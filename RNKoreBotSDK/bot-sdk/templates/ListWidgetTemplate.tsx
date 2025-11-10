/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import {SvgIcon} from '../utils/SvgIcon';
import {getButtonTheme} from '../theme/themeHelper';
import {ButtonTheme} from '../constants/Constant';
import LazyPopover from '../components/LazyPopover';
import ListWidgetButtonsView from '../components/ListWidgetButtonsView';
const windowWidth = Dimensions.get('window').width;

interface listWidgetTemplateProps extends BaseViewProps {}
interface listWidgetTemplateState extends BaseViewState {
  showPopover?: boolean;
  showBtnPopover?: boolean;
}

const ValueTypes = {
  BUTTON: 'button',
  MENU: 'menu',
  TEXT: 'text',
  URL: 'url',
  IMAGE: 'image',
};

export default class ListWidgetTemplate extends BaseView<
  listWidgetTemplateProps,
  listWidgetTemplateState
> {
  placeholderImage: any;
  btheme: ButtonTheme;
  popoverRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      showPopover: false,
      showBtnPopover: false,
    };
    this.btheme = getButtonTheme(this.props?.theme);
    this.placeholderImage = require('../assets/placehoder/image.png');
  }

  private renderValueTypeComponent = (
    value: any,
    index: number,
    buttonsLayout?: any,
  ): React.ReactNode => {
    if (!value || !value?.type) {
      return <></>;
    }

    const type = value?.type;

    switch (type) {
      case ValueTypes.BUTTON:
        return (
          <View>
            <TouchableOpacity style={styles.values_btn_main}>
              <Text
                style={[
                  styles.values_btn_title,
                  {
                    fontFamily:
                      this.props.theme?.v3?.body?.font?.family || 'Inter',
                  },
                ]}>
                {value?.title || value?.text}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case ValueTypes.MENU:
        if (buttonsLayout) {
          buttonsLayout = {
            ...buttonsLayout,
            displayLimit: {
              count: value?.menu.length,
            },
          };
        }
        return (
          <LazyPopover
            key={index + ' ' + index}
            ref={ref => (this.popoverRef = ref)}
            //isVisible={false}
            onRequestClose={() => {
              this.setState({
                showPopover: false,
              });
            }}
            isVisible={this.state.showPopover}
            from={
              <TouchableOpacity
                style={styles.popover_main}
                onPress={() => {
                  this.setState({
                    showPopover: true,
                  });
                }}>
                <SvgIcon
                  name={'ThreeDots'}
                  width={normalize(18)}
                  height={normalize(18)}
                />
              </TouchableOpacity>
            }>
            <View style={{margin: 10}}>
              <ListWidgetButtonsView
                buttonsLayout={buttonsLayout}
                buttons={value?.menu}
                theme={this.props.theme}
                payload={this.props.payload}
                onListItemClick={this.props.onListItemClick}
              />
            </View>
          </LazyPopover>
        );

      case ValueTypes.TEXT:
        return (
          <View>
            <Text
              style={{
                color: Color.text_color,
                fontSize: normalize(13),
                fontFamily: this.props.theme?.v3?.body?.font?.family || 'Inter',
              }}>
              {value?.title || value?.text}
            </Text>
          </View>
        );
      case ValueTypes.URL:
        return (
          <View>
            <TouchableOpacity style={styles.url_main}>
              <Text
                style={[
                  styles.url_text,
                  {
                    fontFamily:
                      this.props.theme?.v3?.body?.font?.family || 'Inter',
                  },
                ]}>
                {value?.title || value?.text}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case ValueTypes.IMAGE:
        return (
          <View>
            <Image
              source={{uri: value?.image?.image_src}}
              style={styles.value_image}
              onError={this.handleImageError}
            />
          </View>
        );
    }
    return <></>;
  };

  handleImageError = () => {
    // this.setState({imageUri: this.placeholderImage});
  };
  private renderDetailsView = (details: any): React.ReactNode => {
    if (!details || details?.length === 0) {
      return <></>;
    }

    return (
      <View style={{marginTop: 5, marginBottom: 5}}>
        {details?.map((item: any, _index: number) => {
          return (
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <View style={{marginRight: 5}}>
                <Image
                  source={{uri: item?.image?.image_src}}
                  style={styles.value_image}
                  onError={this.handleImageError}
                />
              </View>
              <Text
                //numberOfLines={2}
                style={{
                  color: this.btheme?.ACTIVE_TXT_COLOR,
                  fontFamily:
                    this.props.theme?.v3?.body?.font?.family || 'Inter',
                  fontSize: normalize(12),
                  flexShrink: 1,
                }}>
                {item?.description}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  private renderElements = (elements: any): React.ReactNode => {
    if (!elements || elements?.length === 0) {
      return <></>;
    }

    return (
      <View>
        {elements?.map((item: any, index: number) => {
          return (
            <View key={index + '__'}>
              <View style={styles.ele_main} />
              <View style={{flexDirection: 'row'}}>
                {item?.image?.image_src && (
                  <View style={{marginRight: 10}}>
                    <ImageBackground
                      style={styles.image_view}
                      source={this.placeholderImage}>
                      <Image
                        source={{uri: item?.image?.image_src}}
                        style={styles.image}
                        onError={this.handleImageError}
                      />
                    </ImageBackground>
                  </View>
                )}
                <View
                  style={[
                    styles.title_main,
                    item?.value?.layout?.align && {
                      alignItems: item?.value?.layout?.align,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        color: this.btheme?.ACTIVE_TXT_COLOR,
                        fontFamily:
                          this.props.theme?.v3?.body?.font?.family || 'Inter',
                        fontSize: normalize(16),
                      },
                    ]}>
                    {item?.title}
                  </Text>
                  <Text
                    style={[
                      {
                        color: this.btheme?.ACTIVE_TXT_COLOR,
                        fontFamily:
                          this.props.theme?.v3?.body?.font?.family || 'Inter',
                        fontSize: normalize(14),
                      },
                    ]}>
                    {item?.subtitle}
                  </Text>
                </View>
                {this.renderValueTypeComponent(
                  item?.value,
                  index,
                  item?.buttonsLayout,
                )}
              </View>
              {this.renderDetailsView(item?.details)}
              {item?.buttons && (
                <ListWidgetButtonsView
                  buttonsLayout={item?.buttonsLayout}
                  buttons={item?.buttons}
                  theme={this.props.theme}
                  payload={this.props.payload}
                  onListItemClick={this.props.onListItemClick}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={styles.mainContainer}>
        <View style={{marginBottom: 5}}>
          {this.props.payload?.title && (
            <Text
              style={[
                styles.main_title,
                {
                  color: this.btheme?.ACTIVE_TXT_COLOR,
                  fontFamily:
                    this.props.theme?.v3?.body?.font?.family || 'Inter',
                },
              ]}>
              {this.props.payload?.title}
            </Text>
          )}
          {this.props.payload?.description && (
            <Text
              style={[
                {
                  color: this.btheme?.ACTIVE_TXT_COLOR,
                  fontFamily:
                    this.props.theme?.v3?.body?.font?.family || 'Inter',
                  fontSize: normalize(14),
                },
              ]}>
              {this.props.payload?.description}
            </Text>
          )}
        </View>
        {this.renderElements(this.props.payload?.elements)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_title: {
    fontSize: normalize(17),
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  title_main: {marginRight: 10, flex: 1, marginBottom: 10},
  ele_main: {
    backgroundColor: '#A7A9BE',
    width: '100%',
    height: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  url_text: {
    color: '#4741fa',
    fontSize: normalize(11),
    textDecorationLine: 'underline',
  },
  url_main: {
    paddingBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  menu_image_main: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu_main: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  values_btn_title: {
    color: '#4741fa',
    fontSize: normalize(13),
  },
  values_btn_main: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(71, 65, 250, 0.13)',
  },
  popover_main: {
    paddingLeft: 15,
    paddingTop: 10,
    //paddingBottom: 10,
    marginRight: -5,
    //backgroundColor: 'yellow',
  },
  image: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'stretch',
    margin: 0,
  },
  value_image: {
    height: normalize(22),
    width: normalize(22),
    resizeMode: 'stretch',
    borderRadius: 3,
    margin: 0,
  },
  btn_image: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'stretch',
    borderRadius: 3,
    margin: 0,
  },
  image_view: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 10,
    //alignSelf: 'center',
    height: normalize(55),
    width: normalize(55),
  },
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    width: (windowWidth / 4) * 3.2,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderColor: TEMPLATE_STYLE_VALUES.BORDER_COLOR,
  },
});
