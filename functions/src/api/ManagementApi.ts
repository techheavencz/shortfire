import * as express from 'express'
import EndpointGroup from "./EndpointGroup";
import UrlEndpoint from "./management/UrlEndpoint";

class ManagementApi implements EndpointGroup {

  setup(): express.Router {
    const apiRouter = express.Router();

    // URL endpoint
    apiRouter.post('/url.json', UrlEndpoint.handler);

    return apiRouter;
  }

}

const instance = new ManagementApi();

export default instance