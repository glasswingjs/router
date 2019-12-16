import RouterFactory from 'find-my-way'
import {container} from 'tsyringe'

export interface HttpRouter extends RouterFactory.Instance<RouterFactory.HTTPVersion.V1> {}

export interface Http2Router extends RouterFactory.Instance<RouterFactory.HTTPVersion.V2> {}

export const registerRouter = (): void => {
  container.register('Router', {
    useFactory: () => RouterFactory(),
  })
}
