import {Platform} from 'react-native';

// for upload files
export const MAX_SOURCE_LIMIT = 1;
export const LIMIT_MESSAGE =
  'Only ' + MAX_SOURCE_LIMIT + ' sources are allowed';
export const MAX_FILE_NAME_LENGTH = 24;
export const FILE_CONTEXT: string = 'workflows';
export const attach_menu_buttons = [
  {
    id: 1,
    title: 'Take Photo',
  },
  {
    id: 2,
    title: 'Upload Photo',
  },
  {
    id: 3,
    title: 'Upload File',
  },
  {
    id: 4,
    title: 'Upload Video',
  },
];

export const HeaderIconsId = {
  BACK: 'BACK',
  HELP: 'HELP',
  LIVE_AGENT: 'live_agent',
  MINIMISE: 'Minimise',
  CLOSE: 'CLOSE',
  THREE_DOTS: 'THREE_DOTS',
  RECONNECT: 'Reconnect',
  EXPAND: 'Expand',
};
export const ChatHeaderType = {
  COMPACT: 'compact',
  LARGE: 'large',
  MEDIUM: 'medium',
  REGULAR: 'regular',
};

export const SHOW_BUTTONS_LIMIT: number = 4;

export const MAX_INPUT_TEXT_LENGTH: number = 256;

export const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 30,
  android: 30,
});
export const MIN_TOOL_BAR_HEIGHT = Platform.select({
  ios: 76,
  android: 72,
});
export const MAX_TOOL_BAR_HEIGHT = Platform.select({
  ios: 180,
  android: 180,
});

export const MIN_HEADER_HEIGHT = Platform.select({
  ios: 55,
  android: 55,
  web: 34,
});
export const BRANDING_RESPONSE_FILE = 'branding';
export const MAX_COMPOSER_HEIGHT = 200;
export const DEFAULT_PLACEHOLDER = 'Type a message';
export const DATE_FORMAT = 'll';
export const TIME_FORMAT = 'LT, ddd';
export const BOT_ICON_URL = 'BOT_ICON_URL';

export const URL_VERSION = '/1.1';

// export const RTM_EVENT = {
//   CONNECTING: 'connecting',
//   AUTHENTICATED: 'authenticated',
//   ON_OPEN: 'on_open',
//   ON_DISCONNECT: 'disconnect',
//   ON_CLOSE: 'on_close',
//   ON_ERROR: 'on_error',
//   ON_MESSAGE: 'on_message',
//   ON_FAILURE: 'failure',
//   PING: 'ping',
//   PONG: 'pong',
//   ERROR: 'error',
//   RECONNECTING: 'reconnecting',
//   UNABLE_TO_RTM_START: 'unable_to_rtm_start',
//   GET_HISTORY: 'get_history',
//   GET_RESULT_VIEW_SETTINGS: 'result_view_settings',
//   ON_ACK: 'ack',
// };

export const TEMPLATE_TYPES = {
  TEXT: 'text',
  BUTTON: 'button',
  CUSTOM: 'custom',
  OTHER: 'other',
  AUDIO_MESSAGE: 'message',
  VIDEO_MESSAGE: 'video_message',
  LINK_MESSAGE: 'link',
  IMAGE_MESSAGE: 'image',
  CARD_TEMPLATE: 'cardTemplate',
  LIST_TEMPLATE: 'list',
  IMAGE_TEMPLATE: 'image',
  TABLE_TEMPLATE: 'table',
  QUICK_REPLIES: 'quick_replies',
  HIDDEN_DIALOG: 'hidden_dialog',
  ERROR_TEMPLATE: 'error',
  CAROUSEL_TEMPLATE: 'carousel',
  LIVE_AGENT_TEMPLATE: 'live_agent',
  SYSTEM_TEMPLATE: 'SYSTEM',
  START_TIMER: 'start_timer',
  ADVANCED_LIST_TEMPLATE: 'advancedListTemplate',
  MINI_TABLE_TEMPLATE: 'mini_table',
  BAR_CHART_TEMPLATE: 'barchart',
  PIE_CHART_TEMPLATE: 'piechart',
  LINE_CHART_TEMPLATE: 'linechart',
  DATE_TEMPLATE: 'dateTemplate',
  DATE_RANGE_TEMPLATE: 'daterange',
  TABLE_LIST_TEMPLATE: 'tableList',
  ADVANCED_MULTI_SELECT_TEMPLATE: 'advanced_multi_select',
  MULTI_SELECT_TEMPLATE: 'multi_select',
  RADIO_OPTION_TEMPLATE: 'radioOptionTemplate',
  LIST_VIEW_TEMPLATE: 'listView',
  DROPDOWN_TEMPLATE: 'dropdown_template',
  FEEDBACK_TEMPLATE: 'feedbackTemplate',
  FORM_TEMPLATE: 'form_template',
  CLOCK_TEMPLATE: 'clockTemplate',
  LISTWIDGET_TEMPLATE: 'listWidget',
  USER_ATTACHEMENT_TEMPLATE: 'user_attachement',
  ARTICLE_TEMPLATE: 'articleTemplate',
  ANSWER_TEMPLATE: 'answerTemplate',
  OTP_TEMPLATE: 'otpValidationTemplate',
  RESET_PIN_TEMPLATE: 'resetPinTemplate',
  DIGITALFORM_TEMPLATE: 'digitalform',
};

export const RENDER_KORA_BUBBLE = 'RENDER_KORA_BUBBLE';
export const KORA_ITEM_CLICK = 'KORA_ITEM_CLICK';

export interface ButtonTheme {
  ACTIVE_BG_COLOR: any;
  ACTIVE_TXT_COLOR: any;
  INACTIVE_BG_COLOR: any;
  INACTIVE_TXT_COLOR: any;
}

export interface HEADER_ICON {
  ICON_1: 'icon-1';
  ICON_2: 'icon-2';
  ICON_3: 'icon-3';
  ICON_4: 'icon-4';
}

export interface BubbleTheme {
  BUBBLE_LEFT_BG_COLOR: any;
  BUBBLE_LEFT_TEXT_COLOR: any;
  BUBBLE_RIGHT_BG_COLOR: any;
  BUBBLE_RIGHT_TEXT_COLOR: any;
}

export const WelcomeHeaderConstants = {
  COMPACT: 'compact',
  LARGE: 'large',
  MEDIUM: 'medium',
  REGULAR: 'regular',
};
