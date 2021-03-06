'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('reflect-metadata');
var common = require('@glasswing/common');
var http = require('@glasswing/http');
var rxjs = require('rxjs');
var tsyringe = require('tsyringe');
var RouterFactory = _interopDefault(require('find-my-way'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var RouteRegistryArgumentException = /** @class */ (function (_super) {
    __extends(RouteRegistryArgumentException, _super);
    function RouteRegistryArgumentException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RouteRegistryArgumentException;
}(Error));
var RouteRegistryRouteExistsException = /** @class */ (function (_super) {
    __extends(RouteRegistryRouteExistsException, _super);
    function RouteRegistryRouteExistsException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RouteRegistryRouteExistsException;
}(Error));
var RouteRegistry = /** @class */ (function () {
    function RouteRegistry() {
        this.registry = [];
    }
    /**
     * Clear the regiutry. Use only when Router is destroyed.
     */
    RouteRegistry.prototype.clear = function () {
        this.registry = [];
    };
    /**
     * Register a route within the application.
     * @param path
     * @param method
     * @param handler
     * @throws {RouteRegistryException}
     * @returns {void}
     * @example
     *    const controller = new MyController()
     *    controller.registerRoute('/users', HttpRequestMethod.GET, (req: HttpRequest, res: Response) => {
     *      ...
     *    })
     * @example
     *    const controller = new MyController()
     *    const route: Route = {
     *      path: '/users',
     *      method: HttpRequestMethod.GET,
     *      handler: (req: HttpRequest, res: Response) => {
     *        ...
     *      }
     *    }
     *    controller.registerRoute(route)
     */
    RouteRegistry.prototype.registerRoute = function (route, method, handler) {
        var xroute;
        if (typeof route === 'string') {
            if (!handler) {
                throw new RouteRegistryArgumentException('For `registryRoute(string, HttpRequestMethod, HttpRouteHandler)` form, `handler` parameter is mandatory.');
            }
            xroute = {
                handler: handler,
                method: method || http.HttpRequestMethod.GET,
                path: route,
            };
        }
        else {
            xroute = route;
        }
        var match = this.registry.find(function (r) { return r.path === xroute.path && r.method === xroute.method; });
        if (match) {
            throw new RouteRegistryRouteExistsException("A route for path '" + xroute.path + "' with method '" + xroute.method + "' was already added.");
        }
        this.registry.push(xroute);
    };
    Object.defineProperty(RouteRegistry.prototype, "routes", {
        /**
         * Obtain the list of routes stored in the registry
         * Getter
         * @returns {HttpRouteDescriptor[]}
         */
        get: function () {
            return this.registry;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Unregister routes
     * @param path
     * @param method
     * @returns {void}
     */
    RouteRegistry.prototype.unregisterRoutes = function (path, method) {
        this.registry = this.registry
            .map(function (r) { return (r.path === path && (r.method === method || method === undefined) ? null : r); })
            .filter(function (r) { return r !== null; });
    };
    RouteRegistry = __decorate([
        tsyringe.singleton()
    ], RouteRegistry);
    return RouteRegistry;
}());

var ROUTE_REGISTRY_METADATA_NAME = '__route_registry__';
/**
 * @link https://nehalist.io/routing-with-typescript-decorators/#routedecorator
 */
/**
 *
 * @param oldMethod
 * @param target
 */
var generateRouteWrapper = function (oldMethod, target) {
    /**
     *
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {any[]} params
     */
    return function (req, res) {
        var result = null;
        try {
            result = oldMethod.apply(target, []); // TODO: obtain arguments; see comment bellow
        }
        catch (error) {
            // prepareErrorHttpResponse(res, error) // TODO: Prepare
            return;
        }
        switch (true) {
            case result instanceof Promise:
                result
                    .then(function (data) {
                    // prepareSuccessHttpResponse(res, data) // TODO: Prepare
                })
                    .catch(function (error) {
                    // prepareErrorHttpResponse(res, error) // TODO: Prepare
                });
                break;
            case result instanceof rxjs.Observable:
                result.subscribe({
                    next: function (data) {
                        // prepareSuccessHttpResponse(res, data) // TODO: Prepare
                    },
                    error: function (error) {
                        // prepareErrorHttpResponse(res, error) // TODO: Prepare
                    },
                    complete: function () {
                        res.end(''); // TODO: Prepare
                    },
                });
                break;
            // prepareSuccessHttpResponse(res, data) // TODO: Prepare
        }
        // TODO:
        // // calculate old method's arguments
        // const argsDefinitions: any[] = await mapHandlerArguments(req, res, params, Reflect.getMetadata(
        //   methodArgumentsDescriptor(propertyKey),
        //   target,
        // ) as ParameterDescriptor[])
        // // return old method call
    };
};
/**
 *
 * @param {HttpRequestMethod} method
 */
var createRouteMappingDecorator = function (method) {
    /**
     *
     * @param {string|string[]} path
     */
    var decorator = function (path) {
        /**
         *
         */
        var descriptor = function (target, propertyKey, propertyDescriptor) {
            return common.extendClassMethod(propertyDescriptor, function (oldMethod) {
                var handler = generateRouteWrapper(propertyDescriptor.value, target);
                registerRouteDescriptor(target, method, Array.isArray(path) ? path : [path || '/'], handler);
                return handler;
            });
        };
        return descriptor;
    };
    return decorator;
};
var All = createRouteMappingDecorator(http.HttpRequestMethod.ALL);
var Delete = createRouteMappingDecorator(http.HttpRequestMethod.DELETE);
var Get = createRouteMappingDecorator(http.HttpRequestMethod.GET);
var Head = createRouteMappingDecorator(http.HttpRequestMethod.HEAD);
var Options = createRouteMappingDecorator(http.HttpRequestMethod.OPTIONS);
var Patch = createRouteMappingDecorator(http.HttpRequestMethod.PATCH);
var Post = createRouteMappingDecorator(http.HttpRequestMethod.POST);
var Put = createRouteMappingDecorator(http.HttpRequestMethod.PUT);
/**
 * Append a path mapping to a controller
 *
 * @param target
 * @param method
 * @param path
 * @param handler
 */
var registerRouteDescriptor = function (target, method, path, handler) {
    var routeRegistry = Reflect.hasMetadata(ROUTE_REGISTRY_METADATA_NAME, target)
        ? Reflect.getMetadata(ROUTE_REGISTRY_METADATA_NAME, target)
        : new RouteRegistry();
    path.forEach(function (p) { return routeRegistry.registerRoute(p, method, handler); });
    Reflect.defineMetadata(ROUTE_REGISTRY_METADATA_NAME, routeRegistry, target);
};
/**
 * Obtain controller's path mappings
 *
 * @param target
 */
var getControllerPathMappings = function (target) {
    if (!Reflect.hasMetadata(ROUTE_REGISTRY_METADATA_NAME, target)) ;
    return Reflect.getMetadata(ROUTE_REGISTRY_METADATA_NAME, target);
};

var registerRouter = function (c) {
    c = c || tsyringe.container;
    c.register('Router', {
        useFactory: function () { return RouterFactory(); },
    });
};

exports.All = All;
exports.Delete = Delete;
exports.Get = Get;
exports.Head = Head;
exports.Options = Options;
exports.Patch = Patch;
exports.Post = Post;
exports.Put = Put;
exports.ROUTE_REGISTRY_METADATA_NAME = ROUTE_REGISTRY_METADATA_NAME;
exports.RouteRegistry = RouteRegistry;
exports.RouteRegistryArgumentException = RouteRegistryArgumentException;
exports.RouteRegistryRouteExistsException = RouteRegistryRouteExistsException;
exports.getControllerPathMappings = getControllerPathMappings;
exports.registerRouteDescriptor = registerRouteDescriptor;
exports.registerRouter = registerRouter;
