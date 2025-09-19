export interface BotConfigModel {
  botName: string;
  botId: string;
  clientId: string;
  clientSecret: string;
  botUrl: string;
  identity: string;
  jwtServerUrl: string;
  isWebHook: boolean;
  value_aud: string;
  isHeaderVisible: boolean;
  isFooterVisible: boolean;
  jwtToken?: string
}
