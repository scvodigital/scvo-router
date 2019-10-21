"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
var pdfMake = require('pdfmake');
var rp = require("request-promise-native");
var stringify = require('json-stringify-safe');
var task_base_1 = require("../task-base");
var TaskGeneratePdf = /** @class */ (function (_super) {
    __extends(TaskGeneratePdf, _super);
    function TaskGeneratePdf(fonts) {
        var _this = _super.call(this) || this;
        _this.fonts = fonts;
        _this.printer = new pdfMake(fonts);
        return _this;
    }
    TaskGeneratePdf.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, imagesMap, images, definition, definitionTemplate, err_1, headerTemplate_1, footerTemplate_1, output, hbs, contentDisposition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        if (!config.imagesTemplate) return [3 /*break*/, 3];
                        return [4 /*yield*/, renderer.render(config.imagesTemplate, routeMatch)];
                    case 1:
                        imagesMap = _a.sent();
                        if (typeof imagesMap === 'string') {
                            imagesMap = JSON.parse(imagesMap);
                        }
                        return [4 /*yield*/, this.fetchImages(imagesMap, routeMatch)];
                    case 2:
                        images = _a.sent();
                        routeMatch.images = images;
                        _a.label = 3;
                    case 3:
                        routeMatch.log('Rendering Definition template');
                        definition = {};
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        definitionTemplate = routeMatch.getObject(config.definitionTemplate);
                        return [4 /*yield*/, renderer.render(definitionTemplate, routeMatch)];
                    case 5:
                        definition = _a.sent();
                        if (typeof definition === 'string') {
                            definition = JSON.parse(definition);
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        routeMatch.log(config.definitionTemplate);
                        routeMatch.error(err_1, 'Failed to render definition template');
                        throw err_1;
                    case 7:
                        routeMatch.log('Rendered Definition template', definition);
                        if (!definition.hasOwnProperty('header') && config.headerTemplate) {
                            routeMatch.log('No header in definition and Header template provided so adding it');
                            headerTemplate_1 = routeMatch.getObject(config.headerTemplate);
                            definition.header = function (currentPage, pageCount) {
                                routeMatch.log('Rendering header -> currentPage:', currentPage, '| pageCount:', pageCount, '| header template:', headerTemplate_1);
                                var output = [];
                                try {
                                    routeMatch.currentPage = currentPage;
                                    routeMatch.pageCount = pageCount;
                                    output = renderer.renderSync(headerTemplate_1, routeMatch);
                                    if (typeof output === 'string') {
                                        output = JSON.parse(output);
                                    }
                                }
                                catch (err) {
                                    routeMatch.error(err, 'Problem rendering header from JSON-e');
                                }
                                if (routeMatch.hasOwnProperty(currentPage)) {
                                    delete routeMatch.currentPage;
                                }
                                if (routeMatch.hasOwnProperty(pageCount)) {
                                    delete routeMatch.pageCount;
                                }
                                routeMatch.log('Header template rendered:\n', stringify(output, null, 2));
                                return output;
                            };
                        }
                        if (!definition.hasOwnProperty('footer') && config.footerTemplate) {
                            routeMatch.log('No footer in definition and Footer template provided so adding it');
                            footerTemplate_1 = routeMatch.getObject(config.footerTemplate);
                            definition.footer = function (currentPage, pageCount) {
                                routeMatch.log('Rendering footer -> currentPage:', currentPage, '| pageCount:', pageCount, '| footer template:', config.footerTemplate);
                                var output = [];
                                try {
                                    routeMatch.currentPage = currentPage;
                                    routeMatch.pageCount = pageCount;
                                    output = renderer.renderSync(footerTemplate_1, routeMatch);
                                    if (typeof output === 'string') {
                                        output = JSON.parse(output);
                                    }
                                }
                                catch (err) {
                                    routeMatch.error(err, 'Problem rendering footer from JSON-e');
                                }
                                if (routeMatch.hasOwnProperty(currentPage)) {
                                    delete routeMatch.currentPage;
                                }
                                if (routeMatch.hasOwnProperty(pageCount)) {
                                    delete routeMatch.pageCount;
                                }
                                routeMatch.log('Footer template rendered:\n', stringify(output, null, 2));
                                return output;
                            };
                        }
                        if (!definition.hasOwnProperty('images') &&
                            routeMatch.hasOwnProperty('images')) {
                            definition.images = routeMatch.images;
                        }
                        return [4 /*yield*/, this.generatePdf(definition, routeMatch)];
                    case 8:
                        output = _a.sent();
                        if (routeMatch.hasOwnProperty('images')) {
                            delete routeMatch.images;
                        }
                        routeMatch.log('Converted to string!', output.length, 'bytes');
                        routeMatch.response.body = output;
                        routeMatch.response.contentType = 'application/pdf';
                        if (!config.contentDispositionTemplate) return [3 /*break*/, 10];
                        hbs = routeMatch.rendererManager.getRenderer('handlebars');
                        return [4 /*yield*/, hbs.renderSync(config.contentDispositionTemplate, routeMatch)];
                    case 9:
                        contentDisposition = _a.sent();
                        routeMatch.response.headers['Content-Disposition'] = contentDisposition;
                        _a.label = 10;
                    case 10:
                        //    routeMatch.response.headers['Content-Disposition'] =
                        //        'attachment; filename=download.pdf';
                        routeMatch.log('Finished everything. Returning HALT command');
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.HALT }];
                }
            });
        });
    };
    TaskGeneratePdf.prototype.fetchImages = function (images, routeMatch) {
        return __awaiter(this, void 0, void 0, function () {
            var fetched, _i, _a, name, url, response, mime, image, b64, uri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!images)
                            return [2 /*return*/, {}];
                        fetched = {};
                        _i = 0, _a = Object.keys(images);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name = _a[_i];
                        url = images[name];
                        routeMatch.log('Downloading Image:', url);
                        return [4 /*yield*/, rp({ url: url, encoding: null, resolveWithFullResponse: true })];
                    case 2:
                        response = _b.sent();
                        mime = response.headers['content-type'];
                        image = Buffer.from(response.body, 'base64');
                        b64 = image.toString('base64');
                        uri = "data:" + mime + ";base64," + b64;
                        fetched[name] = uri;
                        routeMatch.log('Image downloaded');
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, fetched];
                }
            });
        });
    };
    TaskGeneratePdf.prototype.generatePdf = function (definition, routeMatch) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            routeMatch.log('Finished all definition setup, generating pdf:', stringify(definition, null, 4));
            var pdfDoc = _this.printer.createPdfKitDocument(definition);
            var chunks = [];
            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            pdfDoc.on('end', function () {
                var result = Buffer.concat(chunks);
                resolve(result);
            });
            pdfDoc.end();
        });
    };
    return TaskGeneratePdf;
}(task_base_1.TaskBase));
exports.TaskGeneratePdf = TaskGeneratePdf;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-generate-pdf.js.map