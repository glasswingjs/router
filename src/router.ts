import RouterFactory from 'find-my-way'
import {container, DependencyContainer} from 'tsyringe'

export interface HttpRouter extends RouterFactory.Instance<RouterFactory.HTTPVersion.V1> {}

export interface Http2Router extends RouterFactory.Instance<RouterFactory.HTTPVersion.V2> {}

export const registerRouter = (c?: DependencyContainer): void => {
  c = c || container
  c.register('Router', {
    useFactory: () => RouterFactory(),
  })
}
