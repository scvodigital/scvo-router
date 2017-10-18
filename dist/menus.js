"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
var RouteRecognizer = require('route-recognizer');
/** Class for getting menus with matched routes */
var MenuProcessor = /** @class */ (function () {
    /**
     * Create a MenuProcess for getting a menus that are flagged if they match a route
     * @param {IMenus} menus - The menus that you need to get and match routes against
     */
    function MenuProcessor(menus) {
        var _this = this;
        this.menus = {};
        this.routeRecognizer = RouteRecognizer.default ? new RouteRecognizer.default() : new RouteRecognizer();
        var routes = [];
        Object.keys(menus).forEach(function (name) {
            var items = menus[name];
            _this.menus[name] = items.map(function (item, i) {
                return new MenuItem(item, name, i, 0);
            });
            var menuItemsFlat = _this.flatten(_this.menus[name]);
            menuItemsFlat.forEach(function (menuItem) {
                if (menuItem.route) {
                    var routeDef = {
                        path: menuItem.route,
                        handler: menuItem.dotPath
                    };
                    _this.routeRecognizer.add([routeDef]);
                }
            });
        });
    }
    /**
     * Get all registered menus and add a "match" flag next to each one that matches a given route
     * @param {uriString} uriString - The Route you want to match
     */
    MenuProcessor.prototype.getMenus = function (uriString) {
        var _this = this;
        if (uriString === void 0) { uriString = null; }
        if (!uriString) {
            return this.menus;
        }
        var uri = url.parse(uriString);
        var recognizedRoutes = this.routeRecognizer.recognize(uri.path);
        var matchDotPaths = (recognizedRoutes || []).slice().map(function (route) {
            return route.handler;
        });
        var menus = {};
        Object.keys(this.menus).forEach(function (name) {
            menus[name] = _this.menus[name].map(function (item) { return item.toJSON(matchDotPaths); });
        });
        return menus;
    };
    /**
     * Create a flat array of nested child menus
     * @param {MenuItem[]} items - The menu items you need to flatten
     */
    MenuProcessor.prototype.flatten = function (items) {
        var _this = this;
        var flat = [];
        items.forEach(function (item) {
            if (item.children.length > 0) {
                var childItems = _this.flatten(item.children);
                flat.push.apply(flat, childItems);
            }
            else {
                flat.push(item);
            }
        });
        return flat;
    };
    return MenuProcessor;
}());
exports.MenuProcessor = MenuProcessor;
/** Class to represent menu items and handle additional fields used for matching routes */
var MenuItem = /** @class */ (function () {
    /**
     * Create a new MenuItem instance
     * @param {IMenuItem} menuItem - the base data for the menu item
     * @param {string} dotPath - the dot path of the parent menu item
     * @param {number} order - the position of the menu item
     * @param {number} level - how deep into the menu structure is this item
     */
    function MenuItem(menuItem, dotPath, order, level) {
        var _this = this;
        this.label = '';
        this.path = '';
        this.route = null;
        this.children = [];
        this.metaData = {};
        this.dotPath = '';
        this.order = 0;
        this.level = 0;
        Object.assign(this, menuItem, {
            dotPath: dotPath + '.' + order,
            order: order,
            level: level
        });
        if (this.children) {
            this.children = this.children.map(function (child, i) {
                return new MenuItem(child, _this.dotPath, i, level + 1);
            });
        }
    }
    /**
     * Return a JSON friendly representation of this instance recursively calling each child menu item's toJSON method
     * @param {string[]} matchDotPaths - an array of dot paths that have been matched by the route recognizer
     */
    MenuItem.prototype.toJSON = function (matchDotPaths) {
        if (matchDotPaths === void 0) { matchDotPaths = []; }
        var match = matchDotPaths.indexOf(this.dotPath) > -1;
        var children = [];
        if (this.children) {
            children = this.children.map(function (child) {
                return child.toJSON(matchDotPaths);
            });
        }
        return {
            label: this.label,
            path: this.path,
            route: this.route,
            children: children,
            metaData: this.metaData,
            dotPath: this.dotPath,
            order: this.order,
            level: this.level,
            match: match
        };
    };
    return MenuItem;
}());
exports.MenuItem = MenuItem;
//# sourceMappingURL=menus.js.map