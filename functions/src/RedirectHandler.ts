import * as admin from "firebase-admin";
import * as express from "express";

class RedirectHandler {

    private static _instance: RedirectHandler = new RedirectHandler();

    static handleRedirect(request: express.Request, response: express.Response) {
        this._instance.parseLinkId(request)
            .then((linkId) => {
                return this._instance.obtainTargetUrl(linkId)
                    .then((targetUrl) => this._instance.redirectToUrl(targetUrl, response))
                    .then(() => this._instance.logRedirect(linkId))
            })
            .catch((error) => this._instance.handleFailure(error, response));
    }

    private parseLinkId(request: express.Request): Promise<string> {
        try {
            const linkId = request.path
                .substr(1)
                .toLocaleLowerCase();

            return Promise.resolve(linkId)
        } catch (e) {
            console.error(e);
            return Promise.reject("unknown")
        }
    }

    private obtainTargetUrl(linkId: string): Promise<string> {
        return admin.database().ref(`/shortenedLinks/${linkId}/target`)
            .once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    return Promise.resolve(snapshot.val());
                } else {
                    return Promise.reject(`Target '${linkId}' not found`);
                }
            })
            .catch(failure => {
                console.error(failure);
                return Promise.reject("invalid_id")
            });
    }

    private redirectToUrl(url: string, response: express.Response): Promise<void> {
        response.redirect(url);
        return Promise.resolve()
    }

    private logRedirect(linkId: string): Promise<void> {
        return admin.database().ref(`/shortenedLinks/${linkId}/count`)
            .transaction((value) => {
                return (value || 0) + 1;
            })
            .then((response) => {
                if (!response.committed) {
                    console.warn('transaction not committed')
                }
                return Promise.resolve()
            })
    }

    private handleFailure(cause: string, response: express.Response) {
        response.redirect('/');
    }

}

export default RedirectHandler