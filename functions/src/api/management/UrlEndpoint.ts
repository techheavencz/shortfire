import Endpoint from "../Endpoint";
import * as express from 'express'
import {checkSchema, validationResult} from "express-validator/check";
import * as admin from "firebase-admin";
import {respondFailure, respondWith} from "../util/ApiResponse";

class UrlEndpoint implements Endpoint {

    register(router: express.Router) {
        router.put('/url', UrlEndpoint.validatePutRequest(), this.handlePutRequest);
        router.delete('/url/:shortName', UrlEndpoint.validateDeleteRequest(), this.handleDeleteRequest);
        router.get('/url/:shortName', this.handleGetRequest);
    }

    private static validatePutRequest() {
        return checkSchema({
            targetUrl: {
                in: ["body"],
                errorMessage: "Missing/invalid field",
                isURL: true
            },
            shortName: {
                in: ["body"],
                errorMessage: "Missing/invalid field",
                isLength: {
                    options: {
                        min: 1,
                        max: undefined
                    }
                },
                isLowercase: true,
                matches: {
                    options: /^[a-z0-9_\-]+$/g
                }
            }
        });
    }

    private handlePutRequest(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            respondFailure(res, 422, "Validation error", errors.mapped());
            return;
        }

        const targetUrl = req.body.targetUrl;
        const shortName = req.body.shortName;

        const db = admin.database();
        const linkRef = db.ref(`/shortenedLinks/${shortName}`);

        linkRef
            .once('value')
            .then((ref) => {
                if (ref.exists()) {
                    return Promise.reject({
                        status: 409
                    });
                } else {
                    return Promise.resolve();
                }
            })
            .then(() => linkRef.child('target').set(targetUrl))
            .then(() => {
                respondWith(res, null)
            })
            .catch((reason) => {
                console.warn(reason);

                const status = reason.status ? reason.status : 500;

                respondFailure(res, status, "Failed to create link");
            })
    }

    private static validateDeleteRequest() {
        return checkSchema({
            shortName: {
                in: ["params"],
                errorMessage: "Missing/invalid field 'shortName'",
                isLowercase: true,
                matches: {
                    options: /^[a-z0-9_\-]+$/g
                }
            }
        })
    }

    private handleDeleteRequest(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            respondFailure(res, 422, "Validation error", errors.mapped());
            return;
        }

        const shortName = req.params.shortName;

        const db = admin.database();
        const linkRef = db.ref(`/shortenedLinks/${shortName}`);

        linkRef
            .once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return Promise.resolve();
                } else {
                    return Promise.reject({
                        status: 404
                    });
                }
            })
            .then(() => linkRef.remove())
            .then(() => {
                respondWith(res, null)
            })
            .catch((reason) => {
                console.warn(reason);

                const status = reason.status ? reason.status : 500;

                respondFailure(res, status, "Failed to delete link");
            })
    }

    private handleGetRequest(req: express.Request, res: express.Response) {
        // todo
    }

}

export default UrlEndpoint