import React from 'react';
import { View, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';

export default function Base64Image({ base64String, width = 100, height = 100, style }) {
  if (!base64String) return null;

  const lowerCaseStr = base64String.toLowerCase();
  const isSvg = lowerCaseStr.includes('image/svg+xml');

  if (isSvg) {
    const onlyBase64 = base64String.split('base64,')[1];
    const svgXml = global.atob
      ? global.atob(onlyBase64)
      : decodeBase64(onlyBase64);

    return (
      <View style={style}>
        <SvgXml xml={svgXml} width={width} height={height} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: base64String }}
      style={[{ width, height, resizeMode: 'contain' }, style]}
    />
  );
}

function decodeBase64(base64: string) {
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}
