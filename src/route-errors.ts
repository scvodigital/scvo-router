import {RouteDestinationConfiguration, RouteTaskConfiguration} from './interfaces';
import {RouteMatch} from './route-match';

export class RouteError extends Error implements RouteErrorDetails {
  statusCode: number;
  /* tslint:disable */
  data: any;
  /* tslint:enable */
  sourceRoute: RouteMatch;
  redirectTo: string|null;

  constructor(baseError: Error, details: RouteErrorDetails) {
    super(baseError.message);
    Object.setPrototypeOf(this, new.target.prototype);
    Object.assign(this, baseError);
    Object.assign(this, details);
  }
}

export class RouteTaskError extends RouteError implements
    RouteTaskErrorDetails {
  task: RouteTaskConfiguration;

  constructor(baseError: Error, details: RouteTaskErrorDetails) {
    super(baseError, {
      statusCode: details.statusCode,
      data: details.data,
      sourceRoute: details.sourceRoute,
      redirectTo: details.redirectTo || null
    });
    Object.setPrototypeOf(this, new.target.prototype);
    Object.assign(this, baseError);
    this.task = details.task;
  }
}

export class RouteDestinationError extends RouteError implements
    RouteDestinationErrorDetails {
  destination: RouteDestinationConfiguration;

  constructor(baseError: Error, details: RouteDestinationErrorDetails) {
    super(baseError, {
      statusCode: details.statusCode,
      data: details.data,
      sourceRoute: details.sourceRoute,
      redirectTo: details.redirectTo || null
    });
    Object.setPrototypeOf(this, new.target.prototype);
    Object.assign(this, baseError);
    this.destination = details.destination;
  }
}

export interface RouteErrorDetails {
  statusCode: number;
  /* tslint:disable */
  data: any;
  /* tslint:enable */
  sourceRoute: RouteMatch;
  redirectTo?: string|null;
}

export interface RouteTaskErrorDetails extends RouteErrorDetails {
  task: RouteTaskConfiguration;
}

export interface RouteDestinationErrorDetails extends RouteErrorDetails {
  destination: RouteDestinationConfiguration;
}
