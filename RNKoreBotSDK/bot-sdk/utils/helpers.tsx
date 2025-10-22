/* eslint-disable no-bitwise */
// Correct: Import React from 'react'
import * as React from 'react';

import {Dimensions, Platform, PixelRatio} from 'react-native';
import dayjs from 'dayjs';

import Color from '../theme/Color';
import ColorMappings from './colorMappings';
import RenderImage from './RenderImage';
import {TEMPLATE_TYPES} from '../constants/Constant';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// based on iphone X's scale
let NEW_SCREEN_WIDTH =
  SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;
const scale = NEW_SCREEN_WIDTH / 375;

// const ICON_SHAPE = {
//   CIRCLE_IMG: 'circle-img',
// };

const imageTypes: any = [
  'bmp',
  'dds',
  'gif',
  'heic',
  'jpg',
  'png',
  'psd',
  'pspimage',
  'tga',
  'thm',
  'tif',
  'tiff',
  'yuv',
  'jpeg',
];
const videoTypes: any = [
  '3g2',
  '3gp',
  'asf',
  'avi',
  'flv',
  'm4v',
  'mov',
  'mp4',
  'mpg',
  'rm',
  'srt',
  'swf',
  'vob',
  'wmv',
];

export const renderImage: React.FC<any> = ({
  image,
  iconShape = undefined,
  iconSize = '',
  width = 10,
  height = 10,
}) => {
  return (
    <RenderImage
      image={image}
      iconShape={iconShape}
      iconSize={iconSize}
      width={width}
      height={height}
    />
  );
};

export function createDateRange(start: any, end: any) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  let currentDate = startDate;
  const dateArray: any = [];

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    dateArray.push(currentDate.toDate());
    currentDate = currentDate.add(1, 'day');
  }
  //console.log('dateArray   ---->:', dateArray);
  return dateArray;
}

function padZero(str: any, len?: any) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export function invertColor(hex: any, bw?: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }

  if (hex.length !== 6) {
    const hexValue = ColorMappings[hex?.toLowerCase()];

    if (!hexValue) {
      //throw new Error('Invalid HEX color to invertColor :' + hex);
      return Color.black;
    }

    hex = hexValue;
  }
  if (!hex) {
    return undefined;
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var r: any = parseInt(hex.slice(0, 2), 16),
    g: any = parseInt(hex.slice(2, 4), 16),
    b: any = parseInt(hex.slice(4, 6), 16);

  //console.log('   ====>:', finalResultColor);
  if (hex?.toLowerCase() === '#000000') {
    return '#FFFFFF';
  }

  if (hex?.toLowerCase() === '#ffffff') {
    return '#000000';
  }

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  let finalResultColor = '#' + padZero(r) + padZero(g) + padZero(b);
  // console.log(' finalResultColor  ====>:', finalResultColor);
  return finalResultColor;
}

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.ceil(PixelRatio.roundToNearestPixel(newSize));
  }
}

export function generateColor() {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
}

// function getScale() {
//   if (Platform.OS === 'ios') {
//     let NEW_SCREEN_WIDTH =
//       SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;
//     return NEW_SCREEN_WIDTH / 375;
//   } else {
//     return 1080 / 1920;
//   }
// }

export function isSameDay(
  currentMessage: {createdOn: number} | any,
  diffMessage: {createdOn: number} | any,
) {
  const currentCreatedAt = dayjs(currentMessage.createdOn);
  const diffCreatedAt = dayjs(diffMessage.createdOn);
  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }
  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(
  currentMessage: {user: {_id: string}} | any,
  diffMessage: {user: {_id: string}} | any,
) {
  return !!(
    diffMessage?.user &&
    currentMessage?.user &&
    diffMessage.user._id === currentMessage.user._id
  );
}

export const getItemId = (pattern?: any) => {
  var _pattern = pattern || 'xyxxyxxy';
  _pattern = _pattern.replace(/[xy]/g, function (c: any) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return _pattern;
};

export function getDrawableByExt(ext: string): string {
  if (imageTypes.includes(ext)) {
    return '&#128247;';
  } else if (videoTypes.includes(ext)) {
    return '&#127909;';
  } else {
    return '&#128195;';
  }
}
const hexToRGB = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {r, g, b};
};

const isWhite = (hex: string) => {
  const {r, g, b} = hexToRGB(hex);
  return r === 255 && g === 255 && b === 255;
};

function isHexColor(color: string) {
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexPattern.test(color);
}

function isNearWhiteRGB(r: number, g: number, b: number, threshold = 15) {
  return (
    Math.abs(255 - r) <= threshold &&
    Math.abs(255 - g) <= threshold &&
    Math.abs(255 - b) <= threshold
  );
}

export function isWhiteStatusBar(color: any): boolean {
  // console.log(color);

  // If color is null, undefined, or explicitly 'white', return true
  if (!color || color.toLowerCase() === 'white') {
    return true;
  }

  color = color.trim();

  // Check if the color is a valid hex
  if (isHexColor(color)) {
    const {r, g, b} = hexToRGB(color);

    // Return true if the color is exactly white or near white
    return isWhite(color) || isNearWhiteRGB(r, g, b, 15);
  }

  // If not a valid color or hex, return false
  return false;
}

// Use Luma formula to check if a color is near black
function isDarkColor(
  r: number,
  g: number,
  b: number,
  brightnessThreshold = 80,
) {
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // console.log(`Brightness: ${brightness}`);
  return brightness < brightnessThreshold;
}

export function isBlackStatusBar(color: any): boolean {
  // console.log('isBlackStatusBar color --------->:', color);

  if (!color || color.toLowerCase() === 'black') {
    return true;
  }

  if (isHexColor(color)) {
    const {r, g, b} = hexToRGB(color);
    // console.log(`RGB Values -> R: ${r}, G: ${g}, B: ${b}`);
    return isDarkColor(r, g, b);
  }

  return false;
}

export function getTemplateType(message: any) {
  if (
    message?.[0]?.component?.type === 'template' &&
    message[0].component?.payload?.type === 'template' &&
    message[0].component.payload?.payload &&
    message[0].component.payload?.payload?.template_type
  ) {
    if (message[0].component.payload.payload.template_type === TEMPLATE_TYPES.BUTTON && 
      message[0].component.payload.formData != null
    ) {
      return TEMPLATE_TYPES.DIGITALFORM_TEMPLATE;
    }
    return message[0].component.payload?.payload?.template_type;
  }

  if (
    message?.[0]?.component?.type === 'text' &&
    message?.[0]?.component?.payload?.text
  ) {
    return TEMPLATE_TYPES.TEXT;
  }
  if (
    message?.[0]?.component?.type === TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE
  ) {
    return TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE;
  }

  if (
    message?.[0]?.type === 'text' &&
    (message[0]?.component?.type === 'template' ||
      message[0]?.component?.type === 'text') &&
    message[0].component?.payload
    //message[0].component?.payload?.type !== 'message'
  ) {
    if (message[0].component?.payload?.type === 'link') {
      return TEMPLATE_TYPES.LINK_MESSAGE;
    }
    if (message[0].component?.payload?.type === 'message') {
      if (message[0].component?.payload?.payload?.audioUrl) {
        return TEMPLATE_TYPES.AUDIO_MESSAGE;
      }

      if (message[0].component?.payload?.payload?.videoUrl) {
        return TEMPLATE_TYPES.VIDEO_MESSAGE;
      }
    }
    if (message[0].component?.payload?.type === 'image') {
      return TEMPLATE_TYPES.IMAGE_MESSAGE;
    }

    if (message[0].component?.payload?.type === 'error') {
      return TEMPLATE_TYPES.ERROR_TEMPLATE;
    }

    if (typeof message[0].component?.payload === 'string') {
      return TEMPLATE_TYPES.TEXT;
    }
    if (
      (message[0].component?.payload?.text &&
        typeof message[0].component?.payload?.text === 'string') ||
      message[0].component?.payload?.text?.length === 0
    ) {
      return TEMPLATE_TYPES.TEXT;
    }

    if (
      message[0].component?.payload?.payload?.text &&
      typeof message[0].component?.payload?.payload?.text === 'string'
    ) {
      return TEMPLATE_TYPES.TEXT;
    }

    if (
      message?.[0]?.component?.payload?.[0]?.isFromLocal &&
      message?.[0]?.component?.payload?.[0]?.fileId
    ) {
      return TEMPLATE_TYPES.TEXT;
    }
  }

  if (
    message?.[0]?.component?.payload?.lastMessage?.messagePayload?.message
      ?.attachments?.[0]?.isFromLocal &&
    message?.[0]?.component?.payload?.lastMessage?.messagePayload?.message
      ?.attachments?.[0]?.fileId
  ) {
    return TEMPLATE_TYPES.TEXT;
  }

  return TEMPLATE_TYPES.OTHER;
}

export function convertToRNStyle(elementStyles: Record<string, string>) {
  const rnStyle: Record<string, any> = {};

  for (const [key, value] of Object.entries(elementStyles)) {
    switch (key) {
      case 'border':
        const array = value.split(' ');
        if (array?.length === 2) {
          rnStyle.borderStyle = array[0];
          let color1 = array?.[1].replace(';', '');
          rnStyle.borderColor = color1;
        } else if (array?.length === 3) {
          // rnStyle.borderWidth = parseInt(array[0].replace('px', ''));
          rnStyle.borderStyle = array[1];
          let color2 = array?.[2].replace(';', '');
          rnStyle.borderColor = color2;
        }
        // const [_pixel, style, color] = value.split(' ');
        // rnStyle.borderStyle = style;
        // //style.replace('px', '');
        // rnStyle.borderColor = color;
        break;

      case 'border-width':
        const borderWidths = value.split(' ').map(v => parseFloat(v));
        if (borderWidths.length === 1) {
          rnStyle.borderWidth = borderWidths[0];
        } else {
          rnStyle.borderTopWidth = borderWidths[0];
          rnStyle.borderRightWidth = borderWidths[1];
          rnStyle.borderBottomWidth = borderWidths[2];
          rnStyle.borderLeftWidth = borderWidths[3];
        }
        break;

      case 'padding-left':
        rnStyle.paddingLeft = value.includes('%')
          ? `${value}`
          : parseFloat(value);
        break;

      case 'box-shadow':
        const [offsetX, offsetY, blurRadius] = value
          .split(' ')
          .map(v => parseFloat(v));
        rnStyle.shadowOffset = {width: offsetX, height: offsetY};
        rnStyle.shadowRadius = blurRadius;
        rnStyle.shadowOpacity = 0.5; // Default opacity (adjust as needed)
        rnStyle.shadowColor = '#000'; // Default shadow color
        break;

      case 'border-radius':
        rnStyle.borderRadius = parseFloat(value);
        break;

      case 'font-style':
        rnStyle.fontFamily = value; // React Native uses fontFamily instead of font-style
        break;

      case 'color':
        rnStyle.color = value; // Assign text color
        break;

      case 'font-size':
        let num = value?.replace?.(/px/g, '') || '14';
        rnStyle.fontSize = normalize(parseFloat(num));

        break;

      case 'background-color':
        rnStyle.backgroundColor = value;
        break;

      default:
        break;
    }
  }

  return rnStyle;
}
