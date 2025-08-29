import { BotConfigModel } from 'rn-kore-bot-socket-lib-v77';

export const botConfig_f: BotConfigModel = {
  botName: 'PLEASE_ENTER_BOT_NAME',
  botId: 'PLEASE_ENTER_BOT_ID',
  clientId: 'PLEASE_ENTER_CLIENT_ID',
  clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',
  botUrl: 'PLEASE_ENTER_SERVER_URL', // Should not end with '/', Example :  https://your.server.url
  jwtServerUrl: 'PLEASE_ENTER_JWT_SERVER_URL',
  identity: '1234567890',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize',
  isHeaderVisible: true,
  isFooterVisible: true
};

export const botConfig: BotConfigModel = {
  botName: 'SDK V3 All Templates',
  botId: 'PLEASE_ENTER_BOT_ID',
  clientId: 'PLEASE_ENTER_CLIENT_ID',,
  clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',,
  botUrl: 'https://platform.kore.ai',
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
  identity: '1234567890',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize',
  isHeaderVisible: true,
  isFooterVisible: true
};