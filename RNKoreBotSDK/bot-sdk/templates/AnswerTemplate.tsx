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
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {normalize} from '../utils/helpers';
import Color from '../theme/Color';
import { LocalizationManager } from '../constants/Localization';

interface AnswerProps extends BaseViewProps {}
interface AnswerState extends BaseViewState {}
const windowWidth = Dimensions.get('window').width;

const width = windowWidth * 0.8 ;

export default class AnswerTemplate extends BaseView<AnswerProps, AnswerState> {
    constructor(props: any) {
            super(props);
        }
    
        private getLocalizedString = (key: string): string => {
            return LocalizationManager.getLocalizedString(key);
        };
    
        render() {
            return this.props.payload ? (
            <View>
                {this.renderAnswersView(this.props.payload)}
                </View>
            ) : (
                <></>
            );
        }

        renderAnswersView = (payload: any) => {
            if (!payload) {
                return <></>;
            }

            let sourceLinks = new Map<string, string>();
            if (payload.answer_payload?.center_panel?.data) {
                payload.answer_payload.center_panel.data.map((dataItem: any, indexDataItems: any) => {
                    dataItem.snippet_content.map((snippetItem: any, indexSnippetItem: any) => {
                        snippetItem.sources.map((sourceItem: any, indexSourceItem: any) => {
                            if (sourceItem.title)
                                sourceLinks.set(sourceItem.title, sourceItem.url);
                        })
                    })
                })
            }
            return(
                <View style={styles.main_container}>
                    <Text style={styles.title}>{payload.answer}</Text>
                    {[...sourceLinks.entries()].map(([key, value], index) => {
                        return <TouchableOpacity style={styles.item_container} onPress={() => {
                            console.log('pressed url.....', value);
                            Linking.openURL(value); 
                        }}>
                            <Text style={styles.source_item}>
                                {(index + 1)+'. '+key}
                            </Text>
                        </TouchableOpacity>
                        })
                    } : <></>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Image style={styles.image_container1}/>
                        <Image style={styles.image_container2} source={require('../assets/images/ic_automation_ai.png')}/>
                        <Text style={{color:'#6938EF', fontSize: normalize(10), alignSelf:'center', marginStart: 4}}>{this.getLocalizedString('answered_by_ai')}</Text>
                    </View>
                </View>
            )
        }
}

const styles = StyleSheet.create({
    main_container: {
        width: width,
        flexDirection: 'column',
        marginBottom: normalize(4),
        borderWidth: 1,
        borderColor: Color.gray,
        shadowRadius: 4,
        shadowColor: Color.gray,
        borderRadius: normalize(10),
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(6),
        backgroundColor: Color.white
    },

    title:{
        fontSize: normalize(12),
        color: Color.black,
        marginTop: normalize(5),
        marginBottom: normalize(2)
    },

    source_item:{
        fontSize: normalize(10), 
        color:Color.gray, 
        paddingVertical: normalize(2), 
        flexShrink:1
    },

    item_container: {
        flexDirection: 'column',
        marginStart: normalize(4)
    },
    image_container1: {
        backgroundColor: '#d8d8d8', 
        width: 24, 
        height: 24, 
        borderRadius:30
    },
    image_container2:{
        width: 18, 
        height: 18, 
        position:'absolute', 
        marginStart: normalize(2), 
        marginTop: normalize(2), 
        tintColor: '#6938EF'
    }

})