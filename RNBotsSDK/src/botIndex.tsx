import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { RTM_EVENT, BOT_RECOGNITION_EVENTS } from '../bot-sdk/constants/Constant';
import { KoreBotClient } from '../bot-sdk/rtm/KoreBotClient';
import { botConfig } from './BotConfig';
import ApiService from '../bot-sdk/api/ApiService';

const BotConnection: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [connectionColor, setConnectionColor] = useState<string>('#dc3545'); // Red
  const [inputText, setInputText] = useState('');

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
      console.log('RTM_EVENT.ON_OPEN   ---->:', RTM_EVENT.ON_OPEN);
      const apiService = new ApiService(botConfig.botUrl, botClient);
      apiService.subscribePushNotifications("12345");
      updateConnectionStatus('Connected', '#28a745'); // Green
      // const intervalUnsub = setTimeout(() => {
      //   apiService.unsubscribePushNotifications("12345");
      // }, 5000);
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
      console.log('RTM_EVENT.ON_MESSAGE   ---->:', data);
      // Keep connection status as Connected when receiving messages
      if (connectionStatus !== 'Connected') {
        updateConnectionStatus('Connected', '#28a745'); // Green
      }
    });

    botClient.enableLogger();
    botClient.initializeBotClient(botConfig, false);
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

  const sendMessage = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (!botConfig.isWebHook && connectionStatus !== 'Connected') {
      Alert.alert('Error', 'Please connect to the bot first');
      return;
    }

    try {
      botClient.sendMessage(inputText);
      setInputText(''); // Clear input after sending

      // // Add user message to messages array for display
      // addMessage({
      //   type: 'user',
      //   message: inputText,
      //   timestamp: new Date().toLocaleTimeString()
      // });
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
      console.error('Send message error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kore.ai Bot Chat</Text>
        <View style={[styles.statusBadge, { backgroundColor: connectionColor }]}>
          <Text style={styles.statusText}>
            Status: {connectionStatus}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.connectButton} onPress={init}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Send message to bot..."
          placeholderTextColor="#999999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBadge: {
    padding: 10,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  connectButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    flex: 0.4,
    alignItems: 'center',
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    flex: 0.4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    marginRight: 10,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BotConnection;
