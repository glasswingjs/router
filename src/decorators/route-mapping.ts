import 'reflect-metadata'

import {ClassMethod, extendClassMethod} from '@glasswing/common'
import {Http2Request, Http2Response, HttpRequest, HttpRequestMethod, HttpResponse} from '@glasswing/http'
import {Observable} from 'rxjs'
import {HttpRouteHandler} from '../route'
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
const generateRouteWrapper = (oldMethod: any, target: any): HttpRouteHandler =>
  /**
   *
   * @param {HttpRequest} req
   * @param {HttpResponse} res
   * @param {any[]} params
   */
  (req: HttpRequest | Http2Request, res: HttpResponse | Http2Response) => {
    let result: any = null
    try {
      result = oldMethod.apply(target, []) // TODO: obtain arguments; see comment bellow
    } catch (error) {
      // prepareErrorHttpResponse(res, error) // TODO: Prepare
      return
    }
    switch (true) {
      case result instanceof Promise:
        result
          .then((data: string) => {
            // prepareSuccessHttpResponse(res, data) // TODO: Prepare
          })
          .catch((error: any) => {
            // prepareErrorHttpResponse(res, error) // TODO: Prepare
          })
        break
      case result instanceof Observable:
        result.subscribe({
          next(data: string) {
            // prepareSuccessHttpResponse(res, data) // TODO: Prepare
          },
          error(error: any) {
            // prepareErrorHttpResponse(res, error) // TODO: Prepare
          },
          complete() {
            res.end('') // TODO: Prepare
          },
        })
        break
      default:
      // prepareSuccessHttpResponse(res, data) // TODO: Prepare
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
 * @param {HttpRequestMethod} method
 */
const createRouteMappingDecorator = (method: HttpRequestMethod) /*: ??? */ => {
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
      extendClassMethod(propertyDescriptor, (oldMethod: ClassMethod) => {
        const handler: HttpRouteHandler = generateRouteWrapper(propertyDescriptor.value, target)

        registerRouteDescriptor(target, method, Array.isArray(path) ? path : [path || '/'], handler)

        return handler
      })

    return descriptor
  }

  return decorator
}

export const All = createRouteMappingDecorator(HttpRequestMethod.ALL)

export const Delete = createRouteMappingDecorator(HttpRequestMethod.DELETE)

export const Get = createRouteMappingDecorator(HttpRequestMethod.GET)

export const Head = createRouteMappingDecorator(HttpRequestMethod.HEAD)

export const Options = createRouteMappingDecorator(HttpRequestMethod.OPTIONS)

export const Patch = createRouteMappingDecorator(HttpRequestMethod.PATCH)

export const Post = createRouteMappingDecorator(HttpRequestMethod.POST)

export const Put = createRouteMappingDecorator(HttpRequestMethod.PUT)

/******************************************************************************
 *
 * Helpers
 *
 *****************************************************************************/

const prepareSuccessHttpResponse = (res: HttpResponse, data: string): void => {
  // TODO
}

const prepareErrorHttpResponse = (res: HttpResponse, data: string): void => {
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
  method: HttpRequestMethod,
  path: string[],
  handler: HttpRouteHandler,
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
