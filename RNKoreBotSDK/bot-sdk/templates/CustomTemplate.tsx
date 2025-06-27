import {ThemeContext} from '../theme/ThemeContext';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
// {"buttons": [{"payload": "Test", "title": "Test", "type": "postback"}, {"payload": "Testing", "title": "Testing", "type": "postback"}],
//  "isLastMessage": true,
//  "onListItemClick": [Function anonymous],
//  "template_type": "button",
//  "text": "Select an option."}

export interface CustomViewProps extends BaseViewProps {
  payload: any;
  isLastMessage: boolean;
  onListItemClick: any;
}

export interface CustomViewState extends BaseViewState {}

class CustomTemplate<
  T extends CustomViewProps,
  S extends CustomViewState,
> extends BaseView<T, S> {
  static contextType = ThemeContext;
  static propTypes: {
    payload: {};
  };

  constructor(props: T) {
    super(props);
  }
}

export default CustomTemplate;
