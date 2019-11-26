import RouterFactory from 'find-my-way'
import {container} from 'tsyringe'

export const registerRouter = () =>
  container.register('Router', {
    useFactory: () => RouterFactory(),
  })
