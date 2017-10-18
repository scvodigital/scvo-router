import { IMenus, IMenuItem } from './interfaces';
/** Class for getting menus with matched routes */
export declare class MenuProcessor {
    private routeRecognizer;
    private menus;
    /**
     * Create a MenuProcess for getting a menus that are flagged if they match a route
     * @param {IMenus} menus - The menus that you need to get and match routes against
     */
    constructor(menus: IMenus);
    /**
     * Get all registered menus and add a "match" flag next to each one that matches a given route
     * @param {uriString} uriString - The Route you want to match
     */
    getMenus(uriString?: string): {
        [name: string]: MenuItem[];
    };
    /**
     * Create a flat array of nested child menus
     * @param {MenuItem[]} items - The menu items you need to flatten
     */
    private flatten(items);
}
/** Class to represent menu items and handle additional fields used for matching routes */
export declare class MenuItem implements IMenuItem {
    label: string;
    path: string;
    route: string;
    children: MenuItem[];
    metaData: any;
    dotPath: string;
    order: number;
    level: number;
    /**
     * Create a new MenuItem instance
     * @param {IMenuItem} menuItem - the base data for the menu item
     * @param {string} dotPath - the dot path of the parent menu item
     * @param {number} order - the position of the menu item
     * @param {number} level - how deep into the menu structure is this item
     */
    constructor(menuItem: IMenuItem, dotPath: string, order: number, level: number);
    /**
     * Return a JSON friendly representation of this instance recursively calling each child menu item's toJSON method
     * @param {string[]} matchDotPaths - an array of dot paths that have been matched by the route recognizer
     */
    toJSON(matchDotPaths?: string[]): {
        label: string;
        path: string;
        route: string;
        children: any[];
        metaData: any;
        dotPath: string;
        order: number;
        level: number;
        match: boolean;
    };
}
