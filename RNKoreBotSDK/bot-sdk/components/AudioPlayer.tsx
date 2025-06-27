// // AudioPlayer.tsx
// import React, {Component} from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {Slider} from '@react-native-assets/slider';
// // import TrackPlayer, {
// //   Event,
// //   PlaybackState,
// //   State,
// // } from 'react-native-track-player';
// import {SvgIcon} from '../utils/SvgIcon';
// import {normalize} from '../utils/helpers';
// import Color from '../theme/Color';
// import uuid from 'react-native-uuid';

// interface AudioPlayerProps {
//   url: string;
//   title?: string;
//   artist?: string;
//   artwork?: string;
//   onMenuClick?: any;
//   isStopPlayer?: boolean;
// }

// interface AudioPlayerState {
//   isPlaying: boolean;

//   position: number;
//   duration: number;
//   isMuted: boolean;
// }

// class AudioPlayer extends Component<AudioPlayerProps, AudioPlayerState> {
//   private positionUpdateInterval: number | undefined;
//   eventListener: any;
//   isFristTime: boolean;

//   constructor(props: AudioPlayerProps) {
//     super(props);
//     this.isFristTime = true;
//     this.state = {
//       isPlaying: false,
//       position: 0,
//       duration: 0,
//       isMuted: false,
//     };
//   }

//   componentDidUpdate(
//     prevProps: Readonly<AudioPlayerProps>,
//     prevState: Readonly<AudioPlayerState>,
//     snapshot?: any,
//   ): void {
//     if (prevProps.isStopPlayer !== this.props.isStopPlayer) {
//       // TrackPlayer.getActiveTrackIndex().then(
//       //   async (index: number | undefined) => {
//       //     if (index !== undefined) {
//       //       try {
//       //         await TrackPlayer.reset();
//       //       } catch (error) {
//       //         console.log('TrackPlayer.reset error --->:', error);
//       //       }

//       //       try {
//       //         await TrackPlayer.remove(index);
//       //       } catch (error) {
//       //         console.log('TrackPlayer.remove error --->:', error);
//       //       }
//       //     }
//       //   },
//       // );
//     }
//   }

//   // componentDidMount() {
//   //   setTimeout(() => {
//   //     this.initApp()
//   //       .then(() => {
//   //         this.eventListener = TrackPlayer.addEventListener(
//   //           Event.PlaybackState,
//   //           (event: PlaybackState) => {
//   //             this.onPlaybackStateChanged(event?.state);
//   //           },
//   //         );

//   //         this.positionUpdateInterval = setInterval(this.updatePosition, 500);
//   //       })
//   //       .catch(error => {
//   //         console.error('initApp failed:', error);
//   //       });
//   //   }, 1000);
//   // }

//   private initApp = async () => {
//     try {
//       // await TrackPlayer.setupPlayer();
//     } catch (error) {
//       console.log('setupPlayer error ----->:', error);
//     }
//     try {
//       // await TrackPlayer.removeUpcomingTracks();
//     } catch (error) {
//       console.log('removeUpcomingTracks error ----->:', error);
//     }
//     try {
//       // await TrackPlayer.add({
//       //   // key: uuid.v4() + '',
//       //   //id: uuid.v4() + '',
//       //   url: this.props.url, //'https://file-examples.com/storage/fe0e5e78596682d89b36118/2017/11/file_example_MP3_700KB.mp3',
//       //   title: this.props.title || 'Audio title',
//       //   artist: this.props.artist || 'artist',
//       //   artwork: this.props.artwork || 'https://picsum.photos/200',
//       // });
//     } catch (error) {
//       console.log('this.props.url, ----->:', this.props.url);
//       console.log('TrackPlayer.add error ----->:', error);
//     }
//   };

//   componentWillUnmount() {
//     this.eventListener?.remove?.();
//     if (this.positionUpdateInterval) {
//       clearInterval(this.positionUpdateInterval);
//     }
//   }

//   // private onPlaybackStateChanged = (state: State) => {
//   //   switch (state) {
//   //     case State.Playing:
//   //       this.setState({isPlaying: true});
//   //       break;

//   //     case State.Paused:
//   //       this.setState({isPlaying: false});
//   //       break;

//   //     case State.Stopped:
//   //     case State.Ended:
//   //       if (this.positionUpdateInterval) {
//   //         clearInterval(this.positionUpdateInterval);
//   //       }

//   //       this.setState(
//   //         {
//   //           isPlaying: false,
//   //         },
//   //         () => {
//   //           setTimeout(async () => {
//   //             this.setState({
//   //               position: 0,
//   //             });
//   //             await TrackPlayer.pause();
//   //           }, 2000);
//   //         },
//   //       );

//   //       break;

//   //     default:
//   //       this.setState({isPlaying: false});
//   //   }
//   // };

//   // private updatePosition = async () => {
//   //   if (this.isFristTime || this.state.isPlaying) {
//   //     TrackPlayer.getProgress().then(progress => {
//   //       //  console.log('progress ------->:', progress);
//   //       this.setState(
//   //         {
//   //           position: this.isFristTime ? 0 : progress.position,
//   //           duration: progress.duration,
//   //         },
//   //         () => {
//   //           this.isFristTime = false;
//   //         },
//   //       );
//   //     });
//   //   }
//   // };

//   // private togglePlayback = async () => {
//   //   const {isPlaying} = this.state;
//   //   if (isPlaying) {
//   //     // await TrackPlayer.pause();
//   //   } else {
//   //     if (this.positionUpdateInterval) {
//   //       clearInterval(this.positionUpdateInterval);
//   //     }
//   //     if (this.state.position === 0) {
//   //       // await TrackPlayer?.seekTo?.(0);
//   //     }
//   //     // await TrackPlayer.play();
//   //     // this.positionUpdateInterval = setInterval(this.updatePosition, 1000);
//   //   }
//   // };

//   render() {
//     const {position, duration} = this.state;
//     return (
//       <View
//         style={{
//           flex: 1,
//           padding: 8,
//         }}>
//         <View style={styles.container}>
//           <TouchableOpacity onPress={this.togglePlayback}>
//             <SvgIcon
//               name={this.state?.isPlaying ? 'Pause' : 'Play'}
//               width={normalize(22)}
//               height={normalize(22)}
//             />
//           </TouchableOpacity>
//           <Text style={styles.timeText}>
//             {this.formatTime(position)}/{this.formatTime(duration)}
//           </Text>

//           <Slider
//             style={styles.slider}
//             value={position || 0}
//             minimumValue={0}
//             slideOnTap={false}
//             maximumValue={duration || 100}
//             minimumTrackTintColor={Color.green}
//             maximumTrackTintColor="#A7A9BE"
//             thumbTintColor={'#000000'}
//             onValueChange={val => {}}
//           />
//           {/* <TouchableOpacity
//             onPress={() => {
//               if (this.props?.onMenuClick) {
//                 this.props?.onMenuClick?.();
//               }
//             }}>
//             <SvgIcon
//               name={'ThreeDots'}
//               width={normalize(18)}
//               height={normalize(18)}
//             />
//           </TouchableOpacity> */}
//         </View>
//       </View>
//     );
//   }

//   private formatTime(seconds: number) {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Color.white,
//     padding: 5,
//     paddingStart: 8,
//     paddingEnd: 8,
//     borderRadius: 15,
//   },
//   timeText: {
//     marginVertical: 5,
//     marginHorizontal: 5,
//     fontSize: normalize(12),
//     color: '#000',
//   },
//   slider: {
//     flex: 1,
//     height: 40,
//     marginStart: 5,
//     marginEnd: 10,
//   },
// });

// export default AudioPlayer;
