"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var s = require("string");
var moment = require("moment");
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
    Helpers.helper_slugify = function (str) {
        var slug = s(str).slugify().s;
        return slug;
    };
    Helpers.helper_querystringify = function (obj) {
        if (obj === void 0) { obj = {}; }
        var args = arguments[1];
        if (args && args.hash) {
            Object.assign(obj, args.hash);
        }
        var qs = querystring.stringify(obj);
        return qs;
    };
    Helpers.helper_ngStringify = function (obj) {
        var json = JSON.stringify(obj, null, 4);
        json = json.replace(/\{/g, "{{ '{' }}");
        return json;
    };
    Helpers.helper_contains = function (arr, val) {
        var contains = arr.indexOf(val) > -1;
        return contains;
    };
    Helpers.helper_parse = function (str) {
        var obj = JSON.parse(str);
        return obj;
    };
    Helpers.helper_keyValue = function (obj) {
        var props = [];
        Object.keys(obj).forEach(function (key) {
            props.push({ key: key, value: obj[key] });
        });
        return props;
    };
    Helpers.helper_moment = function (date, format) {
        if (date === void 0) { date = null; }
        if (format === void 0) { format = null; }
        if (!date) {
            return moment();
        }
        else if (!format) {
            return moment(date);
        }
        else {
            return moment(date, format);
        }
    };
    Helpers.helper_momentFormat = function (date, format) {
        if (format === void 0) { format = null; }
        if (!format) {
            return date.format();
        }
        else {
            return date.format(format);
        }
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map