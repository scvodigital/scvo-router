[scvo-router](../README.md) > ["router"](../modules/_router_.md) > [Router](../classes/_router_.router.md)



# Class: Router


Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output

## Index

### Constructors

* [constructor](_router_.router.md#constructor)


### Properties

* [defaultResult](_router_.router.md#defaultresult)
* [routeRecognizer](_router_.router.md#routerecognizer)
* [routes](_router_.router.md#routes)


### Methods

* [execute](_router_.router.md#execute)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Router**(routes: *[IRoutes](../interfaces/_interfaces_.iroutes.md)*): [Router](_router_.router.md)


*Defined in [router.ts:24](https://github.com/scvodigital/scvo-router/blob/138c96a/src/router.ts#L24)*



Create a Router for matching routes and rendering responses


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| routes | [IRoutes](../interfaces/_interfaces_.iroutes.md)   |  The routes and their configurations we are matching against |





**Returns:** [Router](_router_.router.md)

---


## Properties
<a id="defaultresult"></a>

###  defaultResult

**●  defaultResult**:  *`Result`* 

*Defined in [router.ts:24](https://github.com/scvodigital/scvo-router/blob/138c96a/src/router.ts#L24)*





___

<a id="routerecognizer"></a>

###  routeRecognizer

**●  routeRecognizer**:  *`any`* 

*Defined in [router.ts:23](https://github.com/scvodigital/scvo-router/blob/138c96a/src/router.ts#L23)*





___

<a id="routes"></a>

### «Private» routes

**●  routes**:  *[IRoutes](../interfaces/_interfaces_.iroutes.md)* 

*Defined in [router.ts:30](https://github.com/scvodigital/scvo-router/blob/138c96a/src/router.ts#L30)*



The routes and their configurations we are matching against




___


## Methods
<a id="execute"></a>

###  execute

► **execute**(uriString: *`string`*): `Promise`.<[RouteMatch](_route_match_.routematch.md)>



*Defined in [router.ts:57](https://github.com/scvodigital/scvo-router/blob/138c96a/src/router.ts#L57)*



Execute the route against a URI to get a matched route and rendered responses


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| uriString | `string`   |  The URI to be matched |





**Returns:** `Promise`.<[RouteMatch](_route_match_.routematch.md)>
The matched route with rendered results






___


