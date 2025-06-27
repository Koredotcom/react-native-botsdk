import React from 'react';
import {IThemeType} from '../../../theme/IThemeType';
import {WelcomeHeaderConstants} from '../../../constants/Constant';
import LargeHeader from './largeHeader';
import MediumHeader from './mediumHeader';
import CompactHeader from './compactHeader';
import RegularHeader from './regularHeader';

interface HeaderProps {
  activetheme?: IThemeType;
}
interface HeaderState {}

export default class WelcomeHeader extends React.Component<
  HeaderProps,
  HeaderState
> {
  render() {
    const type = this.props?.activetheme?.v3?.welcome_screen?.layout;
    switch (type) {
      case WelcomeHeaderConstants.LARGE:
        return <LargeHeader {...this.props} />;
      case WelcomeHeaderConstants.MEDIUM:
        return <MediumHeader {...this.props} />;
      case WelcomeHeaderConstants.REGULAR:
        return <RegularHeader {...this.props} />;
      default:
        return <CompactHeader {...this.props} />;
    }
  }
}
