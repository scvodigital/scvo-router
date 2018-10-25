"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
const pdfMake = require('pdfmake');
const rp = require("request-promise-native");
const stringify = require('json-stringify-safe');
const task_base_1 = require("../task-base");
class TaskGeneratePdf extends task_base_1.TaskBase {
    constructor(fonts) {
        super();
        this.fonts = fonts;
        this.printer = new pdfMake(fonts);
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const images = yield this.fetchImages(config.images, routeMatch);
            routeMatch.images = images;
            routeMatch.log('Rendering Definition template', config.definitionTemplate);
            const definition = yield renderer.render(config.definitionTemplate, routeMatch);
            routeMatch.log('Rendered Definition template', definition);
            if (!definition.hasOwnProperty('header') && config.headerTemplate) {
                routeMatch.log('No header in definition and Header template provided so adding it');
                definition.header = (currentPage, pageCount) => __awaiter(this, void 0, void 0, function* () {
                    routeMatch.log('Rendering header -> currentPage:', currentPage, '| pageCount:', pageCount, '| header template:', config.headerTemplate);
                    const output = [];
                    try {
                        routeMatch.currentPage = currentPage;
                        routeMatch.pageCount = pageCount;
                        const output = yield renderer.render(config.headerTemplate, routeMatch);
                        routeMatch.log('Header template rendered:', output);
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
                    return output;
                });
            }
            if (!definition.hasOwnProperty('footer') && config.footerTemplate) {
                routeMatch.log('No footer in definition and Footer template provided so adding it');
                definition.footer = (currentPage, pageCount) => __awaiter(this, void 0, void 0, function* () {
                    routeMatch.log('Rendering footer -> currentPage:', currentPage, '| pageCount:', pageCount, '| footer template:', config.footerTemplate);
                    const output = [];
                    try {
                        routeMatch.currentPage = currentPage;
                        routeMatch.pageCount = pageCount;
                        const output = yield renderer.render(config.footerTemplate, routeMatch);
                        routeMatch.log('Footer template rendered:', output);
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
                    return output;
                });
            }
            delete routeMatch.images;
            const output = yield this.generatePdf(definition, routeMatch);
            routeMatch.log('Converted to string!', output.length, 'bytes');
            routeMatch.response.body = output;
            routeMatch.response.contentType = 'application/pdf';
            //    routeMatch.response.headers['Content-Disposition'] =
            //        'attachment; filename=download.pdf';
            routeMatch.log('Finished everything. Returning HALT command');
            return { command: task_base_1.TaskResultCommand.HALT };
        });
    }
    fetchImages(images, routeMatch) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!images)
                return {};
            const fetched = {};
            for (const name of Object.keys(images)) {
                const url = images[name];
                routeMatch.log('Downloading Image:', url);
                const response = yield rp({ url, encoding: null, resolveWithFullResponse: true });
                const mime = response.headers['content-type'];
                const image = Buffer.from(response.body, 'base64');
                const b64 = image.toString('base64');
                const uri = `data:${mime};base64;${b64}`;
                fetched[name] = uri;
                routeMatch.log('Image downloaded');
            }
            return fetched;
        });
    }
    generatePdf(definition, routeMatch) {
        return new Promise((resolve, reject) => {
            routeMatch.log('Finished all definition setup, generating pdf:', stringify(definition, null, 4));
            const pdfDoc = this.printer.createPdfKitDocument(definition);
            const chunks = [];
            pdfDoc.on('data', (chunk) => {
                chunks.push(chunk);
            });
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve(result);
            });
            pdfDoc.end();
        });
    }
}
exports.TaskGeneratePdf = TaskGeneratePdf;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-generate-pdf.js.map