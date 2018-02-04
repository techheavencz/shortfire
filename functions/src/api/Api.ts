import * as express from 'express'
import ManagementApi from "./ManagementApi";

class Api {

  setup(): express.Router {
    const apiRouter = express.Router();

    // Setup API
    apiRouter.use('/v1', this.setupV1());

    // Handle all
    apiRouter.all('*', this.rejectInvalidRequest);

    return apiRouter;
  }

  private setupV1(): express.Router {
    const apiRouter = express.Router();

    // Management API (/manage)
    apiRouter.use('/manage', ManagementApi.setup());

    return apiRouter;
  }

  private rejectInvalidRequest(request: express.Request, response: express.Response) {
    response.setHeader('Content-Type', 'application/json');
    response.send({
      status: 500,
      message: 'Invalid request'
    })
  }

}

const ApiInstance = new Api();

export default ApiInstance