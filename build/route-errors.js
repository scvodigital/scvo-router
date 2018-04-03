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
Object.defineProperty(exports, "__esModule", { value: true });
var RouteError = /** @class */ (function (_super) {
    __extends(RouteError, _super);
    function RouteError(baseError, details) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, baseError.message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        Object.assign(_this, baseError);
        Object.assign(_this, details);
        return _this;
    }
    return RouteError;
}(Error));
exports.RouteError = RouteError;
var RouteTaskError = /** @class */ (function (_super) {
    __extends(RouteTaskError, _super);
    function RouteTaskError(baseError, details) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, baseError, {
            statusCode: details.statusCode,
            data: details.data,
            sourceRoute: details.sourceRoute,
            redirectTo: details.redirectTo || null
        }) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        Object.assign(_this, baseError);
        _this.task = details.task;
        return _this;
    }
    return RouteTaskError;
}(RouteError));
exports.RouteTaskError = RouteTaskError;
var RouteDestinationError = /** @class */ (function (_super) {
    __extends(RouteDestinationError, _super);
    function RouteDestinationError(baseError, details) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, baseError, {
            statusCode: details.statusCode,
            data: details.data,
            sourceRoute: details.sourceRoute,
            redirectTo: details.redirectTo || null
        }) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        Object.assign(_this, baseError);
        _this.destination = details.destination;
        return _this;
    }
    return RouteDestinationError;
}(RouteError));
exports.RouteDestinationError = RouteDestinationError;
//# sourceMappingURL=route-errors.js.map