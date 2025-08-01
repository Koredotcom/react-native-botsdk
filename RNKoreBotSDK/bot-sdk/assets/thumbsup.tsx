/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import Svg, {Defs, G, Image, Path, Pattern, Rect, Use} from 'react-native-svg';

export interface SvgProps {
  width: number;
  height: number;
  color: string;
  style?: any;
}

const WIDTH = 17;
const HEIGHT = 17;

export const UnLike = (props: SvgProps) => {
  //let width = props.width || normalize(WIDTH);
  // let height = props.height || normalize(HEIGHT);
  // let strokeColor = props.color || Color.black;
  // let style = props.style;
  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <Path
        d="M17.3083 9.5625C17.3083 10.2874 16.7207 10.875 15.9958 10.875C15.2709 10.875 14.6833 10.2874 14.6833 9.5625V4.3125C14.6833 3.58763 15.2709 3 15.9958 3C16.7207 3 17.3083 3.58763 17.3083 4.3125V9.5625Z"
        fill={props.color ? props.color: '#DC2626'}
      />
      <Path
        d="M13.8083 9.70833V4.95656C13.8083 4.29371 13.4338 3.68775 12.8409 3.39131L12.7973 3.3695C12.3113 3.12651 11.7754 3 11.2321 3L6.49298 3C5.65879 3 4.94056 3.5888 4.77696 4.4068L3.72696 9.6568C3.51038 10.7397 4.33865 11.75 5.44298 11.75H8.55832V15.25C8.55832 16.2165 9.34182 17 10.3083 17C10.7916 17 11.1833 16.6082 11.1833 16.125V15.5417C11.1833 14.7844 11.4289 14.0475 11.8833 13.4417L13.1083 11.8083C13.5627 11.2025 13.8083 10.4656 13.8083 9.70833Z"
        fill={props.color ? props.color: '#DC2626'}
      />
    </Svg>
  );
};

export const Like = (props: SvgProps) => {
  // let width = props.width || normalize(WIDTH);
  // let height = props.height || normalize(HEIGHT);
  // let strokeColor = props.color || Color.black;
  // let style = props.style;
  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <Path
        d="M3.69238 10.4375C3.69238 9.71263 4.28001 9.125 5.00488 9.125C5.72976 9.125 6.31738 9.71263 6.31738 10.4375V15.6875C6.31738 16.4124 5.72976 17 5.00488 17C4.28001 17 3.69238 16.4124 3.69238 15.6875V10.4375Z"
        fill={props.color ? props.color: '#16A34A'}
      />
      <Path
        d="M7.19238 10.2917V15.0434C7.19238 15.7063 7.56689 16.3123 8.15976 16.6087L8.20337 16.6305C8.68937 16.8735 9.22526 17 9.76862 17H14.5077C15.3419 17 16.0601 16.4112 16.2237 15.5932L17.2737 10.3432C17.4903 9.26032 16.6621 8.25 15.5577 8.25H12.4424V4.75C12.4424 3.7835 11.6589 3 10.6924 3C10.2091 3 9.81738 3.39175 9.81738 3.875V4.45833C9.81738 5.21563 9.57176 5.9525 9.11738 6.55833L7.89238 8.19167C7.43801 8.7975 7.19238 9.53437 7.19238 10.2917Z"
        fill={props.color ? props.color: '#16A34A'}
      />
    </Svg>
  );
};
