/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

import { BotConfigModel } from 'rn-kore-bot-socket-lib-v79';
import { ROUTE_NAMES } from '../../navigation/RouteNames';
import Color from 'rn-kore-bot-sdk-v79-test';
import WAKeyboardAvoidingView from '../../components/WAKeyboardAvoidingView';

interface State {
  botName: string;
  botId: string;
  clientId: string;
  clientSecret: string;
  botUrl: string;
  jwtServerUrl: string;
  permissionsGranted: {
    camera: boolean;
    microphone: boolean;
    photoLibrary: boolean;
  };
  permissionsChecked: boolean;
}

class WelcomeScreen extends Component<any, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      botName: 'Kore.ai Bot',
      botId: 'st-b9889c46-218c-58f7-838f-73ae9203488c',
      clientId: 'cs-1e845b00-81ad-5757-a1e7-d0f6fea227e9',
      clientSecret: '5OcBSQtH/k6Q/S6A3bseYfOee02YjjLLTNoT1qZDBso=',
      botUrl: 'https://bots.kore.ai',
      jwtServerUrl: 'https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/',
      permissionsGranted: {
        camera: false,
        microphone: false,
        photoLibrary: false,
      },
      permissionsChecked: false,
    };
  }

  componentDidMount() {
    this.checkAndRequestPermissions();
  }

  handleChange = (field: keyof State, value: string) => {
    this.setState({ [field]: value } as Pick<State, keyof State>);
  };

  private getPermissionsToCheck = (): Permission[] => {
    if (Platform.OS === 'ios') {
      return [
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ];
    } else {
      return [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ];
    }
  };

  private checkPermission = async (permission: Permission): Promise<boolean> => {
    try {
      const result = await check(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.warn('Error checking permission:', error);
      return false;
    }
  };

  private requestPermission = async (permission: Permission): Promise<boolean> => {
    try {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.warn('Error requesting permission:', error);
      return false;
    }
  };

  private checkAndRequestPermissions = async () => {
    const permissions = this.getPermissionsToCheck();
    const [cameraPermission, microphonePermission, photoLibraryPermission] = permissions;

    try {
      // Check current permissions
      const cameraGranted = await this.checkPermission(cameraPermission);
      const microphoneGranted = await this.checkPermission(microphonePermission);
      const photoLibraryGranted = await this.checkPermission(photoLibraryPermission);

      // Request permissions that are not granted
      const finalCameraGranted = cameraGranted || await this.requestPermission(cameraPermission);
      const finalMicrophoneGranted = microphoneGranted || await this.requestPermission(microphonePermission);
      const finalPhotoLibraryGranted = photoLibraryGranted || await this.requestPermission(photoLibraryPermission);

      this.setState({
        permissionsGranted: {
          camera: finalCameraGranted,
          microphone: finalMicrophoneGranted,
          photoLibrary: finalPhotoLibraryGranted,
        },
        permissionsChecked: true,
      });

      // Show alert if any permissions are denied
      if (!finalCameraGranted || !finalMicrophoneGranted || !finalPhotoLibraryGranted) {
        const deniedPermissions = [];
        if (!finalCameraGranted) deniedPermissions.push('Camera');
        if (!finalMicrophoneGranted) deniedPermissions.push('Microphone');
        if (!finalPhotoLibraryGranted) deniedPermissions.push('Photo Library');

        Alert.alert(
          'Permissions Required',
          `The following permissions are required for full functionality: ${deniedPermissions.join(', ')}. You can enable them in Settings.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error handling permissions:', error);
      this.setState({
        permissionsGranted: {
          camera: false,
          microphone: false,
          photoLibrary: false,
        },
        permissionsChecked: true,
      });
    }
  };

  private requestPermissionsAgain = () => {
    this.setState({
      permissionsChecked: false,
      permissionsGranted: {
        camera: false,
        microphone: false,
        photoLibrary: false,
      },
    }, () => {
      this.checkAndRequestPermissions();
    });
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
    const { botName, botId, clientId, clientSecret, botUrl, jwtServerUrl } = this.state;

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
      identity: '1234567890',
      isWebHook: false,
      value_aud: 'https://idproxy.kore.com/authorize', //this is for jwt token generation
      jwtServerUrl: jwtServerUrl,
      isHeaderVisible: true,
      isFooterVisible: true,
    };

    this.props.navigation.navigate(ROUTE_NAMES.HOME, { botConfig: botConfig });
  };

  private renderPermissionStatus = () => {
    const { permissionsGranted, permissionsChecked } = this.state;

    if (!permissionsChecked) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Checking Permissions...</Text>
        </View>
      );
    }

    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>App Permissions</Text>
        <View style={styles.permissionRow}>
          <Text style={styles.permissionLabel}>Camera:</Text>
          <Text style={[styles.permissionStatus, { color: permissionsGranted.camera ? Color.green : Color.red }]}>
            {permissionsGranted.camera ? '✓ Granted' : '✗ Denied'}
          </Text>
        </View>
        <View style={styles.permissionRow}>
          <Text style={styles.permissionLabel}>Microphone:</Text>
          <Text style={[styles.permissionStatus, { color: permissionsGranted.microphone ? Color.green : Color.red }]}>
            {permissionsGranted.microphone ? '✓ Granted' : '✗ Denied'}
          </Text>
        </View>
        <View style={styles.permissionRow}>
          <Text style={styles.permissionLabel}>Photo Library:</Text>
          <Text style={[styles.permissionStatus, { color: permissionsGranted.photoLibrary ? Color.green : Color.red }]}>
            {permissionsGranted.photoLibrary ? '✓ Granted' : '✗ Denied'}
          </Text>
        </View>
        {(!permissionsGranted.camera || !permissionsGranted.microphone || !permissionsGranted.photoLibrary) && (
          <Button 
            title="Request Permissions Again" 
            onPress={this.requestPermissionsAgain}
            color={Color.blue}
          />
        )}
      </View>
    );
  };

  render() {
    const { botName, botId, clientId, clientSecret, botUrl } = this.state;

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
            {this.renderPermissionStatus()}
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
  permissionContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Color.black,
    textAlign: 'center',
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionLabel: {
    fontSize: 14,
    color: Color.black,
    fontWeight: '500',
  },
  permissionStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
