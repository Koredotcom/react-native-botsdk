import React, {Component} from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import Modal from './CustomModal';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';

type Props = {
  thisRef?: any;
};
type State = {
  isModalVisible: boolean;
  title: string;
  message: string;
  onPress: any;
};

class CustomAlertComponent extends Component<Props, State> {
  state: State = {
    isModalVisible: false,
    title: '',
    message: '',
    onPress: null,
  };

  componentDidMount(): void {
    if (this.props?.thisRef) {
      this.props?.thisRef(this);
    }
  }

  showAlert = (title: string, message: string, onPress?: any) => {
    // Update the state with the latest title and message
    this.setState({
      isModalVisible: true,
      title,
      message,
      onPress,
    });
  };

  hideAlert = () => {
    this.setState({isModalVisible: false});

    if (this.state.onPress) {
      this.state.onPress();
    }
  };

  render() {
    const {isModalVisible, title, message} = this.state;

    return (
      <View style={styles.container}>
        {/* <Button
          title="Alert"
          onPress={() =>
            this.showAlert(
              'Latest Alert',
              'This is the most recent alert message',
            )
          }
        /> */}

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={this.hideAlert}
          onBackButtonPress={this.hideAlert}
          useNativeDriver
          hideModalContentWhileAnimating>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>
            <View style={styles.btn}>
              <Button title=" Ok " onPress={this.hideAlert} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    //alignItems: 'center',
  },
  alertTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: 10,
    color: Color.text_color,
  },
  alertMessage: {
    fontSize: normalize(16),
    marginBottom: 20,
    color: Color.text_color,
  },
});

export default CustomAlertComponent;
