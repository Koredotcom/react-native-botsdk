import uuid from 'react-native-uuid';
import {BotConfigModel} from 'rn-kore-bot-socket-sdk';

export const botConfig: BotConfigModel = {
  botName: 'SDK V3 All Templates',
  botId: 'PLEASE_ENTER_BOT_ID',
  clientId: 'PLEASE_ENTER_CLIENT_ID',,
  clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',,
  botUrl: 'https://platform.kore.ai',
  identity: uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
};
