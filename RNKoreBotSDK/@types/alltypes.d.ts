declare module 'rn-kore-bot-sdk-v77' {
  import { ComponentType, ReactNode } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  // Bot Configuration
  export interface BotConfigModel {
    botId: string;
    chatBotName: string;
    serverUrl: string;
    brandingAPIUrl: string;
    clientId?: string;
    clientSecret?: string;
    identity?: string;
    isReconnect?: boolean;
    isAnonymous?: boolean;
    meta?: any;
    userAccessToken?: string;
    customData?: any;
  }

  // Theme Configuration
  export interface IThemeType {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
    accent?: string;
    error?: string;
    // Add other theme properties as needed
  }

  // Message Types
  export interface MessageType {
    _id: string | number;
    text?: string;
    createdAt: Date | number;
    user: {
      _id: string | number;
      name?: string;
      avatar?: string;
    };
    image?: string;
    video?: string;
    audio?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
    quickReplies?: QuickReply[];
  }

  export interface QuickReply {
    type: 'radio' | 'checkbox';
    keepIt?: boolean;
    values: QuickReplyValue[];
  }

  export interface QuickReplyValue {
    title: string;
    value: string;
    messageId?: string;
  }

  // Custom Template Props
  export interface CustomViewProps {
    currentMessage?: MessageType;
    previousMessage?: MessageType;
    nextMessage?: MessageType;
    position?: 'left' | 'right';
    optionType?: string;
    isGroupMessage?: boolean;
    theme?: IThemeType;
  }

  export interface CustomViewState {
    // Add state properties as needed
  }

  // Main Component Props
  export interface KoreChatProps {
    botConfig: BotConfigModel;
    messages?: MessageType[];
    text?: string | null;
    onSend?: (message: any) => void;
    onInputTextChanged?: (text: string) => void;
    onListItemClick?: (item: any) => void;
    onHeaderActionsClick?: (action: any) => void;
    renderQuickRepliesView?: (props: any) => ReactNode;
    renderChatHeader?: (props: any) => ReactNode;
    templateInjection?: Map<string, CustomTemplate<CustomViewProps, CustomViewState>>;
    style?: ViewStyle;
    messagesContainerStyle?: ViewStyle;
    textInputProps?: any;
    maxInputLength?: number;
    minComposerHeight?: number;
    alwaysShowSend?: boolean;
    scrollToBottom?: boolean;
    wrapInSafeArea?: boolean;
    navigation?: any;
    route?: any;
    statusBarColor?: (colorCode: any) => void;
  }

  // Component Classes
  export class CustomTemplate<P = CustomViewProps, S = CustomViewState> {
    constructor(props: P);
    render(): ReactNode;
  }

  // Main Components
  export default class KoreChat {
    constructor(props: KoreChatProps);
    render(): ReactNode;
  }
  
  export class BotTemplate {
    constructor(props: any);
    render(): ReactNode;
  }
  
  export class QuickReplies {
    constructor(props: any);
    render(): ReactNode;
  }
  
  export class InputToolbar {
    constructor(props: any);
    render(): ReactNode;
  }
  
  export class ThemeProvider {
    constructor(props: { theme?: IThemeType; children: ReactNode });
    render(): ReactNode;
  }

  // Constants
  export const TEMPLATE_TYPES: {
    [key: string]: string;
  };

  export const MIN_COMPOSER_HEIGHT: number;
  export const MAX_COMPOSER_HEIGHT: number;
  export const DEFAULT_PLACEHOLDER: string;
  export const TIME_FORMAT: string;
  export const DATE_FORMAT: string;

  // Utility Functions
  export function getTemplateType(template: any): string;
  export function normalize(size: number): number;
  export function renderImage(source: any, style?: any): ReactNode;
}

// SVG Module Declaration
declare module '*.svg' {
  const content: string;
  export default content;
}

// Image Module Declarations
declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}
