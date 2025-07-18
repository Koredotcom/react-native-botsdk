import * as React from 'react';
import {SafeAreaView} from 'react-native';
import styles from './styles';
import KoreChat from 'rn-kore-bot-sdk-v77';

import WAKeyboardAvoidingView from '../../components/WAKeyboardAvoidingView';
import {
  TEMPLATE_TYPES,
} from 'rn-kore-bot-sdk-v77';
import CustomButton from '../../customTemplates/CustomButton';

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
