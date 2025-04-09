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
    botName: 'SDK',
    botId: 'st-b9889c46-218c-58f7-838f-73ae9203488c',
    clientId: 'cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9',
    clientSecret: '5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=',
    botUrl: 'https://bots.kore.ai',
    jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
    identity: uuid.v4() + '',
    isWebHook: false,
    value_aud: 'https://idproxy.kore.com/authorize',
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
