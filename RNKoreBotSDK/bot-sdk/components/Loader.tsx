import * as React from 'react';
import {ActivityIndicator} from 'react-native';

export const Loader = (props: any) => {
  return (
    <ActivityIndicator
      animating={true}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: props?.height || 80,
      }}
      size={props.size || 'small'}
      color={props?.color || '#517BD2'}
    />
  );
};
