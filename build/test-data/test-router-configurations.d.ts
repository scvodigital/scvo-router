import { RouterConfiguration, RouteTaskConfiguration, RouterResponse, RouteConfiguration } from '../configuration-interfaces';
export declare class RouterConfigurationBuilder {
    defaults: RouterConfiguration;
    constructor(defaults: RouterConfigurationDefaults);
    build(routes: TestRoute[]): RouterConfiguration;
}
export interface RouterConfigurationDefaults {
    name?: string;
    domains?: string[];
    metaData?: any;
    disasterResponse?: RouterResponse;
}
export interface TestRoute extends RouteConfiguration {
    tasks: TestRouteTask[];
}
export interface TestRouteTask extends RouteTaskConfiguration<any> {
    routerMetaData?: any;
}
