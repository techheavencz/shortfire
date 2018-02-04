'use strict';

import * as functions from 'firebase-functions'

export const redirect = functions.https.onRequest((request, response) => {
  response.send('THVN ShortFire');
});
