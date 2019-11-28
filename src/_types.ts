import {Request, RequestHandler, RequestMethod, Response} from '@glasswing/http'
import {HTTPVersion, Instance} from 'find-my-way'

export type Router = Instance<HTTPVersion.V1> | Instance<HTTPVersion.V2>

export interface RouteDescriptor {
  method: RequestMethod
  path: string
  handler: RequestHandler
}
