import { BotClient } from './BotClient';
import { IBotClient } from './IBotClient';

export class KoreBotClient extends BotClient implements IBotClient {
  private static _instance: any;
  private static localBrandingDictionary?: any;

  private constructor() {
    super();
  }
  public static getInstance(): KoreBotClient {
    if (this._instance == null) {
      this._instance = new KoreBotClient();
    }
    return this._instance;
  }

  public static disconnectClient() {
    this._instance.disconnect();
    this._instance = null;
  }

  setSessionActive(isActive: boolean) {
    super.setSessionActive(isActive);
  }

  setAppState(_appState: string) {
    super.setAppState(_appState);
  }

  setIsNetworkAvailable(isNetWorkAvailable: boolean) {
    super.setIsNetworkAvailable(isNetWorkAvailable);
  }

  checkSocketAndReconnect() {
    super.checkSocketAndReconnect();
  }

  public static setLocalBranding(branding: any) {
    this.localBrandingDictionary = branding;
  }

  public static getLocalBranding(): any {
    return this.localBrandingDictionary;
  }

}
