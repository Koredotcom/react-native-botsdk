import { BotConfigModel } from 'rn-kore-bot-socket-lib-v79';

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
  botName: 'SDK',
  botId: 'st-b9889c46-218c-58f7-838f-73ae9203488c',
  clientId: 'cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9',
  clientSecret: '5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=',
  botUrl: 'https://bots.kore.ai',
  identity: '1234567890',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
  isHeaderVisible: true,
  isFooterVisible: true,
};
