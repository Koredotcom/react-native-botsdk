import uuid from 'react-native-uuid';
import {BotConfigModel} from 'rn-kore-bot-socket-sdk';

export const botConfig: BotConfigModel = {
  botName: 'SDK V3 All Templates',
  botId: 'st-027b5770-6ff0-5d9f-a3df-89254b012a55',
  clientId: 'cs-c334ce38-b4ad-5027-861e-1d8150508bfa',
  clientSecret: 'ItUgs7N4wN013LAxSxJlAKmj7K8uZnojBC7ZSCwpmZ4=',
  botUrl: 'https://platform.kore.ai',
  identity: uuid.v4() + '',
  isWebHook: false,
  value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
};