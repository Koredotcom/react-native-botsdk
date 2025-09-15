// Using native fetch() API instead of axios
import { BotConfigModel } from '../model/BotConfigModel';
import { KoreBotClient } from '../rtm/KoreBotClient';
import { APP_STATE, RTM_EVENT } from '../constants/Constant';
import Logger from '../utils/Logger';
// import KoreBotClient, {
//   APP_STATE,
//   ConnectionState,
//   RTM_EVENT,
// } from 'react-native-kore-bot-socket-dev';
// import {BotConfigModel} from 'react-native-kore-bot-socket-dev';
// import {URL_VERSION} from '../../constants/Constant';

const MAX_RETRIES = 5;

export class ActiveThemeAPI {
  private isSocketACtive: boolean = false;

  private async fetchWithRetries(
    url: string,
    options: RequestInit | undefined,
    retries = 1,
    method = 'GET',
  ): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (retries <= MAX_RETRIES) {
        const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), MAX_RETRIES) * 1000;
        await new Promise((resolve) => setTimeout(() => resolve(undefined), delay));
        Logger.logApiError(url, method, err, delay);
        return this.fetchWithRetries(url, options, retries + 1, method);
      } else {
        throw new Error(`Max retries exceeded. error: ${err}`);
      }
    }
  }
  public async getThemeAPI(botConfig: BotConfigModel, callback = (data?: any) => { }): Promise<void> {
    Logger.info('Theme API - Getting theme for bot', {
      botId: botConfig.botId,
      botName: botConfig.botName,
      hasAuthorization: !!KoreBotClient.getInstance().getAuthorization()
    });

    if (KoreBotClient.getInstance().getAuthorization()) {
      Logger.info('Theme API - Using existing authorization');
      this.isSocketACtive = true;
      await this.getAppTheme(botConfig, callback);
    } else {
      Logger.info('Theme API - No authorization, initializing bot client');
      KoreBotClient.getInstance().setAppState(APP_STATE.SLEEP);
      KoreBotClient.getInstance()
        .once(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED, async () => {
          Logger.info('Theme API - JWT token authorized, fetching theme');
          await this.getAppTheme(botConfig, callback);
        });

      // KoreBotClient.getInstance().initializeBotClient(botConfig);
    }
  }

  private getAppTheme = async (
    botConfig: BotConfigModel,
    callback = (data?: any) => { },
  ): Promise<void> => {
    let themeurl =
      botConfig.botUrl +
      '/api/websdkthemes/' +
      botConfig.botId +
      '/activetheme';

    const startTime = Date.now();
    Logger.logApiRequest(themeurl, 'GET', {
      botId: botConfig.botId,
      isSocketActive: this.isSocketACtive
    });

    const urlWithParams = new URL(themeurl);
    urlWithParams.searchParams.append('botId', botConfig.botId);

    try {
      const response = await this.fetchWithRetries(urlWithParams.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          Authorization: KoreBotClient.getInstance().getAuthorization() || '',
          state: 'published',
          'Accepts-version': '1',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json',
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

      Logger.logApiSuccess(themeurl, 'GET', {
        hasThemeData: !!responseData,
        themeId: responseData?.themeId,
        themeName: responseData?.name
      }, duration);

      callback(responseData);
      if (!this.isSocketACtive) {
        Logger.info('Theme API - Disconnecting bot client after theme retrieval');
        KoreBotClient.disconnectClient();
      }
    } catch (e: any) {
      const duration = Date.now() - startTime;
      Logger.logApiError(themeurl, 'GET', e, duration);

      callback(null);
      if (!this.isSocketACtive) {
        Logger.info('Theme API - Disconnecting bot client after theme error');
        KoreBotClient.disconnectClient();
      }
    }
  };
}
