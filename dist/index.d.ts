import { HttpRequest, Http2Request, HttpResponse, Http2Response, HttpRequestMethod } from '@glasswing/http';
import RouterFactory, { Instance, HTTPVersion } from 'find-my-way';

declare type HttpRouteHandler = (req: HttpRequest | Http2Request, res: HttpResponse | Http2Response) => void;
interface HttpRouteDescriptor {
    method: HttpRequestMethod;
    path: string;
    handler: HttpRouteHandler;
}

declare class RouteRegistryArgumentException extends Error {
}
declare class RouteRegistryRouteExistsException extends Error {
}
declare class RouteRegistry {
    private registry;
    /**
     * Clear the regiutry. Use only when Router is destroyed.
     */
    clear(): void;
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
    registerRoute(route: string | HttpRouteDescriptor, method?: HttpRequestMethod, handler?: HttpRouteHandler): void;
    /**
     * Obtain the list of routes stored in the registry
     * Getter
     * @returns {HttpRouteDescriptor[]}
     */
    get routes(): HttpRouteDescriptor[];
    /**
     * Unregister routes
     * @param path
     * @param method
     * @returns {void}
     */
    unregisterRoutes(path: string, method?: HttpRequestMethod): void;
}

declare const ROUTE_REGISTRY_METADATA_NAME = "__route_registry__";
declare const All: (path?: string | string[] | undefined) => MethodDecorator;
declare const Delete: (path?: string | string[] | undefined) => MethodDecorator;
declare const Get: (path?: string | string[] | undefined) => MethodDecorator;
declare const Head: (path?: string | string[] | undefined) => MethodDecorator;
declare const Options: (path?: string | string[] | undefined) => MethodDecorator;
declare const Patch: (path?: string | string[] | undefined) => MethodDecorator;
declare const Post: (path?: string | string[] | undefined) => MethodDecorator;
declare const Put: (path?: string | string[] | undefined) => MethodDecorator;
/**
 * Append a path mapping to a controller
 *
 * @param target
 * @param method
 * @param path
 * @param handler
 */
declare const registerRouteDescriptor: (target: any, method: HttpRequestMethod, path: string[], handler: HttpRouteHandler) => void;
/**
 * Obtain controller's path mappings
 *
 * @param target
 */
declare const getControllerPathMappings: (target: any) => RouteRegistry;

declare type Router = Instance<HTTPVersion.V1> | Instance<HTTPVersion.V2>;
interface HttpRouter extends RouterFactory.Instance<RouterFactory.HTTPVersion.V1> {
}
interface Http2Router extends RouterFactory.Instance<RouterFactory.HTTPVersion.V2> {
}
declare const registerRouter: () => void;

export { All, Delete, Get, Head, Http2Router, HttpRouteDescriptor, HttpRouteHandler, HttpRouter, Options, Patch, Post, Put, ROUTE_REGISTRY_METADATA_NAME, RouteRegistry, RouteRegistryArgumentException, RouteRegistryRouteExistsException, Router, getControllerPathMappings, registerRouteDescriptor, registerRouter };
