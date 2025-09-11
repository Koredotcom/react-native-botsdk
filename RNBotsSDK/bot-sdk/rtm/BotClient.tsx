// Using native fetch() API instead of axios
import { EventEmitter } from 'events';
import BotInfoModel from '../model/BotInfoModel';
import { IBotClient } from './IBotClient';
import {
  APP_STATE,
  ConnectionState,
  RTM_EVENT,
  URL_VERSION,
} from '../constants/Constant';
import { Platform } from 'react-native';
import { BotConfigModel } from '../model/BotConfigModel';
import Logger from '../utils/Logger';
import ApiService from '../api/ApiService';

const RECONNECT_ATTEMPT_LIMIT = 5;

export class BotClient extends EventEmitter implements IBotClient {
  private pingInterval: number;
  private pingTimer?: any;
  private receivedLastPong: boolean;
  private timer?: any;
  private isConnecting: boolean;
  private jwtToken: String;
  private resultViewSettings: never[];
  private webSocket?: WebSocket;
  private botUrl: string;
  private sessionActive: boolean;
  private appState: string;
  private isNetWorkAvailable: boolean;
  private botInfo: any;
  private customData: any;
  private userInfo: any;
  private authorization: any;
  private botCustomData: Map<string, string>;

  private isConnectAtleastOnce: boolean;

  private connectionState = ConnectionState.DISCONNECTED;

  private reconnectAttemptCount: number = 0;

  private isReconnectAttemptRequired: boolean = false;

  private DATA_IDENTITY = 'identity';
  private DATA_USERNAME = 'userName';

  private RECONNECT_PARAM = '&isReconnect=true';
  private reconnectTimer?: any;
  private botConfig?: BotConfigModel;
  private isChangeToken?: boolean;

  constructor() {
    super();
    this.pingInterval = 10000;
    this.receivedLastPong = false;
    this.isConnecting = false;
    this.jwtToken = '';
    this.resultViewSettings = [];
    this.webSocket = undefined;
    this.botUrl = '';
    this.sessionActive = false;
    this.appState = APP_STATE.ACTIVE;
    this.isNetWorkAvailable = true;
    this.botCustomData = new Map<string, string>();
    this.isChangeToken = true;
    this.isConnectAtleastOnce = false;
  }

  initializeBotClient(config: BotConfigModel) {
    if (config == null || config == undefined) {
      throw new Error('BotConfigModel object can not be null');
    }
    if (
      !config.botId ||
      !config.clientId ||
      !config.clientSecret ||
      !config.botUrl ||
      !config.identity ||
      !config.value_aud
    ) {
      throw new Error('BotConfigModel object has some values are missing');
    }
    this.connectToBot(config, true);
  }

  // async checkConnectivity() {
  //   try {
  //     const connectionInfo = await NetInfo.fetch();
  //     return connectionInfo.isConnected;
  //   } catch (error) {
  //     console.log('Error checking connectivity:', error);
  //   }

  //   return false;
  // }


  getAccessToken() {
    return this.authorization?.accessToken;
  }
  getUserId = () => {
    return this.getBotUserId();
  };
  getBotName = () => {
    return this.botConfig?.botName;
  };

  getBotUrl = (): string => {
    return this.botConfig?.botUrl || '';
  };
  getJwtServerUrl = (): string => {
    return this.botConfig?.jwtServerUrl || '';
  };

  getAuthorization = () => {
    if (!this.authorization) {
      return undefined;
    }
    return (
      this.authorization?.token_type + ' ' + this.authorization?.accessToken
    );
  };

  private async connectToBot(config: BotConfigModel, isFirstTime: boolean = true) {
    const _this = this;
    if (
      this.connectionState == ConnectionState.CONNECTED ||
      this.isConnecting
    ) {
      console.log('this.connectionState  :', this.connectionState);
      return;
    }

    if (!config) {
      // console.log('BotConfigModel object has some values are missing');
      this.emit(RTM_EVENT.ERROR, {
        message: 'BotConfigModel object has some values are missing',
        isBack: true,
      });

      return;
    }

    this.botConfig = config;
    this.botCustomData.clear();

    this.botCustomData.set(this.DATA_IDENTITY, '');
    this.botCustomData.set(this.DATA_USERNAME, '');
    this.isReconnectAttemptRequired = true;

    await this.getJwtToken(this.botConfig, isFirstTime);
  }

  private async getJwtToken(config: BotConfigModel, isFirstTime: boolean = true) {
    if (!this.botConfig) return;
    const apiService = new ApiService(this.botConfig?.botName + "", this);
    await apiService.getJwtToken(
      this.botConfig!!,
      isFirstTime,
      async (jwtToken: any) => {
        this.jwtToken = jwtToken;
        this.botInfo = new BotInfoModel(config.botName, config.botId, {
          identity: '',
          userName: '',
        });
        this.initialize(this.botInfo, this.botCustomData);
        await this.connectWithJwToken(this.jwtToken, !isFirstTime);
      },
      (error: any) => {
        this.emit(RTM_EVENT.ERROR, {
          message:
            'Connection to the bot failed. Please ensure your configuration is valid and try again.',
          isBack: false,
        });
      })
  }

  private initialize(botInfo: any, customData: any) {
    this.botInfo = botInfo;
    this.customData = customData;
  }

  setSessionActive(isActive: boolean) {
    this.sessionActive = isActive;
  }

  setAppState(appState: string) {
    this.appState = appState;
  }
  getAppState(): string | undefined {
    return this.appState;
  }
  setIsNetworkAvailable(isNetWorkAvailable: boolean) {
    this.isNetWorkAvailable = isNetWorkAvailable;
  }

  private async connectWithJwToken(jwtToken: String, isReconnectionAttempt: boolean) {
    if (this.isConnecting) {
      Logger.warn('JWT Token Connection already in progress', {
        isConnecting: this.isConnecting
      });
      return false;
    }

    this.jwtToken = jwtToken;

    const apiService = new ApiService(this.botConfig?.botUrl + "", this);
    await apiService.getJwtGrant(
      jwtToken,
      isReconnectionAttempt,
      (status: any) => {
        this.emit(RTM_EVENT.CONNECTING);
      },
      async (response: any) => {
        this.userInfo = response.userInfo;
        this.authorization = response.authorization;

        Logger.logConnectionEvent('JWT Token Authorization Success', {
          userId: this.userInfo?.userId,
          tokenType: this.authorization?.token_type
        });

        this.emit(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED);
        if (this.appState === APP_STATE.ACTIVE) {
          await this.initSocketConnection(isReconnectionAttempt);
        }
      },
      (error: any) => { })
  }

  private async getRtmUrl(isReconnectionAttempt: boolean): Promise<void> {
    const apiService = new ApiService(this.botConfig?.botUrl + "", this);
    await apiService.getRtmUrl(isReconnectionAttempt, (response) => {
      this.connect(response, isReconnectionAttempt)
    }, (error) => {
      this.isChangeToken = false;
      if (error?.response?.status === 401) {
        Logger.logConnectionError('RTM Start - Unauthorized (401)', error);
        this.refreshTokenAndReconnect(!isReconnectionAttempt);
      } else if (isReconnectionAttempt) {
        Logger.logConnectionError('RTM Start - Reconnection Failed', error);
        this.reconnect(isReconnectionAttempt, !this.isConnectAtleastOnce);
      } else {
        Logger.logConnectionError('RTM Start - Connection Failed', error);
        this.emit(RTM_EVENT.ERROR, {
          message: 'Error:' + error,
          isBack: true,
        });
      }
    });
  }

  private connect(data: { url: string }, isReconnectionAttempt: boolean) {
    const _this = this;
    let botServerUrl = this.botUrl?.replace('/https/g', 'wss');
    // console.log('botServerUrl ---->', botServerUrl);
    let url = data.url;
    let wssUrl = url.replace('ws://dummy.com:80', botServerUrl);
    //let wssUrl = 'ws://dummy.com:80';
    this.connectionState = ConnectionState.CONNECTING;
    wssUrl = isReconnectionAttempt ? wssUrl + this.RECONNECT_PARAM : wssUrl;
    //TODO write a logic for reconnect
    //  private const val RECONNECT_PARAM = "&isReconnect=true"
    // console.log('wssUrl  ---->:', wssUrl);
    let isManualClose = false;
    if (
      this.webSocket &&
      (this.webSocket?.readyState == WebSocket.CONNECTING ||
        this.webSocket?.readyState == WebSocket.OPEN)
    ) {
      isManualClose = true;
      this.webSocket?.close();
    }
    const ws = new WebSocket(wssUrl);

    ws.onopen = () => {
      this.isConnectAtleastOnce = true;
      Logger.logWebSocketEvent('Connected', {
        url: wssUrl.substring(0, 100) + '...',
        isReconnectionAttempt,
        readyState: ws.readyState
      });

      _this.connectionState = ConnectionState.CONNECTED;
      _this.emit(RTM_EVENT.ON_OPEN, {
        message: 'Bot socket connected',
        isReconnectionAttempt: isReconnectionAttempt,
      });
      _this.startSendingPing();
      _this.reconnectAttemptCount = 0;
    };
    ws.onclose = e => {
      Logger.logWebSocketEvent('Closed', {
        code: e?.code,
        reason: e?.reason,
        isManualClose,
        wasCleanClose: e?.code === 1000
      });

      _this.emit(RTM_EVENT.ON_CLOSE, 'Bot socket closed:' + e);

      if (isManualClose || e?.code === 1000) {
        Logger.info('WebSocket closed normally (manual or clean close)', {
          code: e?.code,
          isManualClose
        });
        return;
      }

      if (this.webSocket) {
        this.webSocket.close();
      }
      _this.webSocket = undefined;
      _this.isConnecting = false;
      _this.reconnect(true);
      _this.connectionState = ConnectionState.DISCONNECTED;
    };

    ws.onmessage = e => {
      let data = JSON.parse(e.data);
      switch (data.type) {
        case 'pong':
          _this.receivedLastPong = true;
          Logger.debug('WebSocket Pong received', {
            timestamp: new Date().toISOString(),
            dataLength: e.data.length
          });
          break;
        default:
          Logger.logWebSocketEvent('Message Received', {
            type: data.type,
            from: data.from,
            messageLength: e.data.length,
            hasMessage: !!data.message
          });
          _this.onMessage(e.data, false);
          break;
      }
    };

    ws.onerror = (e: any) => {
      Logger.logWebSocketError('Error', e);

      _this.emit(RTM_EVENT.ON_ERROR, e?.message);

      if (_this.webSocket) {
        _this.webSocket.close();
      }
      _this.webSocket = undefined;
      _this.isConnecting = false;
      let isReconnect = this.connectionState == ConnectionState.CONNECTED;
      _this.connectionState = ConnectionState.DISCONNECTED;
      _this.reconnect(isReconnect);
    };

    _this.webSocket = ws;
  }

  private onMessage(messageData: any, isJsonObj: boolean = false) {
    if (!messageData) {
      return;
    }
    var data: any = null;
    if (!isJsonObj) {
      data = JSON.parse(messageData);
    } else {
      data = messageData;
    }

    switch (data.type) {
      case 'bot_response': {
        if (data.from === 'bot') {
          if (data.type === 'bot_response') {
            data.timeMillis = new Date(data.createdOn).getTime();
          }
          this.emit(RTM_EVENT.ON_MESSAGE, data);
        }
        break;
      }
      case 'user_message': {
        if (data.from === 'self') {
          var message = data.message;
          if (message) {
            var messageData: any = {
              type: 'user_message',
              message: [
                {
                  type: 'text',
                  component: {
                    type: 'text',
                    payload: {
                      text: message.body,
                      createdOn: new Date().getTime(),
                    },
                  },
                  cInfo: {
                    body: message.body,
                  },
                  clientMessageId: data.id,
                },
              ],
            };
            // this.processMessage(messageData);
            this.emit(RTM_EVENT.ON_MESSAGE, messageData);
          }
        }
        break;
      }
      case 'ack': {
        this.emit(RTM_EVENT.ON_ACK, data);
        break;
      }
      case 'events': {
        this.emit(RTM_EVENT.ON_EVENTS, data);
        break;
      }
      case 'pong': {
        break;
      }
      default: {
        break;
      }
    }
  }

  private async fetchWithRetries(
    url: string,
    options: RequestInit | undefined,
    retries = 1,
    method = 'POST',
  ): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (retries <= RECONNECT_ATTEMPT_LIMIT) {
        const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), RECONNECT_ATTEMPT_LIMIT) * 1000;
        await new Promise((resolve) => setTimeout(() => resolve(undefined), delay));
        // console.log(`Request failed, retrying ${retries}/${RECONNECT_ATTEMPT_LIMIT}. Error ${err}`);
        Logger.logApiError(url, method, err, delay);
        return this.fetchWithRetries(url, options, retries + 1, method);
      } else {
        throw new Error(`Max retries exceeded. error: ${err}`);
      }
    }
  }

  getConnectionState() {
    return this.connectionState;
  }

  disconnect() {
    Logger.logConnectionEvent('Bot Disconnect Called', {
      connectionState: this.connectionState,
      isConnecting: this.isConnecting,
      hasWebSocket: !!this.webSocket,
      reconnectAttemptCount: this.reconnectAttemptCount
    });

    if (this.reconnectTimer) {
      this.reconnectAttemptCount = 0;
      clearInterval(this.reconnectTimer);
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.connectionState = ConnectionState.DISCONNECTED;
    this.isReconnectAttemptRequired = false;
    this.userInfo = null;
    this.authorization = null;
    this.sessionActive = false;
    this.isConnecting = false;
    this.isConnectAtleastOnce = false;
    if (this.webSocket) {
      this.webSocket.close();
    }
    this.webSocket = undefined;
    this.removeAllListeners();

    Logger.logConnectionEvent('Bot Disconnected Successfully', {
      connectionState: this.connectionState
    });
  }

  private async initSocketConnection(isReconnectionAttempt: boolean) {
    // console.log('--------->> initSocketConnection <<---------');
    if (this.isConnecting) {
      return;
    }
    if (this.authorization) {
      //console.log('this.authorization =====>:', this.authorization);
      this.isConnecting = true;
      await this.getRtmUrl(isReconnectionAttempt);
    } else if (isReconnectionAttempt && this.botConfig) {
      await this.connectToBot(this.botConfig, !this.isConnectAtleastOnce);
    }
  }

  reconnect(
    isReconnectionAttempt: boolean,
    resetReconnectAttemptCount?: boolean,
  ) {
    if (this.isReconnectAttemptRequired && this.reconnectAttemptCount < RECONNECT_ATTEMPT_LIMIT) {
      Logger.logConnectionEvent('Reconnection Attempt', {
        attemptCount: this.reconnectAttemptCount,
        maxAttempts: RECONNECT_ATTEMPT_LIMIT,
        isReconnectionAttempt,
        resetReconnectAttemptCount
      });

      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
      }

      this.reconnectTimer = setTimeout(
        async () => {
          this.isConnecting = false;
          await this.initSocketConnection(isReconnectionAttempt);
        },
        this.getReconnectDelay(),
      );
    }
    else {
      Logger.logConnectionError('Maximum Reconnection Limit Reached', {
        attemptCount: this.reconnectAttemptCount,
        maxAttempts: RECONNECT_ATTEMPT_LIMIT,
        isReconnectAttemptRequired: this.isReconnectAttemptRequired
      });
    }
  }

  private async refreshTokenAndReconnect(isReconnectionAttempt?: boolean) {
    Logger.logConnectionEvent('Refresh Token and Reconnect Started', {
      isReconnectionAttempt,
      reconnectAttemptCount: this.reconnectAttemptCount,
      connectionState: this.connectionState,
      hasWebSocket: !!this.webSocket
    });

    if (this.reconnectTimer) {
      this.reconnectAttemptCount = 0;
      clearInterval(this.reconnectTimer);
    }
    this.isReconnectAttemptRequired = false;
    this.userInfo = null;
    this.authorization = null;
    this.sessionActive = false;
    this.isConnecting = false;
    this.connectionState = ConnectionState.DISCONNECTED;

    if (this.webSocket) {
      this.webSocket.close();
    }
    if (
      this.webSocket?.readyState == WebSocket.CLOSED ||
      this.webSocket?.readyState == WebSocket.CLOSING ||
      this.receivedLastPong == false
    ) {
      clearInterval(this.pingTimer);
    }

    setTimeout(async () => {
      this.reconnectAttemptCount = 0;
      if (this.botConfig) {
        Logger.logConnectionEvent('Initiating Fresh Connection After Token Refresh', {
          hasBotConfig: !!this.botConfig
        });
        await this.connectToBot(this.botConfig, isReconnectionAttempt);
      }
    }, 500);
  }

  private getReconnectDelay() {
    // Get current connectivity status
    // NetInfo.fetch().then(status => {
    //   if (status.isConnected) {
    this.reconnectAttemptCount++;
    // }
    // else {
    //   this.reconnectAttemptCount = 1
    // }

    // Logger.info('Network connectivity check for reconnection', {
    //   isConnected: status.isConnected,
    //   connectionType: status.type,
    //   reconnectAttemptCount: this.reconnectAttemptCount
    // });
    // });

    return 3000;
  }

  checkSocketAndReconnect() {
    // console.log('--------->> checkSocketAndReconnect <<---------');
    if (!this.webSocket) {
      this.reconnect(this.isReconnectAttemptRequired);
    } else {
      this.refreshTokenAndReconnect(false);
    }
  }

  private startSendingPing() {
    let ws = this.webSocket;
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }

    setTimeout(() => {
      this.pingTimer = setInterval(() => {
        if (ws?.readyState == WebSocket.OPEN) {
          this.receivedLastPong = false;
          this.send({ type: 'ping' });
        } else if (
          ws?.readyState == WebSocket.CLOSED ||
          ws?.readyState == WebSocket.CLOSING ||
          this.receivedLastPong == false
        ) {
          clearInterval(this.pingTimer);
        }
      }, this.pingInterval);
    }, 1000);
  }

  private setTimer() {
    let ws = this.webSocket;
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setTimeout(() => {
      if (ws?.readyState == WebSocket.OPEN) {
        this.receivedLastPong = false;
        this.send({ type: 'ping' });
        this.setTimer();
      } else if (
        ws?.readyState == WebSocket.CLOSED ||
        ws?.readyState == WebSocket.CLOSING ||
        this.receivedLastPong == false
      ) {
        clearInterval(this.timer);
      }
    }, this.pingInterval);
  }

  send = (message: {
    type?: string;
    clientMessageId?: {};
    message?: any;
    resourceid?: string;
    botInfo?: {};
    id?: {};
    client?: string;
  }) => {
    switch (this.webSocket?.readyState) {
      case WebSocket.OPEN:
        try {
          let jsonString = JSON.stringify(message);
          this.webSocket.send(jsonString);

          Logger.logWebSocketEvent('Message Sent', {
            type: message.type,
            clientMessageId: message.clientMessageId,
            resourceid: message.resourceid,
            messageLength: jsonString.length,
            client: message.client
          });
        } catch (error) {
          Logger.logWebSocketError('Send Failed', error);
        }
        break;
      default:
        Logger.warn('WebSocket Send Failed - Connection not ready', {
          readyState: this.webSocket?.readyState,
          connectionState: this.connectionState,
          messageType: message.type
        });
        break;
    }
  };

  getBotAccessToken() {
    return this.authorization?.accessToken;
  }

  getResultViewSettings() {
    return this.resultViewSettings;
  }
  //{"accountId": "60a4179424c895fef482f57c", "identity": "cs-1e38e7d9-20bd-579a-9a7c-9ec6777a39e2/42438ffd-b473-42d1-bd5f-66bd16715ad6", "managedBy": "60a4179424c895fef482f57c", "userId": "u-822d2104-c94e-5dc9-876b-b858b45d065d"}
  getBotUserId() {
    return this.userInfo?.userId;
  }
  getBotUserIdentity() {
    return this.userInfo?.identity;
  }

  getBotInfo() {
    return this.botInfo;
  }
  sendMessage(message: any, payload?: any, attachments?: any): any {
    var clientMessageId = new Date().getTime();

    Logger.info('Sending message to bot', {
      clientMessageId,
      messageLength: message?.length,
      hasPayload: !!payload,
      hasAttachments: !!attachments,
      platform: Platform.OS
    });

    var msgData = {
      type: 'user_message',
      timeMillis: clientMessageId,
      message: [
        {
          type: 'text',
          component: {
            type: 'text',
            payload: {
              text: message,
              attachments: attachments,
              createdOn: clientMessageId,
            },
          },
          clientMessageId: clientMessageId,
        },
      ],
    };

    var messageToBot = {
      clientMessageId: clientMessageId,
      message: {
        body: payload || message,
        renderMsg: payload != null ? message : null,
        customData: {
          botToken: this.getBotAccessToken(),
          kmToken: this.getAccessToken(),
          kmUId: this.getUserId(),
        },
      },
      resourceid: '/bot.message',
      botInfo: this.getBotInfo(),
      id: clientMessageId,
      client: Platform.OS,
    };

    this.send(messageToBot);

    return msgData;
  }

  sendEvent(eventName: any, isZenDeskEvent?: any) {
    var clientMessageId = new Date().getTime();
    Logger.info('Sending Event to bot', {
      clientMessageId,
      eventName: eventName,
      isZenDeskEvent: isZenDeskEvent,
      platform: Platform.OS
    });

    var eventToBot = {
      clientMessageId: clientMessageId,
      event: eventName,
      message: {
        body: isZenDeskEvent == true ? eventName : '',
        customData: {
          botToken: this.getBotAccessToken(),
          kmToken: this.getAccessToken(),
          kmUId: this.getUserId(),
        },
      },
      resourceid: isZenDeskEvent == true ? '/bot.clientEvent' : '/bot.message',
      botInfo: this.getBotInfo(),
      id: clientMessageId,
      client: Platform.OS,
    };
    this.send(eventToBot);
  }
}
