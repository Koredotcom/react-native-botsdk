import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { RTM_EVENT, BOT_RECOGNITION_EVENTS } from '../bot-sdk/constants/Constant';
import { KoreBotClient } from '../bot-sdk/rtm/KoreBotClient';
import { botConfig } from './BotConfig';
import ApiService from '../bot-sdk/api/ApiService';

const BotConnection: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [connectionColor, setConnectionColor] = useState<string>('#dc3545'); // Red

  const updateConnectionStatus = useCallback((status: string, color: string) => {
    setConnectionStatus(status);
    setConnectionColor(color);
  }, []);
  const botClient = KoreBotClient.getInstance();
  const init = useCallback(() => {
    if (!botConfig) {
      console.log('this.props.botConfig ------>:', botConfig);
    }
    console.log('-----> Connect clicked <------');
    updateConnectionStatus('Connecting...', '#ffc107'); // Yellow



    botClient.on(RTM_EVENT.CONNECTING, () => {
      console.log('RTM_EVENT.CONNECTING   ---->:', RTM_EVENT.CONNECTING);
      updateConnectionStatus('Connecting...', '#ffc107'); // Yellow
    });

    botClient.on(RTM_EVENT.ON_OPEN, () => {
      //setTypingIndicator(false);
      const interval = setTimeout(() => {
        botClient.sendMessage('Help');
      }, 5000);
      console.log('RTM_EVENT.ON_OPEN   ---->:', RTM_EVENT.ON_OPEN);
      const apiService = new ApiService(botConfig.botUrl, botClient);
      apiService.subscribePushNotifications("12345");
      updateConnectionStatus('Connected', '#28a745'); // Green
      const intervalUnsub = setTimeout(() => {
        apiService.unsubscribePushNotifications("12345");
      }, 5000);
    });

    botClient.on(RTM_EVENT.ON_DISCONNECT, () => {
      //setTypingIndicator(false);
      console.log(
        'RTM_EVENT.ON_DISCONNECT   ---->:',
        RTM_EVENT.ON_DISCONNECT,
      );
      updateConnectionStatus('Disconnected', '#dc3545'); // Red
    });

    botClient.on(RTM_EVENT.ON_CLOSE, () => {
      console.log('RTM_EVENT.ON_CLOSE   ---->:', RTM_EVENT.ON_CLOSE);
      updateConnectionStatus('Disconnected', '#dc3545'); // Red
    });

    botClient.on(RTM_EVENT.ON_ERROR, (error: any) => {
      console.log('RTM_EVENT.ON_ERROR   ---->:', error);
      updateConnectionStatus('Connection Error', '#dc3545'); // Red
    });

    botClient.on(RTM_EVENT.RECONNECTING, () => {
      console.log('RTM_EVENT.RECONNECTING   ---->:', RTM_EVENT.RECONNECTING);
      updateConnectionStatus('Reconnecting...', '#fd7e14'); // Orange
    });

    botClient.on(RTM_EVENT.ON_MESSAGE, (data: any) => {
      //setTypingIndicator(false);
      console.log('RTM_EVENT.ON_MESSAGE   ---->:', data);
      // Keep connection status as Connected when receiving messages
      if (connectionStatus !== 'Connected') {
        updateConnectionStatus('Connected', '#28a745'); // Green
      }
    });

    botClient.initializeBotClient(botConfig);
    //botClient.initSocketConnection();
  }, [connectionStatus, updateConnectionStatus]);

  const handleDisconnect = useCallback(() => {
    console.log('-----> Disconnect clicked <------');
    updateConnectionStatus('Disconnecting...', '#ffc107');
    KoreBotClient.getInstance().disconnect();
    setTimeout(() => {
      updateConnectionStatus('Disconnected', '#dc3545');
    }, 500);
  }, [updateConnectionStatus]);


  // Cleanup effect for component unmount
  useEffect(() => {
    //
    return () => {
      const botClient = KoreBotClient.getInstance();

      // Clean up event listeners
      botClient.removeAllListeners(RTM_EVENT.CONNECTING);
      botClient.removeAllListeners(RTM_EVENT.ON_OPEN);
      botClient.removeAllListeners(RTM_EVENT.ON_DISCONNECT);
      botClient.removeAllListeners(RTM_EVENT.ON_CLOSE);
      botClient.removeAllListeners(RTM_EVENT.ON_ERROR);
      botClient.removeAllListeners(RTM_EVENT.RECONNECTING);
      botClient.removeAllListeners(RTM_EVENT.ON_MESSAGE);

      // Disconnect
      botClient?.disconnect();
    };
  }, []);

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
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          {'Kore.ai Inc, Bot Socket module'}
        </Text>

        {/* Connection Status Display */}
        <View
          style={{
            backgroundColor: connectionColor,
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            minWidth: 200,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Status: {connectionStatus}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity
            onPress={init}
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
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
              {'Connect'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDisconnect}
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
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
              {'Disconnect'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => botClient.sendEvent(BOT_RECOGNITION_EVENTS.TYPING)}

            style={{
              backgroundColor: '#dc3545',
              padding: 10,
              marginTop: 30,
              minHeight: 40,
              minWidth: 100,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              display: 'none',
            }}>
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
              {'Send Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView >
  );
};

export default BotConnection;
