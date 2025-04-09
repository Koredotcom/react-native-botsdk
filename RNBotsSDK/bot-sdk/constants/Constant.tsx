export const URL_VERSION = '/1.1';

export const RTM_EVENT = {
  CONNECTING: 'connecting',
  AUTHENTICATED: 'authenticated',
  ON_OPEN: 'on_open',
  ON_DISCONNECT: 'disconnect',
  ON_CLOSE: 'on_close',
  ON_ERROR: 'on_error',
  ON_MESSAGE: 'on_message',
  ON_FAILURE: 'failure',
  PING: 'ping',
  PONG: 'pong',
  ERROR: 'error',
  RECONNECTING: 'reconnecting',
  UNABLE_TO_RTM_START: 'unable_to_rtm_start',
  GET_HISTORY: 'get_history',
  GET_RESULT_VIEW_SETTINGS: 'result_view_settings',
  ON_ACK: 'ack',
  ON_JWT_TOKEN_AUTHORIZED: 'ON_JWT_TOKEN_AUTHORIZED',
};

export const ConnectionState = {
  CONNECTING: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
};

export const APP_STATE = {
  ACTIVE: 'active',
  SLEEP: 'sleep',
};
