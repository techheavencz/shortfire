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

## Planned features

 - [ ] tracking clicks on links (analytics), accessible via API
 - [ ] aliases for shortened urls (`short.url/my-event` -> `short.url/event` -> `some-very-long-url-address.com`)
 - [ ] simple UI for shortening URLs
 - [ ] support tokens (non Firebase Auth) for API authorization