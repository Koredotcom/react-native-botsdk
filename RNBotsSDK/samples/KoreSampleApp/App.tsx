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
  LogLevel
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

  const setupBotClient = () => {
    botClient.current = KoreBotClient.getInstance();
    
    // Setup event listeners
    botClient.current.on(RTM_EVENT.CONNECTING, () => {
      updateStatus('Connecting...', '#ffc107');
    });

    botClient.current.on(RTM_EVENT.ON_OPEN, () => {
      updateStatus('Connected', '#28a745');
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
    const botConfig = {
      // Your bot configuration
      botName: 'MyAssistant',
      botId: 'st-b9889c46-218c-58f7-838f-73ae9203488c',
      clientId: 'cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9',
      clientSecret: '5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=',
      botUrl: 'https://bots.kore.ai',
      identity: 'user@example.com',
      jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
      isWebHook: false,
      value_aud: 'your-audience-value',
      isHeaderVisible: true,
      isFooterVisible: true
    };
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
