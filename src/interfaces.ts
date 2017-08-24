export interface IMetaTag {
    content: string;
    name: string;
    [attribute: string]: string;
}

export interface ILinkTag {
    href: string;
    rel: string;
    name?: string;
    type: string;
    [attribute: string]: string;
}
