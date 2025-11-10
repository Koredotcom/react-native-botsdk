import * as React from 'react';
import {Component} from 'react';
import {ThemeContext} from '../../theme/ThemeContext';
import {ThemeType} from '../../theme/ThemeType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BOT_ICON_URL} from '../../constants/Constant';
import {normalize} from '../../utils/helpers';
import {StyleSheet, Text, View, Image} from 'react-native';
import CustomLoadingDots from '../../components/CustomLoadingDots';

import KoraBotClient from 'rn-kore-bot-socket-lib-v79';
import {botStyles} from '../../theme/styles';
import {isIOS} from '../../utils/PlatformCheck';
import Color from '../../theme/Color';

interface TypingProps {
  isTypingIndicator?: boolean;
}
interface TypingState {}

export default class TypingIndicator extends Component<
  TypingProps,
  TypingState
> {
  static contextType = ThemeContext;
  botIconUrl: any = null;
  theme?: any;
  bgColor: any;

  private getBackgroundColor = () => {
    const theme = this.context as ThemeType;
    if (theme?.v3?.body?.background?.type === 'color') {
      return theme?.v3?.body?.background?.color || '#FFFFFF';
    }
    return '#FFFFFF';
  };

  private getAvatarBgColor = () => {
    const theme = this.context as ThemeType;
    if (theme?.v3?.general?.colors?.primary) {
      return theme?.v3?.general?.colors?.primary || '#000000';
    }

    return '#000000';
  };
  private getDotColor = () => {
    const theme = this.context as ThemeType;
    if (theme?.v3?.body?.time_stamp?.color) {
      return theme?.v3?.body?.time_stamp?.color + 'c8' || '#000000c8';
    }
    return '#000000c8';
  };

  private getBotIconUrl = () => {
    //if (!this.botIconUrl) {
    AsyncStorage.getItem(BOT_ICON_URL).then(url => {
      this.botIconUrl = url;
    });
    // }
    return this.botIconUrl;
  };

  renderBotName(): React.ReactNode {
    let name = KoraBotClient.getInstance().getBotName() || ' ';

    const theme = this.context as ThemeType;
    let textColor = theme?.v3?.general?.colors?.secondary_text || '#FFFFFF';

    return (
      <Text
        style={[
          {
            color: textColor,
            fontFamily: theme?.v3?.body?.font?.family,
            ...botStyles['small']?.size,
          },
        ]}>
        {name?.[0]}
      </Text>
    );
  }

  private renderBotIcon = (url: any) => {
    let bg = this.getAvatarBgColor();
    return (
      <View style={styles.bot_icon_con}>
        <View
          style={[
            styles.bot_icon_con2,
            {
              backgroundColor: url ? Color.transparent : bg,
            },
          ]}>
          {url ? (
            <Image
              source={{
                uri: url,
              }}
              style={[styles.bot_icon]}
            />
          ) : (
            this.renderBotName()
          )}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.box, styles.box1]}>{this.renderTyping()}</View>
      </View>
    );
  }

  renderTyping = (): React.ReactNode => {
    let isTypingIndicator = this.props.isTypingIndicator;
    // let bgColor = this.getBackgroundColor();
    let url = undefined;
    if (isTypingIndicator) {
      url = this.getBotIconUrl();
    }
    // console.log('getBotIconUrl ---->', url);
    // console.log('getBackgroundColor ---->:', bgColor);

    return (
      <View style={styles.main}>
        {isTypingIndicator && (
          <View style={styles.horizontalContainer}>
            {this.renderBotIcon(url)}
            <CustomLoadingDots
              animation="typing"
              color={this.getDotColor()}
              size={isIOS ? 7 : 4}
              spacing={isIOS ? 8 : 7}
              delay={isIOS ? 120 : 180}
            />
          </View>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  bot_icon: {
    height: normalize(22),
    width: normalize(22),

    margin: 0,
    alignSelf: 'center',
    resizeMode: 'stretch',
  },
  bot_icon_con2: {
    height: normalize(22),
    width: normalize(22),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bot_icon_con: {
    marginLeft: 6,
  },
  main: {
    //height: normalize(22),
    //marginBottom: normalize(isIOS ? 0 : 8),
    // position: 'absolute',
    //left: 0,
    //top: 0,
    //bottom: 0,
    //zIndex: 200,
    //marginBottom: 3,

    backgroundColor: 'transparency',
  },

  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Parent container needs to have position relative
  },
  box: {
    position: 'absolute',
  },
  box1: {
    top: -normalize(23),
    left: 0,
    zIndex: 1, // Higher zIndex brings the element to the front
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
