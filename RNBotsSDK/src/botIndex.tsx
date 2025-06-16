import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {RTM_EVENT, ConnectionState} from '../bot-sdk/constants/Constant';
import {KoreBotClient} from '../bot-sdk/rtm/KoreBotClient';
import {botConfig} from './BotConfig';

interface BotConnectionProps {}

interface BotConnectionState {
  connectionStatus: string;
  connectionColor: string;
}

class BotConnection extends React.Component<
  BotConnectionProps,
  BotConnectionState
> {
  constructor(props: BotConnectionProps) {
    super(props);
    this.state = {
      connectionStatus: 'Disconnected',
      connectionColor: '#dc3545', // Red
    };
  }

  private updateConnectionStatus = (status: string, color: string) => {
    this.setState({
      connectionStatus: status,
      connectionColor: color,
    });
  };

  private init = () => {
    if (!botConfig) {
      console.log('this.props.botConfig ------>:', botConfig);
    }
    console.log('-----> Connect clicked <------');
    this.updateConnectionStatus('Connecting...', '#ffc107'); // Yellow
    
    const botClient = KoreBotClient.getInstance();

    botClient.on(RTM_EVENT.CONNECTING, () => {
      console.log('RTM_EVENT.CONNECTING   ---->:', RTM_EVENT.CONNECTING);
      this.updateConnectionStatus('Connecting...', '#ffc107'); // Yellow
    });
    
    botClient.on(RTM_EVENT.ON_OPEN, () => {
      //setTypingIndicator(false);
      const interval = setTimeout(() => {
        botClient.sendMessage('Hi');
      }, 5000);
      console.log('RTM_EVENT.ON_OPEN   ---->:', RTM_EVENT.ON_OPEN);
      this.updateConnectionStatus('Connected', '#28a745'); // Green
    });
    
    botClient.on(RTM_EVENT.ON_DISCONNECT, () => {
      //setTypingIndicator(false);
      console.log(
        'RTM_EVENT.ON_DISCONNECT   ---->:',
        RTM_EVENT.ON_DISCONNECT,
      );
      this.updateConnectionStatus('Disconnected', '#dc3545'); // Red
    });

    botClient.on(RTM_EVENT.ON_CLOSE, () => {
      console.log('RTM_EVENT.ON_CLOSE   ---->:', RTM_EVENT.ON_CLOSE);
      this.updateConnectionStatus('Disconnected', '#dc3545'); // Red
    });

    botClient.on(RTM_EVENT.ON_ERROR, (error: any) => {
      console.log('RTM_EVENT.ON_ERROR   ---->:', error);
      this.updateConnectionStatus('Connection Error', '#dc3545'); // Red
    });

    botClient.on(RTM_EVENT.RECONNECTING, () => {
      console.log('RTM_EVENT.RECONNECTING   ---->:', RTM_EVENT.RECONNECTING);
      this.updateConnectionStatus('Reconnecting...', '#fd7e14'); // Orange
    });

    botClient.on(RTM_EVENT.ON_MESSAGE, (data: any) => {
      //setTypingIndicator(false);
      console.log('RTM_EVENT.ON_MESSAGE   ---->:', data);
      // Keep connection status as Connected when receiving messages
      if (this.state.connectionStatus !== 'Connected') {
        this.updateConnectionStatus('Connected', '#28a745'); // Green
      }
    });
    
    botClient.initializeBotClient(botConfig);
    //botClient.initSocketConnection();
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
          <Text style={{fontSize: 18, marginBottom: 20}}>
            {'Kore.ai Inc, Bot Socket module'}
          </Text>
          
          {/* Connection Status Display */}
          <View
            style={{
              backgroundColor: this.state.connectionColor,
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
              minWidth: 200,
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
              Status: {this.state.connectionStatus}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 15}}>
            <TouchableOpacity
              onPress={() => {
                this.init();
              }}
              style={{
                backgroundColor: '#007bff',
                padding: 10,
                marginTop: 30,
                minHeight: 40,
                minWidth: 100,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>
                {'Connect'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
                console.log('-----> Disconnect clicked <------');
                this.updateConnectionStatus('Disconnecting...', '#ffc107');
                KoreBotClient.getInstance().disconnect();
                setTimeout(() => {
                  this.updateConnectionStatus('Disconnected', '#dc3545');
                }, 500);
              }}
              style={{
                backgroundColor: '#dc3545',
                padding: 10,
                marginTop: 30,
                minHeight: 40,
                minWidth: 100,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>
                {'Disconnect'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  componentWillUnmount() {
    const botClient = KoreBotClient.getInstance();
    
    // Clean up event listeners
    botClient.removeAllListeners(RTM_EVENT.CONNECTING);
    botClient.removeAllListeners(RTM_EVENT.ON_OPEN);
    botClient.removeAllListeners(RTM_EVENT.ON_DISCONNECT);
    botClient.removeAllListeners(RTM_EVENT.ON_CLOSE);
    botClient.removeAllListeners(RTM_EVENT.ON_ERROR);
    botClient.removeAllListeners(RTM_EVENT.RECONNECTING);
    botClient.removeAllListeners(RTM_EVENT.ON_MESSAGE);
    
    // Disconnect and reset status
    this.updateConnectionStatus('Disconnected', '#dc3545');
    botClient?.disconnect();
  }
}

export default BotConnection;
