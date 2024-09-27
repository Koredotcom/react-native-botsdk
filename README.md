# Kore.ai SDK
Kore.ai offers Bots SDKs as a set of platform-specific client libraries that provide a quick and convenient way to integrate Kore.ai Bots chat capability into custom applications.

With just few lines of code, you can embed our Kore.ai chat widget into your applications to enable end-users to interact with your applications using Natural Language. For more information, refer to https://developer.kore.com/docs/bots/kore-web-sdk/

# Kore.ai react-native SDK for developers

Kore.ai SDK for react-native enables you to talk to Kore.ai bots over a web socket. This repo also comes with the code for sample application that developers can modify according to their Bot configuration.

##### #Supported react-native versions
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

#Client id - Copy this id from Bot Builder SDK Settings ex. cs-5250bdc9-6bfe-5ece-92c9-ab54aa2d4285

#Client secret - copy this value from Bot Builder SDK Settings ex. Wibn3ULagYyq0J10LCndswYycHGLuIWbwHvTRSfLwhs=
 
#User identity - This should represent the subject for JWT token that could be an email or phone number in case of known user. In case of anonymous user, this can be a randomly generated unique id.

#Bot name - copy this value from Bot Builder -> Channels -> Web/Mobile SDK config  ex. "Demo Bot"

#Bot Id - copy this value from Bot Builder -> Channels -> Web/Mobile SDK config  ex. st-acecd91f-b009-5f3f-9c15-7249186d827d

#Server URL - replace it with your server URL, if required

#Anonymous user - if not anonymous, assign same identity (such as email or phone number) while making a connection.

#JWT Server URL - specify the server URL for JWT token generation. This token is used to authorize the SDK client. Refer to documentation on how to setup the JWT server for token generation - e.g. https://jwt-token-server.example.com/

 ```
export const botConfig: BotConfigModel = {
  botName: 'Bot name here',
  botId: 'Bot id here',
  clientId: 'client id here',
  clientSecret: 'client secret here',
  botUrl: 'https://platform.kore.ai',//change url here
  identity: uuid.v4() + '',//change identity here
  isWebHook: false,// For now this should be always false as web hook support is not yet available in react-native sdk
};

```

### Running the Demo app
*	Download or clone the repository.
*	Import the project.
*	npm install --legacy-peer-deps
*	Run Android app - npx react-native run-android.
*	Run iOS app - ios/pod install & npx react-native run-ios
  
# How to integrate react-native BotSDK through npm

1. Add below npm modules to your app's package.json
   
```
    "rn-kore-bot-sdk": "^0.0.2",
    "rn-kore-bot-socket-sdk": "^0.0.1",

```
2. Import KoreChat and render your BotChat component as shown below
```
import KoreChat, {HeaderIconsId, TEMPLATE_TYPES} from 'rn-kore-bot-sdk';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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


License
Copyright © Kore, Inc. MIT License; see LICENSE for further details.
