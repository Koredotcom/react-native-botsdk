import * as React from 'react';
import { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LoadEarlier from './LoadEarlier';
import Message, { MessageProps } from './Message';
import Color from '../../theme/Color';
import { ThemeType } from '../../theme/ThemeType';
import { ThemeContext } from '../../theme/ThemeContext';
import { IThemeType } from '../../theme/IThemeType';
import { TEMPLATE_TYPES } from '../../constants/Constant';
import KoreBotClient, { ApiService, BotConfigModel } from 'rn-kore-bot-socket-lib-v77';
import { getWindowWidth } from '../../charts';
import { LocalizationManager } from '../../constants/Localization';

interface MessageContainerProps {
  //extends MessageProps {
  messages: any[];
  isTyping: boolean;
  renderChatEmpty?: (() => any) | null;
  renderFooter?: (() => any) | null;
  renderMessage?: ((props: MessageProps | any) => any) | null;
  renderLoadEarlier?: ((props: any) => any) | null;
  onLoadEarlier: () => void;
  onQuickReply: () => void;
  inverted: boolean;
  loadEarlier: boolean;
  listViewProps: any;
  invertibleScrollViewProps: any;
  extraData: any;
  scrollToBottom: boolean;
  scrollToBottomOffset: number;
  scrollToBottomComponent?: () => any;
  alignTop: boolean;
  scrollToBottomStyle: any;
  infiniteScroll: boolean;
  isLoadingEarlier: boolean;
  forwardRef: any;
  onDragList: any;
  position: 'right' | 'center' | 'left';
  onListItemClick: any;
  botConfig: BotConfigModel;
  onHistoryLoaded: (messages: any[]) => any
  onSendText?: any;
}

interface MessageContainerState {
  showScrollBottom: boolean;
  hasMoreHististory: boolean;
  historyOffset: number;
  loadingHistory: boolean;
  isListScrollable: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAlignTop: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: Color.white,
  },
  history_container: {
    flex: 1,
    justifyContent: "center", // center vertically
    alignItems: "center",     // center horizontally
  },
  heading: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    maxWidth: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Android shadow
  },
  contentContainerStyle: {
    //flexGrow: 1,
    //justifyContent: 'flex-end',
  },
  emptyChatContainer: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
  },
  scrollToBottomStyle: {
    opacity: 0.8,
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
});

export default class MessageContainer extends PureComponent<
  MessageContainerProps,
  MessageContainerState
> {
  private listLayoutHeight = 0;
  private listContentHeight = 0;
  static contextType = ThemeContext;
  static defaultProps = {
    messages: [],
    isTyping: false,
    renderChatEmpty: null,
    renderFooter: null,
    renderMessage: null,
    onLoadEarlier: () => { },
    onQuickReply: () => { },
    inverted: true,
    loadEarlier: false,
    listViewProps: {},
    invertibleScrollViewProps: {},
    extraData: null,
    scrollToBottom: false,
    scrollToBottomOffset: 0,
    alignTop: false,
    scrollToBottomStyle: {},
    infiniteScroll: false,
    isLoadingEarlier: false,
    position: 'right',
    onListItemClick: undefined,
  };
  state: MessageContainerState = {
    showScrollBottom: false,
    hasMoreHististory: true,
    historyOffset: 0,
    loadingHistory: false,
    isListScrollable: false
  };

  renderFooter = (): any => {
    if (this.props.renderFooter) {
      return this.props.renderFooter();
    }

    return null;
  };

  // renderLoadEarlier = (): any => {
  //   if (this.props.loadEarlier === true) {
  //     const loadEarlierProps = {
  //       ...this.props,
  //     };
  //     if (this.props.renderLoadEarlier) {
  //       return this.props.renderLoadEarlier(loadEarlierProps);
  //     }
  //     return <LoadEarlier {...loadEarlierProps} />;
  //   }
  //   return null;
  // };


  scrollTo(options: { offset: number; animated?: boolean }): void {
    if (this.props.forwardRef && this.props.forwardRef.current && options) {
      this.props.forwardRef.current.scrollToOffset(options);
    }
  }

  scrollToBottom = (animated: boolean): void => {
    const { inverted } = this.props;
    if (inverted) {
      this.scrollTo({ offset: 0, animated });
    } else if (this.props.forwardRef && this.props.forwardRef.current) {
      this.props.forwardRef?.current?.scrollToEnd({ animated });
    }
  };

  handleOnScroll = (event: any): void => {
    const {
      nativeEvent: {
        contentOffset: { y: contentOffsetY },
        contentSize: { height: contentSizeHeight },
        layoutMeasurement: { height: layoutMeasurementHeight },
      },
    } = event;
    const { scrollToBottomOffset } = this.props;
    if (this.props.onDragList) {
      this.props.onDragList();
    }
    if (this.props.inverted) {
      if (contentOffsetY > scrollToBottomOffset) {
        this.setState({ showScrollBottom: true });
      } else {
        this.setState({ showScrollBottom: false });
      }
    } else {
      if (
        contentOffsetY < scrollToBottomOffset &&
        contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset
      ) {
        this.setState({ showScrollBottom: true });
      } else {
        this.setState({ showScrollBottom: false });
      }
    }
  };

  renderRow = ({ item, index }: { item: any; index: number }): any => {
    const { messages, inverted, ...restProps } = this.props;
    if (messages) {
      const previousMessage =
        (inverted ? messages[index + 1] : messages[index - 1]) || {};
      const nextMessage =
        (inverted ? messages[index - 1] : messages[index + 1]) || {};

      let position = this.props.position;
      let isDisplayTime = true;
      switch (item.type) {
        case 'bot_response':
          position = 'left';

          if (
            item.message &&
            item.message[0] &&
            item.message[0].component &&
            item.message[0].component.payload &&
            item.message[0].component.payload.type &&
            item.message[0].component.type === 'template' &&
            item.message[0].component.payload.payload &&
            item.message[0].component.payload.payload.template_type &&
            item.message[0].component.payload.payload.template_type !==
            TEMPLATE_TYPES.START_TIMER &&
            item.message[0].component.payload.payload.template_type !==
            TEMPLATE_TYPES.QUICK_REPLIES &&
            item.message[0].component.payload.payload.template_type !==
            TEMPLATE_TYPES.LIVE_AGENT_TEMPLATE &&
            item.message[0].component.payload.payload.template_type !==
            TEMPLATE_TYPES.SYSTEM_TEMPLATE
          ) {
            //position = 'center';
            //isDisplayTime = false;
          }
          if (
            item?.message?.[0]?.component?.type === 'template' &&
            item?.message?.[0]?.component?.payload?.type === 'image' &&
            item.message[0].component.payload?.payload
          ) {
            //position = 'center';
            isDisplayTime = false;
          }

          break;
        case 'user_message':
          position = 'right';
          break;

        default:
          break;
      }
      let totalLength = messages ? messages.length : 0;
      item = {
        ...item,
        totalLength: totalLength,
        itemIndex: index,
        position: position,
      };

      const messageProps = {
        ...restProps,
        key: item._id,
        currentMessage: item,
        previousMessage,
        inverted,
        nextMessage,
        itemIndex: index,
        isFirstMsz: totalLength - 1 === index,
        position: position,
        onListItemClick: this.onListItemClick,
        onSendText: this.props.onSendText,
        isDisplayTime: isDisplayTime,
      };

      if (this.props.renderMessage) {
        return this.props.renderMessage(messageProps);
      }
      const theme = this.context as IThemeType;
      return <Message {...messageProps} theme={theme} />;
    }
    return null;
  };

  private onListItemClick = (
    template_type?: string,
    item?: any,
    isFromViewMore?: boolean,
  ) => {
    if (this.props.onListItemClick) {
      const theme = this.context as ThemeType;
      this.props.onListItemClick(template_type, item, isFromViewMore, theme);
    }
  };

  renderChatEmpty = (): any => {
    if (this.props.renderChatEmpty) {
      return this.props.inverted ? (
        this.props.renderChatEmpty()
      ) : (
        <View style={styles.emptyChatContainer}>
          {this.props.renderChatEmpty()}
        </View>
      );
    }
    return <View style={styles.container} />;
  };

  renderHeaderWrapper = (): any => (
    <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>
  );

  renderScrollBottomComponent(): any {
    const { scrollToBottomComponent } = this.props;

    if (scrollToBottomComponent) {
      return scrollToBottomComponent();
    }

    return <Text>V</Text>;
  }

  renderScrollToBottomWrapper(): any {
    const propsStyle = this.props.scrollToBottomStyle || {};
    return (
      <View style={[styles.scrollToBottomStyle, propsStyle]}>
        <TouchableOpacity
          onPress={() => this.scrollToBottom(false)}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}>
          {this.renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>
    );
  }

  onLayoutList = (e: any): void => {
    const height = e?.nativeEvent?.layout?.height;
    if (typeof height === 'number' && height > 0 && height !== this.listLayoutHeight) {
      this.listLayoutHeight = height;
      this.setState({ isListScrollable: this.isListScrollable() });
    }
    if (
      !this.props.inverted &&
      !!this.props.messages &&
      this.props.messages?.length
    ) {
      setTimeout(
        () => this.scrollToBottom && this.scrollToBottom(true),
        15 * (this.props.messages?.length || 1),
      );
    }
  };

  private isListScrollable = (): boolean => {
    if (this.listLayoutHeight && this.listContentHeight) {
      const canScroll = this.listContentHeight > this.listLayoutHeight + 1;
      return canScroll;
    }
    return false;
  };

  onEndReached = (distanceFromEnd: number): void => {
    const { loadEarlier, onLoadEarlier, infiniteScroll, isLoadingEarlier } =
      this.props;
    if (
      infiniteScroll &&
      distanceFromEnd > 0 &&
      distanceFromEnd <= 100 &&
      loadEarlier &&
      onLoadEarlier &&
      !isLoadingEarlier &&
      Platform.OS !== 'web'
    ) {
      onLoadEarlier();
    }
  };

  getItemId = (pattern?: string): string => {
    let _pattern = pattern || 'xyxxyx';
    _pattern = _pattern.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return _pattern;
  };

  keyExtractor = (item: any): string => {
    // if (item.itemId) {
    //   return item.itemId;
    // } else {
    // const itemId = this.getItemId();
    const itemId = item.timeMillis;
    item = {
      ...item,
      itemId,
    };
    return item.itemId;
    // }
  };

  loadHistory = async () => {
    if (this.state.hasMoreHististory) {
      // this.setState({historyOffset: this.props.messages.length});

      const apiService = new ApiService(this.props.botConfig.botUrl, KoreBotClient.getInstance());
      await apiService.getBotHistory(this.props.messages.length, 10, this.props.botConfig, (response: any) => {

        this.setState({ loadingHistory: false });
        if (response == null) {
          console.log('BotHistory null');
          return;
        }
        this.setState({ hasMoreHististory: response.data.moreAvailable });
        this.props.onHistoryLoaded(response.data.botHistory);
      });
    } else {
      await new Promise((res) => setTimeout(res, 1000));
      this.setState({ loadingHistory: false });
    }
  };

  private renderLoadEarlier = () => {
    //Show only if we already have 10+ messages
    if (!this.state.isListScrollable) return null;

    if (this.props.loadEarlier) {
      return <ActivityIndicator size="small" style={{ padding: 10 }} />;
    }
    return (
      <View style={styles.history_container}>
        <TouchableOpacity
          style={[styles.card, styles.shadowProp]}
          onPress={this.loadHistory}
        >
          <Text style={styles.heading} >{LocalizationManager.getLocalizedString('load_earlier_messages')}</Text>
        </TouchableOpacity>
      </View>

    );
  };


  render() {
    const { inverted } = this.props;
    return (
      <View
        style={[
          this.props.alignTop ? styles.containerAlignTop : styles.container,
          { backgroundColor: this.getBackgroundColor() },
        ]}>
        {this.state.showScrollBottom && this.props.scrollToBottom
          ? this.renderScrollToBottomWrapper()
          : null}
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: '#ffffff', alignSelf: 'flex-end', marginEnd: 5 }}
          onPress={(v) => {
            if (!this.state.loadingHistory) {
              this.setState({ loadingHistory: true });
              this.loadHistory();
            }
          }}>
          <Text style={{ fontSize: 10, color: '#000000', fontWeight: 'bold', display: 'none' }}>Load history</Text>
        </TouchableOpacity>
        <FlatList
          ref={this.props.forwardRef}
          extraData={[this.props.extraData, this.props.isTyping]}
          keyExtractor={this.keyExtractor}
          enableEmptySections
          automaticallyAdjustContentInsets={false}
          inverted={inverted}
          showsVerticalScrollIndicator={false}
          data={this.props.messages}
          // style={[{transform: [{rotate: '180deg'}]}]}
          //style={styles.listStyle}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={this.renderRow}
          {...this.props.invertibleScrollViewProps}
          ListEmptyComponent={this.renderChatEmpty}
          ListFooterComponent={
            inverted ? this.renderHeaderWrapper : this.renderFooter
          }
          ListHeaderComponent={
            inverted ? this.renderFooter : this.renderHeaderWrapper
          }
          onScroll={this.handleOnScroll}
          scrollEventThrottle={100}
          onLayout={this.onLayoutList}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          {...this.props.listViewProps}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          estimatedItemSize={100}
          contentInsetAdjustmentBehavior="scrollableAxes"
          scrollIndicatorInsets={{ top: 0, left: 20, bottom: 0, right: 0 }}
          onContentSizeChange={(w, h) => {
            if (typeof h === 'number' && h > 0 && h !== this.listContentHeight) {
              this.listContentHeight = h;
              this.setState({ isListScrollable: this.isListScrollable() });
            }
          }}
        />
        {this.state.loadingHistory ? (
          <ActivityIndicator size="large" style={{ flex: 1, width: getWindowWidth(), position: 'absolute' }} />
        ) : <></>}
      </View>
    );
  }
  private getBackgroundColor = () => {
    const theme = this.context as ThemeType;

    if (theme?.v3?.body?.background?.type === 'color') {
      return theme?.v3?.body?.background?.color || '#FFFFFF';
    }

    return '#FFFFFF';
  };
}
