export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: any;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private log(level: LogLevel, category: string, message: string, data?: any, error?: any) {
    if (level < this.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with color coding
    const levelName = LogLevel[level];
    const formattedMessage = `[${logEntry.timestamp}] [${levelName}] [${category}] ${message}`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '');
        if (error) console.warn('Error details:', error);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '');
        if (error) console.error('Error details:', error);
        break;
    }
  }

  // API specific logging methods
  logApiRequest(endpoint: string, method: string, data?: any) {
    this.log(LogLevel.INFO, 'API_REQUEST', `${method} ${endpoint}`, data);
  }

  logApiSuccess(endpoint: string, method: string, responseData?: any, duration?: number) {
    const message = duration 
      ? `${method} ${endpoint} - Success (${duration}ms)`
      : `${method} ${endpoint} - Success`;
    this.log(LogLevel.INFO, 'API_SUCCESS', message, responseData);
  }

  logApiError(endpoint: string, method: string, error: any, duration?: number) {
    const message = duration 
      ? `${method} ${endpoint} - Error (${duration}ms)`
      : `${method} ${endpoint} - Error`;
    this.log(LogLevel.ERROR, 'API_ERROR', message, { 
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message 
    }, error);
  }

  // WebSocket specific logging
  logWebSocketEvent(event: string, data?: any) {
    this.log(LogLevel.INFO, 'WEBSOCKET', `WebSocket ${event}`, data);
  }

  logWebSocketError(event: string, error: any) {
    this.log(LogLevel.ERROR, 'WEBSOCKET_ERROR', `WebSocket ${event}`, undefined, error);
  }

  // Connection specific logging
  logConnectionEvent(event: string, data?: any) {
    this.log(LogLevel.INFO, 'CONNECTION', event, data);
  }

  logConnectionError(event: string, error: any) {
    this.log(LogLevel.ERROR, 'CONNECTION_ERROR', event, undefined, error);
  }

  // General logging methods
  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, 'INFO', message, data);
  }

  warn(message: string, data?: any, error?: any) {
    this.log(LogLevel.WARN, 'WARN', message, data, error);
  }

  error(message: string, data?: any, error?: any) {
    this.log(LogLevel.ERROR, 'ERROR', message, data, error);
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }
}

export default Logger.getInstance(); 