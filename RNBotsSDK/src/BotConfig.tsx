import { BotConfigModel } from '../bot-sdk/model/BotConfigModel';

export const botConfig: BotConfigModel = {
  botName: 'PLEASE_ENTER_BOT_NAME',
  botId: 'PLEASE_ENTER_BOT_ID',
  clientId: 'PLEASE_ENTER_CLIENT_ID',
  clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',
  botUrl: 'PLEASE_ENTER_SERVER_URL',
  jwtServerUrl: 'PLEASE_ENTER_JWT_SERVER_URL',
  identity: 'PLEASE_ENTER_UNIQUE_IDENTITY', // uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
  isHeaderVisible: true,
  isFooterVisible: true,
};

export const botConfig_sit: BotConfigModel = {
  botName: 'PLEASE_ENTER_BOT_NAME',
  botId: 'PLEASE_ENTER_BOT_ID',
  clientId: 'PLEASE_ENTER_CLIENT_ID',
  clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',
  botUrl: 'PLEASE_ENTER_SERVER_URL',
  jwtServerUrl: 'PLEASE_ENTER_JWT_SERVER_URL',
  identity: 'PLEASE_ENTER_UNIQUE_IDENTITY', // uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
  isHeaderVisible: true,
  isFooterVisible: true,
};
