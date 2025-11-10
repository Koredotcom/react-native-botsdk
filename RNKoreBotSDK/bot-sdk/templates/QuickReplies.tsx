import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {TEMPLATE_STYLE_VALUES, botStyles} from '../theme/styles';
import {normalize} from '../utils/helpers';

import {getBubbleTheme} from '../theme/themeHelper';

interface QuickProps extends BaseViewProps {
  quick_replies: any;
  itemClick?: any;
  isVertical?: boolean;
  quick_container_style?: any;
  quck_text_style?: any;
  quick_image_style?: any;
}
interface QuickState extends BaseViewState {
  isClickedItem?: boolean;
}

export default class QuickReplies extends BaseView<QuickProps, QuickState> {
  constructor(props: QuickProps) {
    super(props);
    this.state = {
      isClickedItem: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<QuickProps>,
    _prevState: Readonly<QuickState>,
    _snapshot?: any,
  ): void {
    if (this.props?.quick_replies !== prevProps?.quick_replies) {
      this.setState({
        isClickedItem: false,
      });
    }
  }

  private renderQuickRepliesView = () => {
    if (!this.props?.quick_replies) {
      return <></>;
    }

    // const bbtheme = getBubbleTheme(this.props?.theme);

    const btheme = getBubbleTheme(this.props?.theme);

    const views = this.props?.quick_replies.map((item: any, index: number) => {
      return (
        <TouchableOpacity
          key={index + ''}
          onPress={() => {
            this.setState({
              isClickedItem: true,
            });
            this.props?.itemClick?.(item);
          }}>
          <View
            style={
              this.props.quick_container_style
                ? this.props.quick_container_style
                : [
                    styles.quick_container,

                    {
                      borderColor: btheme?.BUBBLE_LEFT_BG_COLOR || '#3F51B5',
                      backgroundColor: btheme?.BUBBLE_LEFT_BG_COLOR || '#3F51B5',
                      borderWidth: 1,
                    },
                  ]
            }>
            {item?.image_url && (
              <View style={styles.image_bg}>
                <Image
                  source={{uri: item?.image_url}}
                  style={[
                    this.props.quick_image_style
                      ? this.props.quick_image_style
                      : styles.image,
                    {
                      borderRadius: normalize(30),
                    },
                  ]}
                />
              </View>
            )}
            <Text
              style={
                this.props.quck_text_style
                  ? this.props.quck_text_style
                  : [
                      {
                        padding: 5,
                      },
                      {
                        color: btheme?.BUBBLE_RIGHT_BG_COLOR,
                        fontFamily:
                          this.props?.theme?.v3?.body?.font?.family || 'Inter',
                      },
                      botStyles[
                        this.props?.theme?.v3?.body?.font?.size || 'medium'
                      ].size,
                    ]
              }>
              {item?.title?.value || item?.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return views && views.length > 0 ? (
      <ScrollView
        pointerEvents={this.state.isClickedItem ? 'none' : 'auto'}
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
        style={{
          groundColor:
            this.props?.theme?.v3?.body?.background?.color || '#FFFFFF',
        }}back
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        keyboardShouldPersistTaps={'handled'}
        horizontal={!this.props.isVertical}>
        <View
        style={styles.quick_main_container}>
          <View
            style={{
              height: 1,
              backgroundColor: btheme?.BUBBLE_LEFT_BG_COLOR || '#CCCCCC',
              marginVertical: 2,
              flexGrow: 1,
              minWidth: '100%',
            }}
          />
          {views}
        </View>
      </ScrollView>
    ) : (
      <></>
    );
  };

  render() {
    return this.renderQuickRepliesView();
  }
}

const styles = StyleSheet.create({
  image_bg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: normalize(30),
    width: normalize(30),
    resizeMode: 'stretch',
    margin: 0,
  },
  quick_container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    marginStart: 15,
    // borderWidth:0.5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    //background: #0D6EFD;
    borderColor: '#BDC1C6', //'#F8F9FA',
    borderWidth: 1,
    backgroundColor: 'white',

    color: TEMPLATE_STYLE_VALUES.TEXT_COLOR,
    //background: #0D6EFD;
  },

  quick_main_container: {
    marginStart: 5,
    marginEnd: 5,
    alignItems: 'flex-start',
    elevation: 2,
    flexDirection: 'row',
    //flexWrap: 'wrap',
    // flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
    backgroundColor: 'transparent',
    //backgroundColor:'yellow',
  },
});
