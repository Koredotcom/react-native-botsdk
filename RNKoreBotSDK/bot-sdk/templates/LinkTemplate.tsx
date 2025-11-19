import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Keyboard
} from 'react-native';
import Color from '../theme/Color';
import Toast from "react-native-toast-message";
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
import RNFS from 'react-native-fs';
import { saveBase64File } from '../utils/Base64Converter';
import { placeholder } from '../assets';

const windowWidth = Dimensions.get('window').width;
let window = windowWidth * 0.8;

interface LinkTemplateProps extends BaseViewProps {}
interface LinkTemplateState extends BaseViewState {
}

export default class LinkTemplate extends BaseView<LinkTemplateProps, LinkTemplateState> {
  intervalId: number | undefined;
  constructor(props: LinkTemplateState) {
    super(props);
    this.state = {isPlaying: false};
  }

  render() {
    const bubbleTheme = getBubbleTheme(this.props?.theme);
    const payload = this.props.payload;
    if (!payload) return null;
  
    const themeColors = {
      active: bubbleTheme?.BUBBLE_RIGHT_BG_COLOR || 'blue',
      inactive: bubbleTheme?.BUBBLE_LEFT_BG_COLOR || 'gray',
    };


   const downloadFile = async (url: string, fileName?: string) => {
      console.log('url ' + url);
      console.log('fileName ' + fileName);
      try {
        if (!fileName) fileName = url.split("/").pop() || 'file';
    
        // Handle base64 case
        if (url.includes('base64,')) {
          if (fileName?.includes('.')) fileName = fileName.split('.')[0];
          const path = await saveBase64File(url, fileName!!);
          if (path) {
            Toast.show({
              type: "info",
              text1: "Success File saved to:",
              text2: path,
              position: 'bottom',
              visibilityTime: 3000,
              autoHide: true,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Failed to save file",
              position: 'bottom',
              visibilityTime: 3000,
              autoHide: true,
            });
          }
          return;
        }
    
        const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    
        // Check if file already exists
        const exists = await RNFS.exists(destPath);
        if (exists) {
          Toast.show({
            type: "info",
            text1: "Already downloaded",
            text2: destPath,
          });
          return;
        }
    
        // Download file
        const result = await RNFS.downloadFile({
          fromUrl: url,
          toFile: destPath,
        }).promise;
    
        if (result && result.statusCode === 200) {
          Toast.show({
            type: "success",
            text1: "Downloaded",
            text2: destPath,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Download failed!",
          });
        }
      } catch (err) {
        console.error("Download error:", err);
        Toast.show({
          type: "error",
          text1: "Download failed!",
        });
      }
    };
  
    let borderColor = this.props.onBottomSheetClose ? Color.transparent : bubbleTheme?.BUBBLE_LEFT_BG_COLOR
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'} style={[styles.main_Container, { width: window, borderColor: borderColor }]}>
        {<Image source={placeholder.pdf} style={[styles.image,{position: 'absolute',marginStart: 8,marginTop: 10}]}
                />}
        <Text style={[styles.label,{fontSize: 16, marginTop:5, marginLeft: 55}]}>{payload.fileName}</Text>
        <TouchableOpacity
            onPress={() => { downloadFile(payload.url.trim(), payload.fileName); }}
                style={[styles.button, { backgroundColor: Color.white }]}>
            <Image 
                source={placeholder.download} style={styles.buttonImage} />
        </TouchableOpacity>
        <Toast/>
      </View>
    );
  }
  }
  
  const styles = StyleSheet.create({
      main_Container:{
          marginTop: 0,
          marginEnd: 10,
          height: 80,
          padding: 10,
          borderRadius: 5,
          backgroundColor: Color.white,
          borderWidth: 1,
      },
      label:{
          color: Color.black,
          fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
          fontWeight: '500',
          letterSpacing: 0.2,
          fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
      },
      button: {
        position: 'absolute',
        bottom: 5,
        right: 10,
        borderRadius: 5,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
      },
        image: {
            width: 50, // must set width
            height: 50, // must set height
            resizeMode: 'contain', 
          },
          buttonImage: {
            width: 30,
            height: 30,
            resizeMode: 'contain',
          },
  })