/// <reference types="node" />

import { HTTPVersion, Instance } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export declare type Request = IncomingMessage | Http2ServerRequest;
export declare type Response = ServerResponse | Http2ServerResponse;
export declare type RequestHandler = (req: Request, res: Response, params: any) => void;
declare enum RequestMethod {
	ALL = "all",
	/**
	 * The CONNECT method establishes a tunnel to the server identified by the target  resource.
	 */
	CONNECT = "connect",
	/**
	 * The DELETE method deletes the specified resource.
	 */
	DELETE = "delete",
	/**
	 * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
	 */
	GET = "get",
	/**
	 * The HEAD method asks for a response identical to that of a GET request, but without the response body.
	 */
	HEAD = "head",
	/**
	 * The OPTIONS method is used to describe the communication options for the target resource.
	 */
	OPTIONS = "options",
	/**
	 * The PATCH method is used to apply partial modifications to a resource.
	 */
	PATCH = "patch",
	/**
	 * The POST method is used to submit an entity to the specified resource, often causing a change in state or side
	 * effects on the server.
	 */
	POST = "post",
	/**
	 * The PUT method replaces all current representations of the target resource with the request payload.
	 */
	PUT = "put",
	/**
	 * The TRACE method performs a message loop-back test along the path to the target resource.
	 */
	TRACE = "trace"
}
export declare type Router = Instance<HTTPVersion.V1> | Instance<HTTPVersion.V2>;
export declare type RouterCallable = (req: Request, res: Response) => void;
export interface RouteDescriptor {
	method: RequestMethod;
	path: string;
	handler: RequestHandler;
}
export declare class RouteRegistryArgumentException extends Error {
}
export declare class RouteRegistryRouteExistsException extends Error {
}
export declare class RouteRegistry {
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
	 *    controller.registerRoute('/users', RequestMethod.GET, (req: Request, res: Response) => {
	 *      ...
	 *    })
	 * @example
	 *    const controller = new MyController()
	 *    const route: Route = {
	 *      path: '/users',
	 *      method: RequestMethod.GET,
	 *      handler: (req: Request, res: Response) => {
	 *        ...
	 *      }
	 *    }
	 *    controller.registerRoute(route)
	 */
	registerRoute(route: string | RouteDescriptor, method?: RequestMethod, handler?: RequestHandler): void;
	/**
	 * Obtain the list of routes stored in the registry
	 * Getter
	 * @returns {RouteDescriptor[]}
	 */
	get routes(): RouteDescriptor[];
	/**
	 * Unregister routes
	 * @param path
	 * @param method
	 * @returns {void}
	 */
	unregisterRoutes(path: string, method?: RequestMethod): void;
}
export declare const ROUTE_REGISTRY_METADATA_NAME = "__route_registry__";
export declare const All: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Delete: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Get: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Head: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Options: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Patch: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Post: (path?: string | string[] | undefined) => MethodDecorator;
export declare const Put: (path?: string | string[] | undefined) => MethodDecorator;
/**
 * Append a path mapping to a controller
 *
 * @param target
 * @param method
 * @param path
 * @param handler
 */
export declare const registerRouteDescriptor: (target: any, method: RequestMethod, path: string[], handler: RequestHandler) => void;
/**
 * Obtain controller's path mappings
 *
 * @param target
 */
export declare const getControllerPathMappings: (target: any) => RouteRegistry;
export declare const registerRouter: () => void;

export {};
