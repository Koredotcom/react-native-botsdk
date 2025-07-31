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

  private connectToBot(config: BotConfigModel, isFirstTime: boolean = true) {
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

    this.getJwtToken(this.botConfig, isFirstTime);
  }

  private getJwtToken(config: BotConfigModel, isFirstTime: boolean = true) {
    const body = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      identity: config.identity,
      aud: config.value_aud,
      isAnonymous: false,
    };

    const _this = this;
    return new Promise((resolve, reject) => {
      _this.botUrl = _this.getJwtServerUrl();
      let jwtAuthorizationUrl = _this.botUrl + 'users/sts';

      const startTime = Date.now();
      Logger.logApiRequest(jwtAuthorizationUrl, 'POST', {
        clientId: body.clientId,
        identity: body.identity,
        aud: body.aud,
        isAnonymous: body.isAnonymous
      });

      fetch(jwtAuthorizationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(async response => {
          const duration = Date.now() - startTime;
          const responseData = await response.json();

          if (!response.ok) {
            const error: any = new Error(`HTTP ${response.status}`);
            error.response = {
              status: response.status,
              statusText: response.statusText,
              data: responseData,
            };
            throw error;
          }

          Logger.logApiSuccess(jwtAuthorizationUrl, 'POST', {
            hasJwtToken: !!responseData.jwt,
            tokenLength: responseData.jwt?.length
          }, duration);

          this.jwtToken = responseData.jwt;
          _this.botInfo = new BotInfoModel(config.botName, config.botId, {
            identity: '',
            userName: '',
          });
          _this.initialize(_this.botInfo, _this.botCustomData);
          _this.connectWithJwToken(this.jwtToken, !isFirstTime);
        })
        .catch((e: any) => {
          const duration = Date.now() - startTime;
          Logger.logApiError(jwtAuthorizationUrl, 'POST', e, duration);
          Logger.logConnectionError('JWT Token Generation Failed', e);

          _this.emit(RTM_EVENT.ERROR, {
            message:
              'Connection to the bot failed. Please ensure your configuration is valid and try again.',
            isBack: false,
          });
          resolve(false);
        });
    });
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

  private connectWithJwToken(jwtToken: String, isReconnectionAttempt: boolean) {
    const _this = this;
    return new Promise((resolve, reject) => {
      if (_this.isConnecting) {
        Logger.warn('JWT Token Connection already in progress', {
          isConnecting: _this.isConnecting
        });
        return resolve(false);
      }

      _this.jwtToken = jwtToken;

      Logger.logConnectionEvent('JWT Token Authorization Started', {
        isReconnectionAttempt,
        tokenLength: jwtToken.length
      });
      _this.emit(RTM_EVENT.CONNECTING);

      _this.botUrl = _this.getBotUrl();
      let jwtAuthorizationUrl = _this.botUrl + '/api/oAuth/token/jwtgrant';

      const startTime = Date.now();
      let payload = { assertion: jwtToken, botInfo: _this.botInfo };

      Logger.logApiRequest(jwtAuthorizationUrl, 'POST', {
        botId: _this.botInfo?.taskBotId,
        botName: _this.botInfo?.botName
      });

      fetch(jwtAuthorizationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(async response => {
          const duration = Date.now() - startTime;
          const responseData = await response.json();

          if (!response.ok) {
            const error: any = new Error(`HTTP ${response.status}`);
            error.response = {
              status: response.status,
              statusText: response.statusText,
              data: responseData,
            };
            throw error;
          }

          Logger.logApiSuccess(jwtAuthorizationUrl, 'POST', {
            hasUserInfo: !!responseData.userInfo,
            hasAuthorization: !!responseData.authorization,
            userId: responseData.userInfo?.userId,
            tokenType: responseData.authorization?.token_type
          }, duration);

          _this.userInfo = responseData.userInfo;
          _this.authorization = responseData.authorization;

          Logger.logConnectionEvent('JWT Token Authorization Success', {
            userId: _this.userInfo?.userId,
            tokenType: _this.authorization?.token_type
          });

          _this.emit(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED);
          if (_this.appState === APP_STATE.ACTIVE) {
            _this.initSocketConnection(isReconnectionAttempt);
          }
          resolve(true);
        })
        .catch((e: any) => {
          const duration = Date.now() - startTime;
          Logger.logApiError(jwtAuthorizationUrl, 'POST', e, duration);
          Logger.logConnectionError('JWT Token Authorization Failed', e);

          _this.emit(RTM_EVENT.ERROR, {
            message:
              'Connection to the bot failed. Please ensure your configuration is valid and try again.',
            isBack: false,
          });
          resolve(false);
        });
    });
  }

  private getRtmUrl(isReconnectionAttempt: boolean) {
    const _this = this;
    let rtmUrl = this.botUrl + '/api/rtm/start';
    let payload = { botInfo: this.botInfo };
    let token = this.authorization.accessToken;
    // if (this.isChangeToken) {
    //   token = token + '_123';
    // }

    const startTime = Date.now();
    Logger.logApiRequest(rtmUrl, 'POST', {
      botId: this.botInfo?.taskBotId,
      botName: this.botInfo?.botName,
      isReconnectionAttempt
    });

    fetch(rtmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: this.authorization.token_type + ' ' + token,
      },
      body: JSON.stringify(payload),
    })
      .then(async response => {
        const duration = Date.now() - startTime;
        const responseData = await response.json();

        if (!response.ok) {
          const error: any = new Error(`HTTP ${response.status}`);
          error.response = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          };
          throw error;
        }

        Logger.logApiSuccess(rtmUrl, 'POST', {
          hasUrl: !!responseData.url,
          url: responseData.url?.substring(0, 50) + '...'
        }, duration);

        Logger.logConnectionEvent('RTM URL Retrieved Successfully', {
          isReconnectionAttempt,
          hasWebSocketUrl: !!responseData.url
        });

        _this.connect(responseData, isReconnectionAttempt);
      })
      .catch((e: any) => {
        const duration = Date.now() - startTime;
        Logger.logApiError(rtmUrl, 'POST', e, duration);

        _this.isChangeToken = false;
        if (e?.response?.status === 401) {
          Logger.logConnectionError('RTM Start - Unauthorized (401)', e);
          _this.refreshTokenAndReconnect(!isReconnectionAttempt);
        } else if (isReconnectionAttempt) {
          Logger.logConnectionError('RTM Start - Reconnection Failed', e);
          _this.reconnect(isReconnectionAttempt, !this.isConnectAtleastOnce);
        } else {
          Logger.logConnectionError('RTM Start - Connection Failed', e);
          _this.emit(RTM_EVENT.ERROR, {
            message: 'Error:' + e,
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
      case 'pong': {
        break;
      }
      default: {
        break;
      }
    }
  }

  getBotHistory() {
    if (
      !this.isConnecting ||
      !this.botInfo.taskBotId ||
      !this.authorization ||
      !this.authorization.token_type ||
      !this.authorization.accessToken
    ) {
      Logger.warn('Bot History - Missing required parameters', {
        isConnecting: this.isConnecting,
        hasBotId: !!this.botInfo?.taskBotId,
        hasAuthorization: !!this.authorization,
        hasTokenType: !!this.authorization?.token_type,
        hasAccessToken: !!this.authorization?.accessToken
      });
      return;
    }

    let rtmUrl = this.botUrl + '/api' + URL_VERSION + '/botmessages/rtm';
    const startTime = Date.now();

    Logger.logApiRequest(rtmUrl, 'GET', {
      botId: this.botInfo.taskBotId,
      limit: 40,
      offset: 0,
      forward: true
    });

    const urlWithParams = new URL(rtmUrl);
    urlWithParams.searchParams.append('botId', this.botInfo.taskBotId);
    urlWithParams.searchParams.append('limit', '40');
    urlWithParams.searchParams.append('offset', '0');
    urlWithParams.searchParams.append('forward', 'true');

    fetch(urlWithParams.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        Authorization:
          this.authorization.token_type +
          ' ' +
          this.authorization.accessToken,
      },
    })
      .then(async response => {
        const duration = Date.now() - startTime;
        const responseData = await response.json();

        if (!response.ok) {
          const error: any = new Error(`HTTP ${response.status}`);
          error.response = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          };
          throw error;
        }

        Logger.logApiSuccess(rtmUrl, 'GET', {
          messageCount: responseData?.length || 0,
          hasData: !!responseData
        }, duration);

        // Create axios-like response object for compatibility
        const axiosResponse = {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
          headers: {},
        };

        this.emit(RTM_EVENT.GET_HISTORY, axiosResponse, this.botInfo);
      })
      .catch((e: any) => {
        const duration = Date.now() - startTime;
        Logger.logApiError(rtmUrl, 'GET', e, duration);
      });
  }

  public subscribePushNotifications(deviceId?: string) {
    const _this = this;
    if (!deviceId) {
      return new Promise((resolve, reject) => {
        Logger.logConnectionError('Push notification subscription Failed', "deviceId is not VALID!");
        resolve(false);
      });
    }
    return new Promise((resolve, reject) => {
      Logger.debug('Subscribe notications', "is in-progress");

      _this.botUrl = _this.getBotUrl();
      let url = `/api/users/${this.getUserId()}/sdknotifications/subscribe`;
      let subscribeUrl = _this.botUrl + url;

      const startTime = Date.now();
      let payload = { osType: Platform.OS, deviceId: deviceId };

      Logger.logApiRequest(subscribeUrl, 'POST', {});

      const headers = { Authorization: `bearer ${this.getAccessToken()}` };

      fetch(subscribeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        body: JSON.stringify(payload),
      })
        .then(async response => {
          const duration = Date.now() - startTime;

          if (!response.ok) {
            const responseData = await response.json().catch(() => ({}));
            const error: any = new Error(`HTTP ${response.status}`);
            error.response = {
              status: response.status,
              statusText: response.statusText,
              data: responseData,
            };
            throw error;
          }

          Logger.logApiSuccess(subscribeUrl, 'POST', {}, duration);
          Logger.logConnectionEvent('Push notification subscription Success', {});
          resolve(true);
        })
        .catch((e: any) => {
          const duration = Date.now() - startTime;
          Logger.logApiError(subscribeUrl, 'POST', e, duration);
          Logger.logConnectionError('Push notification subscription Failed', e);
          resolve(false);
        });
    });
  }

  public unsubscribePushNotifications(deviceId?: string) {
    const _this = this;
    if (!deviceId) {
      return new Promise((resolve, reject) => {
        Logger.logConnectionError('Push notification unsubscription Failed', "deviceId is not VALID!");
        resolve(false);
      });
    }
    return new Promise((resolve, reject) => {
      Logger.debug('Unsubscribe notications', "is in-progress");

      _this.botUrl = _this.getBotUrl();
      let url = `/api/users/${this.getUserId()}/sdknotifications/unsubscribe`;
      let subscribeUrl = _this.botUrl + url;

      const startTime = Date.now();
      let payload = { osType: Platform.OS, deviceId: deviceId };

      Logger.logApiRequest(subscribeUrl, 'POST', {});

      const headers = {
        Authorization: `bearer ${this.getAccessToken()}`,
        "Content-type": "application/json",
        "X-HTTP-Method-Override": "DELETE"
      };

      fetch(subscribeUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...headers,
        },
        body: JSON.stringify(payload),
      })
        .then(async response => {
          const duration = Date.now() - startTime;

          if (!response.ok) {
            const responseData = await response.json().catch(() => ({}));
            const error: any = new Error(`HTTP ${response.status}`);
            error.response = {
              status: response.status,
              statusText: response.statusText,
              data: responseData,
            };
            throw error;
          }

          Logger.logApiSuccess(subscribeUrl, 'POST', {}, duration);
          Logger.logConnectionEvent('Push notification unsubscription Success', {});
          resolve(true);
        })
        .catch((e: any) => {
          const duration = Date.now() - startTime;
          Logger.logApiError(subscribeUrl, 'POST', e, duration);
          Logger.logConnectionError('Push notification unsubscription Failed', e);
          resolve(false);
        });
    });
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

  private initSocketConnection(isReconnectionAttempt: boolean) {
    // console.log('--------->> initSocketConnection <<---------');
    if (this.isConnecting) {
      return;
    }
    if (this.authorization) {
      //console.log('this.authorization =====>:', this.authorization);
      this.isConnecting = true;
      this.getRtmUrl(isReconnectionAttempt);
    } else if (isReconnectionAttempt && this.botConfig) {
      this.connectToBot(this.botConfig, !this.isConnectAtleastOnce);
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
        () => {
          this.isConnecting = false;
          this.initSocketConnection(isReconnectionAttempt);
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

  private refreshTokenAndReconnect(isReconnectionAttempt?: boolean) {
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

    setTimeout(() => {
      this.reconnectAttemptCount = 0;
      if (this.botConfig) {
        Logger.logConnectionEvent('Initiating Fresh Connection After Token Refresh', {
          hasBotConfig: !!this.botConfig
        });
        this.connectToBot(this.botConfig, isReconnectionAttempt);
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

  getSettings() {
    if (
      !this.botInfo.searchIndexId ||
      !this.botInfo.taskBotId ||
      !this.authorization ||
      !this.authorization.token_type ||
      !this.authorization.accessToken ||
      !this.jwtToken
    ) {
      Logger.warn('Get Settings - Missing required parameters', {
        hasSearchIndexId: !!this.botInfo?.searchIndexId,
        hasTaskBotId: !!this.botInfo?.taskBotId,
        hasAuthorization: !!this.authorization,
        hasTokenType: !!this.authorization?.token_type,
        hasAccessToken: !!this.authorization?.accessToken,
        hasJwtToken: !!this.jwtToken
      });
      return false;
    }

    let urlString =
      this.botUrl +
      'searchassistapi/searchsdk/stream/' +
      this.botInfo.taskBotId +
      '/' +
      this.botInfo.searchIndexId +
      '/getresultviewsettings';

    const startTime = Date.now();
    Logger.logApiRequest(urlString, 'GET', {
      taskBotId: this.botInfo.taskBotId,
      searchIndexId: this.botInfo.searchIndexId
    });

    fetch(urlString, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        Authorization:
          this.authorization?.token_type +
          ' ' +
          this.authorization?.accessToken,
        auth: this.jwtToken.toString(),
      },
    })
      .then(async response => {
        const duration = Date.now() - startTime;
        const responseData = await response.json();

        if (!response.ok) {
          const error: any = new Error(`HTTP ${response.status}`);
          error.response = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          };
          throw error;
        }

        Logger.logApiSuccess(urlString, 'GET', {
          hasSettings: !!responseData?.settings,
          settingsCount: responseData?.settings?.length || 0
        }, duration);

        if (responseData?.settings) {
          this.resultViewSettings = responseData?.settings;
        }
      })
      .catch((e: any) => {
        const duration = Date.now() - startTime;
        Logger.logApiError(urlString, 'GET', e, duration);
      });
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
}
