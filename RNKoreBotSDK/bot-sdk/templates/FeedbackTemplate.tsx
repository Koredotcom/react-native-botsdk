import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../theme/Color';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
const windowWidth = Dimensions.get('window').width;
import Svg, { Path } from 'react-native-svg';
import {CustomRatingBar as RatingBar} from '../components/CustomRatingBar';
import {SvgIcon} from '../utils/SvgIcon';
import {normalize} from '../utils/helpers';

interface FeedbackProps extends BaseViewProps {}
interface FeedbackState extends BaseViewState {
  rating?: any;
}

const FeedbackTypes = {
  star: 'star',
  CSAT: 'CSAT',
  NPS: 'NPS',
  THUMBS_UP_DOWN: 'ThumbsUpDown',
};
const ThumbsUpDown = [
  {
    icon: 'Like',
    bg: '#E2FBE8',
    color: '#16A34A',
  },
  {
    icon: 'Unlike',
    bg: '#FCF2F2',
    color: '#DC2626',
  },
];

export default class FeedbackTemplate extends BaseView<
  FeedbackProps,
  FeedbackState
> {
  constructor(props: FeedbackProps) {
    super(props);
    this.state = {
      rating: 0,
    };
  }

  // SVG Star Components
  private renderFullStar = (size: number, color: string) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path 
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
        fill={color}
      />
    </Svg>
  );

  private renderHalfStar = (size: number, color: string) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path 
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Path 
        d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
        fill={color}
      />
    </Svg>
  );

  private renderEmptyStar = (size: number, color: string) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path 
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  // SVG Emoji Components  
  private renderSadFace = (size: number, color: string) => (
    <Text style={{fontSize: size, color}}>😞</Text>
  );

  private renderNeutralFace = (size: number, color: string) => (
    <Text style={{fontSize: size, color}}>😐</Text>
  );

  private renderHappyFace = (size: number, color: string) => (
    <Text style={{fontSize: size, color}}>😊</Text>
  );

  private renderFeedbackView = (viewType: any) => {
    switch (viewType) {
      case FeedbackTypes.star:
        return this.renderStarViewFeedback();
      case FeedbackTypes.CSAT:
        return this.renderEmojiViewFeedback();
      case FeedbackTypes.THUMBS_UP_DOWN:
        return this.renderThumbsUpDownFeedback();
      default:
        return this.renderPendingFeedback(viewType);
    }
  };

  private renderPendingFeedback = (viewType: any) => {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.container}>
        {this.props.payload?.text && (
          <Text style={styles.title}>{this.props.payload?.text}</Text>
        )}
        <View style={{marginTop: 10, marginBottom: 10}}>
          <View>
            <Text>
              {'The feedback template view type "' + viewType + '" is pending'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  private renderEmojiViewFeedback = () => {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.container}>
        <Text style={styles.title}>{this.props.payload?.text}</Text>
        <View style={{marginTop: 10, marginBottom: 10}}>
          <RatingBar
            initialRating={0}
            itemCount={5}
            itemPadding={4}
            itemBuilder={index => {
              switch (index) {
                case 0:
                  return <Text style={{fontSize: 40}}>😡</Text>;
                case 1:
                  return <Text style={{fontSize: 40}}>😞</Text>;
                case 2:
                  return <Text style={{fontSize: 40}}>😐</Text>;
                case 3:
                  return <Text style={{fontSize: 40}}>😊</Text>;
                case 4:
                  return <Text style={{fontSize: 40}}>😍</Text>;
                default:
                  return <View />;
              }
            }}
            onRatingUpdate={value => {
              // console.log('Rating  --------->:', value);

              let starObjArray = this.props.payload?.starArrays.filter(
                (obj: any) => obj?.starId === value,
              );

              let startObj = starObjArray?.[0] || null;

              if (startObj && startObj?.value) {
                if (this.props.payload?.onListItemClick) {
                  setTimeout(() => {
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      {
                        title: startObj?.value + '',
                        type: 'postback',
                      },
                    );
                  }, 1000);
                }
              }
            }}
          />
        </View>
      </View>
    );
  };

  private renderStarViewFeedback = () => {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.container}>
        <Text style={styles.title}>{this.props.payload?.text}</Text>
        <View style={{marginTop: 10, marginBottom: 10}}>
          <RatingBar
            initialRating={0}
            direction="horizontal"
            allowHalfRating={false}
            itemCount={5}
            itemPadding={4}
            ratingElement={{
              full: this.renderFullStar(45, '#E9A93B'),
              half: this.renderHalfStar(45, '#54D3C2'),
              empty: this.renderEmptyStar(45, '#a7b0be'),
            }}
            onRatingUpdate={value => {
              // console.log('Rating  --------->:', value);

              let starObjArray = this.props.payload?.starArrays.filter(
                (obj: any) => obj?.starId === value,
              );

              let startObj = starObjArray?.[0] || null;

              if (startObj && startObj?.value) {
                if (this.props.payload?.onListItemClick) {
                  setTimeout(() => {
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      {
                        title: startObj?.value + '',
                        type: 'postback',
                      },
                    );
                  }, 1000);
                }
              }
            }}
          />
        </View>
      </View>
    );
  };

  private renderThumbsUpDownFeedback = () => {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.container}>
        <Text style={[styles.title1, {}]}>{this.props.payload?.text}</Text>
        <View style={styles.thumb_main}>
          {this.props.payload?.thumpsUpDownArrays.map(
            (item: any, index: number) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // console.log('item ---->:', item);
                    this.props.payload.onListItemClick(
                      this.props.payload.template_type,
                      {
                        title: item?.value + '',
                        type: 'postback',
                        ...item,
                      },
                    );
                  }}
                  style={styles.thumb_item_main}>
                  <View
                    style={[
                      styles.thumb_item,
                      {backgroundColor: ThumbsUpDown[index % 2].bg},
                    ]}>
                    <SvgIcon
                      name={ThumbsUpDown[index % 2].icon}
                      width={normalize(22)}
                      height={normalize(22)}
                      color={'#697586'}
                    />
                    <Text
                      style={[
                        styles.thumb_text,
                        {color: ThumbsUpDown[index % 2].color},
                      ]}>
                      {item?.reviewText}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </View>
    );
  };

  render() {
    let viewType = this.props.payload?.view;
    return (
      <View pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.renderFeedbackView(viewType)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumb_text: {
    fontSize: normalize(12),
    marginLeft: 2,
    fontFamily: 'inter',
  },
  thumb_item: {
    padding: 10,
    margin: 7,
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  thumb_item_main: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb_main: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  title: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    color: Color.text_color,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '800',
  },
  title1: {
    color: Color.text_color,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '500',
    fontSize: TEMPLATE_STYLE_VALUES.SUB_TEXT_SIZE,
  },
  container: {
    maxWidth: (windowWidth / 4) * 3.2,
    marginStart: 5,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.black,
  },
});
