import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import KoreBotClient,{ConnectionState,RTM_EVENT} from 'rn-kore-bot-socket-lib';
import uuid from 'react-native-uuid';
import { useRef, useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [resp, setResp] = useState('Your output shown here');
  const [title, setTitle] = useState('Connect');
  const botConfig = {
    botName: 'PLEASE_ENTER_BOT_NAME',
    botId: 'PLEASE_ENTER_BOT_ID',
    clientId: 'PLEASE_ENTER_CLIENT_ID',
    clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',
    botUrl: 'PLEASE_ENTER_SERVER_URL',
    jwtServerUrl: 'PLEASE_ENTER_JWT_SERVER_URL',
    identity: uuid.v4() + '',
    isWebHook: false,
    value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
  };
  function onPressAction(){
    if(KoreBotClient.getInstance().getConnectionState() === ConnectionState.CONNECTED){
        KoreBotClient.getInstance().sendMessage(text);
    }else{
    KoreBotClient.getInstance().getEmitter()
    .once(RTM_EVENT.CONNECTING, () => {
      console.log('Connecting....');
    });

    KoreBotClient.getInstance().getEmitter()
    .once(RTM_EVENT.ON_OPEN, () => {
      //setTypingIndicator(false);
      setTitle('Send Message');
      console.log('RTM_EVENT.ON_OPEN   ---->:', RTM_EVENT.ON_OPEN);
    });
    KoreBotClient.getInstance().getEmitter().on(RTM_EVENT.ON_MESSAGE,(data) =>{
      setResp(JSON.stringify(data?.message[0]));
      console.log('The response is :',JSON.stringify(data));
    })
  KoreBotClient.getInstance().getEmitter()
    .on(RTM_EVENT.ON_DISCONNECT, () => {
      setTitle('Connect');
      console.log(
        'RTM_EVENT.ON_DISCONNECT   ---->:',
        RTM_EVENT.ON_DISCONNECT,
      );
    });
  KoreBotClient.getInstance().initializeBotClient(botConfig);
  }
  }
  return (
    <View style={styles.container}>
      <TextInput
            style={styles.textInputStyle1}
            autoFocus={true}
            onChangeText={newText => setText(newText)}
            placeholderTextColor="#98A2B3"
            placeholder={'Enter your message'}
          />
          <Button title={title} 
          paddingTop='50'
          onPress={onPressAction}
          backgroundColor="#AAFFDD"/>
          <View padding='50'>
          <Text>{resp}
          </Text>
          </View>
          
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle1: {
    paddingLeft: 8,
    alignItems:"center",
    paddingVertical: 0,
  },
});
