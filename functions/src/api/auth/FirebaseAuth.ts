import * as admin from 'firebase-admin'
import {respondFailure} from "../util/ApiResponse";

function checkIsAdmin(uid: string) {
  return admin.database()
    .ref(`/admins/${uid}`)
    .once('value')
    .then((ref) => {
      if (ref.val() === true) {
        return Promise.resolve()
      } else {
        return Promise.reject('User not admin')
      }
    })
}

const authorizeRequest = (req, res, next) => {
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');

    respondFailure(res, 403, 'Unauthorized');
    return;
  }

  let idToken;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }

  admin.auth()
    .verifyIdToken(idToken)
    .then((decodedIdToken) => {
      req.user = decodedIdToken;
      return checkIsAdmin(decodedIdToken.uid);
    })
    .then(() => next())
    .catch((error) => {
      console.error('Error while verifying Firebase ID token:', error);
      respondFailure(res, 403, 'Unauthorized');
    });
};

export default authorizeRequest