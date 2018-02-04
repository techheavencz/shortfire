(function () {
  var AppElement = document.getElementById("App");
  var LoginElement = document.getElementById("Login");

  var UserInfoElement = document.getElementById("InfoUser");

  var ShortenUrlField = document.getElementById("ShortenUrlField");
  var ShortenAsField = document.getElementById("ShortenAsField");
  var ShortenButton = document.getElementById("NewUrl-ShortenButton");

  window._updateAdminUi = function () {
    var userLoggedIn = window._adminUser !== undefined && window._adminUser !== null;

    AppElement.style.visibility = userLoggedIn ? 'visible' : 'hidden';
    LoginElement.style.visibility = userLoggedIn ? 'hidden' : 'visible';

    if (userLoggedIn) {
      var user = window._adminUser;

      UserInfoElement.innerText = user.name;
    }
  };

  function setupApp() {
    // Handle click events of login button
    setupLoginButton();

    // Handle shorten url button
    setupShortenButton();

    // Observe URLs
    observeExistingUrls();
  }

  function setupLoginButton() {
    document.getElementById('Login-Button')
      .addEventListener('click', function () {
        window.loginWithGoogle();
      })
  }

  function setupShortenButton() {
    var url = ShortenUrlField.innerText;
    var shortString = ShortenAsField.innerText;

    ShortenButton.addEventListener('click', function () {
      fetch('/api/v1/manage/url.json', {
        method: 'POST',
        body: JSON.stringify({
          url: url,
          shortName: shortString
        })
      })
        .then(function (response) {
          console.log('response', response)
        })
        .catch(function (reason) {
          console.warn('error', reason)
        })
    })
  }

  function observeExistingUrls() {
    firebase.database().ref('/shortenedLinks/')
      .on('value', function (snapshot) {
        // todo:
        console.log('existing urls', snapshot.val());
      })
  }

// Wait for app to load to initialize app
  window.addEventListener('load', function () {
    setupApp();
  }, false);
}());