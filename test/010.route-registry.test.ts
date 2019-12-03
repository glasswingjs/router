import 'reflect-metadata'
import {Request, RequestMethod, Response} from '@glasswing/http'
import {expect} from 'chai'
import {container} from 'tsyringe'

import {RouteDescriptor, RouteRegistry, registerRouter} from '../src'

registerRouter()

describe('@glasswing/router', () => {
  describe('RouteRegistry', () => {
    let routeRegistry: RouteRegistry

    const routeAsString: RouteDescriptor = {
      handler: (req: Request, res: Response) => {},
      method: RequestMethod.GET,
      path: '/path-as-string',
    }

    const addRouteAsString = () => {
      routeRegistry.registerRoute(routeAsString.path, routeAsString.method, routeAsString.handler)
    }

    const routeAsObject: RouteDescriptor = {
      handler: (req: Request, res: Response) => {},
      method: RequestMethod.GET,
      path: '/path-as-object',
    }
    const addRouteAsObject = () => {
      routeRegistry.registerRoute(routeAsObject)
    }

    before(() => {
      routeRegistry = new RouteRegistry()
    })

    it('::singleton() will return an object', () => {
      expect(container.resolve(RouteRegistry)).to.be.an('object')
    })

    it('::constructor() will return an object', () => {
      expect(routeRegistry).to.be.an('object')
    })

    it('::registerRoute(/test, get, handler) should register properly', () => {
      expect(addRouteAsString).to.not.throw()

      const addedRoute: RouteDescriptor | undefined = routeRegistry.routes.find(
        r => r.path === routeAsString.path && r.method === routeAsString.method,
      )
      expect(addedRoute).to.not.be.a('null')
      expect(addedRoute).to.not.be.a('undefined')
    })

    it('::registerRoute(/test, get, handler) if ran for seccond time, should throw error', () => {
      expect(addRouteAsString).to.throw("A route for path '/path-as-string' with method 'get' was already added.")
    })

    it('::registerRoute(/test, get) should throw an error', () => {
      expect(() => routeRegistry.registerRoute('/test', RequestMethod.GET)).to.throw(
        'For `registryRoute(string, RequestMethod, RequestHandler)` form, `handler` parameter si mandatory.',
      )
    })

    it('::registerRoute(route)', () => {
      expect(addRouteAsObject).to.not.throw()

      const addedRoute: RouteDescriptor | undefined = routeRegistry.routes.find(
        r => r.path === routeAsObject.path && r.method === routeAsObject.method,
      )
      expect(addedRoute).to.not.be.a('null')
      expect(addedRoute).to.not.be.a('undefined')
    })

    it('::registerRoute(route) if ran for seccond time, should throw error', () => {
      expect(addRouteAsObject).to.throw("A route for path '/path-as-object' with method 'get' was already added.")
    })

    it('::routes getter to return a valid array', () => {
      expect(routeRegistry.routes).to.be.an('array')
    })

    it('::unregisterRoutes(/path-to-string, post) to not remove route (with get method)', () => {
      routeRegistry.unregisterRoutes(routeAsString.path, RequestMethod.POST)

      const addedRoute: RouteDescriptor | undefined = routeRegistry.routes.find(
        r => r.path === routeAsString.path && r.method === routeAsString.method,
      )
      expect(addedRoute).to.not.be.a('null')
      expect(addedRoute).to.not.be.a('undefined')
    })

    it('::unregisterRoutes(/path-to-string, get) to remove route (with get method)', () => {
      routeRegistry.unregisterRoutes(routeAsString.path, routeAsString.method)

      const addedRoute: RouteDescriptor | undefined = routeRegistry.routes.find(
        r => r.path === routeAsString.path && r.method === routeAsString.method,
      )
      expect(addedRoute).to.be.a('undefined')
    })

    it('::unregisterRoutes(/path-to-object) to remove all routes (with this path)', () => {
      routeRegistry.unregisterRoutes(routeAsObject.path)

      const addedRoute: RouteDescriptor | undefined = routeRegistry.routes.find(r => r.path === routeAsObject.path)
      expect(addedRoute).to.be.a('undefined')
    })

    it('::clear to delete all stored routes', () => {
      routeRegistry.registerRoute(routeAsObject)
      expect(routeRegistry.routes.length).to.equal(1)
      routeRegistry.clear()
      expect(routeRegistry.routes).to.be.an('array')
      expect(routeRegistry.routes.length).to.equal(0)
    })
  })

  describe('Router', () => {
    it('::singleton() will return an object', () => {
      expect(container.resolve('Router')).to.be.an('object')
      // expect(container.resolve('Router') instanceof Y).to.be.an('object')
    })
  })
})
