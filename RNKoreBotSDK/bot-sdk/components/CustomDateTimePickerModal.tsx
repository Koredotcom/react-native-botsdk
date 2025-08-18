import React, {Component} from 'react';
import {View, StyleSheet, Platform, Button} from 'react-native';
import CustomModal from './CustomModal';
import { LazyDateTimePicker, FallbackDateTimePicker } from './LazyDateTimePicker';

interface CustomDateTimePickerModalProps {
  isVisible: boolean;
  mode?: 'date' | 'time' | 'datetime';
  date?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  is24Hour?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  display?: 'default' | 'spinner' | 'compact' | 'inline';
}

interface CustomDateTimePickerModalState {
  selectedDate: Date;
}

class CustomDateTimePickerModal extends Component<
  CustomDateTimePickerModalProps,
  CustomDateTimePickerModalState
> {
  constructor(props: CustomDateTimePickerModalProps) {
    super(props);
    this.state = {
      selectedDate: props.date || new Date(),
    };
  }

  componentDidUpdate(prevProps: CustomDateTimePickerModalProps) {
    // Update internal date when prop changes
    if (prevProps.date !== this.props.date && this.props.date) {
      this.setState({selectedDate: this.props.date});
    }
  }

  handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // On Android, the picker automatically closes after selection
      if (event.type === 'set' && selectedDate) {
        this.setState({selectedDate});
        this.props.onConfirm(selectedDate);
      } else if (event.type === 'dismissed') {
        this.props.onCancel();
      }
    } else {
      // On iOS, update the state but don't auto-confirm
      if (selectedDate) {
        this.setState({selectedDate});
      }
    }
  };

  handleConfirm = () => {
    this.props.onConfirm(this.state.selectedDate);
  };

  handleCancel = () => {
    // Reset to original date
    this.setState({selectedDate: this.props.date || new Date()});
    this.props.onCancel();
  };

  render() {
    const {
      isVisible,
      mode = 'date',
      is24Hour = false,
      minimumDate,
      maximumDate,
      display = 'default',
    } = this.props;

    if (Platform.OS === 'android') {
      // On Android, show the native picker directly
      return isVisible ? (
        <LazyDateTimePicker
          value={this.state.selectedDate}
          mode={mode}
          is24Hour={Boolean(is24Hour)}
          display={display}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={this.handleDateChange}
          fallbackComponent={FallbackDateTimePicker}
        />
      ) : null;
    }

    // On iOS, wrap in modal
    return (
      <CustomModal
        isVisible={isVisible}
        onBackdropPress={this.handleCancel}
        onBackButtonPress={this.handleCancel}
        animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.pickerContainer}>
            <LazyDateTimePicker
              value={this.state.selectedDate}
              mode={mode}
              is24Hour={Boolean(is24Hour)}
              display={display}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={this.handleDateChange}
              style={styles.picker}
              fallbackComponent={FallbackDateTimePicker}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Cancel" onPress={this.handleCancel} color="#ff6b6b" />
            </View>
            <View style={styles.button}>
              <Button title="Confirm" onPress={this.handleConfirm} color="#4ECDC4" />
            </View>
          </View>
        </View>
      </CustomModal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: '90%',
    width: Platform.OS === 'ios' ? 300 : '100%',
  },
  pickerContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 40,
    width: Platform.OS === 'ios' ? 280 : '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default CustomDateTimePickerModal; 