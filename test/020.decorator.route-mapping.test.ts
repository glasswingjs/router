import 'reflect-metadata'
import {expect} from 'chai'

import {HttpRequestMethod} from '@glasswing/http'

import {
  All,
  Delete,
  Get,
  getControllerPathMappings,
  Head,
  Options,
  Patch,
  Post,
  Put,
  ROUTE_REGISTRY_METADATA_NAME,
} from '../src'

export class TestController {
  @All('/no-args-all')
  public noArgsAll() {}

  @Delete('/delete')
  public delete() {}

  @Get('/no-args-get')
  public noArgsGet() {}

  @Head('/head')
  public head() {}

  @Options('/options')
  public options() {}

  @Patch('/no-args-patch')
  public noArgsPatch() {}

  @Post('/no-args-post')
  public noArgsPost() {}

  @Put('/no-args-put')
  public noArgsPut() {}
}

const hmd = (key: string, target: any) => Reflect.hasMetadata(key, target)

const gmd = (key: string, target: any) => Reflect.getMetadata(key, target)

const mapping = (target: any, method: HttpRequestMethod, path: string) => {
  const routes = getControllerPathMappings(target).routes.filter(
    route => route.method === method && route.path === path,
  )
  return routes.length ? routes.pop() : null
}

describe('@glasswing/router/decorator', () => {
  describe('All(route: string) => ', () => {
    let controller: TestController

    beforeEach(() => {
      controller = new TestController()
    })

    it('@All() => Should add a @All route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.ALL, '/no-args-all')
      expect(route).to.not.be.null
    })

    it('@Delete() => Should add a @Delete route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.DELETE, '/delete')
      expect(route).to.not.be.null
    })

    it('@Get() => Should add a @Get route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.GET, '/no-args-get')
      expect(route).to.not.be.null
    })

    it('@Head() => Should add a @Head route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.HEAD, '/head')
      expect(route).to.not.be.null
    })

    it('@Options() => Should add a @Options route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.OPTIONS, '/options')
      expect(route).to.not.be.null
    })

    it('@Patch() => Should add a @Patch route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.PATCH, '/no-args-patch')
      expect(route).to.not.be.null
    })

    it('@Post() => Should add a @Post route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.POST, '/no-args-post')
      expect(route).to.not.be.null
    })

    it('@Put() => Should add a @Put route mapping', () => {
      expect(hmd(ROUTE_REGISTRY_METADATA_NAME, controller)).to.be.true
      const route = mapping(controller, HttpRequestMethod.PUT, '/no-args-put')
      expect(route).to.not.be.null
    })
  })
})
