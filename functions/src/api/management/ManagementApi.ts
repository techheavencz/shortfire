import express from 'express'
import EndpointGroup from "../EndpointGroup";
import UrlEndpoint from "./UrlEndpoint";

class ManagementApi implements EndpointGroup {

  setup(): express.Router {
    const apiRouter = express.Router();

    // URL endpoint
    new UrlEndpoint().register(apiRouter);

    return apiRouter;
  }

}

const instance = new ManagementApi();

export default instance
