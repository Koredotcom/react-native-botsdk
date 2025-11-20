import * as React from 'react';

import {Play, Pause} from '../assets/audio';
import {
  UpSolid,
  ThreeDots,
  Left,
  HeaderAvatar,
  RightSolid,
  Right,
} from '../assets/boticons';
import {
  Speed,
  Soundmixer,
  Playlist,
  Settings,
  PPlay,
  Quality,
  PPause,
  MuteSound,
  Increase10Seconds,
  FullSound,
  FullScreen,
  Eye,
  Expand,
  ExitFullScreen,
  Error,
  Dot,
  Decrease10Seconds,
  Close,
  Back,
  Blur,
} from '../assets/playerIcons';

import {
  HeaderHelp,
  HeaderClose,
  HeaderLiveAgent,
  HeaderLeft,
  HeaderMinimize,
  HeaderReconnect,
} from '../assets/headerIcons';

import {
  MicIcon,
  MenuIcon,
  AttachmentIcon,
  KeyboardIcon,
  SendIcon,
  HappyIcon,
  SpeakerIcon,
  SpeakerOffIcon,
} from '../assets/composebarIcons';

import {
  IcIcon_1,
  IcIcon_2,
  IcIcon_3,
  IcIcon_4,
  Koreai_logo,
  AvatarBot,
} from '../assets/welcome';

import {Like, UnLike} from '../assets/thumbsup';
//import Unlike from '../assets/Unlike.svg';

import Color from '../theme/Color';

//LinkRecord
export class SvgIcon extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   const differentName = this.props.name !== nextProps.name;
  //   const differentWidth = this.props.width !== [];
  //   const differentHeight = this.props.height !== [];
  //   return differentName || differentWidth || differentHeight;
  // }

  render() {
    const {name, width, height, color = 'black', style = {}} = this.props;
    const iconsMap = {
      DownSolid: (
        <RightSolid
          width={width}
          height={height}
          color={color}
          style={{transform: [{rotate: '90deg'}]}}
        />
      ),

      Like: <Like width={width} height={height} color={color} />,
      Unlike: <UnLike width={width} height={height} color={color} />,
      UpSolid: <UpSolid width={width} height={height} />,
      RightArrow: <RightSolid width={width} height={height} color={color} />,
      Right: <Right width={width} height={height} color={color} />,
      Left: <Left width={width} height={height} />,
      Play: <Play width={width} height={height} color={color} />,
      Pause: <Pause width={width} height={height} color={color} />,
      ThreeDots: <ThreeDots width={width} height={height} color={color} />,

      Speed: <Speed width={width} height={height} color={color} />,
      Soundmixer: <Soundmixer width={width} height={height} color={color} />,
      Playlist: <Playlist width={width} height={height} color={color} />,
      Settings: <Settings width={width} height={height} color={color} />,
      PPlay: <PPlay width={width} height={height} color={color} />,
      Quality: <Quality width={width} height={height} color={color} />,
      PPause: <PPause width={width} height={height} color={color} />,
      MuteSound: <MuteSound width={width} height={height} color={color} />,
      Increase10Seconds: (
        <Increase10Seconds width={width} height={height} color={color} />
      ),
      FullSound: <FullSound width={width} height={height} color={color} />,
      FullScreen: <FullScreen width={width} height={height} color={color} />,
      Eye: <Eye width={width} height={height} color={color} />,
      Expand: <Expand width={width} height={height} color={color} />,
      ExitFullScreen: (
        <ExitFullScreen width={width} height={height} color={color} />
      ),
      Error: <Error width={width} height={height} color={color} />,
      Dot: <Dot width={width} height={height} color={color} />,
      Decrease10Seconds: (
        <Decrease10Seconds width={width} height={height} color={color} />
      ),
      Close: <Close width={width} height={height} color={color} />,
      Back: <Back width={width} height={height} color={color} />,
      Blur: <Blur width={width} height={height} color={color} />,
      HeaderHelp: (
        <HeaderHelp
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      HeaderTalk: (
        <HeaderLiveAgent
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      HeaderMenu: (
        <HeaderMinimize
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      HeaderReconnect: (
        <HeaderReconnect
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      HeaderClose: (
        <HeaderClose
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      HeaderLeft: (
        <HeaderLeft
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      HeaderAvatar: <HeaderAvatar width={width} height={height} />,

      MicIcon: (
        <MicIcon
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      AttachmentIcon: (
        <AttachmentIcon
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      MenuIcon: (
        <MenuIcon
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),

      KeyboardIcon: (
        <KeyboardIcon
          width={width}
          height={height}
          color={color ? color : '#697586'}
        />
      ),
      SendIcon: (
        <SendIcon
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),

      HappyIcon: (
        <HappyIcon
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      SpeakerIcon: (
        <SpeakerIcon
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      SpeakerOffIcon: (
        <SpeakerOffIcon
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      IcIcon_1: (
        <IcIcon_1
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      IcIcon_2: (
        <IcIcon_2
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      IcIcon_3: (
        <IcIcon_3
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      IcIcon_4: (
        <IcIcon_4
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      AvatarBot: (
        <AvatarBot
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      'icon-1': (
        <IcIcon_1
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      'icon-2': (
        <IcIcon_2
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      'icon-3': (
        <IcIcon_3
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
      'icon-4': (
        <IcIcon_4
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),

      Koreai_logo: (
        <Koreai_logo
          width={width}
          height={height}
          color={color ? color : Color.white}
        />
      ),
    };

    // const keys = Object.keys(iconsMap);
    // if (keys.indexOf(name) === -1) {
    //   return <IcoMoon name={name} />;
    // }

    return iconsMap[name];
  }
}
