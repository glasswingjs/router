import 'reflect-metadata'

import {HttpRequestMethod} from '@glasswing/http'
import {singleton} from 'tsyringe'

import {HttpRouteDescriptor, HttpRouteHandler} from './route'

export class RouteRegistryArgumentException extends Error {}

export class RouteRegistryRouteExistsException extends Error {}

@singleton()
export class RouteRegistry {
  private registry: HttpRouteDescriptor[] = []

  /**
   * Clear the regiutry. Use only when Router is destroyed.
   */
  public clear(): void {
    this.registry = []
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
  public registerRoute(
    route: string | HttpRouteDescriptor,
    method?: HttpRequestMethod,
    handler?: HttpRouteHandler,
  ): void {
    let xroute: HttpRouteDescriptor
    if (typeof route === 'string') {
      if (!handler) {
        throw new RouteRegistryArgumentException(
          'For `registryRoute(string, HttpRequestMethod, HttpRouteHandler)` form, `handler` parameter is mandatory.',
        )
      }
      xroute = {
        handler,
        method: method || HttpRequestMethod.GET,
        path: route,
      }
    } else {
      xroute = route
    }

    const match: HttpRouteDescriptor | undefined = this.registry.find(
      (r: HttpRouteDescriptor) => r.path === xroute.path && r.method === xroute.method,
    )
    if (match) {
      throw new RouteRegistryRouteExistsException(
        `A route for path \'${xroute.path}\' with method \'${xroute.method}\' was already added.`,
      )
    }

    this.registry.push(xroute)
  }

  /**
   * Obtain the list of routes stored in the registry
   * Getter
   * @returns {HttpRouteDescriptor[]}
   */
  get routes(): HttpRouteDescriptor[] {
    return this.registry
  }

  /**
   * Unregister routes
   * @param path
   * @param method
   * @returns {void}
   */
  public unregisterRoutes(path: string, method?: HttpRequestMethod): void {
    this.registry = this.registry
      .map((r: HttpRouteDescriptor) => (r.path === path && (r.method === method || method === undefined) ? null : r))
      .filter((r: HttpRouteDescriptor | null) => r !== null) as HttpRouteDescriptor[]
  }
}
