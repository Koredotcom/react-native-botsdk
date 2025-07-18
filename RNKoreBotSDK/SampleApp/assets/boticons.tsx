import * as React from 'react';
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

export const HeaderAvatar = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none">
      <Rect
        x="1.25"
        y="1.25"
        width="33.5"
        height="33.5"
        rx="16.75"
        fill="url(#pattern0)"
      />
      <Rect
        x="1.25"
        y="1.25"
        width="33.5"
        height="33.5"
        rx="16.75"
        stroke="white"
        stroke-width="1.5"
      />
      <Defs>
        <Pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1">
          <Use xlinkHref="#image0_11743_8911" transform="scale(0.003125)" />
        </Pattern>
        <Image
          id="image0_11743_8911"
          width="320"
          height="320"
          xlinkHref={{
            uri: 'data:image/jpeg;base64,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',
          }}
        />
      </Defs>
    </Svg>
  );
};
{
  /* <Svg viewBox="0 0 320 512"> */
}
export const UpSolid = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;
  let style = props.style;
  return (
    <Svg
      style={style}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none">
      <Path
        d="M18.6806 13.9783L15.4706 10.7683L13.5106 8.79828C12.6806 7.96828 11.3306 7.96828 10.5006 8.79828L5.32056 13.9783C4.64056 14.6583 5.13056 15.8183 6.08056 15.8183H11.6906H17.9206C18.8806 15.8183 19.3606 14.6583 18.6806 13.9783Z"
        fill={strokeColor}
      />
    </Svg>
  );
};

export const DownSolid = (props: SvgProps) => {
  return (
    <Svg viewBox="0 0 320 512">
      <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
    </Svg>
  );
};

export const RightSolid = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;
  let style = props.style;
  return (
    <Svg
      style={style}
      fill={strokeColor}
      width={width}
      height={height}
      viewBox="0 0 24 24">
      <Path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z" />
    </Svg>
  );
};

export const Left = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} id="Capa_1" viewBox="0 0 34.075 34.075">
      <G>
        <G>
          <Path
            fill={strokeColor}
            d="M24.57,34.075c-0.505,0-1.011-0.191-1.396-0.577L8.11,18.432c-0.771-0.771-0.771-2.019,0-2.79
                L23.174,0.578c0.771-0.771,2.02-0.771,2.791,0s0.771,2.02,0,2.79l-13.67,13.669l13.67,13.669c0.771,0.771,0.771,2.021,0,2.792
                C25.58,33.883,25.075,34.075,24.57,34.075z"
          />
        </G>
      </G>
    </Svg>
  );
};

export const Right = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;
  let style = props.style;
  return (
    <Svg
      fill={strokeColor}
      width={width}
      height={height}
      id="Layer_1"
      style={style}
      viewBox="0 0 492.004 492.004">
      <G>
        <G>
          <Path
            d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
			c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
			c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
			c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"
          />
        </G>
      </G>
    </Svg>
  );
};

export const ThreeDots = (props: SvgProps) => {
  let width = props.width || normalize(WIDTH);
  let height = props.height || normalize(HEIGHT);
  let strokeColor = props.color || Color.black;

  return (
    <Svg width={width} height={height} fill={strokeColor} viewBox="0 0 16 16">
      <Path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
    </Svg>
  );
};
