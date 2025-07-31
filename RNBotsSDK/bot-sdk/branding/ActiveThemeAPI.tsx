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

export class ActiveThemeAPI {
  private isSocketACtive: boolean = false;
  public getThemeAPI(botConfig: BotConfigModel, callback = (data?: any) => { }) {
    Logger.info('Theme API - Getting theme for bot', {
      botId: botConfig.botId,
      botName: botConfig.botName,
      hasAuthorization: !!KoreBotClient.getInstance().getAuthorization()
    });

    if (KoreBotClient.getInstance().getAuthorization()) {
      Logger.info('Theme API - Using existing authorization');
      this.isSocketACtive = true;
      this.getAppTheme(botConfig, callback);
    } else {
      Logger.info('Theme API - No authorization, initializing bot client');
      KoreBotClient.getInstance().setAppState(APP_STATE.SLEEP);
      KoreBotClient.getInstance()
        .once(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED, () => {
          Logger.info('Theme API - JWT token authorized, fetching theme');
          this.getAppTheme(botConfig, callback);
        });

      KoreBotClient.getInstance().initializeBotClient(botConfig);
    }
  }

  private getAppTheme = (
    botConfig: BotConfigModel,
    callback = (data?: any) => { },
  ) => {
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

    fetch(urlWithParams.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        Authorization: KoreBotClient.getInstance().getAuthorization() || '',
        state: 'published',
        'Accepts-version': '1',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json',
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
      })
      .catch((e: any) => {
        const duration = Date.now() - startTime;
        Logger.logApiError(themeurl, 'GET', e, duration);

        callback(null);
        if (!this.isSocketACtive) {
          Logger.info('Theme API - Disconnecting bot client after theme error');
          KoreBotClient.disconnectClient();
        }
      });
  };
}
