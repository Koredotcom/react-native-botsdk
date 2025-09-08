import React, { Component, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import KoreBotClient, {
  RTM_EVENT,
  ConnectionState,
  Logger,
  LogLevel,
  ApiService
} from 'rn-kore-bot-socket-lib-v77';

const BotChatComponent = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [connectionColor, setConnectionColor] = useState('#dc3545');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  const botClient = useRef<any>(null);

  useEffect(() => {
    setupBotClient();

    // Cleanup function
    return () => {
      botClient.current?.removeAllListeners();
      botClient.current?.disconnect();
    };
  }, []);

  const botConfig = {
    // Your bot configuration
    botName: 'MyAssistant',
    botId: 'botId',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    botUrl: 'botUrl',
    identity: 'identity',
    jwtServerUrl: 'jwtServerUrl',
    isWebHook: false,
    value_aud: 'value_aud',
    isHeaderVisible: true,
    isFooterVisible: true
  };

  const getHistory = () => {
    const apiService = new ApiService(botConfig.botUrl, botClient.current);
    apiService.getBotHistory(0, 10, (response: any) => {
      console.log('botHistory ' + JSON.stringify(response));
    });
  }

  const setupBotClient = () => {
    botClient.current = KoreBotClient.getInstance();

    // Setup event listeners
    botClient.current.on(RTM_EVENT.CONNECTING, () => {
      updateStatus('Connecting...', '#ffc107');
    });

    botClient.current.on(RTM_EVENT.ON_OPEN, () => {
      updateStatus('Connected', '#28a745');
      getHistory();
    });

    botClient.current.on(RTM_EVENT.ON_MESSAGE, (data: any) => {
      console.log('Received message:', data);
      addMessage(data);
    });

    botClient.current.on(RTM_EVENT.ON_ERROR, (error: any) => {
      updateStatus('Error', '#dc3545');
      Alert.alert('Connection Error', error.toString());
    });
  };

  const updateStatus = (status: string, color: string) => {
    setConnectionStatus(status);
    setConnectionColor(color);
  };

  const addMessage = (messageData: any) => {
    setMessages(prevMessages => [...prevMessages, messageData]);
  };

  const connect = () => {
    setupBotClient();
    botClient.current.initializeBotClient(botConfig);
  };

  const disconnect = () => {
    updateStatus('Disconnecting...', '#ffc107');
    botClient.current.disconnect();
    setTimeout(() => {
      updateStatus('Disconnected', '#dc3545');
    }, 500);
  };

  const sendMessage = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (connectionStatus !== 'Connected') {
      Alert.alert('Error', 'Please connect to the bot first');
      return;
    }

    try {
      botClient.current.sendMessage(inputText);
      setInputText(''); // Clear input after sending

      // Add user message to messages array for display
      addMessage({
        type: 'user',
        message: inputText,
        timestamp: new Date().toLocaleTimeString()
      });
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
        <TouchableOpacity style={styles.connectButton} onPress={connect}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
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

export default BotChatComponent;
