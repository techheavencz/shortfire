// User state observing/handling

function updateAuthorizedState(user) {
  if (user != null) {
    console.log('user signed in - ' + user.name);

    checkAdminState(user.uid)
      .then(function () {
        updateUser(user);
      })
      .catch(function (reason) {
        handleInvalidUser(user);
      })
  } else {
    console.log('user signed out');

    window._adminUser = null;
    window._updateAdminUi();
  }
}

function updateUser(user) {
  window._adminUser = user;
  window._updateAdminUi();

  return Promise.resolve();
}

function handleInvalidUser(user) {
  console.warn('invalid user!!!', user);

  alert('User account not admin!');
  firebase.auth().signOut();
}

function checkAdminState(uid) {
  return firebase.database().ref('/admins/' + uid)
    .once('value')
    .then(function (value) {
      if (value.exists()) {
        return Promise.resolve()
      } else {
        return Promise.reject('not_admin')
      }
    })
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged(function (user) {
  user.getIdToken()
    .then((idToken) => {
      updateAuthorizedState(user != null ? {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        token: idToken
      } : null)
    })
    .catch((err) => {
      console.warn(err);
    });
});

// Setup Google Login

var googleProvider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();

window.loginWithGoogle = function () {
  firebase.auth().signInWithPopup(googleProvider)
    .then(function () {
      console.log('login successful')
    })
    .catch(function (reason) {
      console.warn('login failed', reason)
    })
};