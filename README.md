# PartyKit x React Native

## Package Exports

Metro complains about `import usePartySocket from "partysocket/react"` because of package exports which aren't fully compatible with react native as yet.

![Alt text](<Screenshot 2023-09-12 at 11.31.14.png>)

We can resolve this with an unstable flag in the metro config as follows:

```js

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enablePackageExports: true,
  },
};
```
Ref: https://facebook.github.io/metro/docs/configuration/#unstable_enablepackageexports-experimental


## Debug vs Release

PartySocket works perfectly in debug mode but not in Release mode, on both iOS as well as Android.

Steps to reproduce:

1. Run iOS in debug mode:

```bash
# run concurrently
yarn ios-party-debug 

# or run in separate terminals
yarn ios
yarn party
```

2. Verify that messages are coming into the app as well as the browser.

Open the partykit [dev page](http://127.0.0.1:1999/) and the ios app. You should see both sending/receiving messages:
![App in debug mode sending/receiving messages](<Screenshot 2023-09-12 at 11.01.45.png>)


3. Stop running processes.

4. Run iOS in release mode:

```bash
yarn ios-release
```

5. Open the app in release mode and the partykit [prod page](https://pkrepro.parasdaryanani.partykit.dev/).

6. Verify that connect/disconnect in the app works by closing the app (via Device > App Switcher) and reopening the app.

7. Notice that messages are not sent or received, although connect/disconnect seems ok.
![App in release mode not sending/receiving messages](<Screenshot 2023-09-12 at 11.20.23.png>)

8. Tailing partykit logs doesn't show anything suspicious.
![Partykit tail logs](<Screenshot 2023-09-12 at 11.22.32.png>)

9. Running the app in Release mode using XCode lets us tail logs in Release mode, which show the following errors:
![Logs in release mode with errors](<Screenshot 2023-09-22 at 15.29.13.png>)
I suspect that this has something to do with how events are implemented in react native, as well as the use of `MessageEvent` which is a DOM property, which is unavailable in react native.
10. I've written a hacky [patch](/patches/partysocket+0.0.8.patch) for this which seems to resolve the issue and enables partysocket to be used in Release mode. It's probably not the best way, but it lets us party on! 🎈
![Logs in release mode without errors](<Screenshot 2023-09-22 at 15.41.08.png>)