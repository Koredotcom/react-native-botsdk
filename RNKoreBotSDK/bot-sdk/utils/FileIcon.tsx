import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {normalize} from './helpers';

interface FileIconProps {
  fileType: string;
  size?: number;
}

interface FileIconState {}

const iconMappings: any = {
  txt: 'file-text-o',
  pdf: 'file-pdf-o',
  doc: 'file-word-o',
  docx: 'file-word-o',
  xls: 'file-excel-o',
  xlsx: 'file-excel-o',
  ppt: 'file-powerpoint-o',
  pptx: 'file-powerpoint-o',
  jpg: 'file-image-o',
  jpeg: 'file-image-o',
  png: 'file-image-o',
  gif: 'file-image-o',
  mp3: 'file-audio-o',
  mp4: 'file-video-o',
  avi: 'file-video-o',
  mov: 'file-video-o',
  zip: 'file-zip-o',
  rar: 'file-zip-o',
  default: 'file-o', // Default icon for unknown file types
};

export default class FileIcon extends React.Component<
  FileIconProps,
  FileIconState
> {
  private getColor = (fileType: string) => {
    switch (fileType) {
      case 'txt':
        return '#00f';
      case 'pdf':
        return '#f00';
      case 'doc':
      case 'docx':
        return '#6495ED';
      case 'xls':
      case 'xlsx':
        return '#008000';
      case 'ppt':
      case 'pptx':
        return '#FF4500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '#FFA500';
      case 'mp3':
        return '#800080';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '#FFD700';
      case 'zip':
      case 'rar':
        return '#808000';
      default:
        return '#000'; // Default color
    }
  };

  private renderIcon = (fileType: string) => {
    fileType = fileType?.toLowerCase?.()?.trim?.();
    let size = this.props.size || 45;
    const iconName = iconMappings[fileType] || iconMappings.default;
    const color = this.getColor(fileType);

    return <Icon name={iconName} size={normalize(size)} color={color} />;
  };

  render() {
    return this.renderIcon(this.props.fileType);
  }
}
