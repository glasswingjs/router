/// <reference types="node" />

import { Request, RequestHandler, RequestMethod, Response } from '@glasswing/http';
import { HTTPVersion, Instance } from 'find-my-way';
import { DependencyContainer } from 'tsyringe';

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
export declare const registerRouter: () => import("tsyringe").DependencyContainer;

export {};
