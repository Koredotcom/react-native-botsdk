import { EventEmitter } from 'events';
import { BotConfigModel } from '../model/BotConfigModel';

export interface IBotClient {
  sendMessage(message: any, payload?: any, attachments?: any): any;
  reconnect(
    isReconnectionAttempt: boolean,
    resetReconnectAttemptCount?: boolean,
  ): any;
  setIsNetworkAvailable(setNetWork: boolean): any;
  initializeBotClient(model: BotConfigModel, isFirstTime: boolean): any;
  disconnect(): any;
  setSessionActive(isActive: boolean): any;
  setAppState(appState: string): any;
  checkSocketAndReconnect(): any;
  getBotUserIdentity(): any;
  getConnectionState(): any;
  getBotName(): string | undefined;
  getBotUrl(): string | undefined;
  getUserId(): string;
  getAccessToken(): string;
  getAuthorization(): string | undefined;
  getAppState(): string | undefined;
  sendEvent(eventName: any, isZenDeskEvent?: any): void;
  enableLogger(): void;
  disableLogger(): void;
  isLoggerEnabled(): boolean;
}
