import uuid from 'react-native-uuid';
import {BotConfigModel} from 'rn-kore-bot-socket-sdk-dev-ch';

export const botConfig: BotConfigModel = {
  botName: 'SDK',
  botId: 'PLEASE_ENTER_BOT_ID',
  clientId: 'PLEASE_ENTER_CLIENT_ID',,
  clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',
  botUrl: 'https://bots.kore.ai',
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
  identity: uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
};

export const botConfig_sit: BotConfigModel = {
  botName: 'Theme Bot',
  botId: 'st-55fcafbe-053a-5d20-828f-f05166e0133d',
  clientId: 'PLEASE_ENTER_CLIENT_ID',,
  clientSecret: '0Ow+ajipoXqyihVWhGyq64oSZewXwBcj20aBfAKSLUQ=',
  botUrl: 'https://sit-xo.kore.ai',
  jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
  identity: uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
};

// "Theme Bot",
// "st-55fcafbe-053a-5d20-828f-f05166e0133d",
// "PLEASE_ENTER_CLIENT_ID",
// "0Ow+ajipoXqyihVWhGyq64oSZewXwBcj20aBfAKSLUQ=",
// "https://sit-xo.kore.ai/"

// botName: 'BotName',
// botId: 'st-333122c9-4be8-5261-8b7e-6a3c2ad8cc0d',
// clientId: 'PLEASE_ENTER_CLIENT_ID',,
// clientSecret: 'Ryx1U4CDP/tozxD4+0EdzsUl78qU7m72iNVdRUQXdHY=',
// botUrl: 'https://bots.kore.ai',
// identity: uuid.v4() + '',
// isWebHook: false,
// value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
