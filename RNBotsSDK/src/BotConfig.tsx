import { BotConfigModel } from '../bot-sdk/model/BotConfigModel';

export const botConfig: BotConfigModel = {
  botName: 'Kore.ai Bot',
  botId: 'st-f59fda8f-e42c-5c6a-bc55-3395c109862a',
  clientId: 'cs-8fa81912-0b49-544a-848e-1ce84e7d2df6',
  clientSecret: 'DnY4BIXBR0Ytmvdb3yI3Lvfri/iDc/UOsxY2tChs7SY=',
  botUrl: 'https://platform.kore.ai',
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
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
