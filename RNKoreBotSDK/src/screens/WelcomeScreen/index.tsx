/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import uuid from 'react-native-uuid';
import {BotConfigModel} from 'rn-kore-bot-socket-lib';
import {ROUTE_NAMES} from '../../navigation/RouteNames';
import Color from '../../../bot-sdk/theme/Color';
import WAKeyboardAvoidingView from '../../components/WAKeyboardAvoidingView';

interface State {
  botName: string;
  botId: string;
  clientId: string;
  clientSecret: string;
  botUrl: string;
  jwtServerUrl: string;
}

class WelcomeScreen extends Component<any, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      botName: 'PLEASE_ENTER_BOT_NAME',
      botId: 'PLEASE_ENTER_BOT_ID',
      clientId: 'PLEASE_ENTER_CLIENT_ID',
      clientSecret: 'PLEASE_ENTER_CLIENT_SECRET',
      botUrl: 'PLEASE_ENTER_SERVER_URL',
      jwtServerUrl: 'PLEASE_ENTER_JWT_SERVER_URL',
    };
  }

  handleChange = (field: keyof State, value: string) => {
    this.setState({[field]: value} as Pick<State, keyof State>);
  };

  private isValid = (item: string) => {
    if (!item) {
      return false;
    }
    if (item?.trim()?.length === 0) {
      return false;
    }

    return true;
  };

  handleSubmit = () => {
    const {botName, botId, clientId, clientSecret, botUrl, jwtServerUrl} = this.state;

    if (
      !(
        this.isValid(botName) &&
        this.isValid(botId) &&
        this.isValid(clientId) &&
        this.isValid(clientSecret) &&
        this.isValid(botUrl) &&
        this.isValid(jwtServerUrl)
      )
    ) {
      Alert.alert('Alert', 'Please provide a valid bot configuration.');

      return;
    }

    const botConfig: BotConfigModel = {
      botName: botName,
      botId: botId,
      clientId: clientId,
      clientSecret: clientSecret,
      botUrl: botUrl,
      identity: uuid.v4() + '',
      isWebHook: false,
      value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
      jwtServerUrl: jwtServerUrl,
      isHeaderVisible: true,
      isFooterVisible: true,
    };

    this.props.navigation.navigate(ROUTE_NAMES.HOME, {botConfig: botConfig});
  };

  render() {
    const {botName, botId, clientId, clientSecret, botUrl} = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Color.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <WAKeyboardAvoidingView style={styles.mainStyle2}>
          <ScrollView
            contentContainerStyle={styles.container}
            style={styles.container1}>
            <Text style={styles.label}>Bot Name</Text>
            <TextInput
              style={styles.input}
              value={botName}
              onChangeText={value => this.handleChange('botName', value)}
            />
            <Text style={styles.label}>Bot ID</Text>
            <TextInput
              style={styles.input}
              value={botId}
              onChangeText={value => this.handleChange('botId', value)}
            />
            <Text style={styles.label}>Client ID</Text>
            <TextInput
              style={styles.input}
              value={clientId}
              onChangeText={value => this.handleChange('clientId', value)}
            />
            <Text style={styles.label}>Client Secret</Text>
            <TextInput
              style={styles.input}
              value={clientSecret}
              onChangeText={value => this.handleChange('clientSecret', value)}
            />
            <Text style={styles.label}>Bot URL</Text>
            <TextInput
              style={styles.input}
              value={botUrl}
              onChangeText={value => this.handleChange('botUrl', value)}
            />
            <Button title="Connect" onPress={this.handleSubmit} />
          </ScrollView>
        </WAKeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.black,
  },
  container1: {
    backgroundColor: '#fff',
    margin: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Color.black,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    color: Color.black,
  },
  mainStyle2: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;
