import 'reflect-metadata'
import {Request, RequestMethod, Response} from '@glasswing/http'
import {expect} from 'chai'
import {container} from 'tsyringe'

import {Route, RouteRegistry} from '../src'

describe('src/route => RouteRegistry', () => {
  let routeRegistry: RouteRegistry

  const routeAsString: Route = {
    handler: (req: Request, res: Response) => {},
    method: RequestMethod.GET,
    path: '/path-as-string',
  }

  const addRouteAsString = () => {
    routeRegistry.registerRoute(routeAsString.path, routeAsString.method, routeAsString.handler)
  }

  const routeAsObject: Route = {
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

  it('RouteRegistry::singleton() will return an object', () => {
    expect(container.resolve(RouteRegistry)).to.be.an('object')
  })

  // it('RouteRegistry::constructor() will return an object', () => {
  //   expect(routeRegistry).to.be.an('object')
  // })

  // it('RouteRegistry::registerRoute(get, /test, handler) should register properly', () => {
  //   expect(addRouteAsString).to.not.throw()

  //   const addedRoute: Route | undefined = routeRegistry.routes.find(
  //     r => r.path === routeAsString.path && r.method === routeAsString.method,
  //   )
  //   expect(addedRoute).to.not.be.a('null')
  //   expect(addedRoute).to.not.be.a('undefined')
  // })

  // it('RouteRegistry::registerRoute(get, /test, handler) if ran for seccond time, should throw error', () => {
  //   expect(addRouteAsString).to.throw("A route for path '/path-as-string' with method 'get' was already added.")
  // })

  // it('RouteRegistry::registerRoute(route)', () => {
  //   expect(addRouteAsObject).to.not.throw()

  //   const addedRoute: Route | undefined = routeRegistry.routes.find(
  //     r => r.path === routeAsObject.path && r.method === routeAsObject.method,
  //   )
  //   expect(addedRoute).to.not.be.a('null')
  //   expect(addedRoute).to.not.be.a('undefined')
  // })

  // it('RouteRegistry::registerRoute(route) if ran for seccond time, should throw error', () => {
  //   expect(addRouteAsObject).to.throw("A route for path '/path-as-object' with method 'get' was already added.")
  // })

  // it('RouteRegistry::routes getter to return a valid array', () => {
  //   expect(routeRegistry.routes).to.be.an('array')
  // })

  // it('RouteRegistry::unregisterRoutes(/path-to-string, post) to not remove route (with get method)', () => {
  //   routeRegistry.unregisterRoutes(routeAsString.path, RequestMethod.POST)

  //   const addedRoute: Route | undefined = routeRegistry.routes.find(
  //     r => r.path === routeAsString.path && r.method === routeAsString.method,
  //   )
  //   expect(addedRoute).to.not.be.a('null')
  //   expect(addedRoute).to.not.be.a('undefined')
  // })

  // it('RouteRegistry::unregisterRoutes(/path-to-string, get) to remove route (with get method)', () => {
  //   routeRegistry.unregisterRoutes(routeAsString.path, routeAsString.method)

  //   const addedRoute: Route | undefined = routeRegistry.routes.find(
  //     r => r.path === routeAsString.path && r.method === routeAsString.method,
  //   )
  //   expect(addedRoute).to.be.a('undefined')
  // })

  // it('RouteRegistry::unregisterRoutes(/path-to-object) to remove all routes (with this path)', () => {
  //   routeRegistry.unregisterRoutes(routeAsObject.path)

  //   const addedRoute: Route | undefined = routeRegistry.routes.find(r => r.path === routeAsObject.path)
  //   expect(addedRoute).to.be.a('undefined')
  // })

  // it('RouteRegistry::clear to delete all stored routes', () => {
  //   routeRegistry.registerRoute(routeAsObject)
  //   expect(routeRegistry.routes.length).to.equal(1)
  //   routeRegistry.clear()
  //   expect(routeRegistry.routes).to.be.an('array')
  //   expect(routeRegistry.routes.length).to.equal(0)
  // })
})
