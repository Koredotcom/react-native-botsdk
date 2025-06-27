/* eslint-disable react/self-closing-comp */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {convertToRNStyle, normalize} from '../utils/helpers';
import UserAvatar from '../chat/components/UserAvatar';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Load English locale for formatting

import CheckBox from 'react-native-check-box';

import Popover from 'react-native-popover-view';
import {SvgIcon} from '../utils/SvgIcon';
import {CollapsableContainer} from '../components/CollapsableContainer';
import Color from '../theme/Color';
import {TEMPLATE_TYPES} from '../constants/Constant';
import RadioGroup, {RadioButton} from 'react-native-radio-buttons-group';
import {botStyles} from '../theme/styles';
import RenderImage from '../utils/RenderImage';

import 'dayjs/locale/en'; // Load English locale for formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const windowWidth = Dimensions.get('window').width;

interface AdvListProps extends BaseViewProps {
  navigation?: any;
  route?: any;
}
interface AdvListState extends BaseViewState {
  otherOptions: any;
  showPopover?: boolean;
  payload?: any;
  listItems?: any;
  radioOtherOptions: any;
  showBtnPopover?: boolean;
}
const LIST_TEMPLATE_TYPES = {
  NORMAL: 'normal',
  DEFAULT: 'default',
};

const koraStyles = StyleSheet.create({
  pbutton: {
    backgroundColor: '#0D6EFD',
    //border: 0,
    // padding: 7px 20px,
    // fontweight: normal,
    // fontsize: 14px,
    // lineheight: 20px,
    // cursor: pointer,
    // background: #0D6EFD,
    // borderradius: 4px,
    // color: #FFFFFF,
    // width: 100%,
    // margin: 0 5px,
    // textalign: center,
  },
  sbutton: {
    backgroundColor: '#FFFFFF',
    // padding: 7px 20px,
    // fontweight: normal,
    // fontsize: 14px,
    // lineheight: 20px,
    // cursor: pointer,
    // width: 100%,
    // margin: 0 5px,
    // background: #FFFFFF,
    // border: 1px solid
    borderColor: '#BDC1C6',
    borderWidth: 1,
    // boxsizing: borderbox,
    // borderradius: 4px,
    // color: #202124,
    // textalign: center,
  },
  pbutton_text: {
    //border: 0,
    // padding: 7px 20px,
    // fontweight: normal,
    // fontsize: 14px,
    // lineheight: 20px,
    // cursor: pointer,
    // background: #0D6EFD,
    // borderradius: 4px,
    color: '#FFFFFF',
    // width: 100%,
    // margin: 0 5px,
    // textalign: center,
  },
  sbutton_text: {
    // padding: 7px 20px,
    // fontweight: normal,
    // fontsize: 14px,
    // lineheight: 20px,
    // cursor: pointer,
    // width: 100%,
    // margin: 0 5px,
    // background: #FFFFFF,
    // border: 1px solid #BDC1C6,
    // boxsizing: borderbox,
    // borderradius: 4px,
    color: '#202124',
    // textalign: center,
  },
});

export default class AdvancedListTemplate extends BaseView<
  AdvListProps,
  AdvListState
> {
  popoverRef: any;
  popoverBtnRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      otherOptions: [],
      payload: this.props.payload,
      listItems: [],
      radioOtherOptions: [],
    };
  }

  private renderImage(imageObj: any): React.ReactNode {
    return (
      <RenderImage
        image={imageObj?.image}
        iconShape={imageObj?.iconShape}
        iconSize={imageObj?.iconSize}
        width={imageObj?.width}
        height={imageObj?.height}
      />
    );
  }

  componentDidMount() {
    let listItems: any = [];

    let splitIndex =
      (this.props.payload?.listItems?.length >=
      this.props.payload?.listItemDisplayCount
        ? this.props.payload?.listItemDisplayCount
        : this.props.payload?.listItems?.length) || 0;

    listItems = this.props.payload?.listItems?.slice(0, splitIndex);
    listItems = listItems.map((item: any) => {
      return {
        ...item,
        defaultIsCollapsed: item?.isCollapsed,
      };
    });

    this.setState({
      listItems: listItems,
    });
  }

  private listViewTemplate = (payload: any) => {
    let viewType = payload?.listViewType;

    switch (viewType) {
      case LIST_TEMPLATE_TYPES.NORMAL:
        return (
          <Text>
            {TEMPLATE_TYPES.ADVANCED_LIST_TEMPLATE}_{viewType}
            {'_pending'}
          </Text>
        );
      case LIST_TEMPLATE_TYPES.DEFAULT:
        return this.defaultListView(payload, this.state.listItems);
      default:
        return this.defaultListView(payload, this.state.listItems);
    }
  };

  private defaultListView = (payload: any, listItems?: []) => {
    if (!listItems || listItems?.length === 0) {
      return <></>;
    }

    let title = payload?.title || undefined;
    if (title && title?.trim() === '') {
      title = undefined;
    }
    let modalTitle = payload?.description || undefined;
    if (modalTitle && modalTitle?.trim() === '') {
      modalTitle = undefined;
    }

    return (
      <View
        style={{backgroundColor: Color.white, width: (windowWidth / 4) * 3.3}}>
        <View
          style={[
            styles.default_main_container,
            {backgroundColor: Color.white},
          ]}>
          {title && (
            <Text
              style={[
                styles.main_title,
                {
                  color: '#444444',
                  fontFamily:
                    this.props?.theme?.v3?.body?.font?.family || 'Inter',
                },
                botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                  ?.size,
              ]}>
              {title}
            </Text>
          )}
          {modalTitle && (
            <Text
              style={[
                styles.main_sub_title,
                {
                  color: '#A4A4A4',
                  fontFamily:
                    this.props?.theme?.v3?.body?.font?.family || 'Inter',
                },
                botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                  ?.size,
              ]}>
              {modalTitle}
            </Text>
          )}
          {listItems && (
            <FlatList
              data={listItems}
              removeClippedSubviews={false}
              scrollIndicatorInsets={{top: 0, left: 20, bottom: 0, right: 0}}
              automaticallyAdjustContentInsets={false}
              renderItem={this.renderDefaultListViewItem}
              // keyExtractor={item => getItemId()}
            />
          )}
        </View>
        {payload?.seeMore && (
          <View style={styles.see_main}>
            <TouchableOpacity
              onPress={() => {
                if (this.props.payload?.onListItemClick) {
                  this.props.payload?.onListItemClick(
                    this.props.payload?.template_type.trim(),
                    this.props.payload?.listItems,
                    true,
                    this.props?.theme,
                  );
                }
              }}
              style={styles.see_sub}>
              <Text style={styles.see_more_text}>{'See More'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  private renderDefaultListViewItem = ({item, index}: any) => {
    let infoList = item?.textInformation || undefined;
    let Wrapper: any;
    if (item?.type) {
      switch (item?.type) {
        case 'url':
        case 'web_url':
        case 'postback':
          Wrapper = TouchableOpacity;
          break;
        default:
          Wrapper = View;
      }
    } else {
      Wrapper = View;
    }

    return (
      <View key={index + '_id'} style={styles.main}>
        {index !== 0 && <View style={styles.line}></View>}
        <Wrapper
          style={{
            flexDirection: 'column',
          }}
          onPress={() => {
            if (item?.type && this.props.payload?.onListItemClick) {
              this.props.payload?.onListItemClick(
                this.props.payload?.template_type.trim(),
                {
                  ...item,
                },
              );
            }
          }}>
          <View style={{}}>
            {this.renderHeaderView(
              item,
              index,
              item?.isCollapsed,
              item?.defaultIsCollapsed,
            )}

            <CollapsableContainer expanded={!item?.isCollapsed}>
              <View style={{flex: 1}}>
                {infoList?.map((info: any, i: number) => {
                  let isLeft = info?.iconAlignment === 'left' || true;
                  let icon = info?.icon || null;
                  if (icon?.trim() === '') {
                    icon = null;
                  }

                  return (
                    <View
                      key={i + ''}
                      style={[styles.imageStyle1, {marginStart: 5, flex: 1}]}>
                      {isLeft ? (
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          {icon && (
                            <View style={[styles.info_main_container]}>
                              {this.renderImage({
                                image: icon,
                                iconShape: info?.iconShape,
                                iconSize: info?.iconSize,
                                width: 15,
                                height: 15,
                              })}
                            </View>
                          )}
                          {info?.title && (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.item_title1,
                                {color: '#202124'},
                                icon ? {marginLeft: 10} : {},
                                {
                                  color: '#444444',
                                  fontFamily:
                                    this.props?.theme?.v3?.body?.font?.family ||
                                    'Inter',
                                },
                                botStyles['small']?.size,
                              ]}>
                              {info.title}
                            </Text>
                          )}
                        </View>
                      ) : (
                        <View style={{flexDirection: 'row'}}>
                          {info?.title && (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.item_title1,
                                {color: '#202124'},
                                icon ? {marginRight: 10} : {},

                                {
                                  color: '#444444',
                                  fontFamily:
                                    this.props?.theme?.v3?.body?.font?.family ||
                                    'Inter',
                                },
                                botStyles['small']?.size,
                              ]}>
                              {info.title}
                            </Text>
                          )}
                          {icon && (
                            <View style={[styles.info_main_container, {}]}>
                              {this.renderImage({
                                image: icon,
                                iconShape: info?.iconShape,
                                iconSize: info?.iconSize,
                                width: 10,
                                height: 15,
                              })}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </CollapsableContainer>
          </View>
        </Wrapper>
        {this.renderTableListData(item)}
        {this.renderOtherOptions(item)}

        {item?.defaultIsCollapsed ? (
          <CollapsableContainer expanded={!item?.isCollapsed}>
            <View style={{}}>{this.renderButtons(item)}</View>
          </CollapsableContainer>
        ) : (
          this.renderButtons(item)
        )}
      </View>
    );
  };
  private renderSenderView = (user: any) => {
    if (!user) {
      return <></>;
    }
    if (!user?.id && user?.senderInitials && user?.color) {
      return (
        <View
          style={[
            styles.circleStyle,
            styles.assigne_container,
            {backgroundColor: user?.color},
          ]}>
          <Text
            style={[
              styles.assigne_text,

              {
                color: '#444444',
                fontFamily:
                  this.props?.theme?.v3?.body?.font?.family || 'Inter',
              },
              botStyles['small']?.size,
            ]}>
            {user?.senderInitials}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.circleStyle, {marginEnd: 6}]}>
        <UserAvatar
          color={user?.color}
          name={user?.fN}
          size={32}
          borderRadius={32}
          style={styles.circleStyle}
          textStyle={{fontSize: normalize(18)}}
          profileIcon={user?.icon}
          userId={user?.id}
        />
      </View>
    );
  };
  private renderHeaderView = (
    item: any,
    index: any,
    expanded?: boolean,
    defaultIsCollapsed?: boolean,
  ) => {
    if (!item) {
      return null;
    }
    let description = item?.description || undefined;
    if (description) {
      //description = description.replaceAll('\n', '');
      description = description?.replace?.(/\n/g, ' ');
    }
    let icon = item?.icon;
    if (icon?.trim() === '') {
      icon = null;
    }

    let descriptionIcon = item?.descriptionIcon;
    if (descriptionIcon?.trim() === '') {
      descriptionIcon = null;
    }
    let title = item?.title;
    if (title?.trim() === '') {
      title = null;
    }
    const Wrapper: any = item?.defaultIsCollapsed ? TouchableOpacity : View;

    let elementStyles: any;
    if (item?.elementStyles) {
      elementStyles = convertToRNStyle(item?.elementStyles);
    }

    let descriptionStyles: any;
    if (item?.descriptionStyles) {
      descriptionStyles = convertToRNStyle(item?.descriptionStyles);
    }

    let titleStyles: any;
    if (item?.titleStyles) {
      titleStyles = convertToRNStyle(item?.titleStyles);
    }

    return (
      <Wrapper
        key={index + ' ' + index}
        onPress={() => {
          const newList = this.state?.listItems?.map(
            (value: any, i: number) => {
              if (i === index) {
                return {
                  ...value,
                  isCollapsed: !item?.isCollapsed,
                };
              }

              return value;
            },
          );

          this.setState({
            listItems: newList || [],
          });
          item = {
            ...item,
            isCollapsed: !item?.isCollapsed,
          };
        }}
        style={[styles.header_view_con, elementStyles]}>
        {icon && (
          <View
            style={[
              styles.header_view_container,
              styles.header_view_container1,
            ]}>
            {this.renderImage({
              image: icon,
              iconShape: item?.iconShape,
              iconSize: 'medium',
            })}
          </View>
        )}
        {item?.sender && this.renderSenderView(item.sender)}
        <View
          style={[
            styles.header_sub_con,
            item?.elementStyles && {
              backgroundColor: item?.elementStyles?.background || 'transparent',
            },
          ]}>
          <View style={{flex: 1}}>
            {title && (
              <Text
                numberOfLines={1}
                style={[
                  styles.item_title,
                  {
                    fontFamily:
                      this.props?.theme?.v3?.body?.font?.family || 'Inter',
                  },

                  {
                    color: '#444444',
                    ...botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  },
                  titleStyles,
                ]}>
                {title}
              </Text>
            )}
            {description && (
              <Text
                numberOfLines={1}
                style={[
                  styles.item_desc,
                  {marginBottom: 5},
                  {
                    fontFamily:
                      this.props?.theme?.v3?.body?.font?.family || 'Inter',
                  },
                  {
                    color: '#444444',
                    ...botStyles['small']?.size,
                  },
                  descriptionStyles,
                ]}>
                {description}
              </Text>
            )}
          </View>

          {descriptionIcon && (
            <View
              style={[
                styles.header_view_container,
                styles.header_view_container2,
              ]}>
              {this.renderImage({
                image: descriptionIcon,
                iconShape: item?.iconShape,
                iconSize: 'small',
              })}
            </View>
          )}
        </View>
        {this.renderHederOptions(item, expanded, defaultIsCollapsed)}
      </Wrapper>
    );
  };

  private dateToFromNowDaily = (dateStr: any) => {
    if (!dateStr) {
      return '';
    }

    const date = dayjs(dateStr).toDate();
    const now = dayjs();

    const diffInDays = now.diff(date, 'day');

    if (diffInDays === 0) {
      return dayjs(date).format('hh:mm a - [Today]');
    } else if (diffInDays === -1) {
      return dayjs(date).format('hh:mm a - [Yesterday]');
    } else if (diffInDays === 1) {
      return dayjs(date).format('hh:mm a - [Tomorrow]');
    } else if (diffInDays < -1 && diffInDays >= -7) {
      return dayjs(date).format('hh:mm a - [Last] dddd');
    } else if (diffInDays > 1 && diffInDays <= 7) {
      return dayjs(date).format('dddd');
    } else {
      return dayjs(date).format('ddd, MMM D, YYYY hh:mm a');
    }
  };

  private renderHederOptions = (
    item: any,
    expanded?: boolean,
    defaultIsCollapsed?: boolean,
  ) => {
    if (!item || !item?.headerOptions) {
      return null;
    }

    let options = item.headerOptions;
    return options?.map((item: any, index: number) => {
      if (!(item?.type || item?.contenttype)) {
        return null;
      }

      const item_type = item?.contenttype || item?.type;
      switch (item_type) {
        case 'icon':
          return (
            <View key={index + ' ' + index} style={[styles.icon_type_con]}>
              {item?.icon && (
                <View style={styles.icon_type_sub1}>
                  {/* {this.renderImage({
                    image: item.icon,
                    iconShape: item?.iconShape,
                    // width: normalize(100),
                    // height: normalize(10),
                    //iconSize: item?.iconSize,
                  })} */}
                  <Image
                    style={[
                      styles.image,
                      defaultIsCollapsed && {
                        transform: [{rotate: expanded ? '90deg' : '180deg'}],
                      },
                    ]}
                    source={{uri: item.icon}}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          );
        case 'text':
          let value = item?.value;
          if (this.props?.payload?.localTemplateName === 'email-lookup') {
            value = this.dateToFromNowDaily(value);
          }
          return (
            <View key={index + ' ' + index} style={{justifyContent: 'center'}}>
              {item?.value && (
                <Text
                  style={[
                    {
                      color: item?.styles?.color || '#444444',
                      fontFamily:
                        this.props?.theme?.v3?.body?.font?.family || 'Inter',
                    },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  ]}>
                  {value + ''}
                </Text>
              )}
            </View>
          );
        case 'button':
          return (
            <View
              key={index + ' ' + index}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.payload?.onListItemClick(
                    this.props.payload?.template_type.trim(),
                    {...item, item_type: item_type},
                  );
                }}
                style={[
                  styles.item_button,
                  item?.buttonStyles?.background && {
                    backgroundColor: item?.buttonStyles?.background,
                  },
                  item?.buttonStyles?.border && {
                    borderColor:
                      item?.buttonStyles?.border?.split(' ')?.[2] ||
                      Color.white,
                    borderWidth: 1,
                  },
                ]}>
                <Text
                  style={[
                    {
                      fontFamily:
                        this.props?.theme?.v3?.body?.font?.family || 'Inter',
                    },
                    item?.buttonStyles
                      ? {
                          color: item?.buttonStyles?.color,
                        }
                      : {
                          color: '#444444',
                        },
                    botStyles[
                      this.props?.theme?.v3?.body?.font?.size || 'medium'
                    ]?.size,
                  ]}>
                  {item?.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        case 'dropdown':
          return (
            <Popover
              key={index + ' ' + index}
              ref={ref => (this.popoverRef = ref)}
              //isVisible={false}
              isVisible={this.state.showPopover}
              onRequestClose={() => {
                this.setState({
                  showPopover: false,
                });
              }}
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
              <View style={{marginTop: 5}}>
                {item?.dropdownOptions?.map((option: any, index: number) => {
                  return (
                    <TouchableOpacity
                      key={index + ''}
                      onPress={() => {
                        this.setState({
                          showPopover: false,
                        });

                        this.props.payload?.onListItemClick(
                          this.props.payload?.template_type.trim(),
                          {...option, item_type: item_type},
                        );
                      }}
                      style={styles.opt_title_con}>
                      <View>
                        <Text
                          style={[
                            {
                              color: '#444444',
                              fontFamily:
                                this.props?.theme?.v3?.body?.font?.family ||
                                'Inter',
                            },
                            botStyles[
                              this.props?.theme?.v3?.body?.font?.size ||
                                'medium'
                            ]?.size,
                          ]}>
                          {option?.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Popover>
          );
      }

      return <Text>{item?.type}</Text>;
    });
  };
  private renderOtherOptions = (item: any) => {
    if (!item || !item.optionsData) {
      return <></>;
    }
    let listItems = item?.optionsData.map((item: any) => {
      return {
        ...item,
        isChecked: false,
        id: item.id + '_' + item.type,
      };
    });

    let isRadio = listItems.filter((item: any) => item.type === 'radio')?.[0];

    let radioButtons = listItems.map((item: any, _index: number) => {
      return {
        id: item.id,
        label: item.label,
        value: item.label,
        labelStyle: {
          color: '#444444',
          fontFamily: this.props?.theme?.v3?.body?.font?.family || 'Inter',
          ...botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
            ?.size,
        },
        borderColor: '#444444',
        color: '#444444',
      };
    });
    if (isRadio) {
      let filterList = this.state.radioOtherOptions.filter(
        (obj: any) => obj?.isChecked,
      );

      return (
        <View style={{backgroundColor: 'transparent'}}>
          <RadioGroup
            radioButtons={radioButtons}
            containerStyle={{
              alignItems: 'flex-start',
              marginStart: 10,
            }}
            onPress={(setSelectedId: any) => {
              let selectedItem = listItems.filter(
                (btn: any) => btn.id === setSelectedId,
              );

              let isSelect = !selectedItem[0].isChecked;
              let obj = {
                ...selectedItem[0],
                isChecked: isSelect,
              };
              this.setSeletedSlot(obj, isSelect, true);
            }}
            selectedId={filterList?.[0] ? filterList?.[0]?.id : undefined}
          />
        </View>
      );
    }

    return (
      listItems && (
        <View>
          <FlatList
            data={listItems}
            renderItem={this.renderOtherOptionItem}
            // keyExtractor={(item) => item?.title}
          />
        </View>
      )
    );
  };
  private renderTableListData = (item: any) => {
    if (!item || !item.tableListData || !item.tableListData?.[0]?.rowData) {
      return <></>;
    }
    let listItems = item.tableListData?.[0]?.rowData;
    return (
      listItems && (
        <View style={styles.table_main_con}>
          {listItems.map((item: any, index: number) => {
            return this.renderTableListItem({item, index});
          })}
        </View>
      )
    );
  };

  private renderTableListItem = ({item, index}: any) => {
    return (
      <View key={index + ''} style={styles.table_item_con}>
        <View style={{minHeight: 20, minWidth: 20}}>
          {item.icon &&
            this.renderImage({
              image: item.icon,
              iconShape: item?.iconShape,
              width: 14,
              height: 14,
              iconSize: item?.iconSize || 'medium',
            })}
        </View>
        <View style={styles.table_sub2}>
          <Text
            style={[
              {
                color: '#444444',
                fontFamily:
                  this.props?.theme?.v3?.body?.font?.family || 'Inter',
              },
              botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                ?.size,
            ]}>
            {item?.title}
          </Text>
          <Text
            style={[
              {
                color: '#444444',
                fontFamily:
                  this.props?.theme?.v3?.body?.font?.family || 'Inter',
              },
              botStyles['small']?.size,
            ]}>
            {item?.description}
          </Text>
        </View>
      </View>
    );
  };

  private setSeletedSlot = (
    item: any,
    isSelect: any,
    isFromRadio?: boolean,
  ) => {
    let newArrayList: any = isFromRadio
      ? this.state.radioOtherOptions
      : this.state.otherOptions;
    if (isSelect) {
      if (isFromRadio) {
        newArrayList = [];
      }
      newArrayList.push(item);
    } else {
      newArrayList = newArrayList.filter((obj: any) => obj.id !== item.id);
    }

    if (isFromRadio) {
      this.setState({
        radioOtherOptions: newArrayList,
      });
    } else {
      this.setState({
        otherOptions: newArrayList,
      });
    }
  };

  private renderOtherOptionItem = ({item, index}: any) => {
    let filterList = this.state.otherOptions.filter(
      (obj: any) => obj?.id === item?.id,
    );

    if (filterList?.length !== 0) {
      item = {
        ...item,
        isChecked: filterList?.[0]?.isChecked,
      };
    }

    const Wrapper: typeof View | typeof TouchableOpacity | any =
      item?.type === 'checkbox' ? TouchableOpacity : View;
    return (
      <View key={index + '_id1'}>
        <Wrapper
          onPress={() => {
            let isSelect = !item.isChecked;
            let obj = {
              ...item,
              isChecked: isSelect,
            };
            this.setSeletedSlot(obj, isSelect);
          }}
          style={styles.other_opt_con}>
          {item.type === 'checkbox' && (
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                style={styles.check_box}
                checkBoxColor={'#444444'}
                isChecked={item.isChecked}
                onClick={() => {
                  let isSelect = !item.isChecked;
                  let obj = {
                    ...item,
                    isChecked: isSelect,
                  };
                  this.setSeletedSlot(obj, isSelect);
                }}
              />
              <Text
                style={[
                  styles.check_box_text,
                  {
                    color: '#444444',
                    fontFamily:
                      this.props?.theme?.v3?.body?.font?.family || 'Inter',
                  },
                  botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']
                    ?.size,
                ]}>
                {item.label}
              </Text>
            </View>
          )}
          {item.type === 'radio' && (
            <RadioButton
              id={item?.id} // acts as primary key, should be unique and non-empty string
              label={item.label}
              value={item.label}
              selected={item.isChecked}
              onPress={(_id: string) => {}}
            />
          )}
        </Wrapper>
      </View>
    );
  };
  private renderButtons = (item: any) => {
    if (item && item?.buttons && item?.buttons?.length > 0) {
      let displayLimit = item?.buttonsLayout?.displayLimit?.count || 4;
      let listItems = [];

      let splitIndex =
        (item?.buttons?.length >= displayLimit
          ? displayLimit
          : item?.buttons?.length) || 0;

      listItems = item?.buttons?.slice(0, splitIndex);
      let buttonAligment =
        item?.buttonsLayout?.buttonAligment || item?.buttonAligment || 'left';
      return (
        <View
          style={[
            styles.buttons_container,
            buttonAligment === 'fullwidth' && styles.full_width1,
            buttonAligment === 'right' && styles.right1,
          ]}>
          {listItems?.map((button: any, index: number) => {
            return (
              <TouchableOpacity
                key={index + ''}
                onPress={() => {
                  if (this.props.payload?.onListItemClick) {
                    let other = {};
                    if (this.state.otherOptions?.length > 0) {
                      let msz = button.title + ': ';
                      this.state.otherOptions.map((obj: any) => {
                        msz = msz + obj.value + ',';
                      });
                      other = {
                        title: msz,
                        payload: msz,
                      };
                    }

                    console.log('button ----->:', button);
                    this.props.payload?.onListItemClick(
                      this.props.payload?.template_type,
                      {
                        ...button,
                        ...other,
                      },
                    );
                  }
                }}
                style={[
                  styles.button_container,
                  button?.class === 'p-button'
                    ? koraStyles.pbutton
                    : koraStyles.sbutton,
                  styles.button_container1,

                  buttonAligment === 'fullwidth' && styles.full_width2,

                  buttonAligment === 'left' && {},
                ]}>
                <View style={styles.btn_main_con}>
                  {button?.icon && (
                    <View style={styles.btn_icon}>
                      {this.renderImage({
                        image: button.icon,
                        iconShape: button?.iconShape,
                        width: 14, //14,
                        height: 14, //8,
                        iconSize: button?.iconSize,
                      })}
                    </View>
                  )}
                  <Text
                    style={[
                      styles.button_text,
                      button?.class === 'p-button'
                        ? koraStyles.pbutton_text
                        : koraStyles.sbutton_text,

                      {
                        color: '#3A35F6',
                        fontFamily:
                          this.props?.theme?.v3?.body?.font?.family || 'Inter',
                      },
                      botStyles[
                        this.props?.theme?.v3?.body?.font?.size || 'medium'
                      ]?.size,
                    ]}>
                    {button.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {item?.buttons?.length > displayLimit && (
            <Popover
              ref={ref => (this.popoverBtnRef = ref)}
              //isVisible={false}
              isVisible={this.state.showBtnPopover}
              onRequestClose={() => {
                this.setState({
                  showBtnPopover: false,
                });
              }}
              from={
                <TouchableOpacity
                  onPress={() => {
                    // console.log('tem?.buttons? ----->:', item?.buttons);
                    this.setState({
                      showBtnPopover: true,
                    });
                  }}
                  style={[styles.button_container, styles.button_container2]}>
                  <View style={styles.btn_sub2}>
                    <Text
                      style={[
                        styles.button_text,

                        {
                          color: '#3A35F6',
                          fontFamily:
                            this.props?.theme?.v3?.body?.font?.family ||
                            'Inter',
                        },
                        botStyles[
                          this.props?.theme?.v3?.body?.font?.size || 'medium'
                        ]?.size,
                      ]}>
                      {'... More'}
                    </Text>
                  </View>
                </TouchableOpacity>
              }>
              <View style={{marginTop: 10, marginBottom: 10}}>
                {item?.buttons?.map((button: any, index: number) => {
                  return (
                    <TouchableOpacity
                      key={index + ''}
                      onPress={() => {
                        if (this.props.payload?.onListItemClick) {
                          let other = {};
                          if (this.state.otherOptions?.length > 0) {
                            let msz = button.title + ': ';
                            this.state.otherOptions.map((obj: any) => {
                              msz = msz + obj.value + ',';
                            });
                            other = {
                              title: msz,
                              payload: msz,
                            };
                          }

                          // console.log('button ----->:', button);
                          this.props.payload?.onListItemClick(
                            this.props.payload?.template_type,
                            {
                              ...button,
                              ...other,
                            },
                          );
                          this.setState({
                            showBtnPopover: false,
                          });
                        }
                      }}
                      style={[
                        styles.button_container,
                        button?.class === 'p-button'
                          ? koraStyles.pbutton
                          : koraStyles.sbutton,
                        styles.button_container1,

                        buttonAligment === 'fullwidth' && styles.full_width2,

                        buttonAligment === 'left' && {},
                      ]}>
                      <View style={styles.btn_main_con}>
                        {button?.icon && (
                          <View style={styles.btn_icon}>
                            {this.renderImage({
                              image: button.icon,
                              iconShape: button?.iconShape,
                              width: 14, //14,
                              height: 14, //8,
                              iconSize: button?.iconSize,
                            })}
                          </View>
                        )}
                        <Text
                          style={[
                            styles.button_text,
                            button?.class === 'p-button'
                              ? koraStyles.pbutton_text
                              : koraStyles.sbutton_text,

                            {
                              color: '#3A35F6',
                              fontFamily:
                                this.props?.theme?.v3?.body?.font?.family ||
                                'Inter',
                            },
                            botStyles[
                              this.props?.theme?.v3?.body?.font?.size ||
                                'medium'
                            ]?.size,
                          ]}>
                          {button.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Popover>
          )}
        </View>
      );
    }
  };

  render() {
    return (
      <View
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          marginTop: normalize(5),
        }}
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}>
        {this.state?.payload &&
          this.state.listItems &&
          this.listViewTemplate(this.state.payload)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: normalize(12),
    height: normalize(12),
  },
  see_more_text: {
    fontSize: normalize(14),
    flexWrap: 'wrap',
    flexShrink: 1,
    color: '#0D6EFD',
  },
  see_sub: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    paddingBottom: 10,
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 20,
  },
  see_main: {
    marginEnd: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  popover_main: {
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: -5,
    //backgroundColor: 'yellow',
  },
  main: {
    flexDirection: 'column',
    marginStart: 10,
    marginEnd: 5,
    paddingStart: 5,
    padding: 5,
  },
  check_box_text: {
    color: 'black',
    fontSize: normalize(14),
    alignSelf: 'center',
  },
  opt_title_con: {padding: 10, marginBottom: 10},
  icon_type_sub1: {
    marginEnd: 5,
    marginStart: 5,
  },
  btn_sub2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btn_icon: {
    marginEnd: 5,
    marginStart: 5,
  },
  btn_main_con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  full_width2: {
    flex: 1,
  },
  right1: {
    //flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    //backgroundColor: 'yellow',
  },
  full_width1: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    marginLeft: 10,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  check_box: {paddingLeft: 8, paddingRight: 8},
  other_opt_con: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'transparent',
    marginBottom: 3,
  },
  table_sub2: {
    marginLeft: 5,
    //backgroundColor: 'green',
    minWidth: 50,
  },
  table_item_con: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flexDirection: 'row',
    padding: 5,
    margin: 10,
  },
  table_main_con: {
    //flexWrap: 'wrap',
    //flexDirection: 'row',

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align items to the start of the line
    width: '100%',
  },
  icon_type_con: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  header_sub_con: {
    flexDirection: 'row',
    flex: 1,
    //marginEnd: 10,
  },
  header_view_con: {flexDirection: 'row', marginTop: 5, padding: 10},

  item_button: {
    backgroundColor: '#E6E6FD',
    borderRadius: 5,
    padding: 6,
    borderWidth: 1,
    borderColor: '#DEDEFC',
  },
  assigne_text: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: normalize(15),
    color: '#FFFFFF',
  },
  assigne_container: {
    width: normalize(28),
    height: normalize(28),

    marginEnd: 6,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

  circleStyle: {
    borderColor: '#ffffff',
    //borderWidth: 0.7,
    borderRadius: 50, //(48 * 0.62) / 2,
    overflow: 'hidden',
  },

  button_container1: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
    // flexWrap: 'wrap',
    backgroundColor: '#E5E5FD',
    borderColor: '#DEDDFC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 2,
    marginLeft: 10,
  },
  button_container2: {
    flexDirection: 'row',
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#E5E5FD',
    borderColor: '#DEDDFC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 2,
    marginLeft: 10,
  },
  button_container: {
    marginRight: 10,
    marginTop: 10,
    borderRadius: 3,
    backgroundColor: '#E7F1FF',
  },
  header_view_container1: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  header_view_container2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_view_container: {
    marginEnd: 10,
    marginStart: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  info_main_container: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 3,
  },

  button_text: {
    minWidth: 50,
    padding: 2,
    borderRadius: 8,
    alignSelf: 'center',
    color: '#3A35F6',
    alignContent: 'center',
    justifyContent: 'center',
  },

  default_main_container: {
    borderRadius: 5,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: '#E4E5E7',
    width: '95%',
    alignSelf: 'center',
  },
  buttons_container: {
    minWidth: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'yellow',
  },
  main_title: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 20,
    alignItems: 'flex-end',
    color: '#202124',
    marginTop: 10,
    marginStart: 10,
  },
  main_sub_title: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    // fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 20,
    alignItems: 'flex-end',
    marginBottom: 15,
    color: '#202124',
    marginStart: 10,
    marginTop: 5,
  },
  item_title: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#202124',
  },
  item_desc: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    letterSpacing: 0.270833,
    marginTop: 2,
    marginLeft: 0,
    color: '#5F6368',
  },
  item_title1: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    letterSpacing: 0.270833,
    marginTop: 2,

    color: '#5F6368',
  },
  line: {
    backgroundColor: '#E4E5E7',
    height: 0.5,
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
    marginStart: -5,
  },
  imageStyle1: {
    flexDirection: 'row',
    marginBottom: 5,
  },
});
