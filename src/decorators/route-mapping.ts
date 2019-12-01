// import 'reflect-metadata'

import {extendPropertyDescriptor} from '@glasswing/common'
import {Request, RequestHandler, RequestMethod, Response} from '@glasswing/http'
import {Observable} from 'rxjs'
import {RouteRegistry} from '../route-registry'

export const ROUTE_REGISTRY_METADATA_NAME = '__route_registry__'

/**
 * @link https://nehalist.io/routing-with-typescript-decorators/#routedecorator
 */

/**
 *
 * @param oldMethod
 * @param target
 */
const generateRouteWrapper = (oldMethod: any, target: any): RequestHandler =>
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {any[]} params
   */
  (req: Request, res: Response, params: any) => {
    let result: any = null
    try {
      result = oldMethod.apply(target, []) // TODO: obtain arguments; see comment bellow
    } catch (error) {
      // prepareErrorResponse(res, error) // TODO: Prepare
      return
    }
    switch (true) {
      case result instanceof Promise:
        result
          .then((data: string) => {
            // prepareSuccessResponse(res, data) // TODO: Prepare
          })
          .catch((error: any) => {
            // prepareErrorResponse(res, error) // TODO: Prepare
          })
        break
      case result instanceof Observable:
        result.subscribe({
          next(data: string) {
            // prepareSuccessResponse(res, data) // TODO: Prepare
          },
          error(error: any) {
            // prepareErrorResponse(res, error) // TODO: Prepare
          },
          complete() {
            res.end('') // TODO: Prepare
          },
        })
        break
      default:
      // prepareSuccessResponse(res, data) // TODO: Prepare
    }
    // TODO:
    // // calculate old method's arguments
    // const argsDefinitions: any[] = await mapHandlerArguments(req, res, params, Reflect.getMetadata(
    //   methodArgumentsDescriptor(propertyKey),
    //   target,
    // ) as ParameterDescriptor[])
    // // return old method call
  }

/**
 *
 * @param {RequestMethod} method
 */
const createRouteMappingDecorator = (method: RequestMethod) /*: ??? */ => {
  /**
   *
   * @param {string|string[]} path
   */
  const decorator = (path?: string | string[]): MethodDecorator => {
    /**
     *
     */
    const descriptor = (
      target: any,
      propertyKey: string | symbol,
      propertyDescriptor: PropertyDescriptor,
    ): PropertyDescriptor =>
      extendPropertyDescriptor(propertyDescriptor, oldMethod => {
        const handler: RequestHandler = generateRouteWrapper(propertyDescriptor.value, target)

        registerRouteDescriptor(target, method, Array.isArray(path) ? path : [path || '/'], handler)

        return handler
      })

    return descriptor
  }

  return decorator
}

export const All = createRouteMappingDecorator(RequestMethod.ALL)

export const Delete = createRouteMappingDecorator(RequestMethod.DELETE)

export const Get = createRouteMappingDecorator(RequestMethod.GET)

export const Head = createRouteMappingDecorator(RequestMethod.HEAD)

export const Options = createRouteMappingDecorator(RequestMethod.OPTIONS)

export const Patch = createRouteMappingDecorator(RequestMethod.PATCH)

export const Post = createRouteMappingDecorator(RequestMethod.POST)

export const Put = createRouteMappingDecorator(RequestMethod.PUT)

/******************************************************************************
 *
 * Helpers
 *
 *****************************************************************************/

const prepareSuccessResponse = (res: Response, data: string): void => {
  // TODO
}

const prepareErrorResponse = (res: Response, data: string): void => {
  // TODO
}

/**
 * Append a path mapping to a controller
 *
 * @param target
 * @param method
 * @param path
 * @param handler
 */
export const registerRouteDescriptor = (
  target: any,
  method: RequestMethod,
  path: string[],
  handler: RequestHandler,
) => {
  const routeRegistry: RouteRegistry = Reflect.hasMetadata(ROUTE_REGISTRY_METADATA_NAME, target)
    ? (Reflect.getMetadata(ROUTE_REGISTRY_METADATA_NAME, target) as RouteRegistry)
    : new RouteRegistry()

  path.forEach(p => routeRegistry.registerRoute(p, method, handler))

  Reflect.defineMetadata(ROUTE_REGISTRY_METADATA_NAME, routeRegistry, target)
}

/**
 * Obtain controller's path mappings
 *
 * @param target
 */
export const getControllerPathMappings = (target: any): RouteRegistry => {
  if (!Reflect.hasMetadata(ROUTE_REGISTRY_METADATA_NAME, target)) {
    // TODO: Throw an eror
  }
  return Reflect.getMetadata(ROUTE_REGISTRY_METADATA_NAME, target)
}
