(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata'), require('@glasswing/common'), require('@glasswing/http'), require('rxjs'), require('tsyringe'), require('find-my-way')) :
    typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata', '@glasswing/common', '@glasswing/http', 'rxjs', 'tsyringe', 'find-my-way'], factory) :
    (global = global || self, factory((global.gw = global.gw || {}, global.gw.router = {}), null, global.common, global.http, global.rxjs, global.tsyringe, global.RouterFactory));
}(this, (function (exports, reflectMetadata, common, http, rxjs, tsyringe, RouterFactory) { 'use strict';

    RouterFactory = RouterFactory && RouterFactory.hasOwnProperty('default') ? RouterFactory['default'] : RouterFactory;

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

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    class RouteRegistryArgumentException extends Error {
    }
    class RouteRegistryRouteExistsException extends Error {
    }
    exports.RouteRegistry = class RouteRegistry {
        constructor() {
            this.registry = [];
        }
        /**
         * Clear the regiutry. Use only when Router is destroyed.
         */
        clear() {
            this.registry = [];
        }
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
        registerRoute(route, method, handler) {
            let xroute;
            if (typeof route === 'string') {
                if (!handler) {
                    throw new RouteRegistryArgumentException('For `registryRoute(string, HttpRequestMethod, HttpRouteHandler)` form, `handler` parameter is mandatory.');
                }
                xroute = {
                    handler,
                    method: method || http.HttpRequestMethod.GET,
                    path: route,
                };
            }
            else {
                xroute = route;
            }
            const match = this.registry.find((r) => r.path === xroute.path && r.method === xroute.method);
            if (match) {
                throw new RouteRegistryRouteExistsException(`A route for path \'${xroute.path}\' with method \'${xroute.method}\' was already added.`);
            }
            this.registry.push(xroute);
        }
        /**
         * Obtain the list of routes stored in the registry
         * Getter
         * @returns {HttpRouteDescriptor[]}
         */
        get routes() {
            return this.registry;
        }
        /**
         * Unregister routes
         * @param path
         * @param method
         * @returns {void}
         */
        unregisterRoutes(path, method) {
            this.registry = this.registry
                .map((r) => (r.path === path && (r.method === method || method === undefined) ? null : r))
                .filter((r) => r !== null);
        }
    };
    exports.RouteRegistry = __decorate([
        tsyringe.singleton()
    ], exports.RouteRegistry);

    const ROUTE_REGISTRY_METADATA_NAME = '__route_registry__';
    /**
     * @link https://nehalist.io/routing-with-typescript-decorators/#routedecorator
     */
    /**
     *
     * @param oldMethod
     * @param target
     */
    const generateRouteWrapper = (oldMethod, target) => 
    /**
     *
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {any[]} params
     */
    (req, res) => {
        let result = null;
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
                    .then((data) => {
                    // prepareSuccessHttpResponse(res, data) // TODO: Prepare
                })
                    .catch((error) => {
                    // prepareErrorHttpResponse(res, error) // TODO: Prepare
                });
                break;
            case result instanceof rxjs.Observable:
                result.subscribe({
                    next(data) {
                        // prepareSuccessHttpResponse(res, data) // TODO: Prepare
                    },
                    error(error) {
                        // prepareErrorHttpResponse(res, error) // TODO: Prepare
                    },
                    complete() {
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
    /**
     *
     * @param {HttpRequestMethod} method
     */
    const createRouteMappingDecorator = (method) => {
        /**
         *
         * @param {string|string[]} path
         */
        const decorator = (path) => {
            /**
             *
             */
            const descriptor = (target, propertyKey, propertyDescriptor) => common.extendClassMethod(propertyDescriptor, (oldMethod) => {
                const handler = generateRouteWrapper(propertyDescriptor.value, target);
                registerRouteDescriptor(target, method, Array.isArray(path) ? path : [path || '/'], handler);
                return handler;
            });
            return descriptor;
        };
        return decorator;
    };
    const All = createRouteMappingDecorator(http.HttpRequestMethod.ALL);
    const Delete = createRouteMappingDecorator(http.HttpRequestMethod.DELETE);
    const Get = createRouteMappingDecorator(http.HttpRequestMethod.GET);
    const Head = createRouteMappingDecorator(http.HttpRequestMethod.HEAD);
    const Options = createRouteMappingDecorator(http.HttpRequestMethod.OPTIONS);
    const Patch = createRouteMappingDecorator(http.HttpRequestMethod.PATCH);
    const Post = createRouteMappingDecorator(http.HttpRequestMethod.POST);
    const Put = createRouteMappingDecorator(http.HttpRequestMethod.PUT);
    /**
     * Append a path mapping to a controller
     *
     * @param target
     * @param method
     * @param path
     * @param handler
     */
    const registerRouteDescriptor = (target, method, path, handler) => {
        const routeRegistry = Reflect.hasMetadata(ROUTE_REGISTRY_METADATA_NAME, target)
            ? Reflect.getMetadata(ROUTE_REGISTRY_METADATA_NAME, target)
            : new exports.RouteRegistry();
        path.forEach(p => routeRegistry.registerRoute(p, method, handler));
        Reflect.defineMetadata(ROUTE_REGISTRY_METADATA_NAME, routeRegistry, target);
    };
    /**
     * Obtain controller's path mappings
     *
     * @param target
     */
    const getControllerPathMappings = (target) => {
        if (!Reflect.hasMetadata(ROUTE_REGISTRY_METADATA_NAME, target)) ;
        return Reflect.getMetadata(ROUTE_REGISTRY_METADATA_NAME, target);
    };

    const registerRouter = (c) => {
        c = c || tsyringe.container;
        c.register('Router', {
            useFactory: () => RouterFactory(),
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
    exports.RouteRegistryArgumentException = RouteRegistryArgumentException;
    exports.RouteRegistryRouteExistsException = RouteRegistryRouteExistsException;
    exports.getControllerPathMappings = getControllerPathMappings;
    exports.registerRouteDescriptor = registerRouteDescriptor;
    exports.registerRouter = registerRouter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
