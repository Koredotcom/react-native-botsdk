import * as React from 'react';
import {ReactNode, RefObject} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Keyboard,
  Dimensions,
  StatusBar,
  BackHandler,
  TouchableWithoutFeedback
} from 'react-native';
import uuid from '../utils/uuid';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import InputToolbar from './components/InputToolbar';
import MessageContainer from './components/MessageContainer';
import NetInfo from '@react-native-community/netinfo';
import {ThemeProvider} from '../theme/ThemeContext';
import {getBubbleTheme} from '../theme/themeHelper';
import {
  MIN_COMPOSER_HEIGHT,
  MAX_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  TIME_FORMAT,
  DATE_FORMAT,
  TEMPLATE_TYPES,
  KORA_ITEM_CLICK,
  LIMIT_MESSAGE,
  MAX_SOURCE_LIMIT,
  attach_menu_buttons,
  MAX_FILE_NAME_LENGTH,
  HeaderIconsId,
  BRANDING_RESPONSE_FILE,
} from '../constants/Constant';
import { LocalizationManager } from '../constants/Localization';

import KoreBotClient, {
  RTM_EVENT,
  BotConfigModel,
  APP_STATE,
  ActiveThemeAPI,
  ApiService,
} from 'rn-kore-bot-socket-lib-v77';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {
  getDrawableByExt,
  getItemId,
  getTemplateType,
  isBlackStatusBar,
  isWhiteStatusBar,
  normalize,
  renderImage,
} from '../utils/helpers';
import QuickReplies from '../templates/QuickReplies';
import Color from '../theme/Color';
import TableTemplate from '../templates/TableTemplate';
import {IThemeType} from '../theme/IThemeType';
import TypingIndicator from './components/BotTypingIndicator';
import ChatHeader from './components/header/ChatHeader';
import {isAndroid, isIOS} from '../utils/PlatformCheck';
import {
  documentPickIOSPermission,
  documentPickPermission,
} from '../utils/PermissionsUtils';
import FileUploadQueue from '../FileUploader/FileUploadQueue';

import * as Progress from 'react-native-progress';

import {SvgIcon} from '../utils/SvgIcon';
import FileIcon from '../utils/FileIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListViewTemplate from '../templates/ListViewTemplate';
import Toast from 'react-native-toast-message';
import CustomTemplate, {
  CustomViewProps,
  CustomViewState,
} from '../templates/CustomTemplate';
import Welcome from '../components/WelcomeScreen';
import CustomAlertComponent from '../components/CustomAlertComponent';
import TemplateBottomSheet from './components/TemplateBottomSheet';
import ArticleTemplate from '../templates/ArticleTemplate';
import { LazyLoader } from '../utils/LazyLoader';

let Sound: any = null;

try {
  Sound = require('react-native-sound').default;
  if (Sound) {
    Sound.setCategory('Playback');
    Sound.setActive(true);
  }
} catch (error) {
  // Sound not available
}

dayjs.extend(localizedFormat);

const imageFilesTypes = ['jpg', 'jpeg', 'png'];
const windowWidth = Dimensions.get('window').width;
var isAgentConnect = false;
var isMinimizedWindow = false
var historyMessages = 1;
interface KoraChatProps {
  messages?: any[];
  messagesContainerStyle?: any;
  text?: string | null;
  actionSheet: any;
  _actionSheetRef?: any;
  inverted: any;
  locale: string | null;
  isTyping?: boolean;
  onDragList: any;
  onSend: any;
  onInputTextChanged: any;
  renderSuggestionsView: any;
  renderMediaView: any;
  initialText?: any;
  minComposerHeight: number;
  textInputProps: any;
  maxInputLength: number;
  renderInputToolbar: any;
  renderComposer: any;
  renderSend: any;
  renderChatFooter: any;
  renderLoading: any;
  renderTypingIndicator: any;
  wrapInSafeArea: any;
  parsePatterns?: any;
  alignTop: boolean;
  alwaysShowSend?: boolean;
  scrollToBottom?: boolean;
  style?: any;
  onListItemClick?: any;
  onLongPress?: any;
  botConfig: BotConfigModel;
  renderQuickRepliesView?: any;
  renderChatHeader?: any;
  onHeaderActionsClick?: any;
  navigation?: any;
  route?: any;
  statusBarColor?: (colorCode: any) => void;
  templateInjection?: Map<
    string,
    CustomTemplate<CustomViewProps, CustomViewState>
  >;
}

interface KoraChatState {
  isInitialized: boolean;
  composerHeight: number;
  messagesContainerHeight: number | null;
  typingDisabled: boolean;
  text: string | null | undefined;
  messages: any[];
  isNetConnected?: boolean;
  showLoader?: boolean;
  quickReplies?: any;
  modalVisible?: boolean;
  viewMoreObj?: any;
  isBotResponseLoading?: boolean;
  menuItems?: any[];
  showAttachmentModal?: boolean;
  showSeeMoreModal?: boolean;
  progressObj?: any;
  isShowProgress?: boolean;
  mediaPayload?: any;
  onSTTValue?: any;
  currentTemplate?: any;
  currentTemplateData?: any;
  activetheme?: any;
  wlcomeModalVisible?: boolean;
  currentTemplateHeading?: any;
  themeData?: IThemeType;
  isTTSenable?: boolean;
  isReconnecting?: boolean;
  showBackButtonDialog?: boolean;
  showTemplateBottomSheet: boolean;
  messageBottomSheet?: any;
}

export default class KoreChat extends React.Component<
  KoraChatProps,
  KoraChatState
> {
  _messageContainerRef: RefObject<any> = React.createRef()
  private ttsModule: any = null;
  private isTTSAvailable: boolean = false;
  textInput: any = null;
  alertRef = React.createRef<CustomAlertComponent>();

  _isFirstLayout = true;
  _locale = 'en';
  invertibleScrollViewProps = {};
  _unsubscribeConn: any;
  backHandler: any;
  unsubscribeNavigation: any;
  allowNavigation: boolean = false;
  static defaultProps: {
    messagesContainerStyle: null;
    text: null;
    placeholder: string;
    disableComposer: boolean;
    messageIdGenerator: () => string | number[];
    user: {};
    onSend: undefined;
    timeFormat: string;
    dateFormat: string;
    loadEarlier: boolean;
    onLoadEarlier: () => void;
    isLoadingEarlier: boolean;
    renderLoading: null;
    renderLoadEarlier: null;
    renderAvatar: null;
    showUserAvatar: boolean;
    actionSheet: null;
    onPressAvatar: null;
    onLongPressAvatar: null;
    renderUsernameOnMessage: boolean;
    renderAvatarOnTop: boolean;
    onLongPress: null;
    renderMessage: null;
    renderMessageText: null;
    imageProps: {};
    videoProps: {};
    audioProps: {};
    lightboxProps: {};
    textInputProps: {};
    listViewProps: {};
    renderCustomView: null;
    isCustomViewBottom: boolean;
    renderDay: null;
    renderTime: null;
    renderFooter: null;
    renderChatEmpty: null;
    renderChatFooter: null;
    renderInputToolbar: null;
    renderComposer: null;
    renderActions: any;
    renderSend: null;
    renderAccessory: null;
    isKeyboardInternallyHandled: boolean;
    onPressActionButton: null;
    bottomOffset: number;
    minInputToolbarHeight: number;
    keyboardShouldPersistTaps: string;
    onInputTextChanged: null;
    maxInputLength: null;
    forceGetKeyboardHeight: boolean;
    inverted: boolean;
    extraData: null;
    minComposerHeight: number | undefined;
    maxComposerHeight: number;
    wrapInSafeArea: boolean;
    renderSuggestionsView: null;
    renderMediaView: null;
    Suggestions: never[];
    renderQuickRepliesView: null;
    onFormAction: null;
    renderTypingIndicator: null;
    renderSpeechToText: null;
    clickSpeechToText: null;
    onDragList: null;
    _actionSheetRef: null;
    locale: string | null;
    alignTop: boolean;
    initialText: undefined;
    onListItemClick: undefined;
    menuItems: [];
  };
  private _isChatMounted: boolean = false;

  private fileUploadQueue?: FileUploadQueue;

  private themApi: ActiveThemeAPI;

  constructor(props: KoraChatProps) {
    super(props);
    this.themApi = new ActiveThemeAPI();
    this.fileUploadQueue = undefined;
    isAgentConnect = false;

    this.state = {
      isInitialized: false,
      composerHeight: 0,
      messagesContainerHeight: 0,
      typingDisabled: false,
      text: '',
      messages: [],
      isNetConnected: false,
      showLoader: true,
      quickReplies: [],
      modalVisible: false,
      viewMoreObj: undefined,
      isBotResponseLoading: false,
      menuItems: undefined,
      showAttachmentModal: false,
      showSeeMoreModal: false,
      progressObj: {},
      isShowProgress: false,
      mediaPayload: [],
      onSTTValue: null,
      currentTemplate: null,
      currentTemplateData: null,
      activetheme: null,
      wlcomeModalVisible: false,
      currentTemplateHeading: undefined,
      isReconnecting: false,
      showBackButtonDialog: false,
      showTemplateBottomSheet: false,
      messageBottomSheet: null,
      isTTSenable: false
    };
  }


  private lazyLaunchCamera = async (options: any, callback: (response: any) => void) => {
    try {
      const { launchCamera } = await import('react-native-image-picker');
      launchCamera(options, callback);
    } catch (error) {
      console.warn('Failed to load ImagePicker:', error);
      const errorResponse = {
        errorMessage: 'Image picker not available',
        errorCode: 'module_not_available',
        didCancel: false
      };
      callback(errorResponse);
    }
  };

  private lazyDocumentPicker = async () => {
    try {
      const DocumentPickerModule = await import('react-native-document-picker');
      return DocumentPickerModule.default || DocumentPickerModule;
    } catch (error) {
      console.warn('Failed to load DocumentPicker:', error);
      return null;
    }
  };

  private getDocumentPickerTypes = async () => {
    try {
      const DocumentPickerModule = await import('react-native-document-picker');
      const DocumentPicker = DocumentPickerModule.default || DocumentPickerModule;
      return DocumentPicker?.types || {};
    } catch (error) {
      console.warn('Failed to load DocumentPicker types:', error);
      return {
        images: 'public.image',
        doc: 'com.microsoft.word.doc',
        docx: 'org.openxmlformats.wordprocessingml.document',
        plainText: 'public.plain-text',
        pdf: 'com.adobe.pdf',
        xls: 'com.microsoft.excel.xls',
        xlsx: 'org.openxmlformats.spreadsheetml.sheet',
        audio: 'public.audio',
        video: 'public.movie',
      };
    }
  };

  private handleDocumentTypeSelection = async (typeCategory: string) => {
    try {
      const types = await this.getDocumentPickerTypes();
      
      let typeArray: string[] = [];
      switch (typeCategory) {
        case 'images':
          typeArray = [types.images];
          break;
        case 'documents':
          typeArray = [
            types.doc,
            types.docx,
            types.plainText,
            types.pdf,
            types.xls,
            types.xlsx,
            types.audio,
          ];
          break;
        case 'video':
          typeArray = [types.video];
          break;
        default:
          console.warn('Unknown document type category:', typeCategory);
          return;
      }
      
      this.onAttachItemClick(typeArray);
    } catch (error) {
      console.error('Error handling document type selection:', error);
    }
  };

  private init = () => {
    if (!this.props.botConfig) {
      setTimeout(() => {
        try {
          if (this.props.navigation?.canGoBack?.()) {
            this.props.navigation?.goBack?.();
          } else {
            BackHandler.exitApp();
          }
        } catch (error) {
          BackHandler.exitApp();
        }
      }, 5000);
      return;
    }
    console.log('this.props.botConfig ------>:', this.props.botConfig);
    const botClient = KoreBotClient.getInstance();

    botClient.setAppState(APP_STATE.ACTIVE);
    botClient
      .once(RTM_EVENT.CONNECTING, () => {
        this.setState({
          showLoader: true,
        });
      });

    botClient
      .on(RTM_EVENT.ERROR, (data?: any) => {
        let message = data?.message
          ? data?.message
          : 'Connection to the bot failed. Please ensure your configuration is valid and try again.';

        this.showAlert('Alert', message, data?.isBack);

        return;
      });
    botClient
      .on(RTM_EVENT.ON_OPEN, (data: any) => {
        console.log('-----> SUCCESS TO KORA BOT CONNECTED <------:', data);
        if (isMinimizedWindow) {
          this.loadHistory();
          isMinimizedWindow = false;
        }
        this.getThemeData();
        this.setBotClientListeners();
        if (!data?.isReconnectionAttempt) {
          if (this.props.route?.params?.postUtterance) {
            setTimeout(() => {
              if (this.props.route?.params?.postUtterance) {
                this.onSend({
                  message: {text: this.props.route?.params?.postUtterance},
                });
              }
            }, 2000);
          }
        }

        if (this.state.isReconnecting) {
          this.setState({
            isReconnecting: false,
            showLoader: false,
          });
        } else if (this.state.showLoader) {
          this.setState({
            showLoader: false,
          });
        }

      });
    botClient.initializeBotClient(this.props.botConfig, !isMinimizedWindow);
  };

  private showAlert = (title: string, message: string, isBack?: boolean) => {
    const {current} = this.alertRef;
    if (current) {
      current?.showAlert?.(title, message, () => {
        if (isBack) {
          if (this.props.onHeaderActionsClick) {
            this.props.onHeaderActionsClick?.(HeaderIconsId.BACK);
          } else {
            this.onHeaderActionsClick(HeaderIconsId.BACK);
          }
        }
      });
    }
  };

  private saveThemeData = async (data: any) => {
    try {
      if (!data || data?.length === 0) {
        await AsyncStorage.removeItem(BRANDING_RESPONSE_FILE);
        console.log('KoreChat ============>>> Removed ThemeData Done');
      } else {
        const strData = JSON.stringify(data);
        await AsyncStorage.setItem(BRANDING_RESPONSE_FILE, strData);
        console.log('KoreChat ============>>> saveThemeData Done');
      }
    } catch (error) {
      console.log('KoreChat saveThemeData error --->:', error);
    }

    const preTheme = this.state.activetheme;

    this.setState(
      {
        showLoader: false,
        activetheme: data,
      },
      () => {
        if (!preTheme && data?.v3 && data?.v3?.welcome_screen?.show) {
          this.setState({
            wlcomeModalVisible: true,
          });
        }
      },
    );
  };

  private getThemeData = () => {
    this.themApi?.getThemeAPI(this.props.botConfig, (data: any) => {
      if (data?.v3) {
        this.saveThemeData(data);
        this.setState({
          showLoader: false,
          themeData: data,
        });
      } else {
        this.saveThemeData(null);
        this.setState({
          showLoader: false,
          themeData: undefined,
        });
      }
    });
  };

  static append(currentMessages: any = [], messages: any) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return messages.concat(currentMessages);
  }

  private handleBackPress = (): boolean => {
    if (!this.state.showBackButtonDialog) {
      this.setState({ showBackButtonDialog: true });
    }
    return true;
  };

  private handleDialogCancel = () => {
    this.setState({ showBackButtonDialog: false });
    this.allowNavigation = false; // Reset navigation flag
  };

  private handleDialogClose = () => {
    isMinimizedWindow = false
    this.setState({ showBackButtonDialog: false });
    if (isAgentConnect) {
      KoreBotClient.getInstance().sendEvent('close_agent_chat');
    } else {
      KoreBotClient.getInstance().sendEvent('close_button_event');
    }
    
    setTimeout(() => {
      try {
        if (this.props.navigation?.canGoBack?.()) {
          this.allowNavigation = true;
          this.props.navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
      } catch (error) {
        BackHandler.exitApp();
      }
    }, 100);
  };

  private handleDialogMinimize = () => {
    isMinimizedWindow = true
    this.setState({ showBackButtonDialog: false });
    KoreBotClient.getInstance().sendEvent('minimize_button_event');
    setTimeout(() => {
      try {
        if (this.props.navigation?.canGoBack?.()) {
          this.allowNavigation = true; // Set flag to allow navigation
          this.props.navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
      } catch (error) {
        BackHandler.exitApp();
      }
    }, 100);
  };

  componentDidMount() {
    const botClient = KoreBotClient.getInstance();
    this._unsubscribeConn = NetInfo.addEventListener(state => {
      const {isConnected} = state;
      if (!this.state.isNetConnected && isConnected) {
        setTimeout(() => {
          botClient.setIsNetworkAvailable(isConnected);
          botClient.checkSocketAndReconnect();
        }, 10);
      }

      this.setState({isNetConnected: isConnected ? isConnected : false});
    });
    botClient.setSessionActive(true);
    if (isAndroid) {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    if (this.props.navigation) {
      this.unsubscribeNavigation = this.props.navigation.addListener('beforeRemove', (e: any) => {
        if (this.allowNavigation) {
          this.allowNavigation = false;
          return; 
        }
        
        e.preventDefault();
        this.setState({ showBackButtonDialog: true });
      });
    }

    const {text} = this.props;
    this.setisChatMounted(true);
    this.initLocale();
    this.setTextFromProp(text);
    this.stopTTS();

    setTimeout(() => {
      this.init();
    }, 1000);
  }

  private clickedQuickReply = () => {
    this.refreshView();
  };

  componentWillUnmount() {
    this.setisChatMounted(false);
    const botClient = KoreBotClient.getInstance();
    botClient.removeAllListeners(RTM_EVENT.CONNECTING);
    botClient.removeAllListeners(RTM_EVENT.ON_OPEN);
    botClient.removeAllListeners(RTM_EVENT.ON_MESSAGE);
    botClient?.disconnect();
    this.stopTTS();
  }

  componentDidUpdate(prevProps: KoraChatProps, prevState: KoraChatState) {
    const {messages, text, inverted} = this.props;

    if (this.props.messages !== prevProps.messages) {
      this.setMessages(messages || []);
    }

    if (
      inverted === false &&
      messages &&
      prevProps.messages &&
      messages?.length !== prevProps.messages?.length
    ) {
      setTimeout(() => this.scrollToBottom(false), 200);
    }

    if (text !== prevProps.text) {
      this.setTextFromProp(text);
    }
  }

  private setBotClientListeners = () => {
    const botClient = KoreBotClient.getInstance();
    botClient
      ?.on(RTM_EVENT.ON_ACK, (data: any) => {
        if (data.type === 'ack') {
        }
      });
    botClient
      ?.on(RTM_EVENT.ON_EVENTS, (data: any) => {
        if (data.type === 'events') {
          this.setIsBotResponseLoading(data.message.type === 'typing');
        }
      });
    botClient
      ?.on(RTM_EVENT.ON_MESSAGE, (data: any) => {
        // if (data) {
        //   console.log('Bot Response Data ------->:', JSON.stringify(data, null, 2));
        // }
        if (data.type === 'ack') {
          console.log('Received ACK message, setting loading state');
          this.setIsBotResponseLoading(true);
          return;
        }
        this.setIsBotResponseLoading(false);
        this.processMessage(data);
        if (isAgentConnect) {
          KoreBotClient.getInstance().sendEvent('message_read');
        }
        const quickReplies = this.isQuickReplies(data);
        if (quickReplies) {
          this.setState({
            quickReplies: quickReplies,
          });
          this.clickedQuickReply();
        }
      });
  };

  private onReconnect = () => {
    if (this.state.isReconnecting) {
      return;
    }
    this.setState({isReconnecting: true}, () => {
      const botClient = KoreBotClient.getInstance();
      botClient.reconnect(true, true);
    });
  };

  private isQuickReplies = (data: any) => {
    if (
      data &&
      data.message &&
      data.message[0] &&
      data.message[0].component &&
      data.message[0].component.type === 'template' &&
      data.message[0].component.payload &&
      data.message[0].component.payload.payload &&
      data.message[0].component.payload.payload.template_type &&
      data.message[0].component.payload.payload.template_type ===
        TEMPLATE_TYPES.QUICK_REPLIES
    ) {
      return data.message[0].component.payload.payload.quick_replies;
    }
    return null;
  };

  private processMessage = (newMessages: any) => {
    
    let modifiedMessages: any = null;
    const itemId = getItemId();

    const hasRealAttachments = newMessages?.message?.[0]?.component?.payload?.attachments && 
                              newMessages?.message?.[0]?.component?.payload?.attachments !== "attachments" &&
                              newMessages?.message?.[0]?.component?.payload?.attachments !== "";

    if (hasRealAttachments) {
      let attachmentTemplate = {
        type: 'user_message',
        message: [
          {
            type: TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE,
            component: {
              type: TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE,
              payload: newMessages?.message?.[0]?.component?.payload,
            },
          },
        ],
      };
      modifiedMessages = [
        {
          ...attachmentTemplate,
          itemId: itemId,
        },
      ];
    } else {
      modifiedMessages = [
        {
          ...newMessages,
          itemId: itemId,
        },
      ];
    }

    if (modifiedMessages.length === 1 && !newMessages?.message?.[0]?.component?.payload?.attachments){
      let message = modifiedMessages[0];
      if (message.type === 'bot_response' && this.isSliderView(message)) {
        this.setState({showTemplateBottomSheet: true, messageBottomSheet: message})
        return;
      }

      if (message.type === 'bot_response'){
        if (message.fromAgent == true){
          isAgentConnect = true;
        }else{
          isAgentConnect = false;
        }  
      }
    }

    if (modifiedMessages && modifiedMessages[0].from === 'bot' && modifiedMessages[0].message && 
        modifiedMessages[0].message[0].component && modifiedMessages[0].message[0].component.payload &&
        !modifiedMessages[0].message[0].component.payload.payload && !modifiedMessages[0].message[0].component.payload.text)
          return
    
    this.setMessages(KoreChat.append(this.state.messages, modifiedMessages))
        setTimeout(() => {
          this.textToSpeech(newMessages);
        }, 1000);
  };
  private stopTTS = async () => {
    if (!this.ttsModule || !this.isTTSAvailable) {
      return;
    }
    try {
      await this.ttsModule.stop();
    } catch (error) {
      // TTS stop failed - silent fail
    }
  };

  private initializeTTS = async () => {
    if (this.ttsModule && this.isTTSAvailable) {
      return; // Already initialized
    }
    
    try {
      // Load TTS module using LazyLoader
      const TTS = await LazyLoader.importModule(
        () => import('react-native-tts'),
        'tts'
      );
      
      if (!TTS || !TTS.speak) {
        throw new Error('TTS module or required methods not found');
      }
      
      // Test availability
      try {
        await TTS.getInitStatus();
        this.isTTSAvailable = true;
      } catch (error) {
        this.isTTSAvailable = true; // Assume available even if check fails
      }
      
      this.ttsModule = TTS;
      
      // Configure TTS settings
      try {
        await TTS.setDefaultRate(0.5);
        await TTS.setDefaultPitch(1.0);
        await TTS.setIgnoreSilentSwitch('ignore');
        await TTS.setDucking(false);
      } catch (configError) {
        console.warn('TTS: Configuration failed:', configError);
      }
      
    } catch (error) {
      console.error('TTS: Failed to initialize:', error);
      this.ttsModule = null;
      this.isTTSAvailable = false;
    }
  };

  private cleanupTTS = async () => {
    if (!this.ttsModule) {
      return;
    }
    
    try {
      await this.ttsModule.stop();
    } catch (error) {
      console.warn('TTS: Error during cleanup:', error);
    }
    
    this.ttsModule = null;
    this.isTTSAvailable = false;
  };

  private speakMessage = async (message: string) => {
    if (!this.ttsModule || !this.isTTSAvailable) {
      return;
    }
    
    try {
      await this.ttsModule.speak(message, {
        iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
        rate: 0.5,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('TTS: Speak failed:', error);
      // Try a simpler speak call without options
      try {
        await this.ttsModule.speak(message);
      } catch (fallbackError) {
        console.error('TTS: Fallback speak also failed:', fallbackError);
      }
    }
  };

  isSliderView=(message: any) => {
    return message.message &&
      message.message[0] &&
      message.message[0].component &&
      message.message[0].component.type === 'template' &&
      message.message[0].component.payload &&
      message.message[0].component.payload.payload &&
      message.message[0].component.payload.payload.template_type && 
      message.message[0].component.payload.payload.sliderView && (
      message.message[0].component.payload.payload.template_type === TEMPLATE_TYPES.OTP_TEMPLATE ||
      message.message[0].component.payload.payload.template_type === TEMPLATE_TYPES.FEEDBACK_TEMPLATE ||
      message.message[0].component.payload.payload.template_type === TEMPLATE_TYPES.RESET_PIN_TEMPLATE);
  }

  private textToSpeech = (botResponse: any) => {
    if (!this.state.isTTSenable) {
      this.stopTTS();
      return;
    }
    if (botResponse.type === 'bot_response') {
      let message: any;

      let component = botResponse.message[0].component;
      if (component?.payload?.payload?.speech_hint) {
        message = component?.payload?.payload?.speech_hint;
      } else {
        let tType = getTemplateType(botResponse.message);
        const payload = component.payload?.payload || component?.payload;
        if (tType === TEMPLATE_TYPES.TEXT) {
          message = payload?.text;
          if (!message) {
            message = payload?.payload?.text;
            if (!message) {
              message = payload;
            }
          }
        } else {
          message = payload?.title || payload?.text || payload?.heading;
        }
      }

      if (message) {
        this.speakMessage(message);
      }
    }
  };

  private initLocale = () => {
    LocalizationManager.initializeLocale(this.props.locale);
    this.setLocale(LocalizationManager.getLocale());
  };

  private setLocale = (locale: string) => {
    this._locale = locale;
    LocalizationManager.setLocale(locale);
  };

  private getLocalizedString = (key: string): string => {
    return LocalizationManager.getLocalizedString(key);
  };

  private setTextFromProp = (textProp: string | undefined | null) => {
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({text: textProp});
    }
  };

  private getTextFromProp = (fallback: string | null | undefined) => {
    if (this.props.text === null) {
      return fallback;
    }
    return this.props.text;
  };

  private setMessages = (messages: any[]) => {
    historyMessages = messages.length;
    this.setState({messages});
  };

  private getMessages = () => {
    return this.state.messages;
  };

  private setIsFirstLayout = (value: boolean) => {
    this._isFirstLayout = value;
  };

  private getIsFirstLayout = () => {
    return this._isFirstLayout;
  };

  private setIsTypingDisabled = (value: boolean) => {
    this.setState({
      typingDisabled: value,
    });
  };

  private getIsTypingDisabled = () => {
    return this.state.typingDisabled;
  };

  private setIsBotResponseLoading = (value: boolean) => {
    this.setState({
      isBotResponseLoading: value,
    });
  };

  private getIsBotResponseLoading = () => {
    return this.state.isBotResponseLoading;
  };

  private setisChatMounted = (value: boolean) => {
    this._isChatMounted = value;
  };

  private getisChatMounted = () => {
    return this._isChatMounted;
  };

  private scrollToBottom = (animated = true) => {
    if (this._messageContainerRef && this._messageContainerRef.current) {
      const {inverted} = this.props;
      if (!inverted) {
        this._messageContainerRef.current.scrollToEnd({animated});
      } else {
        this._messageContainerRef.current.scrollToOffset({
          offset: 0,
          animated,
        });
      }
    }
  };

  private renderMessages = (): ReactNode => {
    const {messagesContainerStyle, ...messagesContainerProps} = this.props;

    return (
      <View style={[messagesContainerStyle, {flex: 1}]}>
        <MessageContainer
          {...messagesContainerProps}
          onListItemClick={this.onListItemClick}
          onSendText={this.onSendPlainText}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
          forwardRef={this._messageContainerRef}
          isTyping={this.props.isTyping}
          onDragList={this.props.onDragList}
          onHistoryLoaded={this.onHistoryLoaded}
        />
        {(this.state.messageBottomSheet && this.state.showTemplateBottomSheet) && (
          this.renderTemplateBottomSheet()
        )}
        {this.renderChatFooter()}
      </View>
    );
  };

  renderTemplateBottomSheet = () => {
    let message = this.state.messageBottomSheet;
    let isShow = this.state.showTemplateBottomSheet;

    if (!message) return <></>;
    return(
      <TemplateBottomSheet 
      isShow= {isShow && message} 
      messageId={message.messageId} 
      payload={message.message[0].component.payload.payload}
      templateType={message.message[0].component.payload.payload.template_type}
      onListItemClick={this.onListItemClick}
      onSliderClosed={() =>{
        this.setState({showTemplateBottomSheet: false})
      }}
      templateInjection={this.props.templateInjection}
      />
    ) 
  }

  onSendPlainText = (message?: any) => {
    this.onSendText({text: message});
  };

  private getAttachmentPayload = (msz: string) => {
    let fileNames = msz;

    this.state?.mediaPayload.map((media: any) => {
      let ext = getDrawableByExt(this.getFileType(media?.fileName));

      let fileName = media?.fileName;
      if (fileName?.length > MAX_FILE_NAME_LENGTH) {
        fileName = fileName?.slice(
          fileName.length - MAX_FILE_NAME_LENGTH,
          fileName.length,
        );
      }

      fileNames = fileNames + '\n' + ext + ' ' + fileName + '\n';
    });

    return {
      message: {text: fileNames},
      data: this.state?.mediaPayload,
      data_type: 'attachments',
    };
  };
  onSendText = (
    message: any,
    shouldResetInputToolbar = false,
    data_type = '',
  ): void => {
    this.stopTTS();
    if (this.props.onSend) {
      this.props.onSend(message.text, data_type);
    } else {
      let data: any;

      if (this.state?.mediaPayload?.length > 0) {
        let payload = this.getAttachmentPayload(message.text);

        this.setState({
          mediaPayload: [],
        });

        this.onSend({
          message: payload.message,
          data: payload.data,
          shouldResetInputToolbar,
          data_type: payload.data_type,
        });
      } else {
        this.onSend({
          message,
          data: data,
          shouldResetInputToolbar,
          data_type,
        });
      }
    }
  };
  private renderQuickRepliesView = (props: any) => {
    const itemClick = (item: any) => {
      this.computePostBack(item, TEMPLATE_TYPES.QUICK_REPLIES);
    };
    if (this.props?.renderQuickRepliesView) {
      return this.props.renderQuickRepliesView({...props, itemClick});
    }
    return <QuickReplies {...props} itemClick={itemClick} />;
  };

  private renderMediaView = (props: any) => {
    if (this.props.renderMediaView) {
      return this.props.renderMediaView(this.state.mediaPayload || []);
    }
    return this.renderInternalMediaView();
  };

  private getFileType = (fileName?: string) => {
    if (!fileName) {
      return '';
    }
    try {
      let fileType = fileName?.slice(
        fileName?.lastIndexOf('.') + 1,
        fileName?.length,
      );

      return fileType?.toLowerCase?.()?.trim?.();
    } catch (error) {}

    return '';
  };

  private renderInternalMediaView = () => {
    const media = this.state.mediaPayload || [];
    if (media?.length === 0) {
      return <></>;
    }
    return (
      <ScrollView horizontal={true}>
        <View style={styles.media_main}>
          {media?.map((m: any, index: number) => {
            let fileType: string = this.getFileType(m?.fileName);
            return (
              <View key={index + ''} style={styles.media_sub1}>
                <TouchableOpacity
                  onPress={() => {
                    if (!m?.fileId) {
                      this.fileUploadQueue?.removeFromQueue(m);
                    }
                    const filterList = this.state.mediaPayload.filter(
                      (m2: any) => m2.id !== m.id,
                    );
                    this.setState({
                      mediaPayload: filterList,
                    });
                  }}
                  style={styles.close_icon_main}>
                  <SvgIcon
                    name={'HeaderClose'}
                    width={normalize(10)}
                    height={normalize(10)}
                    color={'#697586'}
                  />
                </TouchableOpacity>
                <View style={{marginTop: 6}}>
                  {imageFilesTypes.includes(fileType) ? (
                    renderImage({
                      image: m?.uri,
                      iconShape: null,
                      iconSize: null,
                      width: 50,
                      height: 50,
                    })
                  ) : (
                    <FileIcon fileType={fileType} size={45} />
                  )}
                  {!m?.status && (
                    <View style={styles.progress_main}>
                      <Progress.Circle
                        progress={m?.progress / 100 || 0}
                        size={33}
                        thickness={3}
                        color={Color.red}
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  private clearQuickReplies = () => {
    if (this.state?.quickReplies?.length !== 0) {
      this.setState({
        quickReplies: [],
      });
    }
  };

  private onSend = ({
    message = {
      text: '',
    },
    data = undefined,
    shouldResetInputToolbar = true,
    data_type = '',
  }): void => {
    console.log('onSend called with message:', message);

    this.clearQuickReplies();
    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true);
      this.resetInputToolbar();
    }
    this.setIsBotResponseLoading(true);
    if (this.props.onSend) {
      this.props.onSend(message.text, data_type);
    } else {
      var messageData = KoreBotClient.getInstance()?.sendMessage(
        message.text,
        data,
        data_type,
      );
      
      setTimeout(() => {
        this.scrollToBottom(true);
      }, 100);
      this.processMessage(messageData);
    }

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getisChatMounted() === true) {
          this.setIsTypingDisabled(false);
        }
      }, 100);
    }
  };

  private computePostBack = (item: any = {}, template_type = '') => {
    if (!item) {
      return;
    }
    let type = item?.type || item?.content_type || '';
    switch (type) {
      case 'clientCall':
        break;
      case 'notification_action':
        break;
      case 'postback':
      case 'text':
      case 'dateTime':
      case 'person':
        let message =
          item?.utterance?.trim() ||
          item?.title?.value?.trim() ||
          item?.title?.trim() ||
          item?.message?.trim();
        if (template_type === TEMPLATE_TYPES.QUICK_REPLIES) {
          if (item?.renderMsg) {
            message = item?.renderMsg;
          }
        }

        let data_type = '';
        let data: any;
        let pArray =
          item?.payload && typeof item?.payload === 'string'
            ? item?.payload?.split(':')
            : undefined;
        if (pArray?.length === 2) {
          data_type = pArray[0].trim();
        } else {
        }
        data = item;

        if (template_type === TEMPLATE_TYPES.MULTI_SELECT_TEMPLATE) {
          message = item?.message;
          data = {
            payload: item?.payload,
          };
        }

        this.onSend({message: {text: message}, data, data_type});
        break;
      case 'web_url':
      case 'url':
        if (item?.url) {
          let url = item?.url;
          if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
            url = 'http://' + url;
          }
          Linking.openURL(url);
        }
        if (item?.link) {
          let url = item?.link;
          if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
            url = 'http://' + url;
          }
          Linking.openURL(url);
        } else if (item?.redirectUrl) {
          let dweb = item?.redirectUrl?.dweb;
          let mob = item?.redirectUrl?.mob;
          let url = mob || dweb || '';
          if (url?.length > 0) {
            if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
              url = 'http://' + url;
            }
            Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                try {
                  Linking.openURL(url);
                } catch (e) {}
                console.log('No handler for URL:', url);
              } else {
                Linking.openURL(url);
              }
            });
          }
        } else if (item?.value) {
          Linking.openURL(item?.value);
        }
        break;
      case 'action':
        break;

      case 'bot_msz':
        if (item?.message && item?.payload) {
          this.onSend({
            message: {text: item?.message},
            data: item?.payload,
            data_type: type,
          });
        }
        break;
      default:
        if (typeof item === 'string') {
          if (template_type == TEMPLATE_TYPES.IMAGE_MESSAGE) {
            Linking.openURL(item);
          } else {
            this.onSend({message: {text: item}});
          }
        }
    }
  };

  private onListItemClick = (
    template_type?: string,
    item?: any,
    isFromViewMore?: boolean,
    theme?: IThemeType,
  ) => {
    if (this.props.onListItemClick) {
      let onClick = this.props.onListItemClick(
        template_type,
        item,
        isFromViewMore,
        theme,
      );

      if (KORA_ITEM_CLICK !== onClick) {
        return;
      }
    }
    // console.log('Korachat template_type --->:', template_type);
    // console.log('Korachat item --->:', item);
    switch (template_type) {
      case TEMPLATE_TYPES.BUTTON:
      case TEMPLATE_TYPES.CARD_TEMPLATE:
      case TEMPLATE_TYPES.TABLE_LIST_TEMPLATE:
      case TEMPLATE_TYPES.ADVANCED_MULTI_SELECT_TEMPLATE:
      case TEMPLATE_TYPES.MULTI_SELECT_TEMPLATE:
      case TEMPLATE_TYPES.RADIO_OPTION_TEMPLATE:
      case TEMPLATE_TYPES.DROPDOWN_TEMPLATE:
      case TEMPLATE_TYPES.FEEDBACK_TEMPLATE:
      case TEMPLATE_TYPES.FORM_TEMPLATE:
      case TEMPLATE_TYPES.CLOCK_TEMPLATE:
      case TEMPLATE_TYPES.OTP_TEMPLATE:
      case TEMPLATE_TYPES.RESET_PIN_TEMPLATE:
      case TEMPLATE_TYPES.LISTWIDGET_TEMPLATE:
      case TEMPLATE_TYPES.IMAGE_MESSAGE:
      case TEMPLATE_TYPES.DIGITALFORM_TEMPLATE:
        if (!isFromViewMore) {
          this.computePostBack(item, template_type);
        }

        break;
      case TEMPLATE_TYPES.ADVANCED_LIST_TEMPLATE:
        if (!isFromViewMore) {
          this.computePostBack(item, template_type);
        } else {
          console.log('item ------->:', item);
        }

        break;
      case TEMPLATE_TYPES.LIST_VIEW_TEMPLATE:
        if (!isFromViewMore) {
          this.computePostBack(item, template_type);
        } else if (isFromViewMore) {
          Keyboard.dismiss();

          const dataPayload = [
            {
              title: 'Tab1',
              list: item?.Tab1,
              isChecked: true,
            },
            {
              title: 'Tab2',
              list: item?.Tab2,
              isChecked: false,
            },
          ];

          this.setState(
            {
              currentTemplate: TEMPLATE_TYPES.LIST_VIEW_TEMPLATE,
              currentTemplateData: dataPayload,
              currentTemplateHeading: item?.heading,
              showSeeMoreModal: true,
            },
          );
        }

        break;
        
      case TEMPLATE_TYPES.ARTICLE_TEMPLATE:
        this.setState(
            {
              currentTemplate: template_type,
              currentTemplateData: item,
              themeData: theme,
              showSeeMoreModal: true,
            },
          );

        break;
      case TEMPLATE_TYPES.LIST_TEMPLATE:
      case TEMPLATE_TYPES.CAROUSEL_TEMPLATE:
        this.computePostBack(item, template_type);
        break;
      case TEMPLATE_TYPES.TABLE_TEMPLATE:
        let viewMoreObj = {
          template_type,
          payload: item,
          isFromViewMore,
          theme: theme,
        };
        this.setState({modalVisible: true, viewMoreObj});
        break;
      case TEMPLATE_TYPES.DATE_RANGE_TEMPLATE:
        //{"endDate": "03-30-2024", "startDate": "03-26-2024"}
        if (item?.startDate && item?.endDate) {
          let textItem = this.getDateRangeText(item);
          if (textItem) {
            this.computePostBack(textItem, template_type);
          }
        }
        break;
      case TEMPLATE_TYPES.DATE_TEMPLATE:
        // {"currentDate": "03-22-2024"}
        if (item?.currentDate) {
          this.computePostBack(item?.currentDate, template_type);
        }
        break;
    }
  };

  private getDateRangeText(item: any) {
    if (!item?.startDate || !item?.endDate) {
      return undefined;
    }
    //let dateFormat = 'MMMM Do, YYYY';
    try {
      return item.startDate + ' to ' + item.endDate;
    } catch (error) {
      console.log('getDateRangeText Error ----->:', error);
    }

    return undefined;
  }

  private resetInputToolbar = () => {
    if (this.textInput) {
      this.textInput.clear();
    }
    this.notifyInputTextReset();
    this.setState({
      text: this.getTextFromProp(''),
    });
  };

  private onInputSizeChanged = (_size: {height: number; width: number}) => {};

  private onInputTextChanged = (text: string) => {

    if (isAgentConnect == true){
      if (text.length == 0){
        console.log('stop_typing')
        KoreBotClient.getInstance()?.sendEvent('stop_typing',false);
      }else{
        console.log('typing')
        KoreBotClient.getInstance()?.sendEvent('typing',false);
      }
    }

    if (this.getIsTypingDisabled()) {
      return;
    }
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged(text);
    }
    if (this.props.renderSuggestionsView) {
      this.props.renderSuggestionsView(text);
    }
    if (this.props.text === null) {
      this.setState({text});
    }
  };

  private notifyInputTextReset = () => {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged('');
    }
  };

  private onInitialLayoutViewLayout = (e: {
    nativeEvent: {layout: {height: number}};
  }) => {
    const {layout} = e.nativeEvent;
    if (layout.height <= 0) {
      return;
    }
    this.notifyInputTextReset();
    const initialText = this.props.initialText || '';
    this.setState({
      isInitialized: true,
      text: this.getTextFromProp(initialText),
    });
  };

  private onMainViewLayout = (_e: {
    nativeEvent: {layout: {height: number}};
  }) => {
    if (this.getIsFirstLayout() === true) {
      this.setIsFirstLayout(false);
    }
  };

  private isMediaAddedToSend = (): boolean => {
    let list = this.state?.mediaPayload?.filter((media: any) => media?.status);
    return list?.length > 0 || false;
  };
  
  private onSpeakerClicked = (_isSpeech: boolean) => {
    this.setState(
      {
        isTTSenable: _isSpeech,
      },
      () => {
        if (this.state.isTTSenable) {
          // User enabled TTS - create LazyTTS instance on demand
          this.initializeTTS();
        } else {
          // User disabled TTS - cleanup and destroy instance
          this.cleanupTTS();
        }
      },
    );
  };

  private renderInputToolbar = (): ReactNode => {
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text),
      composerHeight: Math.max(
        this.props.minComposerHeight || 0,
        this.state.composerHeight,
      ),
      onSend: this.onSendText,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      onSpeakerClicked: this.onSpeakerClicked,
      isTTSenable: this.state.isTTSenable,
      textInputProps: {
        ...this.props.textInputProps,
        ref: (textInput: any) => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength,
      },
      quick_replies: this.state.quickReplies,
      renderQuickRepliesView: this.renderQuickRepliesView,
      renderMediaView: this.renderMediaView,
      isMediaAddedToSend: this.isMediaAddedToSend(),
      isMediaLoading: this.state?.mediaPayload.length > 0 || false,

      onSTTValue: (value: any) => {
        this.setState({
          onSTTValue: value,
        });
      },

      onSendSTTClick: (isOnlyClearSTT: boolean) => {
        if (!isOnlyClearSTT) {
          this.onSend({message: {text: this.state.onSTTValue}});
        }

        this.setState({
          onSTTValue: null,
        });
      },

      onAttachedItemClick: () => {
        if (this.state?.mediaPayload.length >= MAX_SOURCE_LIMIT) {
          this.showCustomToast(
            'You can upload only ' +
              MAX_SOURCE_LIMIT +
              (MAX_SOURCE_LIMIT > 1 ? ' files' : ' file'),
          );
          return;
        }
        Keyboard.dismiss();
        this.setState({ showAttachmentModal: true });
      },
      onMenuItemClick: (menuItems: any) => {
        console.log('menuItems ------->:', menuItems);
        Keyboard.dismiss();
        this.setState({
          menuItems,
        });
      },
    };
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps);
    }
    return <InputToolbar {...inputToolbarProps} />;
  };

  private renderChatFooter = (): ReactNode | null => {
    if (this.props.renderChatFooter) {
      return this.props.renderChatFooter();
    }
    return null;
  };

  private renderLoading = (): ReactNode | null => {
    if (this.props.renderLoading) {
      return this.props.renderLoading();
    }
    return this.renderLoader();
  };

  private renderTypingIndicator = (): ReactNode | null => {
    let isTypingIndicator = this.state.isBotResponseLoading;
    if (this.props.renderTypingIndicator) {
      return this.props.renderTypingIndicator({
        ...this.props,
        isTypingIndicator,
      });
    }
    return <TypingIndicator isTypingIndicator={isTypingIndicator} />;
  };

  renderSTTview(value: any): React.ReactNode {
    if (!value) {
      return <></>;
    }
    return (
      <View style={styles.stt_main}>
        <View>
          <Text numberOfLines={0} style={styles.stt_text}>
            {value}
          </Text>
        </View>
      </View>
    );
  }

  private refreshView = (): void => {
    this.resetInputToolbar();
  };

  private getViewMoreView(): React.ReactNode {
    let viewMoreObj = this.state.viewMoreObj;
    if (!viewMoreObj || !viewMoreObj.payload || !viewMoreObj.template_type) {
      return <></>;
    }

    switch (viewMoreObj.template_type) {
      case TEMPLATE_TYPES.TABLE_TEMPLATE:
        return (
          <TableTemplate
            payload={viewMoreObj.payload}
            isFromViewMore={true}
            theme={viewMoreObj?.theme}
          />
        );
    }

    return <></>;
  }

  private openFullScreenDialog = () => {
    const {modalVisible} = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          this.setState({modalVisible: false});
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.m_con2}>
              <TouchableOpacity
                style={styles.close_btn_con}
                onPress={() =>
                  this.setState({modalVisible: false, viewMoreObj: undefined})
                }>
                <Text style={styles.close_btn_txt}>{'X'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.m_main_con}>{this.getViewMoreView()}</View>
          </View>
        </View>
      </Modal>
    );
  };

  private renderAttachedBottomSheet(): React.ReactNode {
    return (
      <Modal
        visible={this.state.showAttachmentModal || false}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({ showAttachmentModal: false });
        }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{ 
            backgroundColor: '#fff',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
          }}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: '#ccc',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }} />
            <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                  onPress={() => {
                    this.setState({ showAttachmentModal: false });
                  }}
                >
                  <SvgIcon
                    name={'HeaderClose'}
                    width={normalize(20)}
                    height={normalize(20)}
                    color={'#697586'}
                  />
                </TouchableOpacity>
            {this.renderAssetPopupComponent()}
          </View>
        </View>
      </Modal>
    );
  }

  private renderMenuBottomSheet(): React.ReactNode {
    const shouldShowModal =
      Array.isArray(this.state.menuItems) && this.state.menuItems.length > 0;
  
    return (
      <Modal
        visible={shouldShowModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({ menuItems: undefined });
        }}
      >
        {/* Outer area to detect taps */}
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ menuItems: undefined });
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Prevent tap propagation into this area */}
            <TouchableWithoutFeedback
            onPress={() => {}}
            >
              <View
                style={{
                  minHeight: 300,
                  backgroundColor: '#fff',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 10,
                  maxHeight: '75%',
                }}
              >
                {/* Drag handle */}
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#ccc',
                    borderRadius: 2,
                    alignSelf: 'center',
                    marginBottom: 20,
                  }}
                />
                {/* Close icon button */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                  onPress={() => {
                    this.setState({ menuItems: undefined });
                  }}
                >
                  <SvgIcon
                    name={'HeaderClose'}
                    width={normalize(20)}
                    height={normalize(20)}
                    color={'#697586'}
                  />
                </TouchableOpacity>
  
                {/* Title */}
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    textAlign: 'left',
                    color: '#333',
                  }}
                >
                  Menu
                </Text>
  
                {/* Content */}
                {this.renderMenuPopupComponent()}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  private renderSeeMorePopupComponent(): any {
    const bubbleTheme = getBubbleTheme(this.state.themeData);
    switch (this.state.currentTemplate) {
      case TEMPLATE_TYPES.LIST_VIEW_TEMPLATE:
        const data = this.state.currentTemplateData;

        const selectedItem = data?.filter((d: any) => d?.isChecked);

        return (
          <View>
            <View>
              {this.state?.currentTemplateHeading && (
                <View style={styles.sub_container_title1}>
                  <Text style={[styles.displayTextHeaderStyle,{fontWeight: 600}]}>
                    {this.state?.currentTemplateHeading}
                  </Text>
                </View>
              )}
              <View style={{flexDirection: 'row'}}>
                {data?.map((tab: any, index: number) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (tab?.isChecked) {
                          return;
                        }
                        let dataList = this.state.currentTemplateData.map(
                          (item: any, itemIndex: number) => {
                            if (index === itemIndex) {
                              return {
                                ...item,
                                isChecked: true,
                              };
                            }
                            return {
                              ...item,
                              isChecked: false,
                            };
                          },
                        );

                        this.setState({
                          currentTemplateData: dataList,
                        });
                      }}
                      style={[styles.tab_title_main]}>
                      <Text
                        style={[
                          styles.tab_title,
                          tab?.isChecked
                            ? {
                                backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR,
                                color: Color.white,
                              }
                            : {
                                backgroundColor: Color.white,
                                color: Color.black,
                              },
                        ]}>
                        {tab?.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.line} />
            </View>
            <ScrollView horizontal={false} style={styles.scrollView}>
              <View style={styles.sroll_sub}>
                <ListViewTemplate
                  payload={{
                    elements: selectedItem?.[0]?.list,
                    isLastMessage: true,
                    onListItemClick: (
                      template_type?: string,
                      item?: any,
                      isFromViewMore?: boolean,
                      theme?: IThemeType,
                    ) => {
                      this.setState({ showSeeMoreModal: false });
                      this.onListItemClick(
                        template_type,
                        item,
                        isFromViewMore,
                        theme,
                      );
                    },
                  }}
                  theme={this.state.themeData}
                  onBottomSheetClose={{}}
                />
              </View>
            </ScrollView>
          </View>
        );
        break;
      case TEMPLATE_TYPES.ARTICLE_TEMPLATE:
        const payload = this.state.currentTemplateData;
        return (
          <ScrollView horizontal={false} style={[styles.scrollView, {marginBottom: normalize(10)}]}>
              <View style={styles.sroll_sub}>
                <ArticleTemplate payload={payload} theme={this.state.themeData} onListItemClick={this.props.onListItemClick} onBottomSheetClose={{}} />;
            </View>
          </ScrollView>
        );
    }
  }
  private renderSeeMoreBottomSheet(): React.ReactNode {
    return (
      <Modal
        visible={this.state.showSeeMoreModal || false}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({ showSeeMoreModal: false });
        }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{ 
            backgroundColor: '#fff',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
            maxHeight: '75%',
          }}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: '#ccc',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
              onPress={() => {
                this.setState({ showSeeMoreModal: false });
              }}>
              <SvgIcon
                    name={'HeaderClose'}
                    width={normalize(20)}
                    height={normalize(20)}
                    color={'#697586'}
                  />
            </TouchableOpacity>
            {this.renderSeeMorePopupComponent()}
          </View>
        </View>
      </Modal>
    );
  }

  private renderMenuPopupComponent(): any {
    let buttons = this.state.menuItems || [];
    return (
      <View style={[styles.pop_sub]}>
        {buttons.map((btn: any, index: number) => {
          return (
            <TouchableOpacity
              key={index + ''}
              onPress={() => {
                this.setState({ menuItems: undefined });
                setTimeout(() => {
                  this.computePostBack(btn);
                }, 100);
              }}
              style={{padding: 15, backgroundColor: Color.white, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'}}>
              <Text style={{fontSize: normalize(16), color: Color.text_color}}>
                {btn.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  private requestCameraPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const { cameraPermission } = require('../utils/PermissionsUtils');
      cameraPermission((isSuccess: boolean) => {
        console.log('Camera permission result:', isSuccess);
        resolve(isSuccess);
      });
    });
  };

  private renderAssetPopupComponent(): any {
    return (
      <View style={[styles.pop_sub]}>
        {attach_menu_buttons.map((btn: any, index: number) => {
          return (
            <TouchableOpacity
              key={index + ''}
              onPress={async () => {
                this.setState({ showAttachmentModal: false });

                setTimeout(async () => {
                  switch (btn?.id) {
                    case 1:
                      const hasPermission = await this.requestCameraPermission();
                      if (!hasPermission) {
                        console.error('Camera permission denied');
                        return;
                      }
                      
                      try {
                      this.lazyLaunchCamera(
                        {
                          saveToPhotos: true,
                          mediaType: 'mixed',
                          quality: 0.8,
                          maxWidth: 1920,
                          maxHeight: 1920,
                        },
                        (response: any) => {
                          
                          if (response.didCancel) {
                            console.log('User cancelled image picker');
                            return;
                          }
                          
                          if (response.errorMessage) {
                            console.error('Camera error:', response.errorMessage);
                            return;
                          }
                          
                          if (response.errorCode) {
                            console.error('Camera error code:', response.errorCode);
                            return;
                          }

                          const res = response.assets?.[0];
                          if (res) {
                            let fileName = res.fileName;
                            if (res.fileName) {
                              let names = res.fileName.split('.');
                              fileName =
                                'img_' +
                                new Date().getTime() +
                                '.' +
                                names?.[1];
                            }
                            
                            let result = [
                              {
                                fileCopyUri: null,
                                name: fileName,
                                size: res.fileSize,
                                type: res.type,
                                uri: res.uri,
                              },
                            ];
                            
                            this.computeMediaResult(result);
                          } else {
                            console.warn('No camera result received');
                          }
                        },
                      );
                    } catch (error) {
                      console.error('Error launching camera:', error);
                    }
                    break;
                  case 2:
                    this.handleDocumentTypeSelection('images');
                    break;
                  case 3:
                    this.handleDocumentTypeSelection('documents');
                    break;
                    case 4:
                      this.handleDocumentTypeSelection('video');
                      break;
                  }
                }, 150);
              }}
              style={{padding: 15, backgroundColor: Color.white, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'}}>
              <Text style={{fontSize: normalize(16), color: Color.text_color}}>
                {btn?.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  private onAttachItemClick(types: any) {
    if (isIOS) {
      documentPickIOSPermission((isSuccess: any) => {
        this.pickDocument(types);
        console.log('IOSPermission isSuccess ---->:', isSuccess);
      });
    } else {
      documentPickPermission((isSuccess: any) => {
        this.pickDocument(types);
        console.log('android Permission isSuccess ---->:', isSuccess);
      });
    }
  }

  private pickDocument = async (types: any) => {
    try {
      const DocumentPicker = await this.lazyDocumentPicker();
      if (!DocumentPicker) {
        console.warn('DocumentPicker not available');
        return;
      }
      
      const result = await DocumentPicker.pick({
        allowMultiSelection: MAX_SOURCE_LIMIT > 1,
        type: types,
      });
      this.computeMediaResult(result);
    } catch (err) {}
  };

  private getBeforeLoadingList(files: any) {
    return files.map((file: any) => {
      let itemId = getItemId();
      return {
        ...file,
        id: itemId,
        fileName: file?.name,
        status: false,
      };
    });
  }

  private computeMediaResult = (result: any) => {
    let totalLength = result?.length || 0;

    if (totalLength <= MAX_SOURCE_LIMIT) {
      let filesLessthan10Mb = result?.filter((item: {size: number}) => {
        let sizeInBytes: number = item?.size || 0;
        const fileSizeInMB = sizeInBytes / (1024 * 1024);
        return fileSizeInMB <= 10;
      });

      let filesGreaterthan10Mb = result?.filter((item: {size: number}) => {
        let sizeInBytes: number = item?.size || 1;
        const fileSizeInMB = sizeInBytes / (1024 * 1024);
        return fileSizeInMB > 10;
      });

      if (filesGreaterthan10Mb?.length > 0) {
        let msg = '';
        if (filesGreaterthan10Mb?.length === 1) {
          const name = filesGreaterthan10Mb.map(
            (file: {name: any}) => file?.name,
          );
          msg = "Couldn't attach " + name + ' - Size limit is 10 mb per file';
        } else {
          msg = "Couldn't attach few files Size limit is 10 mb per file";
        }
        this.showCustomToast(msg);
        return;
      }

      if (filesLessthan10Mb?.length > 0) {
        const beforeList = this.getBeforeLoadingList(filesLessthan10Mb);
        this.setState({
          mediaPayload: beforeList,
        });
        let payload = {
          files: beforeList,
        };

        if (payload?.files?.length > 0) {
          this.fileUploadQueue = new FileUploadQueue(
            (resultMedia: any) => {
              if (resultMedia) {
                let updatesList = this.state.mediaPayload.map((media: any) => {
                  if (media?.id === resultMedia?.id) {
                    return {
                      id: resultMedia?.id,
                      fileId: resultMedia?.fileUrl?.fileId,
                      fileName: resultMedia?.fileName,
                      status: resultMedia?.status,
                      uri: resultMedia?.uri,
                      filesize: resultMedia?.filesize,
                      type: resultMedia?.type,
                      mediaType: this.getFileType(resultMedia?.fileName),
                      isFromLocal: true,
                    };
                  }

                  return media;
                });
                this.setState({
                  mediaPayload: updatesList,
                });
              } else {
                this.showCustomToast('actionUploadFail');
              }
            },
            progressObj => {
              let updatesList = this.state.mediaPayload.map((media: any) => {
                if (media?.id === progressObj?.id) {
                  return {
                    ...media,
                    progress: progressObj.progress,
                    status: false,
                  };
                }
                return media;
              });
              this.setState({
                mediaPayload: updatesList,
              });
            },
          );

          payload?.files.forEach((file: any) => {
            this.fileUploadQueue?.addToQueue(file);
          });
        }
      }
    } else {
      this.showCustomToast(LIMIT_MESSAGE);
    }
  };

  private showCustomToast = (msg: any) => {
    // Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM);
    Toast.show({
      type: 'error',
      text1: msg,
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  private onHeaderActionsClick = (item: any) => {
    switch (item) {
      case HeaderIconsId.BACK:
      case HeaderIconsId.CLOSE:
        try {
          if (this.props.navigation?.canGoBack?.()) {
            this.props.navigation?.goBack?.();
          } else {
            BackHandler.exitApp();
          }
        } catch (error) {
          BackHandler.exitApp();
        }

        break;

      case HeaderIconsId.HELP:
        let item = {
          type: 'url',
          url: 'https://kore.ai/',
        };
        this.computePostBack(item);
        break;
      case HeaderIconsId.RECONNECT:
        this.onReconnect();
        break;
      case HeaderIconsId.LIVE_AGENT:
        setTimeout(() => {
          this.onSend({
            message: {text: 'connect to agent'},
          });
        }, 1000);
        break;
    }
  };
  private renderHeader(): React.ReactNode {
    if (this.props.renderChatHeader) {
      return this.props.renderChatHeader();
    }
    let onClick = (item: any) => {
      if (this.props?.onHeaderActionsClick) {
        this.props?.onHeaderActionsClick?.(item);
      } else {
        this.onHeaderActionsClick(item);
      }
    };

    return (
      <ChatHeader
        onHeaderActionsClick={onClick}
        {...this.props}
        isReconnecting={this.state.isReconnecting}
      />
    );
  }
  private renderLoader = (): React.ReactNode => {
    if (this.state.showLoader) {
      return (
        <View style={styles.load}>
          <ActivityIndicator
            animating={true}
            style={styles.indicator}
            size={25}
            color={'#517BD2'}
          />
          <View style={styles.indicator_sub}>
            <Text style={styles.loader_text}>{'Please wait'}</Text>
          </View>
        </View>
      );
    }
    return <></>;
  };

  private renderWelcomeComponent = () => {
    if (this.props.statusBarColor && isIOS) {
      this.props.statusBarColor(
        this.state.activetheme?.v3?.welcome_screen?.background?.color ||
          '#4B4EDE',
      );
    }
    return (
      <Welcome
        activetheme={this.state.activetheme}
        onStartConversationClick={(postUtterance: any) => {
          this.setState(
            {
              wlcomeModalVisible: false,
            },
            () => {
              if (postUtterance) {
                setTimeout(() => {
                  this.onSend({
                    message: {text: postUtterance},
                  });
                }, 100);
              }
              if (this.props.statusBarColor && isIOS) {
                this.props.statusBarColor(
                  this.state.activetheme?.v3?.header?.bg_color,
                );
              }
            },
          );
        }}
      />
    );
  };

  private renderWelcomeScreenModel = () => {
    return (
      <Modal
        visible={this.state.wlcomeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({
            wlcomeModalVisible: false,
          });
        }}>
        {this.renderWelcomeComponent()}
      </Modal>
    );
  };

  private renderBackButtonDialog = () => {
    return (
      <Modal
        visible={this.state.showBackButtonDialog || false}
        animationType="fade"
        transparent={true}
        onRequestClose={this.handleDialogCancel}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 15,
            marginHorizontal: 20,
            minWidth: 320,
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 18,
              marginBottom: 15,
              textAlign: 'left',
              color: '#333'
            }}>
              {this.getLocalizedString('back_dialog_title')}
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginTop: 10,
            }}>
              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  flex: 1,
                  marginHorizontal: 5,
                }}
                onPress={this.handleDialogCancel}>
                <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
                  {this.getLocalizedString('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 5,
                  alignItems: 'center',
                  marginRight: 15,
                  flex: 0,
                }}
                onPress={this.handleDialogClose}>
                <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
                  {this.getLocalizedString('close')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  alignItems: 'center',
                  paddingHorizontal: 5,
                  flex: 0,
                }}
                onPress={this.handleDialogMinimize}>
                <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
                  {this.getLocalizedString('minimize')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    if (
      (this.state.isInitialized === true && !this.state.showLoader) ||
      this.state.activetheme
    ) {
      const {wrapInSafeArea} = this.props;
      const Wrapper = wrapInSafeArea ? SafeAreaView : View;
      const bgColor = this.state.themeData?.v3?.header?.bg_color || '#EAECF0';
      const isWhiteStatus = isWhiteStatusBar(bgColor);
      const isBlackStatus = isBlackStatusBar(bgColor);

      return (
        <ThemeProvider>
          <Wrapper style={styles.safeArea}>
            <View
              style={[styles.container, {flexDirection: 'column'}]}
              onLayout={this.onMainViewLayout}>
              {bgColor && !isWhiteStatus ? (
                <StatusBar
                  barStyle={isBlackStatus ? 'default' : 'dark-content'}
                  backgroundColor={bgColor}
                />
              ) : (
                <StatusBar
                  barStyle="dark-content" // Sets the text/icons to light color
                  backgroundColor={Color.white} // Sets the status bar background color
                />
              )}

              {this.renderHeader()}
              {this.openFullScreenDialog()}
              {this.renderMessages()}
              {this.renderTypingIndicator()}
              {this.renderSTTview(this.state?.onSTTValue)}

              {this.renderInputToolbar()}
              {this.state.activetheme && this.renderLoader()}
              {this.renderAttachedBottomSheet()}
              {this.renderMenuBottomSheet()}
              {this.renderSeeMoreBottomSheet()}
              {this.renderWelcomeScreenModel()}
              {this.renderBackButtonDialog()}
              <CustomAlertComponent ref={this.alertRef} />
            </View>
          </Wrapper>
        </ThemeProvider>
      );
    }
    return (
      <View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
        {this.renderLoading()}
        <CustomAlertComponent ref={this.alertRef} />
      </View>
    );
  }

  private onHistoryLoaded = (historyMessages: any[])=>{
    let newMessages = this.getMessages().concat(historyMessages);
    newMessages = newMessages.filter(
      (item, index, self) =>
        index === self.findIndex(m => m.timeMillis === item.timeMillis)
    );
    console.log('newMessages '+newMessages.length);
    this.setMessages(newMessages);
  }

  private loadHistory = async () => {
      const apiService = new ApiService(this.props.botConfig.botUrl, KoreBotClient.getInstance());
      await apiService.getBotHistory(0, historyMessages > 20 ? 20 : historyMessages, this.props.botConfig, (response: any) => {

        if (response == null) {
          console.log('BotHistory null');
          return;
        }
        this.onHistoryLoaded(response.data.botHistory);
      });
  };
}

const styles = StyleSheet.create({
  displayTextHeaderStyle: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontStyle: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    marginBottom: 10,
    textAlign: 'left',
    justifyContent: 'center',
    color: Color.text_color,
    fontWeight: '800',
  },
  sub_container_title1: {
    flexDirection: 'column',
    marginStart: 5,
    marginEnd: 10,
  },
  tab_title_main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sroll_sub: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: Color.white,
    width: windowWidth,
    marginBottom: normalize(50),
  },
  line: {
    width: windowWidth * 0.90,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Color.black,
    marginBottom: 10,
    marginTop: 10,
  },
  tab_title: {
    padding: 5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  loader_text: {
    fontSize: normalize(13),
    marginStart: normalize(5),
    color: Color.text_color,
  },
  indicator_sub: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stt_main: {
    backgroundColor: Color.transparent,
    marginBottom: 35,
    marginRight: 10,
  },
  stt_text: {
    backgroundColor: 'rgba(75, 78, 222, 0.05)',
    flexWrap: 'nowrap',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#4B4EDE',
    margin: StyleSheet.hairlineWidth,
    padding: 10,
    flexShrink: 1,
    flexGrow: 1,
    alignSelf: 'flex-end',
  },
  progress_main: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  close_icon_main: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: Color.white,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: Color.black,
    right: 0,
    marginEnd: -5,
    padding: 2,
  },
  media_sub1: {marginStart: 20},
  media_main: {
    flexDirection: 'row',
    flex: 1,
    padding: 5,
  },
  menu_item_main: {padding: 10, backgroundColor: Color.white},
  menu_item_text: {fontSize: normalize(16), color: Color.black},
  line1: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Color.gray,
    width: '100%',
    marginBottom: 7,
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Example background color
    padding: 20,
    borderRadius: 10,
    left: '50%',
    top: '50%',
    zIndex: -1,
  },
  handle_container: {
    alignItems: 'center',
    height: 26,
    justifyContent: 'center',
  },
  handle: {
    width: 64,
    height: 5.8,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0.45,
    borderColor: 'black',
    justifyContent: 'center',
  },
  pop_sub: {
    flexDirection: 'column',
    padding: 10,
    marginBottom: 10,
    backgroundColor: Color.white,
    minWidth: normalize(80),
  },
  pop_main: {
    position: 'absolute',
    end: 0,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 5,
    paddingEnd: 10,
    paddingBottom: 5,
    marginEnd: 5,
    zIndex: 1,
  },
  dropdown_main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  m_main_con: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  close_btn_txt: {
    color: Color.blue,
    fontSize: normalize(18),
  },
  close_btn_con: {
    backgroundColor: Color.white,
    paddingEnd: 10,
    paddingStart: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderTopEndRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  m_con2: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  image: {
    height: normalize(20),
    width: normalize(30),
    resizeMode: 'stretch',
    margin: 0,
  },
  quick_container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
    marginStart: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    borderColor: '#BDC1C6', //'#F8F9FA',
    borderWidth: 1,
    backgroundColor: 'white',
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
  },
  quick_container_2: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
    marginStart: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    borderColor: '#BDC1C6', //'#F8F9FA',
    borderWidth: 1,
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    backgroundColor: '#0D6EFD',
  },
  quick_main_container: {
    marginStart: 5,
    marginEnd: 5,
    alignItems: 'flex-start',
    elevation: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
    backgroundColor: '#FCFCFC',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  load: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

KoreChat.defaultProps = {
  _actionSheetRef: null,
  messagesContainerStyle: null,
  text: null,
  placeholder: DEFAULT_PLACEHOLDER,
  disableComposer: false,
  messageIdGenerator: () => uuid.v4(),
  user: {},
  onSend: undefined,
  locale: null, // Auto-detect device locale
  timeFormat: TIME_FORMAT,
  dateFormat: DATE_FORMAT,
  loadEarlier: false,
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
  renderLoading: null,
  renderLoadEarlier: null,
  renderAvatar: null,
  showUserAvatar: false,
  actionSheet: null,
  onPressAvatar: null,
  onLongPressAvatar: null,
  renderUsernameOnMessage: false,
  renderAvatarOnTop: false,
  onLongPress: null,
  renderMessage: null,
  renderMessageText: null,
  imageProps: {},
  videoProps: {},
  audioProps: {},
  lightboxProps: {},
  textInputProps: {},
  listViewProps: {},
  renderCustomView: null,
  isCustomViewBottom: false,
  renderDay: null,
  renderTime: null,
  renderFooter: null,
  renderChatEmpty: null,
  renderChatFooter: null,
  renderInputToolbar: null,
  renderComposer: null,
  renderActions: null,
  renderSend: null,
  renderAccessory: null,
  isKeyboardInternallyHandled: true,
  onPressActionButton: null,
  bottomOffset: 0,
  minInputToolbarHeight: 44,
  keyboardShouldPersistTaps: Platform.select({
    ios: 'never',
    android: 'always',
    default: 'never',
  }),
  onInputTextChanged: null,
  maxInputLength: null,
  forceGetKeyboardHeight: false,
  inverted: true,
  extraData: null,
  minComposerHeight: MIN_COMPOSER_HEIGHT,
  maxComposerHeight: MAX_COMPOSER_HEIGHT,
  wrapInSafeArea: true,
  renderSuggestionsView: null,
  renderMediaView: null,
  Suggestions: [],
  renderQuickRepliesView: null,
  onFormAction: null,
  renderTypingIndicator: null,
  renderSpeechToText: null,
  clickSpeechToText: null,
  onDragList: null,
  alignTop: false,
  initialText: undefined,
  onListItemClick: undefined,
  menuItems: [],
};
