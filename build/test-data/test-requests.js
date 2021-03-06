"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Url = __importStar(require("url"));
/* tslint:disable:no-any */
var PathOptions;
(function (PathOptions) {
    PathOptions[PathOptions["NONE"] = 0] = "NONE";
    PathOptions[PathOptions["VALID"] = 1] = "VALID";
    PathOptions[PathOptions["DEEP"] = 2] = "DEEP";
    PathOptions[PathOptions["TRAILING_SLASH"] = 4] = "TRAILING_SLASH";
})(PathOptions = exports.PathOptions || (exports.PathOptions = {}));
var QsOptions;
(function (QsOptions) {
    QsOptions[QsOptions["NONE"] = 0] = "NONE";
    QsOptions[QsOptions["QS_FIELD"] = 1] = "QS_FIELD";
    QsOptions[QsOptions["QS_ARRAY_WITH_BRACKETS"] = 2] = "QS_ARRAY_WITH_BRACKETS";
    QsOptions[QsOptions["QS_ARRAY_NO_BRACKETS"] = 4] = "QS_ARRAY_NO_BRACKETS";
})(QsOptions = exports.QsOptions || (exports.QsOptions = {}));
var RequestBuilder = /** @class */ (function () {
    function RequestBuilder(baseUrl) {
        if (baseUrl === void 0) { baseUrl = 'https://test-site.com'; }
        this.baseUrl = baseUrl;
    }
    RequestBuilder.prototype.build = function (pathOptions, qsOptions, verb, cookies, headers, baseUrlOverride) {
        if (verb === void 0) { verb = 'GET'; }
        if (cookies === void 0) { cookies = {}; }
        if (headers === void 0) { headers = {}; }
        var url = baseUrlOverride || this.baseUrl;
        if (!(pathOptions & PathOptions.NONE)) {
            if (!!(pathOptions & PathOptions.VALID)) {
                url += '/valid';
            }
            else {
                url += '/invalid';
            }
            if (!!(pathOptions & PathOptions.DEEP)) {
                url += '/deep';
            }
            if (!!(pathOptions & PathOptions.TRAILING_SLASH)) {
                url += '/';
            }
        }
        if (!(qsOptions & QsOptions.NONE)) {
            var qsParams = [];
            if (!!(qsOptions & QsOptions.QS_FIELD)) {
                qsParams.push('search=test');
            }
            if (!!(qsOptions & QsOptions.QS_ARRAY_NO_BRACKETS)) {
                qsParams.push('cat=cat-1');
                qsParams.push('cat=cat-2');
            }
            if (!!(qsOptions & QsOptions.QS_ARRAY_WITH_BRACKETS)) {
                qsParams.push('cat[]=cat-2');
                qsParams.push('cat[]=cat-3');
            }
            if (qsParams.length > 0) {
                var qs = qsParams.join('&');
                url = url + '?' + qs;
            }
        }
        var testRequest = {
            verb: verb,
            params: {},
            url: Url.parse(url),
            body: {},
            cookies: cookies,
            headers: headers,
            fullUrl: url
        };
        return testRequest;
    };
    RequestBuilder.prototype.buildAll = function (verb, cookies, headers, baseUrlOverride) {
        if (verb === void 0) { verb = 'GET'; }
        if (cookies === void 0) { cookies = {}; }
        if (headers === void 0) { headers = {}; }
        var routerRequests = [];
        for (var u = 0; u < (1 << 3) - 1; ++u) {
            for (var q = 0; q < (1 << 3) - 1; ++q) {
                var routerRequest = this.build(u, q, verb, cookies, headers, baseUrlOverride);
                routerRequests.push(routerRequest);
            }
        }
        return routerRequests;
    };
    return RequestBuilder;
}());
exports.RequestBuilder = RequestBuilder;
/* tslint:enable:no-any */
//# sourceMappingURL=test-requests.js.map