import * as React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import { getBubbleTheme } from '../theme/themeHelper';
import Base64Image from '../utils/Base64Image';
import { LocalizationManager } from '../constants/Localization';

interface ListProps extends BaseViewProps {}
interface ListState extends BaseViewState {}
const windowWidth = Dimensions.get('window').width;

const width = windowWidth * 0.8 ;

export default class ArticleTemplate extends BaseView<ListProps, ListState> {
    constructor(props: any) {
        super(props);
    }

    private getLocalizedString = (key: string): string => {
        return LocalizationManager.getLocalizedString(key);
    };

    render() {
        return this.props.payload ? (
        <View style={styles.main_container}>
            {this.renderElementsView(this.props.payload?.elements, this.props.payload?.displayLimit)}
            </View>
        ) : (  <></> );
    }
    
    renderElementsView = (list: any, displayLimit: number) => {
        if (!list || list.length === 0) {
            return <></>;
        }
        const bubbleTheme = getBubbleTheme(this.props?.theme);
        return (
            <View
                style={[{width: width}]}>
                {list?.slice(0, displayLimit > 0 ? displayLimit : list.size).map((item: any, index: any) => {
                    return this.getSingleElementView(item, index, list.length);
                })}
                { list.length > displayLimit ? (
                    <TouchableOpacity 
                        style={{alignSelf:'flex-end'}}
                        onPress={() =>{
                            console.log('Onpress', 'Not implemented yet... ');
                        }}>
                        <Text style={{fontSize: normalize(14), marginVertical: normalize(2), color: bubbleTheme.BUBBLE_RIGHT_BG_COLOR}}>{this.getLocalizedString('view_more')}</Text>
                    </TouchableOpacity>
                 ):<></>
                }
            </View>
        );
    }

    getSingleElementView = (item: any, index: number, _size: number = 0) => {
        if (!item) {
            return <></>;
        }
        const bubbleTheme = getBubbleTheme(this.props?.theme);
        return (
            <View 
                pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
                style={[styles.item_container, {borderColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR, marginBottom: index < _size -1 ? normalize(5) : 0}]}>
                    <View style={{flexDirection: 'row', marginBottom: normalize(5)}}>
                        {item.icon.includes('base64,') ? 
                            (
                                <Base64Image width={14} height={14} base64String={item.icon} style={{ alignSelf: 'center'}} />
                            ):(
                                <FastImage
                                    source={{ uri: item.icon }}
                                    style={{ width: 14, height: 14, alignSelf: 'center' }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            )
                        }
                        
                        <Text numberOfLines={1} style={{marginStart: 5, flexShrink: 1, fontWeight: 'bold', fontSize: normalize(14), }}>{item.title}</Text>
                    </View>
                    <Text numberOfLines={3} style={{flexShrink: 1, fontSize: normalize(12), marginBottom: normalize(5)}}>{item.description}</Text>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flexShrink: 1, fontSize: normalize(12), marginBottom: normalize(5)}}>{item.createdOn+'\n'+item.updatedOn}</Text>
                            { item.button.title ? (
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf:'center', flexDirection: 'row'}}>
                                    <TouchableOpacity 
                                        style={{ alignSelf:'center', flexDirection: 'row', paddingVertical: normalize(5)}}
                                        onPress={() => {
                                            console.log('pressed.....', 'yes');
                                            Linking.openURL(item.button.url);
                                        }}
                                    >
                                        <Image style={{tintColor: bubbleTheme.BUBBLE_RIGHT_BG_COLOR, width: 10, height: 10, alignSelf:'center'}} source={require('../assets/images/article.png')}/>
                                        <Text style={{flexShrink:1, fontSize: 12, color: bubbleTheme.BUBBLE_RIGHT_BG_COLOR,  marginStart: normalize(3)}}>{item.button.title}</Text>
                                    </TouchableOpacity>
                                </View>
                                )
                                : <></>
                            }
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'column'
    },

    item_container: {
        width: width, 
        flexDirection: 'column',
        position: 'relative',
        borderWidth: 1,
        borderRadius: normalize(10),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
        backgroundColor: Color.white
    },
    image_container: {
        backgroundColor: 'transparent',
        minHeight: 24,
        minWidth: 24,
    }
})