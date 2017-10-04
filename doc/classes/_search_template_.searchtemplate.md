[scvo-router](../README.md) > ["search-template"](../modules/_search_template_.md) > [SearchTemplate](../classes/_search_template_.searchtemplate.md)



# Class: SearchTemplate


Class to construct an Elasticsearch query

## Implements

* [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)

## Index

### Constructors

* [constructor](_search_template_.searchtemplate.md#constructor)


### Properties

* [compiledTemplate](_search_template_.searchtemplate.md#compiledtemplate)
* [index](_search_template_.searchtemplate.md#index)
* [preferredView](_search_template_.searchtemplate.md#preferredview)
* [template](_search_template_.searchtemplate.md#template)
* [type](_search_template_.searchtemplate.md#type)


### Methods

* [getBody](_search_template_.searchtemplate.md#getbody)
* [getHead](_search_template_.searchtemplate.md#gethead)
* [getPrimary](_search_template_.searchtemplate.md#getprimary)
* [renderQuery](_search_template_.searchtemplate.md#renderquery)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new SearchTemplate**(searchTemplate: *[ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)*): [SearchTemplate](_search_template_.searchtemplate.md)


*Defined in [search-template.ts:19](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L19)*



Create a search template


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| searchTemplate | [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)   |  - |





**Returns:** [SearchTemplate](_search_template_.searchtemplate.md)

---


## Properties
<a id="compiledtemplate"></a>

### «Private» compiledTemplate

**●  compiledTemplate**:  *`function`*  =  null

*Defined in [search-template.ts:19](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L19)*


#### Type declaration
►(obj: *`any`*, hbs?: *`any`*): `string`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| obj | `any`   |  - |
| hbs | `any`   |  - |





**Returns:** `string`






___

<a id="index"></a>

###  index

**●  index**:  *`string`*  =  null

*Implementation of [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md).[index](../interfaces/_interfaces_.isearchtemplate.md#index)*

*Defined in [search-template.ts:13](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L13)*





___

<a id="preferredview"></a>

###  preferredView

**●  preferredView**:  *`string`[]*  =  null

*Defined in [search-template.ts:16](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L16)*





___

<a id="template"></a>

###  template

**●  template**:  *`string`*  =  null

*Implementation of [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md).[template](../interfaces/_interfaces_.isearchtemplate.md#template)*

*Defined in [search-template.ts:15](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L15)*





___

<a id="type"></a>

###  type

**●  type**:  *`string`*  =  null

*Implementation of [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md).[type](../interfaces/_interfaces_.isearchtemplate.md#type)*

*Defined in [search-template.ts:14](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L14)*





___


## Methods
<a id="getbody"></a>

###  getBody

► **getBody**(params: *`any`*): `any`



*Defined in [search-template.ts:64](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L64)*



Get the body part of an msearch query


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  The data to pass into the handlebars template |





**Returns:** `any`
A usable query line for an Elasticsearch msearch






___

<a id="gethead"></a>

###  getHead

► **getHead**(): [ISearchHead](../interfaces/_interfaces_.isearchhead.md)



*Defined in [search-template.ts:52](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L52)*



Get the head part of a msearch query




**Returns:** [ISearchHead](../interfaces/_interfaces_.isearchhead.md)
A usable head line for an Elasticsearch msearch






___

<a id="getprimary"></a>

###  getPrimary

► **getPrimary**(params: *`any`*): [ISearchQuery](../interfaces/_interfaces_.isearchquery.md)



*Defined in [search-template.ts:80](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L80)*



Get a standalone query


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  The data to pass into the handlebars template |





**Returns:** [ISearchQuery](../interfaces/_interfaces_.isearchquery.md)
A usable Elasticsearch query payload






___

<a id="renderquery"></a>

###  renderQuery

► **renderQuery**(params: *`any`*): `string`



*Defined in [search-template.ts:38](https://github.com/scvodigital/scvo-router/blob/2753b73/src/search-template.ts#L38)*



Render the query template to a string of JSON


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  The data to pass into the handlebars template |





**Returns:** `string`
A search query rendered as a string of JSON






___


