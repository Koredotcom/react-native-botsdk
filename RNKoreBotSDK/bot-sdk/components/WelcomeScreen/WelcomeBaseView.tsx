import React from 'react';
import {IThemeType} from '../../theme/IThemeType';

export interface BaseViewProps {
  activetheme?: IThemeType;
  onStartConversationClick?: any;
}

export interface BaseViewState {}

export class WelcomeBaseView<
  T extends BaseViewProps,
  S extends BaseViewState,
> extends React.Component<T, S> {}
