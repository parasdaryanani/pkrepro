# PartyKit x React Native

PartyKit works in debug mode but not in Release mode, on both iOS as well as Android.

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
![Alt text](<Screenshot 2023-09-12 at 11.01.45.png>)


3. Stop running processes.

4. Run iOS in release mode:

```bash
yarn ios-release
```

5. Open the app in release mode and the partykit [prod page](https://pkrepro.parasdaryanani.partykit.dev/).

6. Verify that connect/disconnect in the app works by closing the app (via Device > App Switcher) and reopening the app.

7. Notice that messages are not sent or received, although connect/disconnect seems ok.
![Alt text](<Screenshot 2023-09-12 at 11.20.23.png>)

8. Tailing partykit logs doesn't show anything suspicious.
![Alt text](<Screenshot 2023-09-12 at 11.22.32.png>)


9. On a side note `import usePartySocket from "partysocket/react"` doesn't seem happy with react-native.

![Alt text](<Screenshot 2023-09-12 at 11.31.14.png>)

<hr/>

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
