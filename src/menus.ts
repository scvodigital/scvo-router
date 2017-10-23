// System imports
import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';

// Module imports
import { Results, Result } from 'route-recognizer';
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
const RouteRecognizer = require('route-recognizer');

// Internal imports
import { IMenus, IMenuItem, IMenuItemMatch } from './interfaces';

/** Class for getting menus with matched routes */
export class MenuProcessor {
    private routeRecognizer: any;
    private menus: { [name: string]: MenuItem[] } = {};

    /**
     * Create a MenuProcess for getting a menus that are flagged if they match a route
     * @param {IMenus} menus - The menus that you need to get and match routes against
     * @param {string[]} domains - A list of domains you want to strip from paths
     */
    constructor(menus: IMenus) { 
        this.routeRecognizer = RouteRecognizer.default ? new RouteRecognizer.default() : new RouteRecognizer();
        
        var routes = [];
        Object.keys(menus).forEach((name: string) => {
            var items: IMenuItem[] = menus[name];
            this.menus[name] = items.map((item: IMenuItem, i: number) => {
                return new MenuItem(item, name, i, 0);
            });

            var menuItemsFlat: MenuItem[] = this.flatten(this.menus[name]);

            menuItemsFlat.forEach((menuItem: MenuItem) => {
                if(menuItem.route)  { 
                    var routeDef = {
                        path: menuItem.route,
                        handler: menuItem.dotPath
                    };
                    this.routeRecognizer.add([routeDef]);
                }
            });
        });
    }

    /**
     * Get all registered menus and add a "match" flag next to each one that matches a given route
     * @param {uriString} uriString - The Route you want to match
     */
    getMenus(uriString: string = null, start: number = 0, depth: number = 1){
        if(!uriString){
            return this.menus;
        }

        var uri: url.Url = url.parse(uriString);
        var recognizedRoutes: Results = this.routeRecognizer.recognize(uri.path);

        var matchDotPaths = (recognizedRoutes||[]).slice().map((route: any) => {
            return route.handler;
        });

        var menus = {};
        var max = start + depth;
        
        Object.keys(this.menus).forEach((name: string) => {
            menus[name] = this.menus[name].map((item: MenuItem) => { return item.toJSON(matchDotPaths); });
            // menus[name] = this.prune(menus[name], start, max); // Might not be needed or needs to be implemented elsewhere
        });

        return menus;
    }

    prune(items: IMenuItemMatch[], min: number, max: number){
        let plucked = [];

        items.forEach((item: IMenuItemMatch) => {
            if(item.level > max) return;
            if(item.level < min || item.match){
                if(item.level + 1 < max){
                    item.children = this.prune(item.children, min, max);
                }
                plucked.push(item); 
            }
        });

        return plucked;
    }

    /**
     * Create a flat array of nested child menus
     * @param {MenuItem[]} items - The menu items you need to flatten
     */
    private flatten(items: MenuItem[]) {
        let flat = [];

        items.forEach((item: MenuItem) => {
            if (item.children.length > 0) {
                var childItems = this.flatten(item.children);
                flat.push(...childItems);
            } else {
                flat.push(item);
            }
        });

        return flat;
    }
}

/** Class to represent menu items and handle additional fields used for matching routes */
export class MenuItem implements IMenuItem {
    label: string = '';
    path: string = '';
    route: string = null;
    children: MenuItem[] = [];
    metaData: any = {};
    dotPath: string = '';
    order: number = 0;
    level: number = 0;

    /**
     * Create a new MenuItem instance
     * @param {IMenuItem} menuItem - the base data for the menu item
     * @param {string} dotPath - the dot path of the parent menu item
     * @param {number} order - the position of the menu item
     * @param {number} level - how deep into the menu structure is this item
     */ 
    constructor(menuItem: IMenuItem, dotPath: string, order: number, level: number){
        Object.assign(this, menuItem, {
            dotPath: dotPath + '.' + order,
            order: order,
            level: level
        });

        if(this.children){
            this.children = this.children.map((child: IMenuItem, i: number) => { 
                return new MenuItem(child, this.dotPath, i, level + 1);
            });
        }
    }
 
    /**
     * Return a JSON friendly representation of this instance recursively calling each child menu item's toJSON method
     * @param {string[]} matchDotPaths - an array of dot paths that have been matched by the route recognizer
     */
    public toJSON(matchDotPaths: string[] = []): IMenuItemMatch{
        var match: boolean = matchDotPaths.indexOf(this.dotPath) > -1;
        var children = [];
        if(this.children) {
            children = this.children.map((child) => { 
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
        }
    }
}
