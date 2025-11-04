import React from 'react';
import { View, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';

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

export const saveBase64File = async (base64Data: string, fileName: string) => {
  try {
    // Extract MIME type and actual base64 data
    const matches = base64Data.match(/^data:(.+);base64,(.*)$/);
    if (!matches || matches.length !== 3) throw new Error('Invalid base64 string');

    const mimeType = matches[1];
    const data = matches[2];

    // Map MIME type to extension
    const mimeMap: { [key: string]: string } = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'video/mp4': 'mp4',
      'text/plain': 'txt',
    };
    const extension = mimeMap[mimeType];
    if (!extension) throw new Error(`Unsupported MIME type: ${mimeType}`);

    // File path inside app storage (Document directory is safe for user files)
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}.${extension}`;

    // Save base64 to file
    await RNFS.writeFile(path, data, 'base64');

    console.log('Saved file path:', path);
    return path;
  } catch (error) {
    console.error('Error saving file:', error);
    return undefined;
  }
};
