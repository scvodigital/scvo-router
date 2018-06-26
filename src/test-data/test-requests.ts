import * as Url from 'url';

import {HttpVerb, RouterRequest} from '../configuration-interfaces';

/* tslint:disable:no-any */
export enum PathOptions {
  NONE = 0,
  VALID = 1,
  DEEP = 1 << 1,
  TRAILING_SLASH = 1 << 2
}

export enum QsOptions {
  NONE = 0,
  QS_FIELD = 1,
  QS_ARRAY_WITH_BRACKETS = 1 << 1,
  QS_ARRAY_NO_BRACKETS = 1 << 2
}

export class RequestBuilder {
  constructor(public baseUrl = 'https://test-site.com') {}

  build(
      pathOptions: PathOptions, qsOptions: QsOptions, verb: HttpVerb = 'GET',
      cookies: any = {}, headers: any = {},
      baseUrlOverride?: string): RouterRequest {
    let url = baseUrlOverride || this.baseUrl;

    if (!(pathOptions & PathOptions.NONE)) {
      if (!!(pathOptions & PathOptions.VALID)) {
        url += '/valid';
      } else {
        url += '/invalid';
      }

      if (!!(pathOptions & PathOptions.DEEP)) {
        url += '/deep';
      }

      if (!!(pathOptions & PathOptions.TRAILING_SLASH)) {
        url += '/';
      }
    }

    if (!(qsOptions & QsOptions.NONE)) {
      const qsParams: string[] = [];

      if (!!(qsOptions & QsOptions.QS_FIELD)) {
        qsParams.push('search=test');
      }

      if (!!(qsOptions & QsOptions.QS_ARRAY_NO_BRACKETS)) {
        qsParams.push('cat=cat-1');
        qsParams.push('cat=cat-2');
      }

      if (!!(qsOptions & QsOptions.QS_ARRAY_WITH_BRACKETS)) {
        qsParams.push('cat[]=cat-2');
        qsParams.push('cat[]=cat-3');
      }

      if (qsParams.length > 0) {
        const qs = qsParams.join('&');
        url = url + '?' + qs;
      }
    }

    const testRequest: RouterRequest = {
      verb,
      params: {},
      url: Url.parse(url),
      body: {},
      cookies,
      headers,
      fullUrl: url
    };
    return testRequest;
  }

  buildAll(
      verb: HttpVerb = 'GET', cookies: any = {}, headers: any = {},
      baseUrlOverride?: string): RouterRequest[] {
    const routerRequests: RouterRequest[] = [];

    for (let u = 0; u < (1 << 3) - 1; ++u) {
      for (let q = 0; q < (1 << 3) - 1; ++q) {
        const routerRequest =
            this.build(u, q, verb, cookies, headers, baseUrlOverride);
        routerRequests.push(routerRequest);
      }
    }

    return routerRequests;
  }
}
/* tslint:enable:no-any */
