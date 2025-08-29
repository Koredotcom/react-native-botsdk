import BaseView, {BaseViewProps, BaseViewState} from './BaseView';

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import Color from '../theme/Color';
import {ThemeContext} from '../theme/ThemeContext';
import {normalize, renderImage} from '../utils/helpers';
import FileIcon from '../utils/FileIcon';
import VideoTemplate from './VideoTemplate';
import AudioTemplate from './AudioTemplate';
const windowWidth = Dimensions.get('window').width;
// Conditional imports for native modules
let FileViewer: any = null;
let RNFS: any = null;
let RNBlobUtil: any = null;

// Lazy load native modules to prevent NativeEventEmitter errors
const loadNativeModules = () => {
  if (FileViewer && RNFS && RNBlobUtil) {
    return { FileViewer, RNFS, RNBlobUtil };
  }

  try {
    FileViewer = require('react-native-file-viewer').default;
    RNFS = require('react-native-fs').default;
    RNBlobUtil = require('react-native-blob-util').default;
    return { FileViewer, RNFS, RNBlobUtil };
  } catch (error: any) {
    console.warn('File handling modules not available:', error);
    return { FileViewer: null, RNFS: null, RNBlobUtil: null };
  }
};

import {getBubbleTheme} from '../theme/themeHelper';

const imageFilesTypes = ['jpg', 'jpeg', 'png'];
const audioTypes: any = [
  'aac',
  'aiff',
  'amr',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'opus',
  'pcm',
  'wav',
  'wma',
];
const videoTypes: any = [
  '3g2',
  '3gp',
  'asf',
  'avi',
  'flv',
  'm4v',
  'mov',
  'mp4',
  'mpg',
  'rm',
  'srt',
  'swf',
  'vob',
  'wmv',
];

interface AttachementsProps extends BaseViewProps {
  buttonContainerStyle?: any;
  buttonTextStyle?: any;
}
interface AttachementsState extends BaseViewState {}

export default class Attachements extends BaseView<
  AttachementsProps,
  AttachementsState
> {
  static contextType = ThemeContext;
  static propTypes = {
    payload: {},
    onListItemClick: undefined,
    onBottomSheetClose: undefined,
  };
  
  private nativeModules: any = null;

  constructor(props: any) {
    super(props);
    // Initialize native modules lazily
    this.nativeModules = loadNativeModules();
  }

  private getFileType = (fileName?: string) => {
    if (!fileName) {
      return '';
    }
    try {
      let fileType = fileName?.slice?.(
        fileName?.lastIndexOf('.') + 1,
        fileName?.length,
      );

      return fileType?.toLowerCase?.()?.trim?.();
    } catch (error) {}

    return '';
  };

  private getMediaView = (media: any, fileType: any) => {
    if (!fileType) {
      return <></>;
    }

    if (imageFilesTypes.includes(fileType)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.openFile(media?.uri);
          }}>
          {renderImage({
            image: media?.uri,
            iconShape: null,
            iconSize: null,
            width: (windowWidth / 4) * 3,
            height: 200,
          })}
        </TouchableOpacity>
      );
    }

    if (videoTypes.includes(fileType)) {
      return (
        <VideoTemplate
          payload={{videoUrl: media?.uri, isLastMessage: true}}
          theme={this.props.theme}
        />
      );
    }

    if (audioTypes.includes(fileType)) {
      return (
        <AudioTemplate
          payload={{audioUrl: media?.uri, isLastMessage: true}}
          theme={this.props.theme}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          //console.log('media ------>:', media);
          this.handleOpenFile(media?.uri, fileType);
          //this.openFile(media?.uri);
        }}>
        <FileIcon fileType={fileType} size={45} />
      </TouchableOpacity>
    );
  };

  private handleOpenFile = async (fileUri: any, fileType: any) => {
    if (!this.nativeModules.RNBlobUtil || !this.nativeModules.RNFS) {
      console.warn('File handling modules not available');
      return;
    }

    try {
      let localFilePath: any;

      //console.log('fileUri ------>:', fileUri);

      if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
        // For Android content:// URIs, resolve the real path
        const blob = await this.nativeModules.RNBlobUtil.fs.readFile(fileUri, 'base64');

        let temp = new Date().getTime() + '_file.';

        // Define where you want to store the file locally
        const filePath = `${this.nativeModules.RNFS.DocumentDirectoryPath}/` + temp + fileType;

        // Write the blob data to a file
        await this.nativeModules.RNFS.writeFile(filePath, blob, 'base64');
        // console.log('filePath ------>:', filePath);
        localFilePath = filePath; // This is the resolved file path now
      } else {
        // For iOS or already resolved paths
        localFilePath = fileUri;
      }

      this.openFile(localFilePath);
    } catch (error: any) {
      //console.log('Error downloading the file:', error);
    }
  };

  private openFile = (localFilePath?: any) => {
    if (!localFilePath || !this.nativeModules.FileViewer) {
      console.warn('FileViewer not available or invalid file path');
      return;
    }
    //console.log('localFilePath --------->:', localFilePath);
    this.nativeModules.FileViewer.open(localFilePath, {
      showOpenWithDialog: true,
      showAppsSuggestions: true,
    })
      .then(() => {
        // success
        //console.log('Image opened successfully');
      })
      .catch((error: any) => {
        // error
        console.log('Error opening the image:', error);
      });
  };

  private renderAttachment = (payload: any) => {
    let attachments: any;

    const bubbleTheme = getBubbleTheme(this.props?.theme);

    console.log('📎 Attachments - Processing payload:', JSON.stringify(payload, null, 2));

    // Check multiple possible attachment locations
    // The actual attachment data might be in different places depending on the message structure
    let attachmentsList = null;

    // Check if payload has attachments array
    if (payload?.payload?.attachments && Array.isArray(payload.payload.attachments)) {
      attachmentsList = payload.payload.attachments;
    } 
    // Check if payload itself has attachments
    else if (payload?.attachments && Array.isArray(payload.attachments)) {
      attachmentsList = payload.attachments;
    }
    // Check if the payload itself is an array of attachments
    else if (Array.isArray(payload)) {
      attachmentsList = payload;
    }
    // Check if this is a message with attachment data (from the data parameter)
    else if (payload?.payload?.attachments === "attachments") {
      // This indicates attachments were sent but the actual data might be elsewhere
      // For now, we'll show the text content
      console.log('📎 Attachments - Found attachment indicator but no actual attachment data');
      return null;
    }

    console.log('📎 Attachments - Found attachments list:', JSON.stringify(attachmentsList, null, 2));

    if (attachmentsList && Array.isArray(attachmentsList) && attachmentsList.length > 0) {
      attachments = attachmentsList.map(
        (media: any, index: number) => {
          let fileType: string = this.getFileType(media?.fileName);
          return (
            <View
              key={'att_' + index}
              style={[
                styles.main,
                {borderColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR},
              ]}>
              <View style={styles.main1}>
                {this.getMediaView(media, fileType)}
              </View>
              <View
                style={[
                  styles.main2,
                  {backgroundColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR},
                ]}>
                <Text
                  style={[
                    styles.fileName,
                    {
                      color: bubbleTheme.BUBBLE_RIGHT_TEXT_COLOR,
                    },
                  ]}>
                  {media?.fileName || 'Unknown file'}
                </Text>
              </View>
            </View>
          );
        },
      );
    } else {
      console.warn('⚠️  Attachments - No valid attachments array found');
      return null;
    }

    return attachments;
  };

  private renderMessageText = () => {
    const text = this.props.payload?.payload?.text || this.props.payload?.text;
    
    if (text && typeof text === 'string' && text.trim()) {
      // Remove the file name part from the text (everything after the emoji)
      const cleanText = text.split('\n')[0].trim();
      
      if (cleanText && cleanText !== '') {
        return (
          <View style={styles.textContainer}>
            <Text style={styles.messageText}>{cleanText}</Text>
          </View>
        );
      }
    }
    return null;
  };

  render() {
    try {
      const textView = this.renderMessageText();
      const attachmentView = this.renderAttachment(this.props.payload);
      
      return (
        <View>
          {textView}
          {attachmentView}
        </View>
      );
    } catch (error) {
      console.error('❌ Attachments render error:', error);
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load attachments</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  main1: {padding: 10},
  main2: {
    width: '100%',
    borderBottomEndRadius: 3,
    borderBottomStartRadius: 3,
  },
  fileName: {
    color: Color.black,
    fontSize: normalize(14),
    marginTop: normalize(3),
    marginBottom: normalize(3),
    padding: 5,
    alignSelf: 'center',
  },
  player: {
    width: (windowWidth / 4) * 3.2,
    height: normalize(200),
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: 'green',
  },
  main: {
    margin: 6,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.black,
  },
  item_container: {
    flexWrap: 'wrap',
    marginBottom: 10,
    marginRight: 10,
    marginTop: 10,
  },
  mainContainer: {
    backgroundColor: Color.white,
    borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    minWidth: TEMPLATE_STYLE_VALUES.MIN_WIDTH,
    marginRight: TEMPLATE_STYLE_VALUES.TEMPLATE_RIGHT_MARGIN,
    marginLeft: TEMPLATE_STYLE_VALUES.TEMPLATE_LEFT_MARGIN,
  },

  text: {
    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
  },

  bottom_btns: {flexDirection: 'row', marginTop: 0},
  btn_view: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    fontWeight: 'bold',
  },

  item_text: {
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    alignSelf: 'center',
    color: Color.blue,
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontWeight: 'normal',
    //marginTop: 10,
  },
  main_view_1: {
    padding: 5,
  },
  btn_views_1: {
    flexDirection: 'column',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
  },
  textContainer: {
    padding: 12,
    marginBottom: 8,
  },
  messageText: {
    fontSize: normalize(16),
    color: Color.text_color,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    lineHeight: normalize(20),
  },
});
