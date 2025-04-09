import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {RTM_EVENT} from '../bot-sdk/constants/Constant';
import {KoreBotClient} from '../bot-sdk/rtm/KoreBotClient';
import {botConfig} from './BotConfig';

interface BotConnectionProps {}

interface BotConnectionState {}

class BotConnection extends React.Component<
  BotConnectionProps,
  BotConnectionState
> {
  private init = () => {
    if (!botConfig) {
      console.log('this.props.botConfig ------>:', botConfig);
    }
    console.log('-----> Connect clicked <------');
    KoreBotClient.getInstance()
      .getEmitter()
      .on(RTM_EVENT.CONNECTING, () => {
        console.log('RTM_EVENT.CONNECTING   ---->:', RTM_EVENT.CONNECTING);
      });
    KoreBotClient.getInstance()
      .getEmitter()
      .on(RTM_EVENT.ON_OPEN, () => {
        //setTypingIndicator(false);
        const interval = setTimeout(() => {
          KoreBotClient.getInstance().sendMessage('Hi');
        }, 5000);
        console.log('RTM_EVENT.ON_OPEN   ---->:', RTM_EVENT.ON_OPEN);
      });
    KoreBotClient.getInstance()
      .getEmitter()
      .on(RTM_EVENT.ON_DISCONNECT, () => {
        //setTypingIndicator(false);
        console.log(
          'RTM_EVENT.ON_DISCONNECT   ---->:',
          RTM_EVENT.ON_DISCONNECT,
        );
      });

    KoreBotClient.getInstance()
      .getEmitter()
      .on(RTM_EVENT.ON_MESSAGE, (data: any) => {
        //setTypingIndicator(false);
        console.log('RTM_EVENT.ON_MESSAGE   ---->:', data);
      });
    KoreBotClient.getInstance().initializeBotClient(botConfig);
    //KoreBotClient.getInstance().initSocketConnection();
  };
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{'welcome to Bot connection lib'}</Text>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.init();
              }}
              style={{
                backgroundColor: 'grey',
                padding: 10,
                marginTop: 30,
                minHeight: 40,
                //width: 100,
                borderRadius: 5,
              }}>
              <Text style={{padding: 10, fontSize: 16, color: 'white'}}>
                {'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  componentWillUnmount() {
    // KoreBotClient.getInstance()
    //   .getEmitter()
    //   .removeAllListeners(RTM_EVENT.CONNECTING);
    // KoreBotClient.getInstance()
    //   .getEmitter()
    //   .removeAllListeners(RTM_EVENT.ON_OPEN);
    // KoreBotClient.getInstance()
    //   .getEmitter()
    //   .removeAllListeners(RTM_EVENT.ON_MESSAGE);
    KoreBotClient.getInstance()?.disconnect();
  }
}

export default BotConnection;
