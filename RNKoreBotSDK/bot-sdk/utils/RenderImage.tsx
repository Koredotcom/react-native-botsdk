/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View} from 'react-native';
import {SvgCssUri} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import {normalize} from './helpers';

interface Props {
  image: string;
  iconShape?: string;
  iconSize?: string;
  width?: number;
  height?: number;
}

interface State {
  error: boolean;
}

class RenderImage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  handleSvgError = () => {
    this.setState({error: true}); // Set error state to true
  };

  render() {
    let {
      image = '',
      iconShape = undefined,
      iconSize = '',
      width = 10,
      height = 10,
    } = this.props;
    const {error} = this.state;

    if (!image || image.length === 0) {
      return null; // Returning null if image is not provided or is empty
    }

    // console.log('image   ---->:', image);

    let fileExtension = image?.split?.('.')?.pop()?.toLowerCase();

    if (iconSize && iconSize.trim() !== '') {
      switch (iconSize) {
        case 'small':
          width = 16;
          height = 16;
          break;
        case 'medium':
          width = 22;
          height = 22;
          break;
        case 'large':
          width = 35;
          height = 35;
          break;
        default:
          width = 16;
          height = 16;
      }
    }

    return (
      <View
        style={{
          ...styles.image_container,
          height: normalize(height),
          width: normalize(width),
        }}>
        {fileExtension === 'svg' ? (
          <SvgCssUri
            uri={error ? require('../assets/placehoder/image.png') : image}
            height={normalize(height)}
            width={normalize(width)}
            style={{
              overflow: 'hidden',
              borderWidth: iconShape !== ICON_SHAPE.CIRCLE_IMG ? 1 : 0,
              borderRadius: iconShape !== ICON_SHAPE.CIRCLE_IMG ? 5 : 0,
            }}
            onError={this.handleSvgError}
          />
        ) : this.state.error ? (
          <></>
        ) : (
          <FastImage
            source={{
              uri: image,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable, // Use cache effectively
            }}
            style={{
              ...styles.unfurlUrl4,
              borderRadius: iconShape === ICON_SHAPE.CIRCLE_IMG ? 150 / 2 : 5,
              overflow: 'hidden',
              height: normalize(height),
              width: normalize(width),
            }}
            onError={() => {
              this.setState({error: true});
              console.log('Image loading error:');
            }}
          />
        )}
      </View>
    );
  }
}

const ICON_SHAPE = {
  CIRCLE_IMG: 'circle-img',
};

// Define styles if not already defined
const styles = {
  image_container: {}, // Define your image container styles
  unfurlUrl4: {
    borderColor: 'gray',
    resizeMode: 'cover',
    //alignSelf: 'center',
    //  borderRadius: 6,
    //alignContent: 'center',
    overflow: 'hidden',
  },
};

export default RenderImage;
