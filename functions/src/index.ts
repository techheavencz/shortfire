import * as functions from 'firebase-functions'
import express from 'express'
import admin from 'firebase-admin'
import RedirectHandler from "./RedirectHandler";
import Api from "./api/Api";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config()

// Initialize Firebase App
admin.initializeApp();

// Routing
const app = express();

// Cookies
app.use(cookieParser());

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

exports.redirect = functions.https.onRequest(app);
