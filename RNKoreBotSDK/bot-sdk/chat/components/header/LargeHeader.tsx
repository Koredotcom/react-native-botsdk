import * as React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {invertColor, normalize} from '../../../utils/helpers';
import Color from '../../../theme/Color';
import BaseHeader, {BaseHeaderProps, BaseHeaderState} from './BaseHeader';
import {ThemeType} from '../../../theme/ThemeType';
import LinearGradient from 'react-native-linear-gradient';
import {ThemeContext} from '../../../theme/ThemeContext';

interface LargeHeaderProps extends BaseHeaderProps {}
interface LargeHeaderState extends BaseHeaderState {}

const windowWidth = Dimensions.get('window').width;

export default class LargeHeader extends BaseHeader<
  LargeHeaderProps,
  LargeHeaderState
> {
  static contextType = ThemeContext;

  render() {
    const theme = this.context as ThemeType;
    const height: number = 140; //MIN_HEADER_HEIGHT || 45;78 79 217
    //const headerColor = '#4E4FD9'; //Color.blue; // theme?.v3?.header?.bg_color || Color.blue;
    const headerColor = theme?.v3?.header?.bg_color || Color.blue;
    return (
      <LinearGradient
        colors={[
          headerColor,
          headerColor,
          headerColor,
          Color.white,
          Color.white,
        ]}
        style={[
          styles.main,
          {
            height: normalize(height),
            backgroundColor: theme?.v3?.header?.bg_color,
          },
        ]}>
        <View style={{flex: 1}}>
          <View style={styles.sub_con}>
            {this.renderBackIcon(
              {
                marginTop: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              },
              {},
              theme?.v3?.header?.icons_color || invertColor(headerColor, true),
            )}
            <View style={styles.sub_con1}>
              <View style={styles.title_main}>
                <View style={styles.title_sub_con}></View>
                <View style={styles.title_sub_con1}></View>
              </View>
            </View>
            <View style={styles.right_icon_container}>
              {theme?.v3?.header?.buttons &&
                this.renderRightSideIcons(
                  theme,
                  styles.right_side_icon_con,
                  {},
                  theme?.v3?.header?.icons_color ||
                    invertColor(headerColor, true),
                )}
            </View>
          </View>

          <View
            style={[
              styles.card_main,
              {
                width: windowWidth - normalize(30),
                borderRadius: 5,
                boxShadow: `
                  0 1px 3px rgba(0, 0, 0, 0.12),
                  0 1px 2px rgba(0, 0, 0, 0.24)
                `,
              },
            ]}>
            <View style={{flex: 1, marginStart: normalize(20)}}>
              <View style={styles.card_con}>
                <Text
                  style={[
                    styles.title_text,
                    {
                      color: theme?.v3?.header?.title?.color || '#000000',
                      fontFamily: this.props.theme?.v3?.body?.font?.family,
                    },
                  ]}>
                  {this.getBotTitleName(theme?.v3?.header?.title?.name)}
                </Text>
                <Text
                  style={[
                    styles.sub_title_text,
                    {
                      color: theme?.v3?.header?.sub_title?.color || '#000000',
                      fontFamily: this.props.theme?.v3?.body?.font?.family,
                    },
                  ]}>
                  {theme?.v3?.header?.sub_title?.name}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.icon_con}>
            {theme?.v3?.header?.icon?.show && (
              <View style={[styles.back_icon_container]}>
                {/* {this.renderIcon(undefined, 'HeaderAvatar', 45, 45, {
                  ...styles.render_icon,
                })} */}
                {this.renderHeaderIcon(theme)}
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  icon_con: {
    position: 'absolute',
    // bottom: 0,
    left: normalize(30),
    // right: 0,
    top: normalize(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_con: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: normalize(5),
  },
  right_side_icon_con: {
    marginTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  card_main: {
    backgroundColor: '#FAFAFA',

    height: normalize(85),
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
    //justifyContent: 'center',
  },
  title_text: {
    fontWeight: '600',
    letterSpacing: 0.3,
    fontSize: normalize(15),
  },

  sub_title_text: {
    fontWeight: 'normal',
    fontSize: normalize(12),
    opacity: 0.5,
  },
  render_icon: {
    paddingHorizontal: 0,
    flexWrap: 'wrap',

    marginStart: 0,
    marginBottom: 5,
    marginTop: -5,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
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
  title_sub_con: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title_main: {flexDirection: 'column', flex: 1, marginStart: 5},
  sub_con: {flex: 1, flexDirection: 'row', paddingTop: 5},
  main: {
    width: '100%',

    marginBottom: 2,
  },
  back_icon_container: {
    // height: '100%',
    // backgroundColor: 'green',
    width: normalize(50),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  right_icon_container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginEnd: 5,
  },
  line: {
    backgroundColor: Color.black,
    opacity: 0.3,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
