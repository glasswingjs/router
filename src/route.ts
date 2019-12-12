import {Http2Request, Http2Response, HttpRequest, HttpRequestMethod, HttpResponse} from '@glasswing/http'

export type HttpRouteHandler = (req: HttpRequest | Http2Request, res: HttpResponse | Http2Response) => void

export interface HttpRouteDescriptor {
  method: HttpRequestMethod
  path: string
  handler: HttpRouteHandler
}
