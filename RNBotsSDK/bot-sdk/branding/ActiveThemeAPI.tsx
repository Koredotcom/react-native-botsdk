import axios from 'axios';
import {BotConfigModel} from '../model/BotConfigModel';
import {KoreBotClient} from '../rtm/KoreBotClient';
import {APP_STATE, RTM_EVENT} from '../constants/Constant';
// import KoreBotClient, {
//   APP_STATE,
//   ConnectionState,
//   RTM_EVENT,
// } from 'react-native-kore-bot-socket-dev';
// import {BotConfigModel} from 'react-native-kore-bot-socket-dev';
// import {URL_VERSION} from '../../constants/Constant';

export class ActiveThemeAPI {
  private isSocketACtive: boolean = false;
  public getThemeAPI(botConfig: BotConfigModel, callback = (data?: any) => {}) {
    if (KoreBotClient.getInstance().getAuthorization()) {
      this.isSocketACtive = true;
      this.getAppTheme(botConfig, callback);
    } else {
      KoreBotClient.getInstance().setAppState(APP_STATE.SLEEP);
      KoreBotClient.getInstance()
        .getEmitter()
        .once(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED, () => {
          this.getAppTheme(botConfig, callback);
        });

      KoreBotClient.getInstance().initializeBotClient(botConfig);
    }
  }

  private getAppTheme = (
    botConfig: BotConfigModel,
    callback = (data?: any) => {},
  ) => {
    //https://platform.kore.ai/api/websdkthemes/st-f59fda8f-e42c-5c6a-bc55-3395c109862a/activetheme

    // KoreBotClient.getInstance().initializeBotClient(botConfig);
    //         state: published
    // Accepts-version: 1
    // Accept-Language: en_US
    // botid: st-f59fda8f-e42c-5c6a-bc55-3395c109862a
    // Content-Type: application/json

    let themeurl =
      botConfig.botUrl +
      '/api/websdkthemes/' +
      botConfig.botId +
      '/activetheme';
    axios
      .get(themeurl, {
        params: {
          botId: botConfig.botId,
        },
        headers: {
          Authorization: KoreBotClient.getInstance().getAuthorization() || '',
          state: 'published',
          'Accepts-version': '1',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // console.log(
        //   'getAppTheme response ---->',
        //   JSON.stringify(response?.data),
        // );
        callback(response?.data);
        if (!this.isSocketACtive) {
          KoreBotClient.disconnectClient();
        }
      })
      .catch(e => {
        console.log('getAppTheme error ---->', e);
        callback(null);
        if (!this.isSocketACtive) {
          KoreBotClient.disconnectClient();
        }
      });
  };
}
