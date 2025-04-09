import {Platform} from 'react-native';

export default class BotInfoModel {
  constructor(
    public chatBot: string,
    public taskBotId: string,
    public customData: any,
    public channelClient: string = Platform.OS,
  ) {}
}
