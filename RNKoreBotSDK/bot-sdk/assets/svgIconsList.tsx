import * as React from 'react';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import Svg, {Path} from 'react-native-svg';

export interface HeaderProps {
  width?: number;
  height?: number;
  color?: string;
  style?: any;
}

const WIDTH = 17;
const HEIGHT = 17;

export const DownSolid = (props: HeaderProps) => {
  return (
    <Svg viewBox="0 0 320 512">
      <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
    </Svg>
  );
};

export const UpSolid = (props: HeaderProps) => {
  return (
    <Svg viewBox="0 0 320 512">
      <Path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
    </Svg>
  );
};

export const ThreeDots = (props: HeaderProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} fill={strokeColor} viewBox="0 0 16 16">
      <Path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
    </Svg>
  );
};

export const Left = (props: HeaderProps) => {
  return (
    <Svg viewBox="0 0 320 512">
      <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
    </Svg>
  );
};

export const HeaderAvatar = (props: HeaderProps) => {
  return (
    <Svg viewBox="0 0 320 512">
      <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
    </Svg>
  );
};
