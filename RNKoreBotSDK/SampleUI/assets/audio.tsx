import React from 'react';
import {normalize} from '../src/utils/helpers';
import Color from '../src/utils/Color';
import Svg, {Defs, G, Image, Path, Pattern, Rect, Use} from 'react-native-svg';

export interface SvgProps {
  width: number;
  height: number;
  color: string;
  style?: any;
}

const WIDTH = 17;
const HEIGHT = 17;

export const Play = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;
  let style = props.style;
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512">
      <Path
        fill={strokeColor}
        d="M405.2,232.9L126.8,67.2c-3.4,-2 -6.9,-3.2 -10.9,-3.2c-10.9,0 -19.8,9 -19.8,20H96v344h0.1c0,11 8.9,20 19.8,20c4.1,0 7.5,-1.4 11.2,-3.4l278.1,-165.5c6.6,-5.5 10.8,-13.8 10.8,-23.1C416,246.7 411.8,238.5 405.2,232.9z"
      />
    </Svg>
  );
};

export const Pause = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;
  let style = props.style;
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512">
      <Path
        fill={strokeColor}
        d="M224,435.8V76.1c0,-6.7 -5.4,-12.1 -12.2,-12.1h-71.6c-6.8,0 -12.2,5.4 -12.2,12.1v359.7c0,6.7 5.4,12.2 12.2,12.2h71.6C218.6,448 224,442.6 224,435.8z"
      />
      <Path
        fill={strokeColor}
        d="M371.8,64h-71.6c-6.7,0 -12.2,5.4 -12.2,12.1v359.7c0,6.7 5.4,12.2 12.2,12.2h71.6c6.7,0 12.2,-5.4 12.2,-12.2V76.1C384,69.4 378.6,64 371.8,64z"
      />
    </Svg>
  );
};
