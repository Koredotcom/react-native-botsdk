import {StyleSheet} from 'react-native';
import {normalize} from '../utils/helpers';
import Color from './Color';
export const TEMPLATE_STYLE_VALUES = {
  BORDER_WIDTH: StyleSheet.hairlineWidth,
  BORDER_COLOR: '#728387', //'#E0E1E9',
  BORDER_RADIUS: 6,
  BUBBLE_RADIUS: 10,

  TEXT_COLOR: Color.text_color, //'#202124',
  TEXT_SIZE: normalize(15),
  FONT_FAMILY: 'Inter',
  SUB_TEXT_SIZE: normalize(13),

  TEMPLATE_RIGHT_MARGIN: 12,
  TEMPLATE_LEFT_MARGIN: 12,
  MIN_WIDTH: 200,
  VIEW_MORE_TEXT_COLOR: '#4B4EDE',
  // TEXT_SIZE1: [{small: normalize(12)}],
};

export const BUBBLE_STYLE_TYPE = {
  BALLOON: 'balloon',
  ROUNDED: 'rounded',
  RECTANGLE: 'rectangle',
};
export const botTimeStyles = {
  medium: StyleSheet.create({
    size: {
      fontSize: normalize(11),
    },
  }),
  small: StyleSheet.create({
    size: {
      fontSize: normalize(10),
    },
  }),
  large: StyleSheet.create({
    size: {
      fontSize: normalize(14),
    },
  }),
};

const BOT_STYLES = {
  medium: StyleSheet.create({
    size: {
      fontSize: normalize(14),
    },
  }),
  small: StyleSheet.create({
    size: {
      fontSize: normalize(12),
    },
  }),
  large: StyleSheet.create({
    size: {
      fontSize: normalize(18),
    },
  }),
};

// Unknown branding sizes (e.g. "xlarge") fall back to medium so `.size` never throws.
export const botStyles = new Proxy(BOT_STYLES, {
  get(target, prop: string | symbol) {
    if (typeof prop === 'string' && prop in target) {
      return target[prop as keyof typeof BOT_STYLES];
    }
    return target.medium;
  },
}) as typeof BOT_STYLES & Record<string, (typeof BOT_STYLES)['medium']>;

export const image_size = {
  medium: StyleSheet.create({
    size: {
      height: normalize(50),
      width: normalize(50),
    },
  }),
  small: StyleSheet.create({
    size: {
      height: normalize(25),
      width: normalize(25),
    },
  }),
  large: StyleSheet.create({
    size: {
      height: normalize(70),
      width: normalize(70),
    },
  }),
};
export const rightBubbleStyles = {
  balloon: StyleSheet.create({
    bubble_style: {
      borderBottomLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
    },
  }),
  rounded: StyleSheet.create({
    bubble_style: {
      borderBottomLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderBottomRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
    },
  }),
  rectangle: StyleSheet.create({
    bubble_style: {
      // borderBottomLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      // borderTopRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      // borderTopLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      // borderBottomStartRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
    },
  }),
};
export const leftBubbleStyles = {
  balloon: StyleSheet.create({
    bubble_style: {
      borderBottomRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
    },
  }),
  rounded: StyleSheet.create({
    bubble_style: {
      borderBottomLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderTopLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      borderBottomRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
    },
  }),
  rectangle: StyleSheet.create({
    bubble_style: {
      // borderBottomLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      // borderTopRightRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      // borderTopLeftRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
      // borderBottomStartRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
    },
  }),
};
