"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var Redis = __importStar(require("redis"));
var util_1 = require("util");
var dot = require("dot-object");
/* tslint:disable:no-any */
var CacheManager = /** @class */ (function () {
    function CacheManager() {
        this.client = Redis.createClient(process.env.REDISPORT ? Number(process.env.REDISPORT) : 6379, process.env.REDISHOST || 'localhost');
        this.GET = util_1.promisify(this.client.GET).bind(this.client);
        this.SETEX = util_1.promisify(this.client.SETEX).bind(this.client);
        this.KEYS = util_1.promisify(this.client.KEYS).bind(this.client);
    }
    CacheManager.prototype.makeKey = function (config, context) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, _a, path, part, hash;
            return __generator(this, function (_b) {
                data = '';
                for (_i = 0, _a = config.keyProperties; _i < _a.length; _i++) {
                    path = _a[_i];
                    part = dot.pick(path, context);
                    data += JSON.stringify(part);
                }
                hash = crypto_1.createHash('sha1').update(data).digest('hex');
                return [2 /*return*/, { partition: config.partition, key: hash }];
            });
        });
    };
    CacheManager.prototype.getItem = function (cacheKey, context) {
        return __awaiter(this, void 0, void 0, function () {
            var key, value, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context.log("CACHE MANAGER: Getting item '" + cacheKey.partition + ":" + cacheKey.key + "'");
                        key = cacheKey.partition + ':' + cacheKey.key;
                        return [4 /*yield*/, this.GET(key)];
                    case 1:
                        value = _a.sent();
                        if (value === null) {
                            context.log("CACHE MANAGER: No item at '" + cacheKey.partition + ":" + cacheKey.key + "', returning null");
                            return [2 /*return*/, null];
                        }
                        try {
                            context.log("CACHE MANAGER: Parsing item '" + cacheKey.partition + ":" + cacheKey.key + "'");
                            output = JSON.parse(value);
                            context.log("CACHE MANAGER: GOT item '" + cacheKey.partition + ":" + cacheKey.key + "'");
                            return [2 /*return*/, output];
                        }
                        catch (err) {
                            console.error("CACHE MANAGER: Failed to parse cached value", err);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheManager.prototype.setItem = function (cacheKey, item, ttl, context) {
        return __awaiter(this, void 0, void 0, function () {
            var key, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context.log("CACHE MANAGER: Setting item '" + cacheKey.partition + ":" + cacheKey.key + "'");
                        key = cacheKey.partition + ':' + cacheKey.key;
                        value = JSON.stringify(item);
                        return [4 /*yield*/, this.SETEX(key, ttl, value)];
                    case 1:
                        _a.sent();
                        context.log("CACHE MANAGER: Set item '" + cacheKey.partition + ":" + cacheKey.key + "'");
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheManager.prototype.flush = function (partition, context) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context.log("CACHE MANAGER: Flushing partition '" + partition + "'");
                        return [4 /*yield*/, this.KEYS(partition + ':')];
                    case 1:
                        keys = _a.sent();
                        return [4 /*yield*/, this.DEL(keys)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheManager.prototype.DEL = function (keys) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.DEL(keys, function (err, total) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(total);
                }
            });
        });
    };
    return CacheManager;
}());
exports.CacheManager = CacheManager;
/* tslint:enable:no-any */ 
//# sourceMappingURL=cache-manager.js.map