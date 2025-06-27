import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgIcon} from '../../utils/SvgIcon';
import normalize from '../datePicker/normalizeText';
import Color from '../../theme/Color';

interface FooterProps {}

interface FooterState {}

export default class WelcomeFooter extends React.Component<
  FooterProps,
  FooterState
> {
  render() {
    return (
      <View style={{backgroundColor: Color.transparent, padding: normalize(4)}}>
        <View style={styles.main}>
          <Text style={styles.text}>{'Powered by'}</Text>
          <SvgIcon
            name={'Koreai_logo'}
            width={normalize(41)}
            height={normalize(10)}
            color={Color.black}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#9AA4B2',
    marginEnd: normalize(5),

    fontFamily: 'Inter',
    fontSize: normalize(10),
    fontStyle: 'normal',
    fontWeight: '500',
  },
});
