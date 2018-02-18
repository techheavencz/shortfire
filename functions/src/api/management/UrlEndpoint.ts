import Endpoint from "../Endpoint";
import * as express from 'express'
import {checkSchema} from "express-validator/check";
import * as admin from "firebase-admin";
import {respondFailure, respondWith} from "../util/ApiResponse";

class UrlEndpoint implements Endpoint {

  register(router: express.Router) {
    router.put('/url.json', this.validatePutRequest(), this.handlePutRequest);
    router.delete('/url.json', this.validateDeleteRequest(), this.handleDeleteRequest);
    router.get('/url.json', this.handleGetRequest);
  }

  private validatePutRequest() {
    return checkSchema({
      targetUrl: {
        in: "body",
        errorMessage: "Missing/invalid field 'targetUrl'",
        isURL: true
      },
      shortName: {
        in: "body",
        errorMessage: "Missing/invalid field 'shortName'",
        isLength: {
          options: {
            min: 3,
            max: undefined
          }
        },
        isLowercase: true,
        matches: {
          options: /^[a-z0-9_\-]+$/g
        }
      }
    })
  }

  private handlePutRequest(req: express.Request, res: express.Response) {
    const targetUrl = req.body.targetUrl;
    const shortName = req.body.shortName;

    const db = admin.database();
    const linkRef = db.ref(`/shortenedLinks/${shortName}`)

    linkRef
      .once('value')
      .then((ref) => {
        if (ref.exists()) {
          return Promise.resolve()
        } else {
          return Promise.reject({
            status: 409
          })
        }
      })
      .then(() => linkRef.child('target').set(targetUrl))
      .then(() => {
        respondWith(res, null)
      })
      .catch((reason) => {
        console.warn(reason);

        const status = reason.status ? reason.status : 500;

        respondFailure(res, status, "Failed to create link")
      })
  }

  private validateDeleteRequest() {
    return checkSchema({
      shortName: {
        in: "body",
        errorMessage: "Missing/invalid field 'shortName"
      }
    })
  }

  private handleDeleteRequest(req: express.Request, res: express.Response) {
    // todo
  }

  private handleGetRequest(req: express.Request, res: express.Response) {
    // todo
  }

}

export default UrlEndpoint