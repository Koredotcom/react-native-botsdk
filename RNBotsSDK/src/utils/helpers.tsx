/* eslint-disable @typescript-eslint/no-unused-vars */
// Correct: Import React from 'react'

import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// based on iphone X's scale
let NEW_SCREEN_WIDTH =
  SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;
const scale = NEW_SCREEN_WIDTH / 375;

const ICON_SHAPE = {
  CIRCLE_IMG: 'circle-img',
};

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

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.ceil(PixelRatio.roundToNearestPixel(newSize));
  }
}
