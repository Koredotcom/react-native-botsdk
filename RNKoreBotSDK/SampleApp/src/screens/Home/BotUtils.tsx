import * as React from 'react';
import {normalize} from '../../utils/helpers';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Color from '../../utils/Color';

export const renderQuickRepliesView = (props: any) => {
  let values = props?.quickReplies || [];

  console.log('values ----------->:', values);
  // return <Text>{'Quick'}</Text>;

  return (
    <View>
      {values?.map((val: any, index: number) => {
        return (
          <TouchableOpacity
            key={index + ''}
            onPress={() => {
              props.itemClick?.(val);
            }}>
            <Text style={{margin: 5, padding: 10, backgroundColor: Color.blue}}>
              {val?.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  composer_inputText: {
    color: '#222B45',
    backgroundColor: 'white',
    paddingTop: 8.5,
    paddingHorizontal: 4,
    marginLeft: 10,
  },
  send_main_container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  send_container: {
    width: 38,
    height: 36,
    borderRadius: 6.4,

    //color: '#ffffff',
    //fontSize: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goTextStyle: {
    color: '#ffffff',
    fontSize: normalize(12),
    fontWeight: '500',
    fontStyle: 'normal',
    fontFamily: 'Inter',
  },
});
