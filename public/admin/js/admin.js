(function () {
  const AppElement = document.getElementById("App");
  const LoginElement = document.getElementById("Login");

  const UserInfoElement = document.getElementById("InfoUser");

  const ShortenUrlField = document.getElementById("ShortenUrlField");
  const ShortenAsField = document.getElementById("ShortenAsField");
  const ShortenButton = document.getElementById("NewUrl-ShortenButton");

  const UrlList = document.getElementById("UrlList-List");

  let userToken = null;

  window._updateAdminUi = function () {
    const userLoggedIn = window._adminUser !== undefined && window._adminUser !== null;

    AppElement.style.visibility = userLoggedIn ? 'visible' : 'hidden';
    LoginElement.style.visibility = userLoggedIn ? 'hidden' : 'visible';

    if (userLoggedIn) {
      const user = window._adminUser;

      userToken = user.token;

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
    ShortenButton.addEventListener('click', () => {
      const url = ShortenUrlField.value;
      const shortString = ShortenAsField.value;

      createNewLink(shortString, url);
    })
  }

  function createNewLink(shortString, targetUrl) {
    fetch('/api/v1/manage/url', {
      method: 'PUT',
      body: JSON.stringify({
        shortName: shortString,
        targetUrl: targetUrl
      }),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${userToken}`
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response)
      })
      .catch(function (reason) {
        console.warn('error', reason)
      })
  }

  function deleteLink(shortString) {
    fetch(`/api/v1/manage/url/${shortString}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${userToken}`
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response)
      })
      .catch(function (reason) {
        console.warn('error', reason)
      })
  }

  function observeExistingUrls() {
    firebase.database().ref('/shortenedLinks/')
      .on('value', (snapshot) => {
        const existingUrls = snapshot.val();

        const list = Object.keys(existingUrls)
          .map((key) => {
            return Object.assign({_key: key}, existingUrls[key]);
          });

        updateExistingUrls(list);
      })
  }

  function updateExistingUrls(existingUrls) {
    // delete all existing URLs
    while (UrlList.firstChild) {
      UrlList.removeChild(UrlList.firstChild);
    }

    // populate all new
    const urlItemElements = existingUrls
      .map((item) => createUrlItem(item));

    urlItemElements
      .forEach((item) => UrlList.appendChild(item));
  }

  function createUrlItem(item) {
    const element = document.createElement("div");
    element.className = "UrlList-ListItem";

    const leftContainer = document.createElement("div");
    leftContainer.className = "UrlList-ListItem-LeftPart";

    element.appendChild(leftContainer);

    const name = document.createElement("div");
    name.innerText = item._key;

    leftContainer.appendChild(name);

    const targetContainer = document.createElement("div");
    targetContainer.className = "UrlList-ListItem-Target";

    leftContainer.appendChild(targetContainer);

    const targetLink = document.createElement("a");
    targetLink.href = item.target;
    targetLink.innerText = item.target;
    targetLink.target = "_blank";

    targetContainer.appendChild(targetLink);

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "UrlList-ListItem-Actions";

    leftContainer.appendChild(actionsContainer);

    const copyAction = document.createElement("button");
    copyAction.className = "UrlList-ListItem-Action";
    copyAction.innerText = "Copy";
    copyAction.addEventListener('click', () => {
      copyToClipboard(`https://${location.hostname}/${item._key}`);
    });

    actionsContainer.appendChild(copyAction);

    const deleteAction = document.createElement("button");
    deleteAction.className = "UrlList-ListItem-Action";
    deleteAction.innerText = "Delete";
    deleteAction.addEventListener('click', () => {
      deleteLink(item._key);
    });

    actionsContainer.appendChild(deleteAction);

    const rightContainer = document.createElement("div");
    rightContainer.className = "UrlList-ListItem-RightPart";

    element.appendChild(rightContainer);

    const clickCount = document.createElement("div");
    clickCount.className = "UrlList-ListItem-Count";
    clickCount.innerText = item.count ? `${item.count}` : "0";

    rightContainer.appendChild(clickCount);

    return element;
  }

  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  // Wait for app to load to initialize app
  window.addEventListener("load", () => {
    setupApp();
  }, false);

}());