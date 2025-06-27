import * as React from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BaseViewProps, BaseViewState, WelcomeBaseView} from './WelcomeBaseView';
import {normalize} from '../../utils/helpers';
import Color from '../../theme/Color';
import {SvgIcon} from '../../utils/SvgIcon';
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;

interface BodyProps extends BaseViewProps {}

interface BodyState extends BaseViewState {}

export default class WelcomeBody extends WelcomeBaseView<BodyProps, BodyState> {
  private quickStartBtns = (): React.ReactNode => {
    const startBox =
      this.props?.activetheme?.v3?.welcome_screen?.starter_box || undefined;

    if (!startBox || !startBox?.quick_start_buttons?.show) {
      return <></>;
    }
    if (
      !startBox?.quick_start_buttons?.buttons ||
      startBox?.quick_start_buttons?.buttons?.length === 0
    ) {
      return <></>;
    }

    return (
      <View style={styles.btn_main}>
        {startBox?.quick_start_buttons?.buttons.map(
          (btn: any, index: number) => {
            return (
              <TouchableOpacity
                key={index + '_'}
                onPress={() => {
                  // console.log('btn?.title ---->:', btn?.title);
                  if (this.props?.onStartConversationClick) {
                    this.props?.onStartConversationClick(btn?.title);
                  }
                }}
                style={styles.quick_btn}>
                <Text style={styles.btn_text}>{btn?.title}</Text>
              </TouchableOpacity>
            );
          },
        )}
      </View>
    );
  };
  private getIconName = () => {
    let iconName = 'IcIcon_1';
    const headerIcon = this.props?.activetheme?.v3?.header?.icon || undefined;

    switch (headerIcon?.icon_url) {
      case 'icon-1':
        iconName = 'IcIcon_1';
        break;

      case 'icon-2':
        iconName = 'IcIcon_2';
        break;

      case 'icon-3':
        iconName = 'IcIcon_3';
        break;

      case 'icon-4':
        iconName = 'IcIcon_4';
        break;

      default:
        iconName = 'AvatarBot';
    }

    return iconName;
  };

  private getBoxIcon = () => {
    const startBox =
      this.props?.activetheme?.v3?.welcome_screen?.starter_box || undefined;
    const headerIcon = this.props?.activetheme?.v3?.header?.icon || undefined;

    if (
      !startBox ||
      !headerIcon ||
      !startBox?.show ||
      !startBox?.icon?.show ||
      !headerIcon?.show
    ) {
      return <></>;
    }
    if (headerIcon?.type === 'custom') {
    }

    return (
      <View
        style={[
          styles.icon_main,
          {
            backgroundColor:
              this.props?.activetheme?.v3?.header?.bg_color || '#EAECF0',
          },
        ]}>
        {headerIcon?.type === 'custom' ? (
          <FastImage
            source={{
              uri: headerIcon?.icon_url,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable, // Use cache effectively
            }}
            style={styles.image}
          />
        ) : (
          <SvgIcon
            name={this.getIconName()}
            width={normalize(18)}
            height={normalize(18)}
            color={
              this.props?.activetheme?.v3?.welcome_screen?.background?.color ||
              '#4B4EDE'
            }
          />
        )}
      </View>
    );
  };

  private renderStarterBox = (): React.ReactNode => {
    const startBox =
      this.props?.activetheme?.v3?.welcome_screen?.starter_box || undefined;
    if (!startBox || !startBox?.show) {
      return <></>;
    }

    return (
      <View style={styles.box_main}>
        <View style={styles.box_sub}>
          {this.getBoxIcon()}
          <View style={styles.title_main}>
            {startBox?.title && (
              <Text style={styles.title}>{startBox?.title}</Text>
            )}
            {startBox?.sub_text && (
              <Text style={styles.sub_text}>{startBox?.sub_text}</Text>
            )}
          </View>
        </View>
        <View style={styles.quick_btn_main}>{this.quickStartBtns()}</View>

        {startBox?.quick_start_buttons?.action && (
          <TouchableOpacity
            onPress={() => {
              if (this.props?.onStartConversationClick) {
                this.props?.onStartConversationClick();
              }
            }}
            style={[
              styles.conversation_main,
              {
                backgroundColor:
                  this.props?.activetheme?.v3?.welcome_screen?.background
                    ?.color || '#4B4EDE',
              },
            ]}>
            <View style={styles.conversation_sub}>
              <Text
                style={[
                  styles.conversation_text,
                  {
                    color:
                      this.props?.activetheme?.v3?.welcome_screen?.top_fonts
                        ?.color || Color.white,
                  },
                ]}>
                {startBox?.quick_start_buttons?.action?.value}
              </Text>
              <SvgIcon
                name={'Right'}
                width={normalize(10)}
                height={normalize(10)}
                color={
                  this.props?.activetheme?.v3?.welcome_screen?.top_fonts
                    ?.color || Color.white
                }
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  private itemClick = (item: any) => {
    switch (item?.type) {
      case 'web_url':
      case 'url':
        if (item?.url) {
          Linking.openURL(item?.url);
        } else if (item?.redirectUrl) {
          let dweb = item?.redirectUrl?.dweb;
          let mob = item?.redirectUrl?.mob;
          let url = mob || dweb || '';
          if (url?.length > 0) {
            Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                try {
                  Linking.openURL(url);
                } catch (e) {}
                console.log('No handler for URL:', url);
              } else {
                Linking.openURL(url);
              }
            });
          }
        } else if (item?.value) {
          Linking.openURL(item?.value);
        }
        break;
    }
  };

  private getSingleLinkView = (
    link: any,
    index: any,
    isFromCarousel?: boolean,
  ) => {
    const Wrapper: any = link?.action?.type === 'url' ? TouchableOpacity : View;
    return (
      <Wrapper
        key={index + '_' + index}
        onPress={() => {
          //console.log('Item --->:', link);
          this.itemClick(link?.action);
        }}
        style={[
          styles.sin_link_main,
          isFromCarousel && {width: (windowWidth / 4) * 2.9},
        ]}>
        <View
          style={[
            styles.sin_link_sub,
            isFromCarousel && {
              minHeight: normalize(65),
            },
          ]}>
          <View style={{flex: 1, marginRight: normalize(5)}}>
            <Text style={styles.sin_link_title}>{link?.title}</Text>
            <Text style={styles.sin_link_desc}>{link?.description}</Text>
          </View>
          <SvgIcon
            name={'Right'}
            width={normalize(10)}
            height={normalize(10)}
            color={'#697586'}
          />
        </View>
      </Wrapper>
    );
  };

  private renderLinkViews = (static_links: any, isFromCarousel?: boolean) => {
    return static_links?.links?.map((link: any, index: any) => {
      return this.getSingleLinkView(link, index, isFromCarousel);
    });
  };
  private renderStaticLinks = (): React.ReactNode => {
    const static_links =
      this.props?.activetheme?.v3?.welcome_screen?.static_links || undefined;
    if (!static_links || !static_links?.show) {
      return <></>;
    }
    //const height = normalize(90);
    // const width = (windowWidth / 4) * 3.2;

    return (
      <View>
        <View style={styles.box_main}>
          <Text style={styles.header_link_title}>{'Links'}</Text>
          {static_links?.layout === 'carousel' ? (
            // <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              style={{}}>
              <View style={{flexDirection: 'row'}}>
                {this.renderLinkViews(static_links, true)}
              </View>
            </ScrollView>
          ) : (
            // {/* <Carousel
            //   loop={false}
            //   width={width}
            //   height={height}
            //   data={static_links?.links}
            //   mode="parallax"
            //   modeConfig={{
            //     parallaxAdjacentItemScale: 0.4,
            //     parallaxScrollingScale: 0.9,
            //   }}
            //   onSnapToItem={index => console.log('current index:', index)}
            //   renderItem={({item, index}: any) =>
            //     this.getSingleLinkView(item, index, true)
            //   }
            // /> */}
            // {/* </View> */}
            <View style={{}}>{this.renderLinkViews(static_links, false)}</View>
          )}
        </View>
      </View>
    );
  };
  private renderPromotionContent = (): React.ReactNode => {
    const promotional_content =
      this.props?.activetheme?.v3?.welcome_screen?.promotional_content ||
      undefined;
    if (
      !promotional_content ||
      !promotional_content?.show ||
      promotional_content?.promotions?.length === 0
    ) {
      return <></>;
    }

    const promotionsList = promotional_content?.promotions;
    return (
      <View>
        {promotionsList?.map((item: any, index: any) => {
          return (
            <TouchableOpacity
              key={index + '__'}
              onPress={() => {
                // console.log('promotionsList item --->:', item);
                this.itemClick(item?.action);
              }}
              style={{marginBottom: normalize(16)}}>
              <FastImage
                source={{
                  uri: item?.banner,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable, // Use cache effectively
                }}
                style={styles.promotion_image}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  render() {
    return (
      <View
        style={{padding: normalize(16), backgroundColor: Color.transparent}}>
        {this.renderStarterBox()}
        {this.renderStaticLinks()}
        {this.renderPromotionContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  promotion_image: {
    height: normalize(200),
    width: windowWidth * 0.91,
  },
  sin_link_desc: {
    color: '#4B5565',
    fontFamily: 'Inter',
    fontSize: normalize(12),
    fontStyle: 'normal',
    fontWeight: '400',
  },
  sin_link_title: {
    color: '#202124',
    fontFamily: 'Inter',
    fontSize: normalize(14),
    fontStyle: 'normal',
    fontWeight: '700',
  },
  sin_link_sub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sin_link_main: {
    margin: normalize(5),
    padding: normalize(8),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E5E7',
    // backgroundColor: 'red',
  },
  header_link_title: {
    color: '#202124',
    fontFamily: 'Inter',
    fontSize: normalize(14),
    fontStyle: 'normal',
    fontWeight: '700',
    marginStart: normalize(5),
    marginBottom: normalize(3),
  },
  conversation_text: {color: Color.white, flex: 1},
  conversation_sub: {flexDirection: 'row', alignItems: 'center'},
  conversation_main: {
    padding: 10,
    borderRadius: 5,

    marginTop: normalize(10),
  },
  quick_btn_main: {
    //marginTop: normalize(16),
    //marginBottom: normalize(16),
  },
  sub_text: {
    fontFamily: 'Inter',
    fontSize: normalize(12),
    fontStyle: 'normal',
    fontWeight: '400',
  },
  title: {
    color: '#202124',
    fontFamily: 'Inter',
    fontSize: normalize(14),
    fontStyle: 'normal',
    fontWeight: '700',
  },
  title_main: {
    marginStart: normalize(5),
    marginEnd: normalize(5),
    marginBottom: normalize(15),
  },
  box_sub: {flexDirection: 'row'},
  box_main: {
    backgroundColor: Color.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E5E7',
    padding: normalize(16),
    // minHeight: 100,
    marginBottom: normalize(16),
  },
  btn_text: {
    color: '#202124',
    fontFamily: 'Inter',
    fontSize: normalize(14),
    fontStyle: 'normal',
    fontWeight: '600',
  },
  quick_btn: {
    borderRadius: 5,
    padding: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    marginEnd: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    backgroundColor: 'white',

    borderWidth: 1,
    borderColor: '#E4E5E7',
  },
  btn_main: {
    alignItems: 'flex-start',
    elevation: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    // marginBottom: 5,
    backgroundColor: Color.transparent,
  },
  icon_main: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: normalize(22),
    width: normalize(22),
    resizeMode: 'stretch',
  },
});
