# ShortFire

Simple URL shortener, using the Firebase platform from Google (to be used with custom domain)

For example, if you have domain *techheaven.org* and use it in form *techheaven.org/events/my-awesome-event*,
but want to use URL shortener with custom domain, in our case *thvn.org*

*techheaven.org/events/my-awesome-event* -> *thvn.org/an-event*

Or anything you want.

Very easy to deploy, running on Google Firebase, for small projects even free (look at Firebase free tier).

## Installation

1. Clone this repository/download release .zip (from Releases)

2. Create a Firebase project you will use for your shortener (you can use free plan)
TODO: link to Firebase console

3. Setup your custom domain for hosting (for example, *thvn.cz* in our case)
TODO: link to documentation

4. Open terminal and enter the *ShortFire* directory

5. Deploy to Firebase

If you don't have firebase command line tools

```bash
# If you are using Yarn
(sudo) yarn global add firebase-tools

# If NPM
(sudo) npm install -g firebase-tools
```

More details in Firebase docs TODO: link

6. Your shortener is working

To start creating shortened URLs

## API

URLs can be created and managed using built in API. Each API request must be authorized 
with Firebase Auth. All users have the same rights, every authorized user is essentially *admin*.

[API docs](/link-to-wiki)

## Local Development
If you have already installed firebase CLI, you should be able to use local firebase emulators.
To use them, you need to setup your environment.
```dotenv
# functions/.env.local
FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
FIREBASE_DATABASE_EMULATOR_HOST="localhost:9000"
FIREBASE_STORAGE_EMULATOR_HOST="localhost:9199"
```
This will setup functions emulator to redirect all requests to emulated enpoints.
```javascript
// public/admin/firebaseConfig.js

//...
/**
 * This will connect to firebase emulators after app is initialized on localhost
 */
function enableEmulators(){
	if(!firebase.app){
		setTimeout(enableEmulators, 50)
		return
	}

	if(location.hostname==="localhost"){
		firebase.auth().useEmulator("http://localhost:9099");
		firebase.database().useEmulator("localhost",9000)
		firebase.functions().useEmulator("localhost", 5001);
	}
}

setTimeout(enableEmulators, 50)
```
You can use this to connect to emulators on your client. This also means you **need** to create `public/admin/firebaseConfig.js`
which contains `firebaseConfig`, that contains valid firebase configuration. ([example here](public/admin/firebaseConfig.sample.js))

After everything is set up, you only need to start the emulators with `firebase emulators:start`. <br/>
You can find more information on using firebase emulators [here](https://firebase.google.com/docs/emulator-suite).

## Planned features

 - [ ] tracking clicks on links (analytics), accessible via API
 - [ ] aliases for shortened urls (`short.url/my-event` -> `short.url/event` -> `some-very-long-url-address.com`)
 - [ ] simple UI for shortening URLs
 - [ ] support tokens (non Firebase Auth) for API authorization
