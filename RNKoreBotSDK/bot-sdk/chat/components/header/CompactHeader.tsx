import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {invertColor, normalize} from '../../../utils/helpers';
import Color from '../../../theme/Color';
import {MIN_HEADER_HEIGHT} from '../../../constants/Constant';
import BaseHeader, {BaseHeaderProps, BaseHeaderState} from './BaseHeader';
import {ThemeType} from '../../../theme/ThemeType';

interface CompactHeaderProps extends BaseHeaderProps {}
interface CompactHeaderState extends BaseHeaderState {}

export default class CompactHeader extends BaseHeader<
  CompactHeaderProps,
  CompactHeaderState
> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const theme = this.context as ThemeType;
    const height: number = MIN_HEADER_HEIGHT || 45;
    const headerColor = theme?.v3?.header?.bg_color || '#EAECF0';

    return (
      <View
        style={[
          styles.main,
          {
            height: normalize(height),
            backgroundColor: headerColor,
          },
        ]}>
        <View style={styles.sub_con}>
          {this.renderBackIcon(
            {},
            {},
            theme?.v3?.header?.icons_color || invertColor(headerColor, true),
          )}
          <View style={styles.sub_con1}>
            {theme?.v3?.header?.icon?.show && (
              <View style={styles.back_icon_container}>
                {this.renderHeaderIcon(theme)}
              </View>
            )}
            <View style={styles.title_main}>
              <View style={styles.title_sub_con}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title_text,
                    {color: theme?.v3?.header?.title?.color || '#000000'},
                  ]}>
                  {this.getBotTitleName(theme?.v3?.header?.title?.name)}
                </Text>
              </View>
              <View style={styles.title_sub_con1}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title_sub_text,
                    {color: theme?.v3?.header?.sub_title?.color || '#000000'},
                  ]}>
                  {theme?.v3?.header?.sub_title?.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.right_icon_container}>
            {theme?.v3?.header?.buttons &&
              this.renderRightSideIcons(
                theme,
                {},
                {},
                theme?.v3?.header?.icons_color ||
                  invertColor(headerColor, true),
              )}
          </View>
        </View>
        <View style={styles.line} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sub_con1: {
    flex: 1,
    flexDirection: 'row',
    marginStart: 10,
  },
  title_sub_text: {
    fontWeight: 'normal',
    fontSize: normalize(12),
    opacity: 0.5,
  },
  title_sub_con1: {
    flex: 1,
  },
  title_text: {fontWeight: '500', fontSize: normalize(14)},
  title_sub_con: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title_main: {flexDirection: 'column', flex: 1, marginStart: 5},
  sub_con: {flex: 1, flexDirection: 'row'},
  main: {
    width: '100%',

    marginBottom: 2,
  },
  back_icon_container: {
    height: '100%',
    width: normalize(33),
    alignItems: 'center',
    justifyContent: 'center',
  },
  right_icon_container: {
    //backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 5,
  },
  line: {
    backgroundColor: Color.black,
    opacity: 0.3,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
