import {HttpVerb, NamedPattern, RouteConfiguration, RouterRequest, RouteTaskConfiguration} from './configuration-interfaces';

import Route = require('route-parser');

export class RegisteredRoute {
  parsers: Route[] = [];

  private get dp(): string {
    return '[' + this.config.name + ']';
  }

  constructor(public config: RouteConfiguration) {
    if (typeof this.config.pattern === 'string') {
      const parser = new Route(this.config.pattern);
      this.parsers.push(parser);
    } else {
      const keys = Object.keys(this.config.pattern);
      keys.forEach((key) => {
        const pattern = (this.config.pattern as NamedPattern)[key];
        const parser = new Route(pattern);
        this.parsers.push(parser);
      });
    }
  }

  test(request: RouterRequest): MatchedRoute|null {
    if (this.config.acceptedVerbs &&
        this.config.acceptedVerbs.indexOf(request.verb) === -1) {
      return null;
    }

    let params = null;

    for (let i = 0; i < this.parsers.length; ++i) {
      const parser = this.parsers[i];
      params = parser.match(request.url.path || '');
      if (!!params) break;
    }

    if (!params) return null;

    console.log('Found match:', this.config.name);
    return {config: this.config, params};
  }
}

export interface RegisteredRouteMap {
  [name: string]: RegisteredRoute;
}

/* tslint:disable:no-any */
export interface MatchedRoute {
  config: RouteConfiguration;
  params: any;
}
/* tslint:enable:no-any */
