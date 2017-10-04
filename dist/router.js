"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var querystring = require("querystring");
// Module imports
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
var RouteRecognizer = require('route-recognizer').default;
var route_1 = require("./route");
var route_match_1 = require("./route-match");
helpers({ handlebars: handlebars });
/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
var Router = (function () {
    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    function Router(routes) {
        var _this = this;
        this.routes = routes;
        // Setup our route recognizer
        this.routeRecognizer = new RouteRecognizer();
        // Loop through each route in the current context
        Object.keys(routes).forEach(function (routeName) {
            // Create a new Route object
            var route = new route_1.Route(routes[routeName]);
            if (routeName === '_default') {
                // Treat routes called `_default` as the default handler
                _this.defaultResult = { handler: route, isDynamic: true, params: {} };
            }
            else {
                // Any other route needs to be added to our RouteRecognizer
                var routeDef = {
                    path: route.pattern,
                    handler: route
                };
                _this.routeRecognizer.add([routeDef]);
            }
        });
    }
    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    Router.prototype.execute = function (uriString) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var uri = url.parse(uriString);
            var recognizedRoutes = _this.routeRecognizer.recognize(uri.path) || [_this.defaultResult];
            var firstResult = recognizedRoutes[0] || _this.defaultResult;
            var handler = firstResult.handler;
            var params = Object.assign({}, firstResult.params);
            var query = querystring.parse(uri.path, handler.queryDelimiter, handler.queryEquals);
            var idFriendlyPath = uri.path.replace(/\//g, '_');
            Object.assign(params, { query: query, path: idFriendlyPath });
            var routeMatch = new route_match_1.RouteMatch(handler, params);
        });
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map