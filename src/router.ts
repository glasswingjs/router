import RouterFactory from 'find-my-way'
import {container} from 'tsyringe'

export const registerRouter = (): void => {
  container.register('Router', {
    useFactory: () => RouterFactory(),
  })
}
