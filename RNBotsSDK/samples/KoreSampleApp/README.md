# Kore.ai React Native Bot Socket Library

[![npm version](https://badge.fury.io/js/rn-kore-bot-socket-lib-v77.svg)](https://badge.fury.io/js/rn-kore-bot-socket-lib-v77)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.70+-blue.svg)](https://reactnative.dev/)

A powerful and feature-rich React Native library for integrating Kore.ai bot conversations with real-time WebSocket communication, comprehensive logging, and theme customization.

## ✨ Features

- 🚀 **Real-time Messaging**: WebSocket-based bot communication
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🔄 **Auto Reconnection**: Intelligent reconnection with exponential backoff
- 📝 **Comprehensive Logging**: Structured logging for debugging and monitoring
- 🎨 **Theme Support**: Dynamic theme retrieval and customization
- 📱 **React Native Ready**: Optimized for React Native applications
- 🛡️ **Type Safe**: Full TypeScript support with detailed type definitions
- 🔧 **Configurable**: Extensive configuration options
- 📊 **Connection Status**: Real-time connection state monitoring

## 📦 Installation

```bash
npm install rn-kore-bot-socket-lib-v77
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react@>=18.0.0 react-native@>=0.70.0
```

### Additional Dependencies

The library requires these dependencies to be installed in your project:

```bash
npm install @react-native-community/netinfo axios events react-native-uuid
```

## 🚀 Quick Start

### Basic Setup

```typescript
import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import KoreBotClient, {
  RTM_EVENT,
  ConnectionState,
  Logger,
  LogLevel,
} from 'rn-kore-bot-socket-lib-v77';
import type {BotConfigModel} from 'rn-kore-bot-socket-lib-v77';

// Configure logging (optional)
Logger.getInstance().setLogLevel(LogLevel.INFO);

class BotExample extends Component {
  componentDidMount() {
    this.setupBotClient();
  }

  setupBotClient = () => {
    const botConfig: BotConfigModel = {
      botName: 'MyAssistant',
      botId: 'your-bot-id',
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      botUrl: 'https://your-bot-url.com',
      identity: 'user@example.com',
      jwtServerUrl: 'https://your-jwt-server.com/',
      isWebHook: false,
      value_aud: 'your-audience-value',
      isHeaderVisible: true,
      isFooterVisible: true,
    };

    const botClient = KoreBotClient.getInstance();

    // Set up event listeners
    botClient.on(RTM_EVENT.ON_OPEN, () => {
      console.log('Bot connected successfully');
    });

    botClient.on(RTM_EVENT.ON_MESSAGE, data => {
      console.log('Received message:', data);
    });

    botClient.on(RTM_EVENT.ON_ERROR, error => {
      console.error('Bot connection error:', error);
    });

    // Initialize the bot client
    botClient.initializeBotClient(botConfig);
  };

  sendMessage = () => {
    const botClient = KoreBotClient.getInstance();
    botClient.sendMessage('Hello, how can you help me?');
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this.sendMessage}>
          <Text>Send Message</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default BotExample;
```

## 🔧 Configuration

### BotConfigModel

```typescript
interface BotConfigModel {
  botName: string; // Display name of the bot
  botId: string; // Unique bot identifier
  clientId: string; // OAuth client ID
  clientSecret: string; // OAuth client secret
  botUrl: string; // Base URL of the bot server
  identity: string; // User identity (email/username)
  jwtServerUrl: string; // JWT token server URL
  isWebHook: boolean; // Enable webhook mode
  value_aud: string; // JWT audience value
  isHeaderVisible: boolean; // Show/hide header
  isFooterVisible: boolean; // Show/hide footer
}
```

## 📡 Events

The library emits various events that you can listen to:

### Connection Events

```typescript
import {RTM_EVENT} from 'rn-kore-bot-socket-lib-v77';

const botClient = KoreBotClient.getInstance();

// Connection lifecycle
botClient.on(RTM_EVENT.CONNECTING, () => {
  console.log('Connecting to bot...');
});

botClient.on(RTM_EVENT.ON_OPEN, () => {
  console.log('Connected to bot');
});

botClient.on(RTM_EVENT.ON_CLOSE, () => {
  console.log('Connection closed');
});

botClient.on(RTM_EVENT.ON_ERROR, error => {
  console.error('Connection error:', error);
});

botClient.on(RTM_EVENT.RECONNECTING, () => {
  console.log('Attempting to reconnect...');
});
```

### Message Events

```typescript
// Incoming messages from bot
botClient.on(RTM_EVENT.ON_MESSAGE, data => {
  console.log('Bot message:', data);
  // Handle bot response
});

// Message acknowledgment
botClient.on(RTM_EVENT.ON_ACK, data => {
  console.log('Message acknowledged:', data);
});

// JWT token authorization
botClient.on(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED, () => {
  console.log('JWT token authorized');
});
```

## 🎨 Theme API

Retrieve and apply bot themes dynamically:

```typescript
import {ActiveThemeAPI} from 'rn-kore-bot-socket-lib-v77';

const themeAPI = new ActiveThemeAPI();

themeAPI.getThemeAPI(botConfig, themeData => {
  if (themeData) {
    console.log('Theme retrieved:', themeData);
    // Apply theme to your UI
  } else {
    console.log('Failed to retrieve theme');
  }
});
```

## 📝 Logging

### Configure Logging

```typescript
import {Logger, LogLevel} from 'rn-kore-bot-socket-lib-v77';

// Set log level
Logger.getInstance().setLogLevel(LogLevel.DEBUG); // Show all logs
Logger.getInstance().setLogLevel(LogLevel.INFO); // Default level
Logger.getInstance().setLogLevel(LogLevel.WARN); // Warnings and errors only
Logger.getInstance().setLogLevel(LogLevel.ERROR); // Errors only
```

### Access Logs Programmatically

```typescript
// Get all logs
const allLogs = Logger.getLogs();

// Get logs by level
const errorLogs = Logger.getLogs(LogLevel.ERROR);

// Clear logs
Logger.clearLogs();

// Custom logging
Logger.info('Custom message', {data: 'example'});
Logger.error('Error occurred', {error: 'details'}, errorObject);
```

### Log Categories

- **API_REQUEST/API_SUCCESS/API_ERROR**: HTTP API calls
- **WEBSOCKET**: WebSocket events and messages
- **CONNECTION**: Connection state changes
- **DEBUG/INFO/WARN/ERROR**: General application logs

## 🔄 Connection Management

### Manual Connection Control

```typescript
const botClient = KoreBotClient.getInstance();

// Initialize and connect
botClient.initializeBotClient(botConfig);

// Check connection state
const connectionState = botClient.getConnectionState();
console.log('Connection state:', connectionState);

// Manual reconnection
botClient.reconnect(true);

// Disconnect
botClient.disconnect();

// Network status management
botClient.setIsNetworkAvailable(true / false);

// Session management
botClient.setSessionActive(true / false);
botClient.setAppState('ACTIVE' | 'SLEEP');
```

### Connection States

```typescript
import {ConnectionState} from 'rn-kore-bot-socket-lib-v77';

// Available states
ConnectionState.CONNECTING; // 0
ConnectionState.CONNECTED; // 1
ConnectionState.DISCONNECTED; // 2
```

## 💬 Messaging

### Send Messages

```typescript
const botClient = KoreBotClient.getInstance();

// Simple text message
botClient.sendMessage('Hello bot!');

// Message with payload
botClient.sendMessage('Display message', 'Actual payload to bot');

// Message with attachments
botClient.sendMessage('Message', null, attachmentArray);
```

### Retrieve Chat History

```typescript
// Get conversation history
botClient.getBotHistory();

// Listen for history response
botClient.on(RTM_EVENT.GET_HISTORY, (response, botInfo) => {
  console.log('Chat history:', response.data);
});
```

## 🛠️ Advanced Usage

### Custom Event Handling

```typescript
class AdvancedBotIntegration extends Component {
  private setupAdvancedListeners = () => {
    const botClient = KoreBotClient.getInstance();

    // Connection monitoring
    botClient.on(RTM_EVENT.ON_OPEN, this.onConnected);
    botClient.on(RTM_EVENT.ON_CLOSE, this.onDisconnected);
    botClient.on(RTM_EVENT.ON_ERROR, this.onError);
    botClient.on(RTM_EVENT.RECONNECTING, this.onReconnecting);

    // Message handling
    botClient.on(RTM_EVENT.ON_MESSAGE, this.onMessage);
    botClient.on(RTM_EVENT.ON_ACK, this.onMessageAck);
  };

  private onConnected = () => {
    this.setState({connectionStatus: 'Connected'});
    // Send initial message or update UI
  };

  private onMessage = (data: any) => {
    // Process incoming bot message
    if (data.type === 'bot_response') {
      this.handleBotResponse(data);
    }
  };

  componentWillUnmount() {
    // Clean up listeners
    const botClient = KoreBotClient.getInstance();
    botClient.removeAllListeners();
    botClient.disconnect();
  }
}
```

### Error Handling

```typescript
const setupErrorHandling = () => {
  const botClient = KoreBotClient.getInstance();

  botClient.on(RTM_EVENT.ON_ERROR, error => {
    Logger.error('Bot connection error', {error});

    // Handle specific error types
    if (error.includes('401')) {
      // Handle authentication error
      this.refreshTokenAndRetry();
    } else if (error.includes('network')) {
      // Handle network error
      this.showNetworkError();
    }
  });
};
```

## 📱 React Native Integration

### Complete Component Example

```typescript
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import KoreBotClient, {
  RTM_EVENT,
  ConnectionState,
  Logger,
  LogLevel,
} from 'rn-kore-bot-socket-lib-v77';

interface State {
  connectionStatus: string;
  connectionColor: string;
  messages: any[];
}

class BotChatComponent extends Component<{}, State> {
  private botClient: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      connectionStatus: 'Disconnected',
      connectionColor: '#dc3545',
      messages: [],
    };
  }

  componentDidMount() {
    this.setupBotClient();
  }

  private setupBotClient = () => {
    this.botClient = KoreBotClient.getInstance();

    // Setup event listeners
    this.botClient.on(RTM_EVENT.CONNECTING, () => {
      this.updateStatus('Connecting...', '#ffc107');
    });

    this.botClient.on(RTM_EVENT.ON_OPEN, () => {
      this.updateStatus('Connected', '#28a745');
    });

    this.botClient.on(RTM_EVENT.ON_MESSAGE, (data: any) => {
      this.addMessage(data);
    });

    this.botClient.on(RTM_EVENT.ON_ERROR, (error: any) => {
      this.updateStatus('Error', '#dc3545');
      Alert.alert('Connection Error', error.toString());
    });
  };

  private updateStatus = (status: string, color: string) => {
    this.setState({connectionStatus: status, connectionColor: color});
  };

  private addMessage = (messageData: any) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, messageData],
    }));
  };

  private connect = () => {
    const botConfig = {
      // Your bot configuration
    };
    this.botClient.initializeBotClient(botConfig);
  };

  private disconnect = () => {
    this.updateStatus('Disconnecting...', '#ffc107');
    this.botClient.disconnect();
    setTimeout(() => {
      this.updateStatus('Disconnected', '#dc3545');
    }, 500);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Kore.ai Bot Chat</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: this.state.connectionColor},
            ]}>
            <Text style={styles.statusText}>
              Status: {this.state.connectionStatus}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.connectButton} onPress={this.connect}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={this.disconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  componentWillUnmount() {
    this.botClient?.removeAllListeners();
    this.botClient?.disconnect();
  }
}

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
});

export default BotChatComponent;
```

## 🔍 Debugging

### Enable Debug Logging

```typescript
import {Logger, LogLevel} from 'rn-kore-bot-socket-lib-v77';

// Enable verbose logging
Logger.setLogLevel(LogLevel.DEBUG);

// Monitor all API calls
const apiLogs = Logger.getLogs().filter(log => log.category.includes('API'));

// Monitor WebSocket events
const wsLogs = Logger.getLogs().filter(log =>
  log.category.includes('WEBSOCKET'),
);

// Export logs for support
const supportLogs = JSON.stringify(Logger.getLogs(), null, 2);
console.log('Support logs:', supportLogs);
```

## 📋 API Reference

### KoreBotClient Methods

| Method                                         | Parameters           | Description                  |
| ---------------------------------------------- | -------------------- | ---------------------------- |
| `getInstance()`                                | None                 | Get singleton instance       |
| `initializeBotClient(config)`                  | `BotConfigModel`     | Initialize bot connection    |
| `sendMessage(message, payload?, attachments?)` | `string, any?, any?` | Send message to bot          |
| `disconnect()`                                 | None                 | Disconnect from bot          |
| `reconnect(isReconnection, resetCount?)`       | `boolean, boolean?`  | Manual reconnection          |
| `getConnectionState()`                         | None                 | Get current connection state |
| `getBotHistory()`                              | None                 | Retrieve chat history        |
| `setSessionActive(active)`                     | `boolean`            | Set session state            |
| `setAppState(state)`                           | `string`             | Set app state                |
| `setIsNetworkAvailable(available)`             | `boolean`            | Set network availability     |

### Event Constants

```typescript
RTM_EVENT.CONNECTING;
RTM_EVENT.ON_OPEN;
RTM_EVENT.ON_CLOSE;
RTM_EVENT.ON_ERROR;
RTM_EVENT.ON_MESSAGE;
RTM_EVENT.ON_ACK;
RTM_EVENT.RECONNECTING;
RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED;
RTM_EVENT.GET_HISTORY;
```

## 🚨 Troubleshooting

### Common Issues

**Connection Fails**

- Verify bot configuration parameters
- Check network connectivity
- Ensure JWT server is accessible
- Review error logs: `Logger.getLogs(LogLevel.ERROR)`

**Authentication Errors**

- Validate `clientId` and `clientSecret`
- Check `jwtServerUrl` accessibility
- Verify `value_aud` parameter

**Message Not Sending**

- Ensure bot is connected: `getConnectionState()`
- Check WebSocket logs for errors
- Verify message format

**Reconnection Issues**

- Check network status
- Review reconnection logs
- Verify server availability

### Debug Checklist

1. ✅ Enable debug logging: `Logger.setLogLevel(LogLevel.DEBUG)`
2. ✅ Check configuration parameters
3. ✅ Monitor connection events
4. ✅ Review API call logs
5. ✅ Test network connectivity
6. ✅ Verify server endpoints

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📞 Support

- **Documentation**: [Full API Documentation](https://developer.kore.com/docs/bots/kore-web-sdk/)
- **Issues**: [GitHub Issues](https://github.com/your-org/rn-kore-bot-socket-lib-v77/issues)
- **Support**: [Kore.ai Support](https://support.kore.com)

## 🏢 About Kore.ai

Kore.ai is a leading conversational AI platform that helps enterprises build sophisticated chatbots and virtual assistants. This library provides seamless integration with Kore.ai bots in React Native applications.

---

**Made with ❤️ by Kore.ai**
