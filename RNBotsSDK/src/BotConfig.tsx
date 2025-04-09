import uuid from 'react-native-uuid';
import {BotConfigModel} from '../bot-sdk/model/BotConfigModel';

export const botConfig: BotConfigModel = {
  botName: 'SDK',
  botId: 'st-b9889c46-218c-58f7-838f-73ae9203488c',
  clientId: 'cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9',
  clientSecret: '5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=',
  botUrl: 'https://bots.kore.ai',
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
  identity: uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
};

export const botConfig_sit: BotConfigModel = {
  botName: 'Theme Bot',
  botId: 'st-55fcafbe-053a-5d20-828f-f05166e0133d',
  clientId: 'cs-68138a95-1273-587d-bfaa-eaabb2b7545a',
  clientSecret: '0Ow+ajipoXqyihVWhGyq64oSZewXwBcj20aBfAKSLUQ=',
  botUrl: 'https://sit-xo.kore.ai',
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
  identity: uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
};

// "Theme Bot",
// "st-55fcafbe-053a-5d20-828f-f05166e0133d",
// "cs-68138a95-1273-587d-bfaa-eaabb2b7545a",
// "0Ow+ajipoXqyihVWhGyq64oSZewXwBcj20aBfAKSLUQ=",
// "https://sit-xo.kore.ai/"

// botName: 'BotName',
// botId: 'st-333122c9-4be8-5261-8b7e-6a3c2ad8cc0d',
// clientId: 'cs-1e38e7d9-20bd-579a-9a7c-9ec6777a39e2',
// clientSecret: 'Ryx1U4CDP/tozxD4+0EdzsUl78qU7m72iNVdRUQXdHY=',
// botUrl: 'https://bots.kore.ai',
// identity: uuid.v4() + '',
// isWebHook: false,
// value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
