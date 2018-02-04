'use strict';

import * as functions from 'firebase-functions'
import * as express from 'express'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase);

function parseLinkId(request: express.Request): Promise<string> {
  try {
    const linkId = request.path.substr(1);
    return Promise.resolve(linkId)
  } catch (e) {
    console.error(e);
    return Promise.reject("unknown")
  }
}

function obtainTargetUrl(linkId: string): Promise<string> {
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

function redirectToUrl(url: string, response: express.Response): Promise<void> {
  response.redirect(url);
  return Promise.resolve()
}

function handleFailure(cause: string, response: express.Response) {
  response.redirect('/');
}

export const redirect = functions.https.onRequest((request, response) => {
  parseLinkId(request)
    .then((linkId) => obtainTargetUrl(linkId))
    .then((targetUrl) => redirectToUrl(targetUrl, response))
    .catch((error) => handleFailure(error, response));
});
