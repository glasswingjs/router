import RouterFactory, {HTTPVersion, Instance} from 'find-my-way'
import {container} from 'tsyringe'

export type Router = Instance<HTTPVersion.V1> | Instance<HTTPVersion.V2>

import {Http2Request, Http2Response, HttpRequest, HttpRequestMethod, HttpResponse} from '@glasswing/http'

export interface HttpRouter extends RouterFactory.Instance<RouterFactory.HTTPVersion.V1> {}

export interface Http2Router extends RouterFactory.Instance<RouterFactory.HTTPVersion.V2> {}

export const registerRouter = (): void => {
  container.register('Router', {
    useFactory: () => RouterFactory(),
  })
}
