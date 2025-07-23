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
import {BotConfigModel} from 'rn-kore-bot-socket-lib-v77';
import {ROUTE_NAMES} from '../../navigation/RouteNames';
import Color from '../../../bot-sdk/theme/Color';
import WAKeyboardAvoidingView from '../../components/WAKeyboardAvoidingView';

interface State {
  botName: string;
  botId: string;
  clientId: string;
  clientSecret: string;
  botUrl: string;
}

class WelcomeScreen extends Component<any, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      // botName: 'SDKDemo_2',
      // botId: 'st-93e92a33-6717-5705-84ab-27735c1e5718',
      // clientId: 'cs-77f8afd7-1f77-574d-8f4a-b71224ef70f8',
      // clientSecret: '+MTaAa4si5v97GYQURbY+AeX0dFjVxzk1fy8EjN8PZU=',
      // botUrl: 'https://platform.kore.ai',

      // botName: 'SDKDemo',
      // botId: 'st-f59fda8f-e42c-5c6a-bc55-3395c109862a',
      // clientId: 'cs-8fa81912-0b49-544a-848e-1ce84e7d2df6',
      // clientSecret: 'DnY4BIXBR0Ytmvdb3yI3Lvfri/iDc/UOsxY2tChs7SY=',
      // botUrl: 'https://platform.kore.ai',

      // botName: 'SDK',
      // botId: 'st-b9889c46-218c-58f7-838f-73ae9203488c',
      // clientId: 'cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9',
      // clientSecret: '5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=',
      // botUrl: 'https://bots.kore.ai',

      // botName: 'Master App Flow E2E',
      // botId: 'st-4bd54243-9b50-5d25-9473-902083e69ab7',
      // clientId: 'cs-7d19b962-7cc7-5b82-9b11-c0bfb1196cfb',
      // clientSecret: 'kJq3RsY2nYfgDOVnXf48ZLPXuVQrjwhZR0hJfm+3sT8=',
      // botUrl: 'https://staging-xo.korebots.com',

      // botName: 'E2E Small App 01',
      // botId: 'st-5bca8918-0ccb-5186-819f-7cf34e8cf758',
      // clientId: 'cs-0516c2cb-ce5b-5d1b-9d1a-e6a8eb5b07c5',
      // clientSecret: '/KdVnboltetVeIwLUGys4aey6Tc5xrbGAt8QbscKJi4=',
      // botUrl: 'https://staging-xo.korebots.com',

      botName: 'SDK V3 All Templates',
      botId: 'st-027b5770-6ff0-5d9f-a3df-89254b012a55',
      clientId: 'cs-c334ce38-b4ad-5027-861e-1d8150508bfa',
      clientSecret: 'ItUgs7N4wN013LAxSxJlAKmj7K8uZnojBC7ZSCwpmZ4=',
      botUrl: 'https://platform.kore.ai',
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
    const {botName, botId, clientId, clientSecret, botUrl} = this.state;

    if (
      !(
        this.isValid(botName) &&
        this.isValid(botId) &&
        this.isValid(clientId) &&
        this.isValid(clientSecret) &&
        this.isValid(botUrl)
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
      jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
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
