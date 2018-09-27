"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
class RegisteredRoute {
    constructor(config) {
        this.config = config;
        this.parsers = [];
        if (typeof this.config.pattern === 'string') {
            const parser = new Route(this.config.pattern);
            this.parsers.push(parser);
        }
        else {
            const keys = Object.keys(this.config.pattern);
            keys.forEach((key) => {
                const pattern = this.config.pattern[key];
                const parser = new Route(pattern);
                this.parsers.push(parser);
            });
        }
    }
    get dp() {
        return '[' + this.config.name + ']';
    }
    test(request) {
        if (this.config.acceptedVerbs &&
            this.config.acceptedVerbs.indexOf(request.verb) === -1) {
            return null;
        }
        let params = null;
        for (let i = 0; i < this.parsers.length; ++i) {
            const parser = this.parsers[i];
            params = parser.match(request.url.path || '');
            if (!!params)
                break;
        }
        if (!params)
            return null;
        // console.log('Found match:', this.config.name);
        return { config: this.config, params };
    }
}
exports.RegisteredRoute = RegisteredRoute;
/* tslint:enable:no-any */
//# sourceMappingURL=registered-route.js.map