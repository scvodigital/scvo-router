[scvo-router](../README.md) > ["route"](../modules/_route_.md) > [Route](../classes/_route_.route.md)



# Class: Route


Class that handles a route match, implements search templates and gets results

## Implements

* [IRoute](../interfaces/_interfaces_.iroute.md)

## Index

### Constructors

* [constructor](_route_.route.md#constructor)


### Properties

* [elasticsearchConfig](_route_.route.md#elasticsearchconfig)
* [linkTags](_route_.route.md#linktags)
* [metaTags](_route_.route.md#metatags)
* [pattern](_route_.route.md#pattern)
* [primarySearchTemplate](_route_.route.md#primarysearchtemplate)
* [queryDelimiter](_route_.route.md#querydelimiter)
* [queryEquals](_route_.route.md#queryequals)
* [supplimentarySearchTemplates](_route_.route.md#supplimentarysearchtemplates)
* [template](_route_.route.md#template)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Route**(route?: *[IRoute](../interfaces/_interfaces_.iroute.md)*): [Route](_route_.route.md)


*Defined in [route.ts:23](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L23)*



Create a Route


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| route | [IRoute](../interfaces/_interfaces_.iroute.md)  |  null |   - |





**Returns:** [Route](_route_.route.md)

---


## Properties
<a id="elasticsearchconfig"></a>

###  elasticsearchConfig

**●  elasticsearchConfig**:  *`ConfigOptions`*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[elasticsearchConfig](../interfaces/_interfaces_.iroute.md#elasticsearchconfig)*

*Defined in [route.ts:23](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L23)*





___

<a id="linktags"></a>

###  linkTags

**●  linkTags**:  *[ILinkTag](../interfaces/_interfaces_.ilinktag.md)[]*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[linkTags](../interfaces/_interfaces_.iroute.md#linktags)*

*Defined in [route.ts:10](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L10)*





___

<a id="metatags"></a>

###  metaTags

**●  metaTags**:  *[IMetaTag](../interfaces/_interfaces_.imetatag.md)[]*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[metaTags](../interfaces/_interfaces_.iroute.md#metatags)*

*Defined in [route.ts:11](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L11)*





___

<a id="pattern"></a>

###  pattern

**●  pattern**:  *`string`*  = ""

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[pattern](../interfaces/_interfaces_.iroute.md#pattern)*

*Defined in [route.ts:12](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L12)*





___

<a id="primarysearchtemplate"></a>

###  primarySearchTemplate

**●  primarySearchTemplate**:  *[ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[primarySearchTemplate](../interfaces/_interfaces_.iroute.md#primarysearchtemplate)*

*Defined in [route.ts:21](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L21)*





___

<a id="querydelimiter"></a>

###  queryDelimiter

**●  queryDelimiter**:  *`string`*  = "&"

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[queryDelimiter](../interfaces/_interfaces_.iroute.md#querydelimiter)*

*Defined in [route.ts:13](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L13)*





___

<a id="queryequals"></a>

###  queryEquals

**●  queryEquals**:  *`string`*  = "="

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[queryEquals](../interfaces/_interfaces_.iroute.md#queryequals)*

*Defined in [route.ts:14](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L14)*





___

<a id="supplimentarysearchtemplates"></a>

###  supplimentarySearchTemplates

**●  supplimentarySearchTemplates**:  *[ISearchTemplateSet](../interfaces/_interfaces_.isearchtemplateset.md)* 

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[supplimentarySearchTemplates](../interfaces/_interfaces_.iroute.md#supplimentarysearchtemplates)*

*Defined in [route.ts:22](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L22)*





___

<a id="template"></a>

###  template

**●  template**:  *`string`*  =  `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}`

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[template](../interfaces/_interfaces_.iroute.md#template)*

*Defined in [route.ts:15](https://github.com/scvodigital/scvo-router/blob/138c96a/src/route.ts#L15)*





___


