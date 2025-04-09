export {
  RTM_EVENT,
  ConnectionState,
  APP_STATE,
} from '../bot-sdk/constants/Constant';
import {KoreBotClient} from '../bot-sdk/rtm/KoreBotClient';

export type {BotConfigModel} from '../bot-sdk/model/BotConfigModel';

export {ActiveThemeAPI} from '../bot-sdk/branding/ActiveThemeAPI';

///export type {ConnectionState} from '../bot-sdk/rtm/BotClient';

//export type BotConfigModel;

export default KoreBotClient;
