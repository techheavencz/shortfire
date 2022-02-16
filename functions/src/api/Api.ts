import express from 'express'
import ManagementApi from "./management/ManagementApi";
import authorizeRequest from "./auth/FirebaseAuth";
import {respondFailure} from "./util/ApiResponse";
import bodyParser from "body-parser";
import cors from "cors";

class Api {

  setup(): express.Router {
    const apiRouter = express.Router();

    // CORS headers
    apiRouter.use(cors({origin: true}));

    // Authorization
    apiRouter.use(authorizeRequest);

    // Parse incoming body
    apiRouter.use(bodyParser.json());

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
    respondFailure(response, 404, 'Not found');
  }

}

const ApiInstance = new Api();

export default ApiInstance
