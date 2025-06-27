import {BubbleTheme, ButtonTheme} from '../constants/Constant';
import {IThemeType} from './IThemeType';

export function getButtonTheme(
  propsTheme: IThemeType | undefined,
): ButtonTheme {
  // editor.putString(BotResponseConstants.BUTTON_ACTIVE_BG_COLOR, brandingModel.general.colors.primary) //#ffffff"
  // editor.putString(BotResponseConstants.BUTTON_ACTIVE_TXT_COLOR, brandingModel.general.colors.primaryText)//"#505968"
  // editor.putString(BotResponseConstants.BUTTON_INACTIVE_BG_COLOR, brandingModel.general.colors.secondary)
  // editor.putString(BotResponseConstants.BUTTON_INACTIVE_TXT_COLOR, brandingModel.general.colors.secondaryText)

  let theme: ButtonTheme = {
    ACTIVE_BG_COLOR: '#a37645',
    ACTIVE_TXT_COLOR: '#505968',
    INACTIVE_BG_COLOR: '#101828',
    INACTIVE_TXT_COLOR: '#1d2939',
  };

  if (!propsTheme) {
    return theme;
  }

  //   console.log(
  //     'propsTheme.v3?.general?.colors ---->:',
  //     propsTheme.v3?.general?.colors,
  //   );

  if (propsTheme.v3?.general?.colors?.useColorPaletteOnly) {
    theme = {
      ...theme,
      ACTIVE_BG_COLOR: propsTheme.v3?.general?.colors?.primary || '#ffffff',
      ACTIVE_TXT_COLOR:
        propsTheme.v3?.general?.colors?.primary_text || '#505968',
      INACTIVE_BG_COLOR: propsTheme.v3?.general?.colors?.secondary || '#101828',
      INACTIVE_TXT_COLOR:
        propsTheme.v3?.general?.colors?.secondary_text || '#1d2939',
    };
  }
  //console.log('theme ---->:', theme);
  return theme;
}

export function getBubbleTheme(
  propsTheme: IThemeType | undefined,
): BubbleTheme {
  // editor.putString(BotResponseConstants.BUBBLE_LEFT_BG_COLOR, brandingModel.body.botMessage.bgColor)
  // editor.putString(BotResponseConstants.BUBBLE_LEFT_TEXT_COLOR, brandingModel.body.botMessage.color)
  // editor.putString(BotResponseConstants.BUBBLE_RIGHT_BG_COLOR, brandingModel.body.userMessage.bgColor)
  // editor.putString(BotResponseConstants.BUBBLE_RIGHT_TEXT_COLOR, brandingModel.body.userMessage.color)

  let theme: BubbleTheme = {
    BUBBLE_LEFT_BG_COLOR: '#3F51B5',
    BUBBLE_LEFT_TEXT_COLOR: '#FFFFFF',
    BUBBLE_RIGHT_BG_COLOR: '#3F51B5',
    BUBBLE_RIGHT_TEXT_COLOR: '#ffffff',
  };

  if (!propsTheme) {
    return theme;
  }

  //   console.log(
  //     'propsTheme.v3?.general?.colors ---->:',
  //     propsTheme.v3?.general?.colors,
  //   );

  if (propsTheme.v3?.body?.user_message) {
    theme = {
      ...theme,

      BUBBLE_RIGHT_BG_COLOR:
        propsTheme.v3?.body?.user_message.bg_color || '#3F51B5',
      BUBBLE_RIGHT_TEXT_COLOR:
        propsTheme.v3?.body?.user_message.color || '#FFFFFF',
    };
  }

  if (propsTheme.v3?.body?.bot_message) {
    theme = {
      ...theme,

      BUBBLE_LEFT_BG_COLOR:
        propsTheme.v3?.body?.bot_message.bg_color || '#3F51B5',
      BUBBLE_LEFT_TEXT_COLOR:
        propsTheme.v3?.body?.bot_message.color || '#FFFFFF',
    };
  }

  if (propsTheme.v3?.general?.colors?.useColorPaletteOnly) {
    theme = {
      ...theme,
      BUBBLE_LEFT_BG_COLOR:
        propsTheme.v3?.general?.colors?.secondary || '#3F51B5',
      BUBBLE_LEFT_TEXT_COLOR:
        propsTheme.v3?.general?.colors?.primary_text || '#FFFFFF',
      BUBBLE_RIGHT_BG_COLOR:
        propsTheme.v3?.general?.colors?.primary || '#3F51B5',
      BUBBLE_RIGHT_TEXT_COLOR:
        propsTheme.v3?.general?.colors?.secondary_text || '#FFFFFF',
    };
  }
  //console.log('theme ---->:', theme);
  return theme;
}
