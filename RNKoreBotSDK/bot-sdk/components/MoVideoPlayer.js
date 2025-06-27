import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  AppState,
  Dimensions,
  StatusBar,
  BackHandler,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';

// Conditional imports for native modules
let Video = null;
let Orientation = null;
let uuid = null;

try {
  Video = require('react-native-video').default;
} catch (error) {
  console.warn('react-native-video not available, video features will be disabled');
}

try {
  Orientation = require('react-native-orientation-locker').default;
} catch (error) {
  console.warn('react-native-orientation-locker not available, orientation features will be disabled');
}

try {
  uuid = require('react-native-uuid').default;
} catch (error) {
  console.warn('react-native-uuid not available, using fallback ID generation');
  // Fallback uuid function
  uuid = { v4: () => Math.random().toString(36).substr(2, 9) };
}

import {SvgIcon} from '../utils/SvgIcon';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';

const MoVideoPlayer = forwardRef((props, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      onCloseScreen() {
        StatusBar.setHidden(false);
        if (Orientation && Orientation.lockToPortrait) {
          try {
            Orientation.lockToPortrait();
          } catch (error) {
            console.warn('Failed to lock orientation:', error);
          }
        }
      },
      onOpenScreen() {
        setAutoHideOptions(true, false, timeOutHandler);
        setIsPaused(false);
        setTimeout(() => {
          setCurrentVideoDuration(duration);
          videoRef?.current?.seek(duration);
        }, 2000);
      },
      onSetVideoResume() {
        videoRef.current.seek(currentVideoDuration - 10);
      },
      onGetVideoDuration() {
        return currentVideoDuration;
      },

      getSource() {
        return props?.source;
      },
      setVideoState(isPaused1) {
        setIsPaused(isPaused1);
      },
    }),
    [timeOutHandler, duration, currentVideoDuration, props?.source],
  );

  const {
    style = {},
    source,
    poster,
    title = '',
    playList = [],
    autoPlay = false,
    playInBackground = false,
    showSeeking10SecondsButton = true,
    showHeader = true,
    showCoverButton = true,
    showFullScreenButton = true,
    showSettingButton = false,
    showMuteButton = true,
    duration = 0,
    isViewDisable,
  } = props;

  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoSeeked, setIsVideoSeeked] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(true);
  const [isShowVideoCurrentDuration, setIsShowVideoCurrentDuration] =
    useState(false);
  const [isShowSettingsBottomSheet, setIsShowSettingsBottomSheet] =
    useState(false);
  const [isShowVideoRateSettings, setIsShowVideoRateSettings] = useState(false);
  const [isShowVideoQualitiesSettings, setIsShowVideoQualitiesSettings] =
    useState(false);
  const [isShowVideoSoundSettings, setIsShowVideoSoundSettings] =
    useState(false);
  const [isShowVideoPlaylist, setIsShowVideoPlaylist] = useState(false);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [isErrorInLoadVideo, setIsVErrorInLoadVideo] = useState(false);
  const [isVideoEnd, setIsVideoEnd] = useState(false);
  const [isVideoCovered, setIsVideoCovered] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoQuality, setVideoQuality] = useState(480);
  const [videoSound, setVideoSound] = useState(1.0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState(duration);
  const [videoRate, setVideoRate] = useState(1);
  const [playlistSelectedVideo, setPlaylistSelectedVideo] = useState(null);
  const [dimension, setDimension] = useState(Dimensions.get('window'));
  const [timeOutHandler, setTimeOutHandler] = useState(0);

  const portraitStyle = {
    alignSelf: 'center',
    height: 200,
    width: 330,
    ...style,
  };
  const landScapeStyle = {
    alignSelf: 'center',
    justifyContent: 'center',
    height: dimension.height - 50,
    width: dimension.width - 50,
  };
  const videoStyle = isVideoFullScreen ? landScapeStyle : portraitStyle;

  useEffect(() => {
    props?.getCurrentVideoDuration?.(currentVideoDuration);
  }, [currentVideoDuration]);

  const setAutoHideOptions = (
    isFocus,
    isPaused,
    timeOutHandler,
    isViewDisable,
  ) => {
    if (isViewDisable) {
      clearTimeout(timeOutHandler);
      setIsVideoFocused(true);
      return;
    }
    setIsVideoFocused(isFocus);

    if (isFocus) {
      clearTimeout(timeOutHandler);
      let handler = setTimeout(() => {
        if (!isPaused) {
          setIsVideoFocused(false);
        }
      }, 5000);
      setTimeOutHandler(handler);
    }
  };
  useEffect(() => {
    if (isViewDisable) {
      setIsVideoFocused(true);
    } else if (isPaused && !isVideoFocused) {
      setIsVideoFocused(true);
    }
  }, [isPaused, isVideoFocused, isViewDisable]);

  useEffect(() => {
    if (isViewDisable) {
      setIsVideoFocused(true);
    }
  }, [isViewDisable]);

  useEffect(() => {
    const dimensionSubscriber = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimension(window);
        setIsVideoFullScreen(window.width > window.height ? true : false);
      },
    );

    const backHandlerSubscriber = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // if(isVideoFullScreen){
        if (Orientation && Orientation.lockToPortrait) {
          try {
            Orientation.lockToPortrait();
          } catch (error) {
            console.warn('Failed to lock orientation:', error);
          }
        }
        StatusBar.setHidden(false);
        return false;
        // }else{
        //   return false
        // }
      },
    );

    return () => {
      dimensionSubscriber.remove();
      backHandlerSubscriber.remove();
    };
  }, [isVideoFullScreen]);

  useEffect(() => {
    const appStateSubscriber = AppState.addEventListener('change', state => {
      console.log('APP STATE CHANGE IS ', state);
      if (playInBackground && isPaused == false) {
        setIsPaused(false);
      } else {
        setIsPaused(true);
        props?.onBackPress?.();
      }
    });

    return () => {
      appStateSubscriber.remove();
    };
  }, [isPaused]);

  const videoHeaders = () => {
    let isFromNormal = props?.isFromNormalScreen || false;

    return (
      <View
        style={{
          paddingHorizontal: 10,
          width: videoStyle.width,
          height: 35,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.5)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100000,
        }}>
        <Text
          numberOfLines={1}
          style={{color: 'white', fontSize: 12, width: videoStyle.width - 170}}>
          {/* {playlistSelectedVideo
          ? playlistSelectedVideo.title
            ? playlistSelectedVideo.title
            : ''
          : title} */}
        </Text>
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {showFullScreenButton && (
            <TouchableOpacity
              onPress={() => {
                if (props?.onFullScreen) {
                  props.onFullScreen?.();
                } else {
                  if (isVideoFullScreen) {
                    StatusBar.setHidden(false);
                    if (Orientation && Orientation.lockToPortrait) {
                      try {
                        Orientation.lockToPortrait();
                      } catch (error) {
                        console.warn('Failed to lock orientation:', error);
                      }
                    }
                  } else {
                    StatusBar.setHidden(true);
                    if (Orientation && Orientation.lockToLandscapeLeft) {
                      try {
                        Orientation.lockToLandscapeLeft();
                      } catch (error) {
                        console.warn('Failed to lock orientation:', error);
                      }
                    }
                  }
                }
              }}
              style={{
                marginRight: 0,
                // backgroundColor: 'red',
                padding: 5,
                //paddingRight: 0,
              }}>
              <SvgIcon
                name={
                  isVideoFullScreen
                    ? 'ExitFullScreen'
                    : isFromNormal
                    ? 'Expand'
                    : 'FullScreen'
                }
                color={Color.white}
                width={normalize(isFromNormal ? 18 : 18)}
                height={normalize(isFromNormal ? 18 : 18)}
              />
            </TouchableOpacity>
          )}

          {playList.length > 0 && (
            <TouchableOpacity
              style={{marginRight: 10, marginTop: 5}}
              onPress={() => {
                setIsShowVideoPlaylist(true);
                setAutoHideOptions(
                  false,
                  isPaused,
                  timeOutHandler,
                  isViewDisable,
                );
              }}>
              <SvgIcon
                name={'Playlist'}
                color={Color.white}
                width={normalize(18)}
                height={normalize(18)}
              />
            </TouchableOpacity>
          )}
          {/* {showSettingButton && (
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                setIsShowSettingsBottomSheet(true);
                setIsVideoFocused(false);
              }}>
              <Image
                source={require('../assets/images/settings.png')}
                style={{width: 18, height: 18}}
              />
            </TouchableOpacity>
          )} */}

          {showMuteButton && (
            <TouchableOpacity
              onPress={() => {
                setIsMuted(!isMuted);
                if (isMuted && videoSound == 0) {
                  setVideoSound(1.0);
                }
              }}
              style={{marginRight: 20, padding: 5}}>
              <SvgIcon
                name={isMuted ? 'MuteSound' : 'FullSound'}
                color={Color.white}
                width={normalize(20)}
                height={normalize(20)}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const videoFooter = () => {
    // console.log('videoFooter currentVideoDuration  -->:', currentVideoDuration);
    return (
      <View
        style={{
          paddingHorizontal: 10,
          width: videoStyle.width,
          height: 35,
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.5)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100000,
        }}>
        <TouchableOpacity
          onPress={() => {
            let value = !isPaused;
            if (isVideoEnd) {
              videoRef.current.seek(0);
              setIsVideoEnd(false);
              setCurrentVideoDuration(0);
              value = false;
              setIsPaused(false);
            } else {
              setIsPaused(value);
            }

            setAutoHideOptions(true, value, timeOutHandler, isViewDisable);
          }}
          style={{
            marginRight: 0,
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 15,
            paddingLeft: 8,
            //paddingRight: 0,
          }}>
          <SvgIcon
            name={isPaused ? 'PPlay' : 'PPause'}
            color={Color.white}
            width={normalize(17)}
            height={normalize(17)}
          />
        </TouchableOpacity>

        {/* <Slider
          style={{flex: 1, marginEnd: 5}}
          //disabled={isRecordBeforePlay}
          maximumValue={videoDuration}
          minimumValue={0}
          minimumTrackTintColor="white"
          maximumTrackTintColor="gray"
          thumbTintColor="white"
          thumbStyle={{height: 12, width: 12}}
          trackStyle={{height: 1.8, width: videoStyle.width - 140}}
          useNativeDriver
          value={currentVideoDuration}
          onSlidingComplete={sliderData => {
            //console.log('sliderData --------->:', sliderData);
            setCurrentVideoDuration(sliderData);
            videoRef.current.seek(sliderData);
          }}
        /> */}

        <Text style={{color: 'white', fontSize: 12, marginRight: 10}}>
          {new Date(currentVideoDuration * 1000).toISOString().substr(14, 5)} /
          <Text style={{color: 'white'}}>
            {' '}
            {new Date(videoDuration * 1000).toISOString().substr(14, 5)}
          </Text>
        </Text>
      </View>
    );
  };

  const videoSeekingIncreaseButton = () => (
    <TouchableOpacity
      style={{
        height: videoStyle.height - 70,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        borderColor: 'red',
        position: 'absolute',
        right: 30,
        top: 35,
        bottom: 0,
        zIndex: 100000,
      }}
      onPress={() => videoRef.current.seek(currentVideoDuration + 10)}>
      <SvgIcon
        name={'Increase10Seconds'}
        color={Color.white}
        width={normalize(25)}
        height={normalize(25)}
      />
    </TouchableOpacity>
  );

  const videoSeekingDecreaseButton = () => (
    <TouchableOpacity
      style={{
        height: videoStyle.height - 70,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        borderColor: 'red',
        position: 'absolute',
        left: 30,
        top: 35,
        bottom: 0,
        zIndex: 100000,
      }}
      onPress={() => videoRef.current.seek(currentVideoDuration - 10)}>
      <SvgIcon
        name={'Decrease10Seconds'}
        color={Color.white}
        width={normalize(25)}
        height={normalize(25)}
      />
    </TouchableOpacity>
  );

  const videoSettingsView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowSettingsBottomSheet(false);
            setAutoHideOptions(true, isPaused, timeOutHandler, isViewDisable);
          }}>
          <SvgIcon
            name={'Close'}
            color={Color.white}
            width={normalize(20)}
            height={normalize(22)}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 170,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setIsShowSettingsBottomSheet(false);
              setIsShowVideoQualitiesSettings(true);
            }}>
            <SvgIcon
              name={'Quality'}
              color={Color.white}
              width={normalize(26)}
              height={normalize(27)}
            />
            <Text style={{color: 'white', fontSize: 13}}>Quality</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setIsShowSettingsBottomSheet(false);
              setIsShowVideoRateSettings(true);
            }}>
            <SvgIcon
              name={'speed'}
              color={Color.white}
              width={normalize(20)}
              height={normalize(25)}
            />
            <Text style={{color: 'white', fontSize: 13}}>Speed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setIsShowSettingsBottomSheet(false);
              setIsShowVideoSoundSettings(true);
            }}>
            <SvgIcon
              name={'SoundMixer'}
              color={Color.white}
              width={normalize(20)}
              height={normalize(22)}
            />
            <Text style={{color: 'white', fontSize: 13}}>Sound</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoRateSettingView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoRateSettings(false);
            setAutoHideOptions(true, isPaused, timeOutHandler, isViewDisable);
          }}>
          <SvgIcon
            name={'Close'}
            color={Color.white}
            width={normalize(20)}
            height={normalize(22)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoRateSettings(false);
            setIsShowSettingsBottomSheet(true);
          }}>
          <SvgIcon
            name={'Back'}
            color={Color.white}
            width={normalize(23)}
            height={normalize(18)}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 230,
            height: 50,
            borderWidth: 0,
            borderColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoRate(0.5);
            }}>
            {videoRate == 0.5 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoRate == 0.5 ? 3 : 0,
              }}>
              Slow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoRate(1);
            }}>
            {videoRate == 1 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoRate == 1 ? 3 : 0,
              }}>
              Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoRate(4);
            }}>
            {videoRate == 4 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoRate == 4 ? 3 : 0,
              }}>
              Fast
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoQualitiesSettingView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoQualitiesSettings(false);
            setAutoHideOptions(true, isPaused, timeOutHandler, isViewDisable);
          }}>
          <SvgIcon
            name={'Close'}
            color={Color.white}
            width={normalize(20)}
            height={normalize(22)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoQualitiesSettings(false);
            setIsShowSettingsBottomSheet(true);
          }}>
          <SvgIcon
            name={'Back'}
            color={Color.white}
            width={normalize(23)}
            height={normalize(18)}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 260,
            borderWidth: 0,
            borderColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(144);
            }}>
            {videoQuality == 144 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}

            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 144 ? 3 : 0,
              }}>
              144p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(240);
            }}>
            {videoQuality == 240 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 240 ? 3 : 0,
              }}>
              240p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(360);
            }}>
            {videoQuality == 360 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 360 ? 3 : 0,
              }}>
              360p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(480);
            }}>
            {videoQuality == 480 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 480 ? 3 : 0,
              }}>
              480p
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: 260,
            marginTop: 15,
            borderWidth: 0,
            borderColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(720);
            }}>
            {videoQuality == 720 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 720 ? 3 : 0,
              }}>
              720p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(1080);
            }}>
            {videoQuality == 1080 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 1080 ? 3 : 0,
              }}>
              1080p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(1440);
            }}>
            {videoQuality == 1440 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 1440 ? 3 : 0,
              }}>
              1440p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(2160);
            }}>
            {videoQuality == 2160 && (
              <SvgIcon
                name={'Dot'}
                color={Color.white}
                width={normalize(10)}
                height={normalize(10)}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 2160 ? 3 : 0,
              }}>
              2160p
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoSoundView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoSoundSettings(false);
            setAutoHideOptions(true, isPaused, timeOutHandler, isViewDisable);
          }}>
          <SvgIcon
            name={'Close'}
            color={Color.white}
            width={normalize(20)}
            height={normalize(22)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoSoundSettings(false);
            setIsShowSettingsBottomSheet(true);
          }}>
          <SvgIcon
            name={'Back'}
            color={Color.white}
            width={normalize(23)}
            height={normalize(18)}
          />
        </TouchableOpacity>

        {/* <Slider
          //disabled={isRecordBeforePlay}
          style={{flex: 1}}
          maximumValue={1}
          minimumValue={0}
          step={0.1}
          minimumTrackTintColor="white"
          maximumTrackTintColor="gray"
          thumbTintColor="white"
          thumbStyle={{height: 12, width: 12}}
          trackStyle={{height: 1.8, width: videoStyle.width - 130}}
          useNativeDriver
          value={videoSound}
          onSlidingComplete={sliderData => {
            //  console.log('TYPE OF', typeof Number(sliderData[0].toFixed(1)));
            setVideoSound(Number(sliderData.toFixed(1)));
            if (sliderData == 0) {
              setIsMuted(true);
            } else {
              setIsMuted(false);
            }
          }}
        /> */}

        <Text style={{color: 'white'}}>{videoSound}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoSeekedLoader = () => (
    <View
      style={{
        height: videoStyle.height,
        width: videoStyle.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0 ,0, 0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color="white" size="large" />
    </View>
  );

  const videoErrorView = () => {
    return (
      <View
        style={{
          height: videoStyle.height,
          width: videoStyle.width,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SvgIcon
          name={'Error'}
          color={Color.red}
          width={normalize(30)}
          height={normalize(30)}
        />
        {/* <SvgIcon
          name={isViewDisable ? 'Error' : 'PPlay'}
          color={isViewDisable ? Color.red : Color.white}
          width={isViewDisable ? normalize(30) : normalize(20)}
          height={isViewDisable ? normalize(30) : normalize(20)}
        /> */}
        {!isViewDisable && (
          <Text style={{color: 'white', fontSize: 12, marginTop: 0}}>
            Error when load video
          </Text>
        )}
      </View>
    );
  };

  const videoPosterView = () => (
    <Image
      source={{
        uri: playlistSelectedVideo
          ? playlistSelectedVideo.poster
            ? playlistSelectedVideo.poster
            : ''
          : poster,
      }}
      style={{
        height: videoStyle.height,
        width: videoStyle.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0 ,0, 0,0.5)',
      }}
    />
  );

  const videoPlaylistView = () => {
    console.log(
      'INDEX OF LIST  ',
      playlistSelectedVideo && playlistSelectedVideo.index > 0
        ? playlistSelectedVideo.index - 1
        : 0,
    );
    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0 ,0, 0,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            ...videoStyle,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 10,
              top: 10,
            }}
            onPress={() => {
              setIsShowVideoPlaylist(false);
              setAutoHideOptions(true, isPaused, timeOutHandler, isViewDisable);
            }}>
            <SvgIcon
              name={'Close'}
              color={Color.white}
              width={normalize(20)}
              height={normalize(22)}
            />
          </TouchableOpacity>

          <View
            style={{
              marginVertical: 5,
              height: playlistSelectedVideo ? 140 : 120,
              marginHorizontal: 20,
            }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
              initialScrollIndex={
                playlistSelectedVideo && playlistSelectedVideo.index > 0
                  ? playlistSelectedVideo.index - 1
                  : 0
              }
              keyExtractor={(item, index) => index}
              data={playList}
              renderItem={({item, index}) => {
                const isSelected = playlistSelectedVideo
                  ? playlistSelectedVideo.url == item.url
                    ? true
                    : false
                  : false;
                return (
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: isSelected ? 150 : 130,
                      height: isSelected ? 140 : 120,
                    }}
                    onPress={() => {
                      if (isSelected) {
                        setIsPaused(!isPaused);
                        setIsShowVideoPlaylist(false);
                      } else {
                        videoRef.current.seek(0);
                        setPlaylistSelectedVideo({...item, index: index});
                        setIsPaused(false);
                        setIsShowVideoPlaylist(false);
                        setAutoHideOptions(
                          true,
                          isPaused,
                          timeOutHandler,
                          isViewDisable,
                        );
                      }
                    }}>
                    <Image
                      source={{uri: item.poster}}
                      resizeMode="stretch"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: isSelected ? 150 : 130,
                        height: isSelected ? 140 : 120,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: 'white',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#900C3F',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10000,
                      }}>
                      <SvgIcon
                        name={
                          isSelected
                            ? isPaused
                              ? 'PPlay'
                              : 'PPause.png'
                            : 'PPlay'
                        }
                        color={Color.white}
                        width={normalize(27)}
                        height={normalize(17)}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const videoCoverView = () => (
    <TouchableWithoutFeedback>
      <ImageBackground
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          ...videoStyle,
        }}
        source={require('../assets/images/blur.png')}>
        <SvgIcon
          name={'Eye'}
          color={Color.white}
          width={normalize(70)}
          height={normalize(100)}
        />

        <TouchableOpacity
          style={{
            width: 80,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0 ,0, 0,0.5)',
            marginTop: 20,
            borderRadius: 5,
          }}
          onPress={() => {
            setAutoHideOptions(true, isPaused, timeOutHandler, isViewDisable);
            setIsVideoCovered(false);
          }}>
          <Text style={{color: 'white'}}>Uncover</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('TOUCH');

        let value = !isPaused;

        if (isPaused) {
          setIsPaused(value);
        }

        if (!isVideoEnd && value) {
          setAutoHideOptions(true, false, timeOutHandler, isViewDisable);
        } else {
          setAutoHideOptions(true, value, timeOutHandler, isViewDisable);
        }
      }}>
      <View style={videoStyle}>
        <Video
          keyExtractor={uuid.v4() + ''}
          style={{flex: 1}}
          posterResizeMode="cover"
          resizeMode="cover"
          bufferConfig={{
            minBufferMs: 1000 * 60,
            bufferForPlaybackMs: 1000 * 60,
            bufferForPlaybackAfterRebufferMs: 1000 * 60,
          }}
          ref={videoRef}
          source={
            playlistSelectedVideo ? {uri: playlistSelectedVideo.url} : source
          }
          paused={isPaused}
          muted={isMuted}
          rate={videoRate}
          selectedVideoTrack={{
            type: 'resolution',
            value: videoQuality,
          }}
          volume={videoSound}
          playInBackground={playInBackground}
          onLoad={videoData => {
            setVideoDuration(videoData.duration);
            setCurrentVideoDuration(duration);
            setIsVErrorInLoadVideo(false);
          }}
          onProgress={videoData => {
            setCurrentVideoDuration(videoData.currentTime);
          }}
          /*onSeek={()=>{
            if(Platform.OS=='android'){
              setIsVideoSeeked(true)
            }
          }}
          onReadyForDisplay={()=>{
            console.log("onReadyForDisplay")
            setIsVideoSeeked(false)
            setIsVErrorInLoadVideo(false)
          }}*/
          onError={videoData => setIsVErrorInLoadVideo(true)}
          onEnd={() => {
            console.log('on end');
            setIsVideoEnd(true);
            setIsPaused(true);
            if (playList.length > 0) {
              setIsShowVideoPlaylist(true);
            }
          }}
        />
        {currentVideoDuration == 0 && poster && videoPosterView()}
        {isVideoFocused && showHeader && videoHeaders()}
        {isVideoFocused &&
          showSeeking10SecondsButton &&
          !isErrorInLoadVideo &&
          videoSeekingIncreaseButton()}
        {isVideoFocused &&
          showSeeking10SecondsButton &&
          !isErrorInLoadVideo &&
          videoSeekingDecreaseButton()}
        {isVideoFocused && videoFooter()}
        {/* {isShowSettingsBottomSheet && videoSettingsView()} */}
        {/* {isShowVideoRateSettings && videoRateSettingView()} */}
        {isShowVideoSoundSettings && videoSoundView()}
        {/* {isShowVideoQualitiesSettings && videoQualitiesSettingView()} */}
        {isVideoSeeked && videoSeekedLoader()}
        {isErrorInLoadVideo && videoErrorView()}
        {isViewDisable && videoErrorView()}
        {/* {playList.length > 0 && isShowVideoPlaylist && videoPlaylistView()} */}
        {isVideoCovered && videoCoverView()}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default MoVideoPlayer;
