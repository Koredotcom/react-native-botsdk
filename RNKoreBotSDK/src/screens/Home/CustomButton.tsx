import CustomTemplate, {
  CustomViewProps,
  CustomViewState,
} from '../../../bot-sdk/templates/CustomTemplate';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {text} from 'react-native-communications';

interface btnProps extends CustomViewProps {}
interface btnState extends CustomViewState {}

export default class CustomButton extends CustomTemplate<btnProps, btnState> {
  componentDidMount(): void {
    // console.log('++++++++++++++++ XXXXXXXXXXXXXXXXXXXXX ++++++++++++++++++++');
    // console.log('this is from CustomButton  ------>:', this.props.payload);
    // console.log('++++++++++++++++ XXXXXXXXXXXXXXXXXXXXX ++++++++++++++++++++');
  }
  render() {
    return (
      <View style={styles.main}>
        <Text>{this.props?.payload?.text}</Text>
        <View style={styles.sub}>
          {this.props?.payload?.buttons.map((btn: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (this.props.onListItemClick)
                    this.props.onListItemClick(
                      this.props.payload?.template_type.trim(),
                      btn,
                    );
                }}
                style={styles.btn}>
                <Text style={styles.text}>{btn?.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {padding: 15, margin: 10},
  sub: {marginTop: 20, marginBottom: 20},
  btn: {margin: 5, padding: 10, alignItems: 'center'},
  text: {
    padding: 5,
    color: '#FFFFFF',
    fontSize: 18,
    backgroundColor: 'red',
  },
});
