import Endpoint from "../Endpoint";
import * as express from 'express'

class UrlEndpoint implements Endpoint{

  handler(request: express.Request, response: express.Response) {
    response.send("hi");
  }

}

const instance = new UrlEndpoint();

export default instance