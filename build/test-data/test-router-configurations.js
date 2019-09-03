"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deepExtend = require("deep-extend");
/* tslint:disable:no-any */
var RouterConfigurationBuilder = /** @class */ (function () {
    function RouterConfigurationBuilder(defaults) {
        this.defaults = { name: 'Test Site', domains: ['test-site.com'], metaData: {}, routes: [] };
        this.defaults.name = defaults.name || this.defaults.name;
        this.defaults.domains = defaults.domains || this.defaults.domains;
        this.defaults.metaData = defaults.metaData || this.defaults.metaData;
        this.defaults.disasterResponse = defaults.disasterResponse || undefined;
    }
    RouterConfigurationBuilder.prototype.build = function (routes) {
        var routerConfiguration = {
            name: this.defaults.name,
            domains: this.defaults.domains,
            metaData: {},
            routes: [],
        };
        Object.assign(routerConfiguration.metaData, this.defaults.metaData);
        if (this.defaults.disasterResponse) {
            routerConfiguration.disasterResponse = this.defaults.disasterResponse;
        }
        routes.forEach(function (route) {
            route.tasks.forEach(function (task) {
                deepExtend(routerConfiguration.metaData, task.routerMetaData);
                if (task.routerMetaData) {
                    delete task.routerMetaData;
                }
            });
            routerConfiguration.routes.push(route);
        });
        return routerConfiguration;
    };
    return RouterConfigurationBuilder;
}());
exports.RouterConfigurationBuilder = RouterConfigurationBuilder;
/* tslint:enable:no-any */
//# sourceMappingURL=test-router-configurations.js.map