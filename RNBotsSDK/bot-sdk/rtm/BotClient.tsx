import axios from 'axios';
import {EventEmitter} from 'events';
import BotInfoModel from '../model/BotInfoModel';
import {IBotClient} from './IBotClient';
import {
  APP_STATE,
  ConnectionState,
  RTM_EVENT,
  URL_VERSION,
} from '../constants/Constant';
import {Platform} from 'react-native';
import {BotConfigModel} from '../model/BotConfigModel';

const RECONNECT_ATTEMPT_LIMIT = 16;

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
    this.pingInterval = 30000;
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

  getEmitter(): EventEmitter {
    return this;
  }
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
    // this.checkConnectivity().then(isNetwork => {
    //   if (!isNetwork) {
    //     _this.connectionState = ConnectionState.DISCONNECTED;
    //     _this.isConnecting = false;
    //     _this.emit(RTM_EVENT.ERROR, {
    //       message: 'BotClient network connection not available',
    //       isBack: false,
    //     });
    //     return;
    //   }
    // });

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

      axios
        .post(jwtAuthorizationUrl, body)
        .then(response => {
          this.jwtToken = response.data.jwt;
          _this.botInfo = new BotInfoModel(config.botName, config.botId, {
            identity: '',
            userName: '',
          });
          _this.initialize(_this.botInfo, _this.botCustomData);
          _this.connectWithJwToken(this.jwtToken, !isFirstTime);
        })
        .catch(e => {
          // console.log('response error --->:', e);
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
        console.log(
          'connectWithJwToken this.isConnecting:',
          _this.isConnecting,
        );
        return resolve(false);
      }

      _this.jwtToken = jwtToken;

      _this.emit(RTM_EVENT.CONNECTING);

      _this.botUrl = _this.getBotUrl();
      let jwtAuthorizationUrl = _this.botUrl + '/api/oAuth/token/jwtgrant';

      let payload = {assertion: jwtToken, botInfo: _this.botInfo};
      axios
        .post(jwtAuthorizationUrl, payload)
        .then(response => {
          _this.userInfo = response.data.userInfo;
          _this.authorization = response.data.authorization;
          _this.emit(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED);
          if (_this.appState === APP_STATE.ACTIVE) {
            _this.initSocketConnection(isReconnectionAttempt);
          }
          resolve(true);
        })
        .catch(e => {
          //console.log('response error --->:', e);
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
    let payload = {botInfo: this.botInfo};
    let token = this.authorization.accessToken;
    // if (this.isChangeToken) {
    //   token = token + '_123';
    // }

    axios
      .post(rtmUrl, payload, {
        headers: {
          Authorization: this.authorization.token_type + ' ' + token,
        },
      })
      .then(response => {
        _this.connect(response.data, isReconnectionAttempt);
      })
      .catch(e => {
        _this.isChangeToken = false;
        console.log('getRtmUrl error ---->', e);
        // console.log(
        //   'getRtmUrl isReconnectionAttempt ---->',
        //   isReconnectionAttempt,
        // );
        // console.log('Data is ', e?.response?.data);
        // console.log('Status is ', e?.response?.status);
        //         getRtmUrl error ----> [Error: Request failed with status code 401]
        //         Data is  {"errors": [{"code": 401, "msg": "Unauthorized"}]}
        //         Status is  401

        if (e?.response?.status === 401) {
          // || (e?.response?.data?.errors?[0]?.code === 401 && e?.response?.data?.errors?[0]?.msg === 'Unauthorized')) {
          _this.refreshTokenAndReconnect(!isReconnectionAttempt);
        } else if (isReconnectionAttempt) {
          _this.reconnectAttemptCount = 1;
          _this.reconnect(isReconnectionAttempt, !this.isConnectAtleastOnce);
        } else {
          _this.emit(RTM_EVENT.ERROR, {
            message: 'Error:' + e,
            isBack: true,
          });
        }
      });
  }

  private connect(data: {url: string}, isReconnectionAttempt: boolean) {
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
      console.log('Bot socket connected');
      _this.connectionState = ConnectionState.CONNECTED;
      _this.emit(RTM_EVENT.ON_OPEN, {
        message: 'Bot socket connected',
        isReconnectionAttempt: isReconnectionAttempt,
      });
      _this.startSendingPing();
      _this.reconnectAttemptCount = 1;
    };
    ws.onclose = e => {
      _this.emit(RTM_EVENT.ON_CLOSE, 'Bot socket closed:' + e);
      console.log('Bot socket closed:', e);
      if (isManualClose || e?.code === 1000) {
        console.log('Bot socket isManualClose = true :', e);
        return;
      }

      if (this.webSocket) {
        this.webSocket.close();
      }
      _this.webSocket = undefined;
      _this.isConnecting = false;
      _this.reconnect(true);
      console.log(RTM_EVENT.ON_CLOSE, e.code, e?.reason);
      _this.connectionState = ConnectionState.DISCONNECTED;
    };

    ws.onmessage = e => {
      let data = JSON.parse(e.data);
      switch (data.type) {
        case 'pong':
          _this.receivedLastPong = true;
          console.log('================================');
          console.log('Pong:', e.data);
          console.log('================================');
          break;
        default:
          // console.log('-----------------------------------');
          // console.log(RTM_EVENT.ON_MESSAGE, e.data);
          // console.log('-----------------------------------');
          // this.emit(RTM_EVENT.ON_MESSAGE, e.data);
          _this.onMessage(e.data, false);
          break;
      }
    };

    ws.onerror = (e: any) => {
      _this.emit(RTM_EVENT.ON_ERROR, e?.message);
      console.log(RTM_EVENT.ON_ERROR, e?.message);
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
      return;
    }

    let rtmUrl = this.botUrl + '/api' + URL_VERSION + '/botmessages/rtm';
    axios
      .get(rtmUrl, {
        params: {
          botId: this.botInfo.taskBotId,
          limit: 40,
          offset: 0,
          forward: true,
        },
        headers: {
          Authorization:
            this.authorization.token_type +
            ' ' +
            this.authorization.accessToken,
        },
      })
      .then(response => {
        this.emit(RTM_EVENT.GET_HISTORY, response, this.botInfo);
        // this.connect(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getConnectionState() {
    return this.connectionState;
  }

  disconnect() {
    console.log('-----> Bot disconnect called  <-------');

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
    // console.log('--------->> reconnect <<---------');

    if (this.isReconnectAttemptRequired) {
      if (this.reconnectTimer) {
        this.reconnectAttemptCount = 0;
        clearInterval(this.reconnectTimer);
      }
      this.reconnectTimer = setTimeout(
        () => {
          this.isConnecting = false;
          this.initSocketConnection(isReconnectionAttempt);
        },
        resetReconnectAttemptCount ? 10 : this.getReconnectDelay(),
      );
    }
  }

  private refreshTokenAndReconnect(isReconnectionAttempt?: boolean) {
    console.log('--------->> refreshTokenAndReconnect <<---------');
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
        this.connectToBot(this.botConfig, isReconnectionAttempt);
      }
    }, 500);
  }

  private getReconnectDelay() {
    // console.log('--------->> getReconnectDelay <<---------');
    this.reconnectAttemptCount = this.reconnectAttemptCount + 1;
    if (this.reconnectAttemptCount > RECONNECT_ATTEMPT_LIMIT) {
      this.reconnectAttemptCount = 0;
    }
    // console.log('Reconnection count :' + this.reconnectAttemptCount);
    return this.reconnectAttemptCount * 2000;
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
      return false;
    }

    let urlString =
      this.botUrl +
      'searchassistapi/searchsdk/stream/' +
      this.botInfo.taskBotId +
      '/' +
      this.botInfo.searchIndexId +
      '/getresultviewsettings';
    axios
      .get(urlString, {
        headers: {
          Authorization:
            this.authorization?.token_type +
            ' ' +
            this.authorization?.accessToken,
          auth: this.jwtToken.toString(),
        },
      })
      .then(response => {
        if (response?.data?.settings) {
          this.resultViewSettings = response?.data?.settings;
        }
      })
      .catch(e => {
        console.log(e);
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
          this.send({type: 'ping'});
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
        this.send({type: 'ping'});
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
          console.log('payload: ', jsonString);
          // this.webSocket.send(JSON.stringify(message));
        } catch (error) {
          console.log('WebSocket.OPEN send error :', error);
        }

        // messageHandler('success');
        break;
      default:
        // messageHandler(new Error(err));
        console.log('ws not connected or reconnecting, unable to send message');
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

    // data_type = data_type.toLowerCase().trim();

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
