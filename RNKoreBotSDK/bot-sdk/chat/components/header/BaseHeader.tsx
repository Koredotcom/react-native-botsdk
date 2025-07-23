/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {normalize} from '../../../utils/helpers';
import {SvgIcon} from '../../../utils/SvgIcon';
import {ThemeContext} from '../../../theme/ThemeContext';
import {ThemeType} from '../../../theme/ThemeType';
import Popover, {
  PopoverMode,
  PopoverPlacement,
} from 'react-native-popover-view';
import {
  HeaderIconsId,
  MIN_HEADER_HEIGHT,
  SHOW_BUTTONS_LIMIT,
} from '../../../constants/Constant';
import {IThemeType} from '../../../theme/IThemeType';
import Color from '../../../theme/Color';
import KoraBotClient from 'rn-kore-bot-socket-lib-v77';

export interface BaseHeaderProps {
  theme?: IThemeType;
  onHeaderActionsClick?: any;
  isReconnecting?: boolean;
}
export interface BaseHeaderState {
  showPopover: boolean;
}

export default abstract class BaseHeader<
  T extends BaseHeaderProps,
  S extends BaseHeaderState,
> extends React.Component<T, S> {
  static contextType = ThemeContext;

  protected renderBackIcon(
    styleProps?: any,
    stylePropsMain?: any,
    colorIcon?: any,
  ): React.ReactNode {
    return (
      <View
        style={
          stylePropsMain
            ? stylePropsMain
            : [styles.back_icon_container, styleProps]
        }>
        {this.renderIcon(
          HeaderIconsId.BACK,
          'HeaderLeft',
          22,
          22,
          styleProps,
          colorIcon,
        )}
      </View>
    );
  }
  private getIconName = (theme: ThemeType) => {
    let iconName = 'IcIcon_1';
    const headerIcon = theme?.v3?.header?.icon || undefined;

    switch (headerIcon?.icon_url) {
      case 'icon-1':
        iconName = 'IcIcon_1';
        break;

      case 'icon-2':
        iconName = 'IcIcon_2';
        break;

      case 'icon-3':
        iconName = 'IcIcon_3';
        break;

      case 'icon-4':
        iconName = 'IcIcon_4';
        break;
      default:
        iconName = 'AvatarBot';
    }

    return iconName;
  };

  protected getBotTitleName(name: any): any {
    if (this.props.isReconnecting) {
      return 'Reconnecting ...';
    }
    let botName = KoraBotClient.getInstance().getBotName();
    return name || botName || 'No Title';
  }
  protected renderHeaderIcon = (theme: ThemeType, customProps?: any) => {
    if (!theme?.v3?.header?.icon?.show) {
      return <></>;
    }
    let type = theme?.v3?.header?.icon?.type;
    if (!type || type?.trim?.()?.length === 0) {
      return <></>;
    }

    if (type === 'custom' && theme?.v3?.header?.icon?.icon_url) {
      return (
        <View style={styles.header_icon_main}>
          <Image
            style={styles.header_icon_main}
            testID="image-custom"
            source={{
              uri: theme?.v3?.header?.icon?.icon_url,
            }}
            height={normalize(30)}
            width={normalize(30)}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.header_icon_main,
          customProps,
          {
            backgroundColor: theme?.v3?.body?.user_message?.bg_color
              ? theme?.v3?.body?.user_message?.bg_color
              : Color.header_blue,
          },
        ]}>
        {this.renderIcon(
          undefined,
          this.getIconName(theme),
          14,
          14,
          customProps ? customProps : {marginStart: 0},
          theme?.v3?.body?.user_message?.color
            ? theme?.v3?.body?.user_message?.color
            : Color.white,
        )}
      </View>
    );
  };

  protected renderIcon = (
    id: any = undefined,
    iconName?: string,
    width: number = 17,
    height: number = 17,
    styleProps?: any,
    iconColor?: any,
  ) => {
    if (!iconName) {
      return <></>;
    }
    const Wrapper: any = id ? TouchableOpacity : View;

    return (
      <Wrapper
        style={[styles.icon_container, {}, styleProps, {}]}
        onPress={() => this.onHeaderIconPress(id)}>
        <SvgIcon
          name={iconName}
          width={normalize(width)}
          height={normalize(height)}
          color={iconColor ? iconColor : '#697586'}
        />
      </Wrapper>
    );
  };

  private onHeaderIconPress = (id?: any) => {
    //console.log('onPress id ---->:', id);

    if (this.props.onHeaderActionsClick) {
      this.props.onHeaderActionsClick?.(id);
    }

    // switch (id) {
    //   case HeaderIconsId.THREE_DOTS:
    //     break;
    // }
  };

  private onDropdownMenuView = (theme?: ThemeType, iconColor?: string) => {
    let buttons = theme?.v3?.header?.buttons;
    const height: number = MIN_HEADER_HEIGHT || 45;
    return (
      <View style={[styles.dropdown_main, {height: normalize(height)}]}>
        <Popover
          mode={PopoverMode.RN_MODAL}
          placement={PopoverPlacement.BOTTOM}
          isVisible={this.state?.showPopover || false}
          onRequestClose={() => {
            this.setState({
              showPopover: false,
            });
          }}
          from={
            <TouchableOpacity
              style={[styles.pop_main]}
              onPress={() => {
                this.setState({
                  showPopover: true,
                });
              }}>
              <SvgIcon
                name={'ThreeDots'}
                width={normalize(18)}
                height={normalize(18)}
                color={
                  iconColor
                    ? iconColor
                    : theme?.v3?.header?.sub_title?.color + 'A6' || '#000000'
                }
              />
            </TouchableOpacity>
          }>
          <View style={styles.pop_sub}>
            {buttons?.help?.show &&
              this.renderMenuItem(HeaderIconsId.HELP, 'Help', 'HeaderHelp')}
            {buttons?.live_agent?.show &&
              this.renderMenuItem(
                HeaderIconsId.LIVE_AGENT,
                'Live Agent',
                'HeaderTalk',
              )}
            {buttons?.reconnect?.show &&
              this.renderMenuItem(
                HeaderIconsId.RECONNECT,
                'Reconnect',
                'HeaderHelp',
              )}
            {buttons?.minimise?.show &&
              this.renderMenuItem(
                HeaderIconsId.MINIMISE,
                'Minimise',
                'HeaderMenu',
              )}
            {buttons?.expand?.show &&
              this.renderMenuItem(HeaderIconsId.EXPAND, 'Expand', 'HeaderHelp')}
            {buttons?.close?.show &&
              this.renderMenuItem(HeaderIconsId.CLOSE, 'Close', 'HeaderClose')}
          </View>
        </Popover>
      </View>
    );
  };

  private renderMenuItem = (
    id: string,
    title: string,
    iconId: string = 'HeaderHelp',
  ) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            showPopover: false,
          });
          this.onHeaderIconPress(id);
        }}
        style={styles.popover_main_2}>
        <View style={styles.popover_item_main}>
          {this.renderIcon(undefined, iconId, 17, 17, {
            marginStart: 0,
          })}
          <View style={styles.popover_item_text_main}>
            <Text style={{fontSize: normalize(13), paddingEnd: 10}}>
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  protected renderRightSideIcons(
    theme?: ThemeType,
    styleProps?: any,
    stylePropsMain?: any,
    iconColor?: any,
  ): React.ReactNode {
    let buttons = theme?.v3?.header?.buttons;
    if (this.isMoreButtons(theme)) {
      buttons = {
        threeDots: {
          show: true,
          icon: 'string',
        },
      };
      stylePropsMain = {};
    }

    return (
      <View style={[{flexDirection: 'row'}, stylePropsMain]}>
        {buttons?.help?.show &&
          this.renderIcon(
            HeaderIconsId.HELP,
            'HeaderHelp',
            17,
            17,
            styleProps,
            iconColor,
          )}
        {buttons?.live_agent?.show &&
          this.renderIcon(
            HeaderIconsId.LIVE_AGENT,
            'HeaderTalk',
            17,
            17,
            styleProps,
            iconColor,
          )}
        {buttons?.reconnect?.show &&
          this.renderIcon(
            HeaderIconsId.RECONNECT,
            'HeaderReconnect',
            17,
            17,
            styleProps,
            iconColor,
          )}
        {buttons?.close?.show &&
          this.renderIcon(
            HeaderIconsId.CLOSE,
            'HeaderClose',
            17,
            17,
            styleProps,
            iconColor,
          )}
        {buttons?.threeDots?.show && this.onDropdownMenuView(theme, iconColor)}
      </View>
    );
  }
  private isMoreButtons(theme?: ThemeType) {
    let count = 0;

    if (theme?.v3?.header?.buttons?.close?.show) {
      count++;
    }
    if (theme?.v3?.header?.buttons?.help?.show) {
      count++;
    }
    if (theme?.v3?.header?.buttons?.live_agent?.show) {
      count++;
    }
    if (theme?.v3?.header?.buttons?.reconnect?.show) {
      count++;
    }
    if (theme?.v3?.header?.buttons?.expand?.show) {
      count++;
    }
    if (theme?.v3?.header?.buttons?.minimise?.show) {
      count++;
    }

    return SHOW_BUTTONS_LIMIT < count;
  }
}

const styles = StyleSheet.create({
  header_icon_main: {
    backgroundColor: Color.header_blue,
    width: normalize(30),
    height: normalize(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(30),
    //marginEnd: 5,
    //marginStart: 5,
  },
  pop_sub: {
    marginTop: 5,
    flexDirection: 'column',
    minWidth: normalize(80),
  },
  pop_main: {
    position: 'absolute',
    end: 0,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 5,
    paddingEnd: 10,
    paddingBottom: 5,
    marginEnd: 5,
    zIndex: 1,
  },
  dropdown_main: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  popover_item_text_main: {
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'yellow',
    // flex: 1,
    height: normalize(30),
  },
  popover_main_2: {
    height: normalize(30),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
    //backgroundColor: 'red',
  },
  popover_item_main: {
    flexDirection: 'row',

    //backgroundColor: 'red',
    alignItems: 'flex-start',
  },
  popover_main: {
    padding: 10,
    // paddingLeft: 15,
    // paddingTop: 10,
    // paddingBottom: 10,
    // marginRight: -5,
    //backgroundColor: 'yellow',
  },
  opt_title_con: {padding: 10, marginBottom: 10},
  back_icon_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(40),
  },
  icon_container: {
    paddingHorizontal: normalize(4),
    flexWrap: 'wrap',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 5,
  },
});
