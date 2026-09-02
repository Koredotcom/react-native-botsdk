// Conditionally initialize react-native-svg to prevent NativeEventEmitter errors
try {
  require('react-native-svg');
} catch (error) {
  console.warn('react-native-svg not available, SVG features will be disabled');
}

export * from '../bot-sdk/constants/Constant';
export * from '../bot-sdk/theme/IThemeType';
export * from '../bot-sdk/templates/BotTemplate';
export * from '../bot-sdk/templates/CustomTemplate';

export {default as BotTemplate} from '../bot-sdk/templates/BotTemplate';
//import BotTemplate from '../bot-sdk/templates/BotTemplate';

import KoreChat from '../bot-sdk/chat/KoreChat';

// Public socket/configuration API used by host applications.
export {default as KoreBotClient, RTM_EVENT, APP_STATE} from 'rn-kore-bot-socket-lib-v79';
export type {BotConfigModel} from 'rn-kore-bot-socket-lib-v79';

export {default as QuickReplies} from '../bot-sdk/templates/QuickReplies';

export {default as CustomTemplate} from '../bot-sdk/templates/CustomTemplate';

export {default as InputToolbar} from '../bot-sdk/chat/components/InputToolbar';

export { UUID } from '../bot-sdk/utils/uuid';

// Lazy loading components
export {default as LazyCommunications, useLazyCommunications, FallbackCommunications, FallbackCommunicationsAPI} from '../bot-sdk/components/LazyCommunications';
export {default as LazySound, useLazySound, FallbackSound, FallbackSoundAPI} from '../bot-sdk/components/LazySound';

// Voice Recognition
export {default as CustomVoiceRecognition} from '../bot-sdk/utils/CustomVoiceRecognition';

export default KoreChat;
