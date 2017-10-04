[scvo-router](../README.md) > ["route-match"](../modules/_route_match_.md) > [RouteMatch](../classes/_route_match_.routematch.md)



# Class: RouteMatch


Class that handles matched routes and gets results

## Implements

* [IRouteMatch](../interfaces/_interfaces_.iroutematch.md)

## Index

### Constructors

* [constructor](_route_match_.routematch.md#constructor)


### Properties

* [_primaryQuery](_route_match_.routematch.md#_primaryquery)
* [_supplimentaryQueries](_route_match_.routematch.md#_supplimentaryqueries)
* [compiledTemplate](_route_match_.routematch.md#compiledtemplate)
* [elasticsearchConfig](_route_match_.routematch.md#elasticsearchconfig)
* [linkTags](_route_match_.routematch.md#linktags)
* [metaTags](_route_match_.routematch.md#metatags)
* [orderMap](_route_match_.routematch.md#ordermap)
* [params](_route_match_.routematch.md#params)
* [pattern](_route_match_.routematch.md#pattern)
* [primaryResponse](_route_match_.routematch.md#primaryresponse)
* [primarySearchTemplate](_route_match_.routematch.md#primarysearchtemplate)
* [queryDelimiter](_route_match_.routematch.md#querydelimiter)
* [queryEquals](_route_match_.routematch.md#queryequals)
* [supplimentaryResponses](_route_match_.routematch.md#supplimentaryresponses)
* [supplimentarySearchTemplates](_route_match_.routematch.md#supplimentarysearchtemplates)
* [template](_route_match_.routematch.md#template)


### Accessors

* [primaryQuery](_route_match_.routematch.md#primaryquery)
* [rendered](_route_match_.routematch.md#rendered)
* [supplimentaryQueries](_route_match_.routematch.md#supplimentaryqueries)


### Methods

* [getResults](_route_match_.routematch.md#getresults)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new RouteMatch**(route: *[Route](_route_.route.md)*, params: *`any`*): [RouteMatch](_route_match_.routematch.md)


*Defined in [route-match.ts:88](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L88)*



Create a matched route to get results using parameters


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| route | [Route](_route_.route.md)   |  The route that has been matched |
| params | `any`   |  The parameters that the route recognizer has found |





**Returns:** [RouteMatch](_route_match_.routematch.md)

---


## Properties
<a id="_primaryquery"></a>

### «Private» _primaryQuery

**●  _primaryQuery**:  *[ISearchQuery](../interfaces/_interfaces_.isearchquery.md)*  =  null

*Defined in [route-match.ts:46](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L46)*





___

<a id="_supplimentaryqueries"></a>

### «Private» _supplimentaryQueries

**●  _supplimentaryQueries**:  *`any`*  =  null

*Defined in [route-match.ts:56](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L56)*





___

<a id="compiledtemplate"></a>

### «Private» compiledTemplate

**●  compiledTemplate**:  *`function`*  =  null

*Defined in [route-match.ts:41](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L41)*


#### Type declaration
►(obj: *`any`*, hbs?: *`any`*): `string`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| obj | `any`   |  - |
| hbs | `any`   |  - |





**Returns:** `string`






___

<a id="elasticsearchconfig"></a>

###  elasticsearchConfig

**●  elasticsearchConfig**:  *`ConfigOptions`*  =  null

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[elasticsearchConfig](../interfaces/_interfaces_.iroutematch.md#elasticsearchconfig)*

*Defined in [route-match.ts:25](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L25)*





___

<a id="linktags"></a>

###  linkTags

**●  linkTags**:  *[ILinkTag](../interfaces/_interfaces_.ilinktag.md)[]*  =  null

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[linkTags](../interfaces/_interfaces_.iroutematch.md#linktags)*

*Defined in [route-match.ts:15](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L15)*





___

<a id="metatags"></a>

###  metaTags

**●  metaTags**:  *[IMetaTag](../interfaces/_interfaces_.imetatag.md)[]*  =  null

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[metaTags](../interfaces/_interfaces_.iroutematch.md#metatags)*

*Defined in [route-match.ts:16](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L16)*





___

<a id="ordermap"></a>

### «Private» orderMap

**●  orderMap**:  *`string`[]*  =  []

*Defined in [route-match.ts:44](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L44)*





___

<a id="params"></a>

###  params

**●  params**:  *`any`* 

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[params](../interfaces/_interfaces_.iroutematch.md#params)*

*Defined in [route-match.ts:95](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L95)*



The parameters that the route recognizer has found




___

<a id="pattern"></a>

###  pattern

**●  pattern**:  *`string`*  =  null

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[pattern](../interfaces/_interfaces_.iroutematch.md#pattern)*

*Defined in [route-match.ts:17](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L17)*





___

<a id="primaryresponse"></a>

###  primaryResponse

**●  primaryResponse**:  *`SearchResponse`.<[IDocumentResult](../interfaces/_interfaces_.idocumentresult.md)>*  =  null

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[primaryResponse](../interfaces/_interfaces_.iroutematch.md#primaryresponse)*

*Defined in [route-match.ts:23](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L23)*





___

<a id="primarysearchtemplate"></a>

###  primarySearchTemplate

**●  primarySearchTemplate**:  *[SearchTemplate](_search_template_.searchtemplate.md)* 

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[primarySearchTemplate](../interfaces/_interfaces_.iroutematch.md#primarysearchtemplate)*

*Defined in [route-match.ts:21](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L21)*





___

<a id="querydelimiter"></a>

###  queryDelimiter

**●  queryDelimiter**:  *`string`*  = "&"

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[queryDelimiter](../interfaces/_interfaces_.iroutematch.md#querydelimiter)*

*Defined in [route-match.ts:19](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L19)*





___

<a id="queryequals"></a>

###  queryEquals

**●  queryEquals**:  *`string`*  = "="

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[queryEquals](../interfaces/_interfaces_.iroutematch.md#queryequals)*

*Defined in [route-match.ts:20](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L20)*





___

<a id="supplimentaryresponses"></a>

###  supplimentaryResponses

**●  supplimentaryResponses**:  *[ISearchResponseSet](../interfaces/_interfaces_.isearchresponseset.md)* 

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[supplimentaryResponses](../interfaces/_interfaces_.iroutematch.md#supplimentaryresponses)*

*Defined in [route-match.ts:24](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L24)*





___

<a id="supplimentarysearchtemplates"></a>

###  supplimentarySearchTemplates

**●  supplimentarySearchTemplates**:  *[SearchTemplateSet](_search_template_.searchtemplateset.md)* 

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[supplimentarySearchTemplates](../interfaces/_interfaces_.iroutematch.md#supplimentarysearchtemplates)*

*Defined in [route-match.ts:22](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L22)*





___

<a id="template"></a>

###  template

**●  template**:  *`string`*  = ""

*Implementation of [IRouteMatch](../interfaces/_interfaces_.iroutematch.md).[template](../interfaces/_interfaces_.iroutematch.md#template)*

*Defined in [route-match.ts:18](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L18)*





___


## Accessors
<a id="primaryquery"></a>

###  primaryQuery


getprimaryQuery(): [ISearchQuery](../interfaces/_interfaces_.isearchquery.md)

*Defined in [route-match.ts:48](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L48)*





**Returns:** [ISearchQuery](../interfaces/_interfaces_.isearchquery.md)



___

<a id="rendered"></a>

###  rendered


getrendered(): `string`

*Defined in [route-match.ts:30](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L30)*



Get the rendered view of the results




**Returns:** `string`



___

<a id="supplimentaryqueries"></a>

###  supplimentaryQueries


getsupplimentaryQueries(): `any`

*Defined in [route-match.ts:58](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L58)*





**Returns:** `any`



___


## Methods
<a id="getresults"></a>

###  getResults

► **getResults**(): `Promise`.<`void`>



*Defined in [route-match.ts:107](https://github.com/scvodigital/scvo-router/blob/2753b73/src/route-match.ts#L107)*



Get primary and supplimentary results for this route match




**Returns:** `Promise`.<`void`>
A promise to tell when results have been fetched






___


