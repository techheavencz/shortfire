'use strict';

import * as functions from 'firebase-functions'
import * as express from 'express'
import * as admin from 'firebase-admin'
import RedirectHandler from "./RedirectHandler";
import Api from "./api/Api";

// Initialize Firebase App
admin.initializeApp(functions.config().firebase);

// Routing
const app = express();

// API
app.use("/api", Api.setup());

// Handle redirect
app.get("*", (request, response) => {
  RedirectHandler.handleRedirect(request, response)
});

// Handle the rest
app.all("*", ((req, res) => {
  res.status(500);
}));

export const redirect = functions.https.onRequest(app);
