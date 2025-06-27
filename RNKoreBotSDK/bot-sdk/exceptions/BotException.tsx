export default class BotException extends Error {
  constructor() {
    let message =
      "Bot socket not connected, Please call 'BotClient.initializeBotClient' with proper values.";
    super(message);
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, BotException);
    // }
    this.name = 'BotException';
  }
}
