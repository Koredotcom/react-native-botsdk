import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {normalize} from '../../../utils/helpers';
import {
  BaseViewProps,
  BaseViewState,
  WelcomeBaseView,
} from '../WelcomeBaseView';
import Color from '../../../theme/Color';
import FastImage from 'react-native-fast-image';

interface MediumHeaderProps extends BaseViewProps {}

interface MediumHeaderState extends BaseViewState {}

export default class MediumHeader extends WelcomeBaseView<
  MediumHeaderProps,
  MediumHeaderState
> {
  render() {
    const obj = this.props?.activetheme?.v3?.welcome_screen || null;

    if (!obj) {
      return <></>;
    }
    const isValidLogo = obj?.logo?.logo_url?.trim?.()?.length || false;
    return (
      <View
        style={[
          styles.main_container,
          {backgroundColor: obj?.background?.color || '#4B4EDE'},
          !isValidLogo && {paddingTop: normalize(20)},
        ]}>
        {obj?.logo?.logo_url && (
          <View style={styles.sub_container}>
            <FastImage
              source={{uri: obj?.logo?.logo_url}}
              style={styles.image}
            />
          </View>
        )}
        <Text
          style={[styles.title, {color: obj?.top_fonts?.color || Color.white}]}>
          {obj?.title?.name}
        </Text>
        <Text
          style={[
            styles.sub_title,
            {color: obj?.top_fonts?.color || Color.white},
          ]}>
          {obj?.sub_title?.name}
        </Text>
        <Text
          style={[styles.note, {color: obj?.top_fonts?.color || Color.white}]}>
          {obj?.note?.name}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  note: {
    fontSize: normalize(14),
    marginTop: normalize(5),
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
  },
  sub_title: {
    fontSize: normalize(18),
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '700',
  },
  title: {
    fontSize: normalize(32),
    opacity: 0.8,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
  },

  sub_container: {
    height: normalize(50),
    width: normalize(50),
    backgroundColor: Color.transparent,
    marginTop: -normalize(25),
  },
  main_container: {
    paddingLeft: normalize(16),
    paddingRight: normalize(16),
    paddingBottom: normalize(20),
    marginTop: normalize(32),
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
  },

  image: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'stretch',
  },
});
