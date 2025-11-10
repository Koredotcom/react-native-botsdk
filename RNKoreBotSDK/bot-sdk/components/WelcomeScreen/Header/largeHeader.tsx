import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {normalize} from '../../../utils/helpers';
import {
  BaseViewProps,
  BaseViewState,
  WelcomeBaseView,
} from '../WelcomeBaseView';
import Color from '../../../theme/Color';

interface LargeHeaderProps extends BaseViewProps {}

interface LargeHeaderState extends BaseViewState {}

export default class LargeHeader extends WelcomeBaseView<
  LargeHeaderProps,
  LargeHeaderState
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
          {paddingTop: normalize(20)},
          !isValidLogo ? {paddingBottom: normalize(20)} : {},
        ]}>
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
        {obj?.logo?.logo_url && (
          <View style={styles.sub_container}>
            <Image
              source={{uri: obj?.logo?.logo_url}}
              style={styles.image}
            />
          </View>
        )}
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
    opacity: 0.8,
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
    marginTop: normalize(10),
    marginBottom: -normalize(25),
  },
  main_container: {
    paddingLeft: normalize(16),
    paddingRight: normalize(16),
    // paddingBottom: normalize(32),
    marginBottom: normalize(25),
    //borderBottomRightRadius: 3,
    //borderBottomLeftRadius: 3,
  },

  image: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'stretch',
  },
});
