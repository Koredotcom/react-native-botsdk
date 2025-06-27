import * as React from 'react';
import {BackHandler, SafeAreaView, Text, View} from 'react-native';
import styles from './styles';
import KoreChat from '../../../bot-sdk/chat/KoreChat';

import WAKeyboardAvoidingView from '../../components/WAKeyboardAvoidingView';
import {
  DEFAULT_PLACEHOLDER,
  HeaderIconsId,
  //KORA_ITEM_CLICK,
  TEMPLATE_TYPES,
} from '../../../bot-sdk/constants/Constant';
//import {botConfig} from './BotConfig';
//import {IThemeType} from '../../../bot-sdk/theme/IThemeType';
import {Composer} from '../../../bot-sdk/chat/components/Composer';
import Send from '../../../bot-sdk/chat/components/Send';
import InputToolbar from '../../../bot-sdk/chat/components/InputToolbar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgIcon} from '../../../bot-sdk/utils/SvgIcon';
import {normalize} from '../../../bot-sdk/utils/helpers';
import CustomButton from './CustomButton';

interface homeState {
  modalVisible?: boolean;
  viewMoreObj?: any;
}
interface HomeProps {
  navigation?: any;
  route?: any;
  onStatusBarColor: (colorCode: string) => void;
}

class Home extends React.Component<HomeProps, homeState> {
  _unsubscribeConn: any;
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      modalVisible: false,
      viewMoreObj: undefined,
    };
  }

  private renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={styles.composer_inputText}
      placeholder={DEFAULT_PLACEHOLDER}
    />
  );

  private renderActions = (_props: any) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{padding: 5, marginLeft: 5}}>
          <SvgIcon
            name={'MenuIcon'}
            width={normalize(22)}
            height={normalize(22)}
            color={'#697586'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 5}}>
          <SvgIcon
            name={'AttachmentIcon'}
            width={normalize(22)}
            height={normalize(22)}
            color={'#697586'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  private renderSend = (props: any) => {
    let disabled = true;
    let text = props?.text;
    if (text && text?.trim().length > 0) {
      disabled = false;
    }
    return (
      <Send {...props} containerStyle={styles.send_main_container}>
        {disabled ? (
          <View
            //underlayColor={'#817dff'}
            style={[styles.send_container]}>
            <TouchableOpacity style={{}}>
              <SvgIcon
                name={'MicIcon'}
                width={normalize(22)}
                height={normalize(22)}
                color={'#697586'}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            //underlayColor={'#817dff'}
            style={[
              styles.send_container,
              {backgroundColor: disabled ? 'grey' : '#0D6EFD'},
            ]}>
            <Text style={styles.goTextStyle}>{'Go'}</Text>
          </View>
        )}
      </Send>
    );
  };

  private renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{}}
      //primaryStyle={{alignItems: 'center'}}
    />
  );

  // private onListItemClick = (
  //   template_type: any,
  //   item: any,
  //   isFromViewMore?: boolean,
  //   theme?: IThemeType,
  // ): any => {
  //   console.log('BotUtils template_type --->:', template_type);
  //   console.log('BotUtils item --->:', item);
  //   // console.log('BotUtils theme --->:', theme);
  //   console.log('BotUtils isFromViewMore --->:', isFromViewMore);
  //   // let viewMoreObj = {
  //   //   template_type,
  //   //   payload: item,
  //   //   isFromViewMore,
  //   // };
  //   // this.props.navigation.navigate(ROUTE_NAMES.FULL_SCREEN_DIALOG);

  //   switch (template_type) {
  //     // case TEMPLATE_TYPES.TABLE_TEMPLATE:
  //     //   this.setState({modalVisible: true, viewMoreObj});
  //     //   break;
  //     default:
  //       return KORA_ITEM_CLICK;
  //   }
  // };
  // private onSend = (
  //   message: any,
  //   shouldResetInputToolbar = false,
  //   data_type = '',
  // ): void => {
  //   // console.log('message --->:', message);
  //   // console.log('data_type --->:', data_type);
  // };

  private onLongPress = (context: any, currentMessage: any) => {
    console.log('onLongPress context --->:', context);
    console.log('onLongPress currentMessage --->:', currentMessage);
  };

  private renderTypingIndicator = (props: any) => {
    console.log('props?.isTypingIndicator ------>:', props?.isTypingIndicator);

    if (!props?.isTypingIndicator) {
      return <></>;
    }

    return <Text>{'Typing...'}</Text>;
  };

  private onHeaderActionsClick = (item: any) => {
    console.log('onHeaderActionsClick item --->:', item);

    switch (item) {
      case HeaderIconsId.BACK:
        try {
          if (this.props.navigation?.canGoBack) {
            this.props.navigation?.goBack?.();
          } else {
            BackHandler.exitApp();
          }
        } catch (error) {
          BackHandler.exitApp();
        }
        break;
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
    }
  };

  render() {
    let config: any;
    if (this.props.route?.params?.botConfig) {
      config = this.props.route?.params?.botConfig;
    }
    return (
      <SafeAreaView style={styles.rootContainer}>
        <WAKeyboardAvoidingView style={styles.mainStyle2}>
          <KoreChat
            botConfig={config}
            // renderInputToolbar={this.renderInputToolbar}
            //renderComposer={this.renderComposer}
            //renderSend={this.renderSend}
            //renderActions={this.renderActions}
            alwaysShowSend={true}
            //onListItemClick={this.onListItemClick}
            //renderTypingIndicator={this.renderTypingIndicator}

            //scrollToBottom={true}
            //renderQuickRepliesView={renderQuickRepliesView}
            //onSend={onSend}
            // onLongPress={onLongPress}
            // isTyping={false}
            //renderSuggestionsView={this.renderSuggestionsView}
            //initialText={'Help'}
            //templateInjection={this.getCustomTemplates()}
            statusBarColor={(color: any) => {
              this.props.onStatusBarColor(color);
            }}
            //onHeaderActionsClick={this.onHeaderActionsClick}
            {...this.props}
          />
        </WAKeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  getCustomTemplates() {
    const hashMap = new Map();
    hashMap.set(TEMPLATE_TYPES.BUTTON, CustomButton);

    return hashMap;
  }
}

export default Home;
