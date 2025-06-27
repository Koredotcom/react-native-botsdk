import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {invertColor, normalize} from '../../../utils/helpers';
import Color from '../../../theme/Color';
import {MIN_HEADER_HEIGHT} from '../../../constants/Constant';
import BaseHeader, {BaseHeaderProps, BaseHeaderState} from './BaseHeader';
import {ThemeType} from '../../../theme/ThemeType';
import {isIOS} from '../../../utils/PlatformCheck';

interface MediumHeaderProps extends BaseHeaderProps {}
interface MediumHeaderState extends BaseHeaderState {}

export default class MediumHeader extends BaseHeader<
  MediumHeaderProps,
  MediumHeaderState
> {
  constructor(props: MediumHeaderProps) {
    super(props);
    this.state = {
      showPopover: false,
    };
  }

  render() {
    const theme = this.context as ThemeType;
    const height: number = MIN_HEADER_HEIGHT || 45;
    const extraHeight = isIOS ? height + 25 : height + 35;
    const headerColor = theme?.v3?.header?.bg_color || '#EAECF0';
    return (
      <View
        style={[
          styles.main,
          {
            height: normalize(extraHeight),
            backgroundColor: headerColor,
          },
        ]}>
        <View style={[styles.sub_con]}>
          {this.renderBackIcon(
            {},
            {...styles.back_icon, height: normalize(height)},
            theme?.v3?.header?.icons_color || invertColor(headerColor, true),
          )}
          <View style={[styles.sub_con1, {}]}>
            {theme?.v3?.header?.icon?.show && (
              <View style={[styles.back_icon_container]}>
                {/* {this.renderIcon(undefined, 'HeaderAvatar', 30, 30, {
                  height: normalize(height - (isIOS ? 15 : 10)),
                  ...styles.render_icon,
                })} */}
                {this.renderHeaderIcon(theme, {
                  marginStart: 0,
                })}
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
                {height: height},
                styles.itemProps,
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
  itemProps: {
    position: 'absolute',
    end: 0,
    marginEnd: 5,
  },
  render_icon: {
    paddingHorizontal: 0,
    flexWrap: 'wrap',

    marginStart: 0,
    marginBottom: 5,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  back_icon: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  sub_con1: {
    flex: 1,
    //flexDirection: 'column',
    //backgroundColor: 'yellow',
    //marginStart: 10,
  },
  title_sub_text: {
    fontWeight: 'normal',
    fontSize: normalize(12),
    opacity: 0.5,
  },
  title_sub_con1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title_text: {fontWeight: '500', fontSize: normalize(14)},
  title_sub_con: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title_main: {flexDirection: 'column', flex: 1, marginStart: 5},
  sub_con: {flex: 1, flexDirection: 'row', alignSelf: 'flex-start'},
  main: {
    width: '100%',

    marginBottom: 2,
  },
  back_icon_container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  right_icon_container: {
    //backgroundColor: 'green',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  line: {
    backgroundColor: Color.black,
    opacity: 0.3,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
