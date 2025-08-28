export {
  RTM_EVENT,
  ConnectionState,
  APP_STATE,
} from '../bot-sdk/constants/Constant';
import { KoreBotClient } from '../bot-sdk/rtm/KoreBotClient';

export type { BotConfigModel } from '../bot-sdk/model/BotConfigModel';

export { ActiveThemeAPI } from '../bot-sdk/branding/ActiveThemeAPI';

// Export Logger for consumers to access logs and control log levels
export { Logger, LogLevel } from '../bot-sdk/utils/Logger';
export type { LogEntry } from '../bot-sdk/utils/Logger';

export { default as ApiService } from "../bot-sdk/api/ApiService";

export default KoreBotClient;
