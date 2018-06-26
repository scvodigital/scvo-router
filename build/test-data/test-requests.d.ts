import { HttpVerb, RouterRequest } from '../configuration-interfaces';
export declare enum PathOptions {
    NONE = 0,
    VALID = 1,
    DEEP = 2,
    TRAILING_SLASH = 4,
}
export declare enum QsOptions {
    NONE = 0,
    QS_FIELD = 1,
    QS_ARRAY_WITH_BRACKETS = 2,
    QS_ARRAY_NO_BRACKETS = 4,
}
export declare class RequestBuilder {
    baseUrl: string;
    constructor(baseUrl?: string);
    build(pathOptions: PathOptions, qsOptions: QsOptions, verb?: HttpVerb, cookies?: any, headers?: any, baseUrlOverride?: string): RouterRequest;
    buildAll(verb?: HttpVerb, cookies?: any, headers?: any, baseUrlOverride?: string): RouterRequest[];
}
