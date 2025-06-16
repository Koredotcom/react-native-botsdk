# Logging Usage Guide

The Bot SDK now includes comprehensive logging for all important API calls and WebSocket events. This guide explains how to use the logging features.

## Features

- **Structured Logging**: All logs include timestamps, categories, and structured data
- **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR
- **API Call Tracking**: Request/response logging with timing
- **WebSocket Events**: Connection, message, and error logging
- **In-Memory Storage**: Access logs programmatically for debugging
- **Configurable**: Set log levels to control verbosity

## Quick Start

```typescript
import KoreBotClient, { Logger, LogLevel } from 'rn-socketlib-test';

// Set log level (optional - defaults to INFO)
Logger.setLogLevel(LogLevel.DEBUG); // Show all logs
// Logger.setLogLevel(LogLevel.ERROR); // Show only errors

// Initialize your bot client
const botConfig = {
  botName: 'MyBot',
  botId: 'your-bot-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  botUrl: 'https://your-bot-url.com',
  identity: 'user@example.com',
  jwtServerUrl: 'https://your-jwt-server.com/',
  isWebHook: false,
  value_aud: 'your-audience',
  isHeaderVisible: true,
  isFooterVisible: true
};

const botClient = KoreBotClient.getInstance();
botClient.initializeBotClient(botConfig);
```

## Log Categories

### API Requests & Responses
```
[2024-01-15T10:30:00.000Z] [INFO] [API_REQUEST] POST https://bot-url/users/sts
[2024-01-15T10:30:00.150Z] [INFO] [API_SUCCESS] POST https://bot-url/users/sts - Success (150ms)
[2024-01-15T10:30:00.000Z] [ERROR] [API_ERROR] POST https://bot-url/users/sts - Error (200ms)
```

### WebSocket Events
```
[2024-01-15T10:30:01.000Z] [INFO] [WEBSOCKET] WebSocket Connected
[2024-01-15T10:30:02.000Z] [INFO] [WEBSOCKET] WebSocket Message Received
[2024-01-15T10:30:03.000Z] [ERROR] [WEBSOCKET_ERROR] WebSocket Error
```

### Connection Events
```
[2024-01-15T10:30:00.500Z] [INFO] [CONNECTION] JWT Token Authorization Started
[2024-01-15T10:30:01.000Z] [INFO] [CONNECTION] Bot Disconnect Called
[2024-01-15T10:30:02.000Z] [ERROR] [CONNECTION_ERROR] Maximum Reconnection Limit Reached
```

## Programmatic Access

### Get All Logs
```typescript
import { Logger, LogLevel } from 'rn-socketlib-test';

// Get all logs
const allLogs = Logger.getLogs();

// Get only error logs
const errorLogs = Logger.getLogs(LogLevel.ERROR);

// Clear logs
Logger.clearLogs();
```

### Log Structure
```typescript
interface LogEntry {
  timestamp: string;     // ISO timestamp
  level: LogLevel;       // DEBUG, INFO, WARN, ERROR
  category: string;      // API_REQUEST, WEBSOCKET, CONNECTION, etc.
  message: string;       // Human readable message
  data?: any;           // Structured data (request params, response data, etc.)
  error?: any;          // Error object if applicable
}
```

## API Endpoints Being Logged

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/users/sts` | POST | JWT Token Generation |
| `/api/oAuth/token/jwtgrant` | POST | JWT Token Authorization |
| `/api/rtm/start` | POST | RTM URL Retrieval |
| `/api/botmessages/rtm` | GET | Bot History |
| `/api/websdkthemes/{botId}/activetheme` | GET | Theme API |
| `searchassistapi/.../getresultviewsettings` | GET | Search Settings |
| WebSocket Connection | - | Real-time messaging |

## Usage Examples

### Monitor Connection Issues
```typescript
// Listen for connection events
const connectionLogs = Logger.getLogs().filter(log => 
  log.category.includes('CONNECTION')
);

console.log('Connection Events:', connectionLogs);
```

### Debug API Failures
```typescript
// Find failed API calls
const apiErrors = Logger.getLogs(LogLevel.ERROR).filter(log => 
  log.category === 'API_ERROR'
);

apiErrors.forEach(error => {
  console.log(`API Error: ${error.message}`, error.data);
});
```

### Track Message Flow
```typescript
// Monitor WebSocket messages
const wsLogs = Logger.getLogs().filter(log => 
  log.category === 'WEBSOCKET'
);

console.log('WebSocket Activity:', wsLogs);
```

### Export Logs for Support
```typescript
// Get logs as JSON for support tickets
const logsForSupport = JSON.stringify(Logger.getLogs(), null, 2);
console.log('Support Logs:', logsForSupport);
```

## Log Levels

- **DEBUG**: Detailed information, typically only of interest when diagnosing problems
- **INFO**: General information about what the program is doing
- **WARN**: Something unexpected happened, but the software is still working
- **ERROR**: Due to a more serious problem, the software has not been able to perform some function

## Performance Impact

- Logging is optimized for minimal performance impact
- Logs are stored in memory with automatic rotation (max 1000 entries)
- Log levels can be adjusted to reduce verbosity in production
- Structured data is logged without sensitive information (tokens are masked)

## Best Practices

1. **Development**: Use `LogLevel.DEBUG` for detailed troubleshooting
2. **Production**: Use `LogLevel.WARN` or `LogLevel.ERROR` to minimize noise
3. **Support**: Export logs using `Logger.getLogs()` for support tickets
4. **Monitoring**: Regularly check error logs for recurring issues
5. **Memory Management**: Call `Logger.clearLogs()` periodically in long-running apps 