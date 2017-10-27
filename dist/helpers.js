"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.register = function (hbs) {
        var _this = this;
        Object.getOwnPropertyNames(this).forEach(function (prop) {
            if (prop.indexOf('helper_') === 0 && typeof _this[prop] === 'function') {
                var name = prop.replace(/helper_/, '');
                hbs.registerHelper(name, _this[prop]);
            }
        });
    };
    Helpers.helper_split = function (str, delimiter) {
        var parts = !str ? [] : str.split(delimiter);
        return parts;
    };
    Helpers.helper_firstItem = function (arr) {
        if (!arr)
            return null;
        if (!Array.isArray(arr))
            return null;
        if (arr.length === 0)
            return null;
        return arr[0];
    };
    Helpers.helper_lastItem = function (arr) {
        if (!arr)
            return null;
        if (!Array.isArray(arr))
            return null;
        if (arr.length === 0)
            return null;
        return arr[arr.length - 1];
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map