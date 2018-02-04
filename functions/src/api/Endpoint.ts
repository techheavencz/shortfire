import * as express from 'express'

interface Endpoint {
  handler(request: express.Request, response: express.Response)
}

export default Endpoint