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
var Mailgun = require("mailgun-js");
var mailComposer = require('nodemailer/lib/mail-composer');
var task_base_1 = require("../task-base");
var TaskMailgun = /** @class */ (function (_super) {
    __extends(TaskMailgun, _super);
    function TaskMailgun(connectionConfigs) {
        var _this = _super.call(this) || this;
        _this.connections = {};
        var connectionNames = Object.keys(connectionConfigs);
        connectionNames.forEach(function (connectionName) {
            var connectionConfig = connectionConfigs[connectionName];
            _this.connections[connectionName] = new Mailgun(connectionConfig);
        });
        return _this;
    }
    TaskMailgun.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, template, dataJson, dataParsed, dataArray, report, promises, i, data, responses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        template = routeMatch.getString(config.template);
                        return [4 /*yield*/, renderer.render(template, routeMatch)];
                    case 1:
                        dataJson = _a.sent();
                        routeMatch.log('Rendered email data object:', dataJson);
                        dataParsed = JSON.parse(dataJson);
                        dataArray = Array.isArray(dataParsed) ? dataParsed : [dataParsed];
                        routeMatch.log('Parsed email data object:', dataArray);
                        report = [];
                        promises = [];
                        for (i = 0; i < dataArray.length; ++i) {
                            data = dataArray[i];
                            if (!data)
                                continue;
                            promises.push(this.sendEmail(data, !config.dontTruncateResponse));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        responses = _a.sent();
                        routeMatch.setData(responses);
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    TaskMailgun.prototype.sendEmail = function (data, truncateResponse) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.connections.hasOwnProperty(data.connectionName)) {
                return resolve({
                    data: data,
                    response: new Error('No such connection: ' + data.connectionName)
                });
            }
            var emailer = _this.connections[data.connectionName];
            var mail;
            try {
                mail = new mailComposer(data);
            }
            catch (err) {
                return resolve({ data: data, response: err });
            }
            if (!mail) {
                return resolve({
                    data: data,
                    response: new Error('Failed to create mailComposer object')
                });
            }
            mail.compile().build(function (err, message) {
                if (truncateResponse) {
                    if (data.html)
                        delete data.html;
                    if (data.text)
                        delete data.text;
                }
                if (err) {
                    return resolve({ data: data, response: err });
                }
                data.message = message.toString('ascii');
                if (!emailer.messages) {
                    return resolve({
                        data: data,
                        response: new Error('Emailer client was not there for some reason')
                    });
                }
                if (!emailer.messages().sendMime) {
                    return resolve({
                        data: data,
                        response: new Error('Emailer client did not have a sendMime method for some reason')
                    });
                }
                emailer.messages().sendMime(data, function (err, body) {
                    if (truncateResponse) {
                        data.message = data.message.substr(0, 255);
                    }
                    if (err) {
                        resolve({ data: data, response: err });
                    }
                    else {
                        resolve({ data: data, response: body });
                    }
                });
            });
        });
    };
    return TaskMailgun;
}(task_base_1.TaskBase));
exports.TaskMailgun = TaskMailgun;
/* tslint:enable:no-any */
//# sourceMappingURL=task-mailgun.js.map