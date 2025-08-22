import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Popover from "react-native-popover-view";
import Sound from "react-native-sound";
import Slider from "@react-native-community/slider";
import RNFS from "react-native-fs";
import { SvgIcon } from "../utils/SvgIcon";
import { normalize } from "../utils/helpers";
import Toast from "react-native-toast-message";

type AudioPlayerProps = {
  audioUrl: string; // remote or local file URL
};

type AudioPlayerState = {
  isPlaying: boolean;
  duration: number;
  position: number;
  showMenu: boolean;
};

export default class AudioPlayer extends React.PureComponent<AudioPlayerProps, AudioPlayerState> {
  private sound: Sound | null = null;
  private intervalRef: NodeJS.Timeout | null = null;

  constructor(props: AudioPlayerProps) {
    super(props);
    this.state = {
      isPlaying: false,
      duration: 0,
      position: 0,
      showMenu: false,
    };
  }

  componentDidMount() {
    this.loadSound();
  }

  componentDidUpdate(prevProps: AudioPlayerProps) {
    if (prevProps.audioUrl !== this.props.audioUrl) {
      this.releaseSound();
      this.loadSound();
    }
  }

  componentWillUnmount() {
    this.releaseSound();
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  loadSound() {
    const { audioUrl } = this.props;
    this.sound = new Sound(audioUrl, "", (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        return;
      }
      this.setState({ duration: this.sound?.getDuration() || 0 });
    });
  }

  releaseSound() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
  }

  togglePlayPause = () => {
    if (!this.sound) return;

    if (this.state.isPlaying) {
      this.sound.pause();
      this.setState({ isPlaying: false });
      if (this.intervalRef) clearInterval(this.intervalRef);
    } else {
      this.sound.play((success) => {
        if (success) {
          console.log("Playback finished");
        }
        this.setState({ isPlaying: false, position: 0 });
        if (this.intervalRef) clearInterval(this.intervalRef);
      });

      this.setState({ isPlaying: true });
      this.intervalRef = setInterval(() => {
        this.sound?.getCurrentTime((sec) => {
          this.setState({ position: sec });
        });
      }, 500);
    }
  };

  onSeek = (value: number) => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ position: value });
    }
  };

  downloadFile = async () => {
    try {
      const { audioUrl } = this.props;
      const fileName = audioUrl.split("/").pop();
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const exists = await RNFS.exists(destPath);
      if (exists) {
        Toast.show({ type: "info", position: "bottom", text1: "Already downloaded", text2: destPath });
        return;
      }

      await RNFS.downloadFile({
        fromUrl: audioUrl,
        toFile: destPath,
      }).promise;
      Toast.show({ type: "success", position: "bottom", text1: "Downloaded", text2: destPath });
    } catch (err) {
      Toast.show({ type: "error", position: "bottom", text1: "Download failed!" });
    }
  };

  formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  render() {
    const { isPlaying, position, duration } = this.state;

    return (
      <View style={{ flex: 1, padding: 4 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.togglePlayPause}>
            <SvgIcon
              name={isPlaying ? "Pause" : "Play"}
              width={normalize(22)}
              height={normalize(22)}
            />
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {this.formatTime(position)}/{this.formatTime(duration)}
          </Text>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={this.onSeek}
          />

          <Popover
            isVisible={this.state.showMenu}
            onRequestClose={() => this.setState({ showMenu: false })}
            backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.1)" }}
            from={
              <TouchableOpacity onPress={() => this.setState({ showMenu: true })}>
                <SvgIcon
                  name={"ThreeDots"}
                  width={normalize(18)}
                  height={normalize(18)}
                />
              </TouchableOpacity>
            }
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                this.setState({ showMenu: false }, () => this.downloadFile());
              }}
            >
              <Text style={styles.menuItemText}>Download</Text>
            </TouchableOpacity>
          </Popover>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeText: {
    marginVertical: 5,
    marginHorizontal: 5,
    fontSize: normalize(12),
    color: "#000",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: normalize(14),
    color: "#000",
  },
});
