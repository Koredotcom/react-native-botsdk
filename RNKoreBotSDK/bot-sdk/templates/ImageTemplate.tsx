import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import * as React from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import {getBubbleTheme} from '../theme/themeHelper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TEMPLATE_TYPES} from '../constants/Constant';
//const windowWidth = Dimensions.get('window').width;

interface ImageProps extends BaseViewProps {
  payload?: any;
  onListItemClick?: any;
}
interface ImageState extends BaseViewState {
  imageUri: string;
}

export default class ImageTemplate extends BaseView<ImageProps, ImageState> {
  static propTypes: {
    payload: any;
  };
  placeholderImage: any;

  constructor(props: any) {
    super(props);
    this.state = {
      imageUri: this.props.payload?.url,
    };
    this.placeholderImage = require('../assets/placehoder/image.png');
  }

  componentDidMount(): void {}

  handleImageError = () => {
    // this.setState({imageUri: this.placeholderImage});
  };

  shouldComponentUpdate(nextProps: ImageProps) {
    return (
      !!this.props.payload &&
      !!nextProps.payload &&
      this.props.payload !== nextProps.payload
    );
  }
  private getFileNameFromUrl = (url: string) => {
    // Extract the filename using a regular expression
    const matches = url?.match?.(/\/([^\/?#]+)[^\/]*$/);
    if (matches && matches.length > 1) {
      return matches[1];
    }
    // If the regular expression doesn't match or there's no filename, return null
    return null;
  };
  private renderImageView(item: any) {
    const bbtheme = getBubbleTheme(this.props?.theme);
    return (
      <View style={[styles.main_container_1]}>
        <View
          style={[
            styles.main_container,
            {
              backgroundColor: bbtheme?.BUBBLE_LEFT_BG_COLOR || '#4B4EDE',
            },
          ]}>
          {this.state.imageUri && (
            <ImageBackground
              style={styles.image_view}
              source={this.placeholderImage}>
              <FastImage
                source={{uri: this.state.imageUri}}
                style={styles.image}
                onError={this.handleImageError}
              />
            </ImageBackground>
          )}
          <View style={styles.image_name_con} />
          <TouchableOpacity
            onPress={() => {
              console.log('url ' + this.state.imageUri);
              if (this.props.payload.onListItemClick) {
                this.props.payload.onListItemClick(
                  TEMPLATE_TYPES.IMAGE_MESSAGE,
                  this.state.imageUri,
                );
              }
            }}>
            <Text
              style={[
                styles.button_text,
                {
                  color: Color.blue,
                  fontFamily:
                    this.props?.theme?.v3?.body?.font?.family || 'Inter',
                },
                botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                  .size,
              ]}>
              {'Download'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return this.props.payload ? (
      <View style={styles.main_container_3}>
        {this.renderImageView(this.props.payload)}
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  main_container_3: {
    backgroundColor: Color.white,
    minWidth: '90%',
    padding: 10,
  },
  main_container_1: {
    //backgroundColor: 'yellow',
    minHeight: 50,
    // width: '100%',
    // width: windowWidth - normalize(30),
  },
  main_container: {
    // backgroundColor: 'yellow',
    borderRadius: TEMPLATE_STYLE_VALUES.BORDER_RADIUS,
    //borderWidth: TEMPLATE_STYLE_VALUES.BORDER_WIDTH,
    padding: 10,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
  image_view: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    height: normalize(140),
    width: normalize(200),
  },
  image_name_con: {
    width: '100%',
    height: 0.5,
    backgroundColor: Color.white,
    marginTop: 20,
    marginBottom: 10,
  },

  image_name: {
    alignSelf: 'center',

    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: normalize(13),
    letterSpacing: 0.270833,
    alignItems: 'flex-start',
    textAlign: 'justify',
    color: '#616368', //'#5F6368',
  },

  image: {
    height: normalize(140),
    width: normalize(200),
    resizeMode: 'stretch',
    margin: 0,
  },
  button_text: {
    minWidth: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eaf1fc',
    alignSelf: 'flex-end',
    color: '#3A35F6',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
