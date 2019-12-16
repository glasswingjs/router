import 'reflect-metadata'
import {expect} from 'chai'
import {container, inject, injectable} from 'tsyringe'

import {HttpRouter, registerRouter} from '../src'

@injectable()
class TestApplication {
  constructor(@inject('Router') public router: HttpRouter) {}
}

registerRouter()

describe('@glasswing/router', () => {
  describe('Router', () => {
    it('::singleton() will return an object', () => {
      expect(container.resolve('Router')).to.be.an('object')
    })

    it('::inject() will return an object', () => {
      const app = container.resolve(TestApplication)
      expect(app.router).to.be.an('object')
    })
  })
})
