import * as React from 'react';
import {ChatHeaderType} from '../../../constants/Constant';
import CompactHeader from './CompactHeader';
import {ThemeContext} from '../../../theme/ThemeContext';
import {IThemeType} from '../../../theme/IThemeType';
import MediumHeader from './MediumHeader';
import LargeHeader from './LargeHeader';
import {isIOS} from '../../../utils/PlatformCheck';
//import {isIOS} from '../../../utils/PlatformCheck';

interface ChatHeaderProps {
  onHeaderActionsClick?: any;
  statusBarColor?: (colorCode: any) => void;
  isReconnecting?: boolean;
}
interface ChatHeaderState {}

export default class ChatHeader extends React.Component<
  ChatHeaderProps,
  ChatHeaderState
> {
  static contextType = ThemeContext;

  private renderHeaderView = () => {
    const theme = this.context as IThemeType;

    const type = theme?.v3?.header?.size;

    try {
      if (this.props?.statusBarColor && isIOS) {
        this.props?.statusBarColor(theme?.v3?.header?.bg_color || '#EAECF0');
      }
    } catch (error) {}

    //console.log('type ----->:', type);

    switch (type) {
      case ChatHeaderType.REGULAR:
        return <MediumHeader {...this.props} theme={theme} />;
      case ChatHeaderType.LARGE:
        return <LargeHeader {...this.props} theme={theme} />;
      case ChatHeaderType.COMPACT:
        return <CompactHeader {...this.props} theme={theme} />;

      default:
        return <CompactHeader {...this.props} theme={theme} />;
    }
  };

  render() {
    return this.renderHeaderView();
  }
}
