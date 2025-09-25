import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { useLazySound, SoundInstance } from "./LazySound";
import { LazyPopover, LazySlider } from "./lazy-loading";
import RNFS from "react-native-fs";
import { SvgIcon } from "../utils/SvgIcon";
import { normalize } from "../utils/helpers";
import Toast from "react-native-toast-message";

type AudioPlayerProps = {
  audioUrl: string; // remote or local file URL
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const { createSound, isLoading: soundLoading, loadError } = useLazySound();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  
  const soundRef = useRef<SoundInstance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load sound when component mounts or audioUrl changes
  useEffect(() => {
    loadSound();
    return () => {
      releaseSound();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseSound();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      setSoundReady(false);
      setPosition(0);
      setDuration(0);
      
      const sound = await createSound(audioUrl, "", (error) => {
        if (error) {
          console.log("Failed to load sound", error);
          Toast.show({
            type: 'error',
            text1: 'Audio Error',
            text2: 'Failed to load audio file',
          });
          return;
        }
        if (sound) {
          setDuration(sound.getDuration() || 0);
          setSoundReady(true);
        }
      });
      
      soundRef.current = sound;
    } catch (error) {
      console.error("Error loading sound with lazy loading:", error);
      Toast.show({
        type: 'error',
        text1: 'Audio Unavailable',
        text2: 'Sound module could not be loaded',
      });
    }
  };

  const releaseSound = () => {
    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }
    setSoundReady(false);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (!soundRef.current || !soundReady) {
      Toast.show({
        type: 'warning',
        text1: 'Audio Not Ready',
        text2: 'Please wait for audio to load',
      });
      return;
    }

    if (isPlaying) {
      soundRef.current.pause(() => {
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
    } else {
      soundRef.current.play((success) => {
        if (success) {
          console.log("Playback finished");
        } else {
          console.log("Playback failed due to audio decoding errors");
          Toast.show({
            type: 'error',
            text1: 'Playback Failed',
            text2: 'Could not play audio file',
          });
        }
        setIsPlaying(false);
        setPosition(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
      setIsPlaying(true);
      startTimer();
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      if (soundRef.current) {
        soundRef.current.getCurrentTime((seconds) => {
          setPosition(seconds);
        });
      }
    }, 500);
  };

  const onSeek = (value: number) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(value);
      setPosition(value);
    }
  };

  const downloadFile = async () => {
    try {
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderPopoverMenu = () => {
    return (
      <LazyPopover
        isVisible={showMenu}
        onRequestClose={() => setShowMenu(false)}
        backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        from={
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <SvgIcon
              name={"ThreeDots"}
              width={normalize(18)}
              height={normalize(18)}
            />
          </TouchableOpacity>
        }
        fallbackComponent={() => (
          <>
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <SvgIcon
                name={"ThreeDots"}
                width={normalize(18)}
                height={normalize(18)}
              />
            </TouchableOpacity>
            
            {showMenu && (
              <Modal
                visible={showMenu}
                transparent
                onRequestClose={() => setShowMenu(false)}
                animationType="fade"
              >
                <TouchableOpacity 
                  style={styles.modalBackdrop} 
                  onPress={() => setShowMenu(false)}
                  activeOpacity={1}
                >
                  <View style={styles.menuContainer}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setShowMenu(false);
                        downloadFile();
                      }}
                    >
                      <Text style={styles.menuItemText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </>
        )}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setShowMenu(false);
            downloadFile();
          }}
        >
          <Text style={styles.menuItemText}>Download</Text>
        </TouchableOpacity>
      </LazyPopover>
    );
  };

  // Show loading state while sound module is loading
  if (soundLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading audio...</Text>
      </View>
    );
  }

  // Show error state if sound module failed to load
  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Audio unavailable</Text>
        <Text style={styles.errorSubText}>{loadError}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 4 }}>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={togglePlayPause}
          disabled={!soundReady || soundLoading}
          style={[
            styles.playButton,
            (!soundReady || soundLoading) && styles.playButtonDisabled
          ]}
        >
          {soundLoading ? (
            <ActivityIndicator size="small" color="#4ECDC4" />
          ) : (
            <SvgIcon
              name={isPlaying ? "Pause" : "Play"}
              width={normalize(22)}
              height={normalize(22)}
              color={soundReady ? undefined : "#CCCCCC"}
            />
          )}
        </TouchableOpacity>

        <Text style={[styles.timeText, !soundReady && styles.textDisabled]}>
          {formatTime(position)}/{formatTime(duration)}
        </Text>

        <LazySlider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={onSeek}
          disabled={!soundReady}
          minimumTrackTintColor={soundReady ? "#4ECDC4" : "#CCCCCC"}
          maximumTrackTintColor="#E0E0E0"
        />

        {renderPopoverMenu()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    padding: 4,
  },
  playButtonDisabled: {
    opacity: 0.5,
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
  textDisabled: {
    color: "#CCCCCC",
  },
  loadingContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
    fontSize: normalize(12),
    color: "#666",
    fontStyle: 'italic',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: normalize(14),
    color: "#c62828",
    fontWeight: "500",
    textAlign: "center",
  },
  errorSubText: {
    fontSize: normalize(12),
    color: "#e57373",
    textAlign: "center",
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    padding: 0,
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

export default AudioPlayer;