"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route = require("route-parser");
var RegisteredRoute = /** @class */ (function () {
    function RegisteredRoute(config) {
        var _this = this;
        this.config = config;
        this.parsers = [];
        if (typeof this.config.pattern === 'string') {
            var parser = new Route(this.config.pattern);
            this.parsers.push(parser);
        }
        else {
            var keys = Object.keys(this.config.pattern);
            keys.forEach(function (key) {
                var pattern = _this.config.pattern[key];
                var parser = new Route(pattern);
                _this.parsers.push(parser);
            });
        }
    }
    Object.defineProperty(RegisteredRoute.prototype, "dp", {
        get: function () {
            return '[' + this.config.name + ']';
        },
        enumerable: true,
        configurable: true
    });
    RegisteredRoute.prototype.test = function (request) {
        if (this.config.acceptedVerbs &&
            this.config.acceptedVerbs.indexOf(request.verb) === -1) {
            return null;
        }
        var params = null;
        for (var i = 0; i < this.parsers.length; ++i) {
            var parser = this.parsers[i];
            params = parser.match(request.url.pathname || '');
            if (!!params)
                break;
        }
        if (!params)
            return null;
        // console.log('Found match:', this.config.name);
        return { config: this.config, params: params };
    };
    return RegisteredRoute;
}());
exports.RegisteredRoute = RegisteredRoute;
/* tslint:enable:no-any */
//# sourceMappingURL=registered-route.js.map