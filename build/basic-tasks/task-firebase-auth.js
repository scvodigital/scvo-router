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
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskFirebaseAuth = /** @class */ (function (_super) {
    __extends(TaskFirebaseAuth, _super);
    function TaskFirebaseAuth(apps) {
        var _this = _super.call(this) || this;
        _this.apps = apps;
        return _this;
    }
    TaskFirebaseAuth.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, appName, cookie, app, uid, decodedToken, err_1, user, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = routeTaskConfig.config;
                        appName = routeMatch.getString(config.appName);
                        if (!this.apps.hasOwnProperty(appName)) {
                            throw new Error('No Firebase app named "' + appName + '" registered');
                        }
                        cookie = routeMatch.request.cookies[config.cookieName];
                        routeMatch.log('Config', config);
                        if (!cookie) {
                            return [2 /*return*/, this.getNoAuthReturn(routeMatch, config, 'No Cookie found or provided')];
                        }
                        app = this.apps[appName];
                        uid = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        routeMatch.log('Got Cookie:', cookie, 'Verifying...');
                        return [4 /*yield*/, app.auth().verifySessionCookie(cookie)];
                    case 2:
                        decodedToken = _a.sent();
                        if (!decodedToken) {
                            throw new Error('No Decoded Token after verifying Session Cookie');
                        }
                        routeMatch.log('Decoded Cookie:', decodedToken);
                        uid = decodedToken.uid;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        routeMatch.log('Failed to verify session cookie:', err_1);
                        return [2 /*return*/, this.getNoAuthReturn(routeMatch, config, 'Failed to verify session cookie')];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        routeMatch.log('Getting user for User Id', uid);
                        return [4 /*yield*/, app.auth().getUser(uid)];
                    case 5:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Failed to get user with ID "' + uid + '"');
                        }
                        routeMatch.log('Got user', user);
                        routeMatch.setData(user);
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                    case 6:
                        err_2 = _a.sent();
                        routeMatch.log('Failed to get user:', err_2);
                        return [2 /*return*/, this.getNoAuthReturn(routeMatch, config, 'Failed to get user for User Id', uid)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TaskFirebaseAuth.prototype.getNoAuthReturn = function (routeMatch, config) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (config.notAuthenticatedRoute) {
            routeMatch.log.apply(routeMatch, args.concat(['Has notAuthenticatedRoute so returning REROUTE command',
                config.notAuthenticatedRoute]));
            return {
                command: task_base_1.TaskResultCommand.REROUTE,
                routeName: config.notAuthenticatedRoute
            };
        }
        else {
            routeMatch.log.apply(routeMatch, args.concat(['No notAuthenticatedRoute to returning CONTINUE command']));
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        }
    };
    return TaskFirebaseAuth;
}(task_base_1.TaskBase));
exports.TaskFirebaseAuth = TaskFirebaseAuth;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-firebase-auth.js.map