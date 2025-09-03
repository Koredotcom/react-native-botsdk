import { RTM_EVENT, URL_VERSION } from "../constants/Constant";
import { Platform } from "react-native";
import Logger from "../utils/Logger";
import { BotConfigModel } from "../model/BotConfigModel";
import { BotClient } from "../rtm/BotClient";

const RECONNECT_ATTEMPT_LIMIT = 5;

export default class ApiService {
  private baseUrl: string;
  private botClient: BotClient;

  constructor(baseUrl: string, botClient: BotClient) {
    this.baseUrl = baseUrl;
    this.botClient = botClient;
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
        Logger.logApiError(url, method, err, delay);
        return this.fetchWithRetries(url, options, retries + 1, method);
      } else {
        throw new Error(`Max retries exceeded. error: ${err}`);
      }
    }
  }

  async getBotHistory(offset: number, limit: number, botName: string, botId: string, onResponse: (response?: any) => void): Promise<void> {
    let rtmUrl = this.baseUrl + '/api' + URL_VERSION + '/botmessages/rtm';
    const startTime = Date.now();

    Logger.logApiRequest(rtmUrl, 'GET', {
      botId: this.botClient.getBotInfo().taskBotId,
      limit: limit,
      offset: offset,
      forward: true
    });

    const urlWithParams = new URL(rtmUrl);
    urlWithParams.searchParams.append('botId', this.botClient.getBotInfo().taskBotId);
    urlWithParams.searchParams.append('limit', limit + "");
    urlWithParams.searchParams.append('offset', offset + "");
    urlWithParams.searchParams.append('forward', 'true');

    try {
      const response = await this.fetchWithRetries(urlWithParams.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          Authorization: this.botClient.getAuthorization() + "",
        },
      }, 1, 'GET');

      const duration = Date.now() - startTime;
      const responseData = await response.json();

      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        };
        onResponse();
        return;
      }

      Logger.logApiSuccess(rtmUrl, 'GET', {
        messageCount: responseData?.length || 0,
        hasData: !!responseData
      }, duration);

      // Create axios-like response object for compatibility
      const axiosResponse = {
        data: this.processHistoryResponse(responseData, botName, botId),
        status: response.status,
        statusText: response.statusText,
        headers: {},
      };
      onResponse(axiosResponse);
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(rtmUrl, 'GET', e, duration);
      onResponse();
    }
  }

  private processHistoryResponse = (botHistory: any, botName: string, botId: string): any => {
    let msgs: any[] = [];
    console.log('BotHistory >>> ' + JSON.stringify(botHistory));
    if (!botHistory.messages) return [];
    const moreHistory = botHistory.moreAvailable;
    const icon: string = botHistory.icon;
    const messages: any[] = botHistory.messages;
    if (messages) {
      for (const msg of messages) {
        const components: any[] = msg.components;
        const data = (components[0].data.text ? components[0].data.text : '').replaceAll('&quot;', '\"');
        let botMessage: any;
        if (msg.type == 'outgoing') {
          if (!data) continue;
          botMessage = this.createBotResponse(data, icon, msg.createdOn, msg._id, botName, botId);
        } else {
          const tags: any = msg.tags;
          const altText: any[] = tags.altText
          const renderMsg = altText ? altText[0] ? altText[0].value : null : null;
          botMessage = this.createBotRequest(msg._id, data, msg.createdOn, botName, botId, renderMsg);
        }
        msgs.push(botMessage);
      }
    }
    msgs = [...msgs].sort((a, b) => b.timeMillis - a.timeMillis);
    return { botHistory: msgs, moreAvailable: moreHistory };
  }

  private createBotResponse = (data: any, icon: string, createdOn: string, msgId: string, botName: string, botId: string): any => {
    let payloadOuter: any;
    try {
      payloadOuter = JSON.parse(data);
    } catch (exception: any) {
      payloadOuter = { text: data };
    }
    const componentModel = { type: 'template', payload: payloadOuter };
    const componentInfo = { body: payloadOuter };
    const messageArray: any[] = [];
    const message = { type: 'text', component: componentModel, cInfo: componentInfo };
    messageArray.push(message);
    const botInfo = { botName: botName, taskBotId: botId, customData: null, channelClient: Platform.OS };
    return {
      type: 'bot_response',
      timeMillis: new Date(createdOn).getTime(),
      messageId: msgId,
      message: messageArray,
      from: 'bot',
      isSend: false,
      icon: icon,
      createdOn: createdOn,
      botInfo: botInfo
    };
  }

  private createBotRequest = (msgId: string, message: string, createdOn: string, botName: string, botId: string, renderMsg?: string): any => {
    const component = {
      type: 'text',
      payload: {
        text: renderMsg ? renderMsg : message,
        attachments: '',
        createdOn: createdOn
      }
    };
    const botMessage = {
      type: 'text',
      component: component,
      clientMessageId: new Date(createdOn).getTime()
    };
    const botInfo = { botName: botName, taskBotId: botId, customData: null, channelClient: Platform.OS };
    return {
      type: 'user_message',
      timeMillis: new Date(createdOn).getTime(),
      messageId: msgId,
      message: [botMessage],
      resourceId: "/bot.message",
      botInfo: botInfo,
      createdOn: createdOn,
      client: Platform.OS,
      isSend: true
    };
  }

  public async subscribePushNotifications(deviceId?: string): Promise<boolean> {
    if (!deviceId) {
      Logger.logConnectionError('Push notification subscription Failed', "deviceId is not VALID!");
      return false;
    }

    Logger.debug('Subscribe notications', "is in-progress");
    let url = `/api/users/${this.botClient.getUserId()}/sdknotifications/subscribe`;
    let subscribeUrl = this.baseUrl + url;

    const startTime = Date.now();
    let payload = { osType: Platform.OS, deviceId: deviceId };

    Logger.logApiRequest(subscribeUrl, 'POST', {});

    const headers = { Authorization: `bearer ${this.botClient.getAccessToken()}` };

    try {
      const response = await this.fetchWithRetries(subscribeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        body: JSON.stringify(payload),
      }, 1, 'POST');

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
      return true;
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(subscribeUrl, 'POST', e, duration);
      Logger.logConnectionError('Push notification subscription Failed', e);
      return false;
    }
  }

  public async unsubscribePushNotifications(deviceId?: string): Promise<boolean> {
    if (!deviceId) {
      Logger.logConnectionError('Push notification unsubscription Failed', "deviceId is not VALID!");
      return false;
    }

    Logger.debug('Unsubscribe notications', "is in-progress");

    let url = `/api/users/${this.botClient.getUserId()}/sdknotifications/unsubscribe`;
    let subscribeUrl = this.baseUrl + url;

    const startTime = Date.now();
    let payload = { osType: Platform.OS, deviceId: deviceId };

    Logger.logApiRequest(subscribeUrl, 'POST', {});

    const headers = {
      Authorization: `bearer ${this.botClient.getAccessToken()}`,
      "Content-type": "application/json",
      "X-HTTP-Method-Override": "DELETE"
    };

    try {
      const response = await this.fetchWithRetries(subscribeUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...headers,
        },
        body: JSON.stringify(payload),
      }, 1, 'POST');

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
      return true;
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(subscribeUrl, 'POST', e, duration);
      Logger.logConnectionError('Push notification unsubscription Failed', e);
      return false;
    }
  }

  async getJwtToken(config: BotConfigModel, isFirstTime: boolean = true, onResponse: (jwtToken: string) => void, onError: (error: any) => void): Promise<boolean> {
    const body = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      identity: config.identity,
      aud: config.value_aud,
      isAnonymous: false,
    };

    const botUrl = this.botClient.getJwtServerUrl();
    let jwtAuthorizationUrl = botUrl + 'users/sts';

    const startTime = Date.now();
    Logger.logApiRequest(jwtAuthorizationUrl, 'POST', {
      clientId: body.clientId,
      identity: body.identity,
      aud: body.aud,
      isAnonymous: body.isAnonymous
    });

    try {
      const response = await this.fetchWithRetries(jwtAuthorizationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      }, 1, 'POST');

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

      onResponse(responseData.jwt);
      return true;
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(jwtAuthorizationUrl, 'POST', e, duration);
      Logger.logConnectionError('JWT Token Generation Failed', e);

      onError('Connection to the bot failed. Please ensure your configuration is valid and try again.');
      return false;
    }
  }

  async getJwtGrant(jwtToken: String, isReconnectionAttempt: boolean, onStatus: any, onResponse: (response: any) => void, onError: (error: any) => void): Promise<boolean> {
    Logger.logConnectionEvent('JWT grant Authorization Started', {
      isReconnectionAttempt,
      tokenLength: jwtToken.length
    });
    onStatus(RTM_EVENT.CONNECTING);

    this.baseUrl = this.botClient.getBotUrl();
    let jwtAuthorizationUrl = this.baseUrl + '/api/oAuth/token/jwtgrant';

    const startTime = Date.now();
    let payload = { assertion: jwtToken, botInfo: this.botClient.getBotInfo() };

    Logger.logApiRequest(jwtAuthorizationUrl, 'POST', {
      botId: this.botClient.getBotInfo()?.taskBotId,
      botName: this.botClient.getBotInfo()?.botName
    });

    try {
      const response = await this.fetchWithRetries(jwtAuthorizationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      }, 1, 'POST');

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

      onResponse(responseData);
      return true;
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(jwtAuthorizationUrl, 'POST', e, duration);
      Logger.logConnectionError('JWT Grant Authorization Failed', e);
      onError('Connection to the bot failed. Please ensure your configuration is valid and try again.')
      return false;
    }
  }

  async getRtmUrl(isReconnectionAttempt: boolean, onResponse: (response: any) => void, onError: (error: any) => void): Promise<void> {
    let rtmUrl = this.baseUrl + '/api/rtm/start';
    let payload = { botInfo: this.botClient.getBotInfo() };

    const startTime = Date.now();
    Logger.logApiRequest(rtmUrl, 'POST', {
      botId: this.botClient.getBotInfo()?.taskBotId,
      botName: this.botClient.getBotInfo()?.botName,
      isReconnectionAttempt
    });

    try {
      const response = await this.fetchWithRetries(rtmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: this.botClient.getAuthorization() + "",
        },
        body: JSON.stringify(payload),
      }, 1, 'POST');

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

      onResponse(responseData);
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(rtmUrl, 'POST', e, duration);
      onError(e);
    }
  }

  async getSettings(onResponse: any) {
    let urlString =
      this.baseUrl + '/searchassistapi/searchsdk/stream/' + this.botClient.getBotInfo().taskBotId +
      '/' +
      this.botClient.getBotInfo().searchIndexId +
      '/getresultviewsettings';

    const startTime = Date.now();
    Logger.logApiRequest(urlString, 'GET', {
      taskBotId: this.botClient.getBotInfo().taskBotId,
      searchIndexId: this.botClient.getBotInfo().searchIndexId
    });

    try {
      const response = await this.fetchWithRetries(urlString, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          Authorization: this.botClient.getAuthorization() + "",
          auth: '',
        },
      }, 1, 'GET');

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
        onResponse(responseData?.settings)
        // this.resultViewSettings = responseData?.settings;
      }
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(urlString, 'GET', e, duration);
    }
  }
}
