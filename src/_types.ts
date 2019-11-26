import {HTTPVersion, Instance} from 'find-my-way'

import {Request, Response} from '../http'

export type Router = Instance<HTTPVersion.V1> | Instance<HTTPVersion.V2>

export type RouterCallable = (req: Request, res: Response) => void

export type ArgumentSource = 'request' | 'response' | 'params'

export type ArgumentMapperCallable = (entity: any) => any

export interface ParameterDescriptor {
  callable: ArgumentMapperCallable
  source: ArgumentSource
}
