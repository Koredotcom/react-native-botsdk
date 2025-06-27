import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
const windowWidth = Dimensions.get('window').width;

interface FormProps extends BaseViewProps {}
interface FormState extends BaseViewState {
  inputText?: string;
}

export default class FormTemplate extends BaseView<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      inputText: undefined,
    };
  }

  private renderFormFields = (formFields: any) => {
    if (!formFields || formFields?.length === 0) {
      return <></>;
    }

    const Wrapper: any = this.state.inputText ? TouchableOpacity : View;

    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {formFields.map((form: any) => {
          return (
            <View>
              <Text style={styles.lable}>{form?.label}</Text>
              <TextInput
                editable={!this.isViewDisable()}
                maxLength={50}
                numberOfLines={1}
                textContentType={form?.type === 'text' ? 'none' : 'password'}
                secureTextEntry={form?.type !== 'text'}
                autoCorrect={false}
                style={[styles.input, {}]}
                placeholder={form?.placeholder}
                placeholderTextColor={'#e4e5eb'}
                autoCapitalize="none"
                onChangeText={text => {
                  if (text?.trim().length === 0) {
                    this.setState({
                      inputText: undefined,
                    });
                  } else {
                    this.setState({
                      inputText: text,
                    });
                  }
                }}
              />
              {form?.fieldButton && (
                <Wrapper
                  onPress={() => {
                    if (!this.state?.inputText) {
                      return;
                    }
                    let title = '';
                    const length = this.state?.inputText?.length || 0;
                    for (let i = 0; i < length; i++) {
                      title = title + '*';
                    }

                    if (form?.type === 'text') {
                      title = this.state?.inputText;
                    }

                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      {
                        title: title,
                        payload: this.state?.inputText,
                        type: 'postback',
                      },
                    );
                  }}
                  style={[
                    styles.button,
                    {
                      backgroundColor: Color.button_blue,
                    },
                  ]}>
                  <Text style={{color: Color.white}}>
                    {form?.fieldButton?.title}
                  </Text>
                </Wrapper>
              )}
            </View>
          );
        })}
      </View>
    );
  };
  render() {
    return this.props?.payload?.formFields ? (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.container}>
        <Text style={styles.heading}>{this.props?.payload?.heading}</Text>
        {this.renderFormFields(this.props?.payload?.formFields)}
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lable: {
    paddingHorizontal: 10,
    marginTop: 10,
    color: '#404051',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontWeight: 'normal',
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  heading: {
    color: '#404051',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontWeight: '800',
    padding: 10,
    letterSpacing: 0.2,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },
  container: {
    backgroundColor: '#e4e5eb',
    marginEnd: 10,
    borderRadius: 5,
    width: (windowWidth / 4) * 3,
  },
  input: {
    height: 40,
    borderColor: Color.gray,
    borderWidth: 1,
    backgroundColor: Color.white,
    paddingLeft: 8,
    marginBottom: 15,
    borderRadius: 5,
    letterSpacing: 0.2,
    marginHorizontal: 10,
  },
});
