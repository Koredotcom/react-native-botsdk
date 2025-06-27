import * as React from 'react';
import {ThemeContext} from '../theme/ThemeContext';
import {IThemeType} from '../theme/IThemeType';

export interface BaseViewProps {
  position?: 'left' | 'right' | 'center';

  //onListItemClick?: (type?: any, item?: any) => {};
  payload?: any;
  theme?: IThemeType;
}

export interface BaseViewState {}

class BaseView<
  T extends BaseViewProps,
  S extends BaseViewState,
> extends React.Component<T, S> {
  static contextType = ThemeContext;
  static propTypes: {
    payload: {};
  };

  constructor(props: T) {
    super(props);
  }

  static defaultProps: {
    position: 'left';
  };

  protected isViewDisable = (): boolean => {
    return !this.props.payload?.isLastMessage || false;
  };

  // protected getTemplateWidth = () => {
  //   const value = this.props?.theme?.v3?.body?.icon?.show
  //     ? normalize(50)
  //     : normalize(30);
  //   return windowWidth - value;
  // };
}

export default BaseView;
