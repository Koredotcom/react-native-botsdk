import BaseView, {BaseViewProps, BaseViewState} from './BaseView';

import * as React from 'react';
import {View} from 'react-native';
import BotText from './BotText';
import {ThemeContext} from '../theme/ThemeContext';

interface ErrorProps extends BaseViewProps {}
interface ErrorState extends BaseViewState {}

export default class ErrorTemplate extends BaseView<ErrorProps, ErrorState> {
  static contextType = ThemeContext;
  static propTypes: {
    payload: any;
    onListItemClick?: any;
  };

  constructor(props: any) {
    super(props);
  }

  // shouldComponentUpdate(nextProps: ErrorProps) {
  //   return (
  //     !!this.props.payload &&
  //     !!nextProps.payload &&
  //     this.props.payload !== nextProps.payload
  //   );
  // }
  render() {
    return (
      <View>
        {this.props.payload && (
          <View>
            {this.props.payload?.text && (
              <BotText
                text={this.props.payload?.text}
                isFilterApply={true}
                text_color={this.props.payload?.color}
                isLastMsz={!this.isViewDisable()}
                theme={this.props.theme}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}
