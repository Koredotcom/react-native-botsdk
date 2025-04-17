# Kore.ai SDK
Kore.ai offers Bots SDKs as a set of platform-specific client libraries that provide a quick and convenient way to integrate Kore.ai Bots chat capability into custom applications.

With just few lines of code, you can embed our Kore.ai chat widget into your applications to enable end-users to interact with your applications using Natural Language. For more information, refer to https://developer.kore.com/docs/bots/kore-web-sdk/

# Kore.ai react-native SDK for developers

Kore.ai SDK for react-native enables you to talk to Kore.ai bots over a web socket. This repo also comes with the code for sample application that developers can modify according to their Bot configuration.

### Supported react-native versions
1.For react-native versions 0.72 & above

2.For react-native versions below 0.72 the sdk will coming soon..


# Setting up

### Prerequisites
* Service to generate JWT (JSON Web Tokens)- this service will be used in the assertion function injected to obtain the connection.
* SDK app credentials 
* Login to the Bots platform
	* Navigate to the Bot builder
	* Search and click on the bot 
	* Enable *Web / Mobile Client* channel against the bot as shown in the screen below.
		
	![Add bot to Web/Mobile Client channel](https://github.com/Koredotcom/android-kore-sdk/blob/master/channels.png)
	
	* create new or use existing SDK app to obtain client id and client secret
	
	![Obtain Client id and Client secret](https://github.com/Koredotcom/android-kore-sdk/blob/master/web-mobile-client-channel.png)

## Instructions

### Configuration changes
* Setting up clientId, clientSecret, botId, botName and identity in BotConfig.tsx file

##### Client id - Copy this id from Bot Builder SDK Settings ex. cs-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx

##### Client secret - copy this value from Bot Builder SDK Settings ex. Wibnxxxxxxxxxxxxxxxxxxxxxxxxxs=
 
##### User identity - This should represent the subject for JWT token that could be an email or phone number in case of known user. In case of anonymous user, this can be a randomly generated unique id.

##### Bot name - copy this value from Bot Builder -> Channels -> Web/Mobile SDK config  ex. "Demo Bot"

##### Bot Id - copy this value from Bot Builder -> Channels -> Web/Mobile SDK config  ex. st-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx

##### Server URL - replace it with your server URL, if required

##### Anonymous user - if not anonymous, assign same identity (such as email or phone number) while making a connection.

##### JWT Server URL - specify the server URL for JWT token generation. This token is used to authorize the SDK client. Refer to documentation on how to setup the JWT server for token generation - e.g. https://jwt-token-server.example.com/

 ```
export const botConfig: BotConfigModel = {
  botName: 'Bot name here',
  botId: 'Bot id here',
  clientId: 'client id here',
  clientSecret: 'client secret here',
  botUrl: 'https://platform.kore.ai',//change url here
  identity: uuid.v4() + '',//change identity here
  jwtServerUrl: 'https://platform.kore.ai'//change url here
  isWebHook: false,// For now this should be always false as web hook support is not yet available in react-native sdk
};

```

### Running the Demo app
*	Download or clone the repository.
*	Import the project.
*	npm install --legacy-peer-deps
*	Run Android app
  
		Install ndkVersion = "23.1.7779620" and build the project in Android Studio
 	
		npx react-native run-android
		  
*	Run iOS app

		ios/pod install, open project in xcode then clean & rebuild
 	
		npx react-native run-ios
 
  
# How to integrate react-native BotSDK through npm

1. Add below npm modules to your app's package.json
   
```
    "rn-kore-bot-ui-sdk": "^0.0.1",
```
2. Import KoreChat and render your BotChat component as shown below
```
import KoreChat, {HeaderIconsId, TEMPLATE_TYPES} from 'rn-kore-bot-ui-sdk';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
//IMPORT BOT CONFIG
.......
.......
render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <KoreChat
            botConfig={botConfig}
            alwaysShowSend={true}
            {...this.props}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
```
3. The following dependent node modules need to be installed to integrate the SDK.
```
"@gorhom/bottom-sheet": "^4.6.1",
"@react-native-async-storage/async-storage": "^1.22.3",
"@react-native-community/checkbox": "^0.5.17",
"@react-native-community/datetimepicker": "^7.6.2",
"@react-native-community/netinfo": "^11.2.0",
"@react-native-picker/picker": "^2.6.1",
"@react-native-voice/voice": "^3.2.4",
"react-native-blob-util": "^0.17.3",
"react-native-charts-wrapper": "^0.6.0",
"react-native-document-picker": "^9.1.1",
"react-native-fast-image": "^8.6.3",
"react-native-file-viewer": "^2.1.5",
"react-native-fs": "^2.20.0",
"react-native-gesture-handler": "^2.14.0",
"react-native-image-picker": "^7.1.2",
"react-native-orientation-locker": "^1.4.0",
"react-native-permissions": "^4.1.5",
"react-native-pure-jwt": "^3.0.2",
"react-native-reanimated": "^3.7.2",
"react-native-reanimated-carousel": "^3.4.0",
"react-native-simple-toast": "^3.1.0",
"react-native-svg": "^13.9.0",
"react-native-svg-transformer": "^1.0.0",
"react-native-track-player": "^4.0.1",
"react-native-user-agent": "^2.3.1",
"react-native-vector-icons": "^10.0.3",
"react-native-video": "^5.2.1",
"react-native-video-controls": "^2.8.1",
```
4. metro.config.js

```
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;
const config = {
 transformer: {
   babelTransformerPath: require.resolve('react-native-svg-transformer'),
 },
 resolver: {
   assetExts: assetExts.filter(ext => ext !== 'svg'),
   sourceExts: [...sourceExts, 'svg'],
 },
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```
5. babel.config.js

```
module.exports = {
 ...
 plugins: ['react-native-reanimated/plugin'],
};
```
 //For Android
 
6. In Android app level build.gradle file add the folowing line at the bottom.

```
...
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle”,
```

//For Android

7. In AndroidManifest.xml 


```
<uses-permission android:name="android.permission.RECORD_AUDIO" />
//react-native-file-viewer not opening documents on Android 11
//For that need to add folowing queries
 <queries>
       <package android:name="com.google.android.apps.docs.editors.docs" /> <!-- package names of Google Docs -->
       <package android:name="com.google.android.apps.docs.editors.sheets" /> <!-- package names of Google Sheets -->
       <package android:name="com.google.android.apps.docs.editors.slides" /> <!-- package names of Google Slides -->

// To open files
       <intent>
           <action android:name="android.intent.action.VIEW" />
           <data android:mimeType="*/*" />
       </intent>
   </queries>
```

//For Android

8. For email template, On clicking on email id email client should open. For that add the following intent-filter in LAUNCHER activity.


```
<intent-filter>
    <action android:name="android.intent.action.SENDTO" />
    <data android:scheme="mailto" />
</intent-filter>
```

 //For iOS
 
9. Following lines need to be added in iOS Podfile

```
...
flipper_config = FlipperConfiguration.disabled
...
setup_permissions([
       'Camera',
       'Microphone',
      'SpeechRecognition',
])
...
pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
...

 post_install do |installer|
 ....
    installer.pods_project.targets.each do |target|
     target.build_configurations.each do |config|
       case target.name
       when 'RCT-Folly'
         config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '9.0'
       else
         config.build_settings.delete('IPHONEOS_DEPLOYMENT_TARGET')
       end
     end
   end
....
 end
```

 //For iOS
 
10. Following permissions need to be added in iOS Info.plist

```
<key>NSCameraUsageDescription</key>
   <string>Please allow access to your camera</string>
   <key>NSHumanReadableCopyright</key>
   <string></string>
   <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
   <string>BotSDK needs access to location.</string>
   <key>NSLocationAlwaysUsageDescription</key>
   <string>BotSDK needs access to location </string>
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>BotSDK needs access to location </string>
   <key>NSMicrophoneUsageDescription</key>
   <string>Your microphone will be used to record</string>
   <key>NSPhotoLibraryAddUsageDescription</key>
   <string>Please allow access to your photo library</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>Please allow access to your photo library</string>
   <key>NSSiriUsageDescription</key>
   <string>Lets you launch BotSDK utterances using Siri shortcuts</string>
   <key>NSSpeechRecognitionUsageDescription</key>
   <string>Speech recognition will be used to d</string>

<key>UISupportedInterfaceOrientations</key>
   <array>
       <string>UIInterfaceOrientationPortrait</string>
       <string>UIInterfaceOrientationLandscapeLeft</string>
       <string>UIInterfaceOrientationLandscapeRight</string>
   </array>
```
 
11. Patches

Patch1 :
In node_modules/@react-native-community/datetimepicker/ios/RNDateTimePickerShadowView.m
line number 44 , change YGNodeConstRef to YGNodeRef

```
YGSize RNDateTimePickerShadowViewMeasure(YGNodeConstRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)

YGSize RNDateTimePickerShadowViewMeasure(YGNodeRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
```
Patch2: If you get the following error

"ViewPropTypes will be removed from React Native. 
Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types"

Then in /node_modules/react-native/index.js replace the following methods.

```
// Deprecated Prop Types
get ColorPropType(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').ColorPropType;
},

get EdgeInsetsPropType(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').EdgeInsetsPropType;
},

get PointPropType(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').PointPropType;
},

get ViewPropTypes(): $FlowFixMe {
  return require('deprecated-react-native-prop-types').ViewPropTypes;
},

```

License
Copyright © Kore, Inc. MIT License; see LICENSE for further details.
