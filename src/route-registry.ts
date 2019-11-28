import {Singleton} from '@glasswing/common'
import {RequestHandler, RequestMethod} from '@glasswing/http'

import {RouteDescriptor} from './_types'

export class RouteRegistryArgumentException extends Error {}

export class RouteRegistryRouteExistsException extends Error {}

@Singleton()
export class RouteRegistry {
  private registry: RouteDescriptor[] = []

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
  public registerRoute(route: string | RouteDescriptor, method?: RequestMethod, handler?: RequestHandler): void {
    let xroute: RouteDescriptor
    if (typeof route === 'string') {
      if (!handler) {
        throw new RouteRegistryArgumentException(
          'For `registryRoute(string, RequestMethod, RequestHandler)` form, `handler` parameter si mandatory.',
        )
      }
      xroute = {
        handler,
        method: method || RequestMethod.GET,
        path: route,
      }
    } else {
      xroute = route
    }

    const match: RouteDescriptor | undefined = this.registry.find(
      (r: RouteDescriptor) => r.path === xroute.path && r.method === xroute.method,
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
   * @returns {RouteDescriptor[]}
   */
  get routes(): RouteDescriptor[] {
    return this.registry
  }

  /**
   * Unregister routes
   * @param path
   * @param method
   * @returns {void}
   */
  public unregisterRoutes(path: string, method?: RequestMethod): void {
    this.registry = this.registry
      .map((r: RouteDescriptor) => (r.path === path && (r.method === method || method === undefined) ? null : r))
      .filter((r: RouteDescriptor | null) => r !== null) as RouteDescriptor[]
  }
}
