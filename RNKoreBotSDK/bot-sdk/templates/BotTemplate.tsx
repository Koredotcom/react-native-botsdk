import * as React from 'react';
import {Text} from 'react-native';
import {TEMPLATE_TYPES} from '../constants/Constant';
import {IThemeType} from '../theme/IThemeType';
import AdvancedListTemplate from './AdvancedListTemplate';
import CardTemplate from './CardTemplate';
import CarouselTemplate from './CarouselTemplate';
import DateTemplate from './DateTemplate';
import ErrorTemplate from './ErrorTemplate';
import ImageTemplate from './ImageTemplate';
import ListTemplate from './ListTemplate';
import MiniTableTemplate from './MiniTableTemplate';
import TableTemplate from './TableTemplate';
import BarChartTemplate from './charts/BarChartTemplate';
import LineChartTemplate from './charts/LineChartTemplate';
import PieChartView from './charts/PieChartView';
import StackBarChartTemplate from './charts/StackBarChartTemplate';
import Button from './Button';
import MessageText from './MessageText';
import BotText from './BotText';
import TableListTemplate from './TableListTemplate';
import AdvanceMultiSelectTemplate from './AdvanceMultiSelectTemplate';
import MultiSelectTemplate from './MultiSelectTemplate';
import RadioOptionTemplate from './RadioOptionTemplate';
import ListViewTemplate from './ListViewTemplate';
import DropdownTemplate from './DropdownTemplate';
import FeedbackTemplate from './FeedbackTemplate';
import FormTemplate from './FormTemplate';
import ClockTemplate from './ClockTemplate';
import ListWidgetTemplate from './ListWidgetTemplate';
import AudioTemplate from './AudioTemplate';
import VideoTemplate from './VideoTemplate';
import Attachements from './Attachemnts';
import ArticleTemplate from './ArticleTemplate';
import AnswerTemplate from './AnswerTemplate';
import OTPTemplate from './OTPTemplate';
import ResetPinTemplate from './ResetPinTemplate';

export interface BotTemplateProps {
  templateType: string;
  textContainerStyle?: any;
  payload?: any;
  theme?: IThemeType;
  renderMessageText?: (props: any) => React.ReactNode;
  currentMessage?: {
    message?: any;
    pending: any;
    received: any;
    sent: any;
    text?: any;
    createdOn?: any | null;
    image?: any | null;
    user: {
      _id: string;
      name: string;
    };
  };
  messageTextProps?: any;
  onListItemClick?: any;
  onSeeMoreClick?: any;
}

export interface BotTemplateState {}

export interface onListItemClickProps {
  templateType: string;
  item?: any;
}

export default class BotTemplate extends React.Component<
  BotTemplateProps,
  BotTemplateState
> {
  static defaultProps: {
    currentMessage: null;
  };

  private renderBubbleViews = (
    templateType?: string,
    payload?: any,
    theme?: IThemeType,
    onListItemClick?: any,
    onSeeMoreClick?: any,
  ) => {
    if (onListItemClick) {
      payload = {
        ...payload,
        onListItemClick: (
          type: any,
          data: any,
          isFromSeeMore: boolean = false,
        ) => {
          if (onSeeMoreClick && isFromSeeMore) {
            onSeeMoreClick(type, data);
          } else if (onListItemClick) {
            onListItemClick(type, data, isFromSeeMore);
          }
        },
      };
    }
    // theme = undefined;
    //console.log('templateType ----->:', templateType);
    // console.log('================ ================ ===============');
    // console.log('templateType ----->:', templateType);
    // console.log('template payload ----->:', JSON.stringify(payload));
    // console.log('================ ================ ===============');
    switch (templateType) {
      case TEMPLATE_TYPES.TEXT:
      case TEMPLATE_TYPES.LIVE_AGENT_TEMPLATE:
        return this.renderMessageText(payload, theme, templateType);
      case TEMPLATE_TYPES.BUTTON:
        return <Button payload={payload} theme={theme} onListItemClick={this.props.onListItemClick}/>;
      case TEMPLATE_TYPES.CARD_TEMPLATE:
        return <CardTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.LIST_TEMPLATE:
        return <ListTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.IMAGE_MESSAGE:
        return <ImageTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.TABLE_TEMPLATE:
        return <TableTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.QUICK_REPLIES:
        return this.renderBotText(payload, templateType, theme);
      case TEMPLATE_TYPES.ERROR_TEMPLATE:
        return <ErrorTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.CAROUSEL_TEMPLATE:
        return <CarouselTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.ADVANCED_LIST_TEMPLATE:
        return <AdvancedListTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.MINI_TABLE_TEMPLATE:
        return <MiniTableTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.BAR_CHART_TEMPLATE:
        if (payload?.stacked) {
          return <StackBarChartTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
        }
        return <BarChartTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.PIE_CHART_TEMPLATE:
        return <PieChartView payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.LINE_CHART_TEMPLATE:
        return <LineChartTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.DATE_TEMPLATE:
        return <DateTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.DATE_RANGE_TEMPLATE:
        return <DateTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.TABLE_LIST_TEMPLATE:
        return <TableListTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.ADVANCED_MULTI_SELECT_TEMPLATE:
        return <AdvanceMultiSelectTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.MULTI_SELECT_TEMPLATE:
        return <MultiSelectTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.RADIO_OPTION_TEMPLATE:
        return <RadioOptionTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.LIST_VIEW_TEMPLATE:
        return <ListViewTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.DROPDOWN_TEMPLATE:
        return <DropdownTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.FEEDBACK_TEMPLATE:
        return <FeedbackTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.FORM_TEMPLATE:
        return <FormTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.CLOCK_TEMPLATE:
        return <ClockTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.LISTWIDGET_TEMPLATE:
        return <ListWidgetTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.AUDIO_MESSAGE:
        return <AudioTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.VIDEO_MESSAGE:
        return <VideoTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.USER_ATTACHEMENT_TEMPLATE:
        return <Attachements payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.ARTICLE_TEMPLATE:
        return <ArticleTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.ANSWER_TEMPLATE:
        return <AnswerTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.OTP_TEMPLATE:
          return <OTPTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
      case TEMPLATE_TYPES.RESET_PIN_TEMPLATE:
            return <ResetPinTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} />;
    }
    return (
      <Text style={{padding: 10}}>
        {'This template is under development...'}
      </Text>
    );
  };

  private renderMessageText = (
    payload: any,
    theme?: IThemeType,
    template_type?: any,
  ) => {
    if (payload) {
      const {...messageTextProps} = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }

      return (
        <MessageText
          {...messageTextProps?.messageTextProps}
          payload={payload}
          containerStyle={this.props.textContainerStyle}
          theme={theme}
          template_type={template_type}
          //position={'left'}
        />
      );
    }
    return null;
  };

  private renderBotText = (
    payload: any,
    template_type?: string,
    theme?: IThemeType,
  ) => {
    let text = null;

    if (payload) {
      text = payload?.text;
      text = text ? text : payload?.payload?.text;
      text = text ? text : payload?.text?.text;
      if (template_type && template_type !== TEMPLATE_TYPES.QUICK_REPLIES) {
        text = text ? text : payload;
      }
    }
    if (text && typeof text === 'object') {
      let newText: {text: any} = text;
      text = newText?.text;
    }

    if (!text) {
      return null;
    }
    if (typeof text !== 'string') {
      console.log('value is not a string type   : ', text);
      return <></>;
    }
    return (
      <BotText
        // {...this.props}
        //template_type={template_type}
        text={text}
        isFilterApply={true}
        theme={theme as IThemeType}
        //isLastMsz={isLastMsz}
      />
    );
  };

  render() {
    return this.renderBubbleViews(
      this.props.templateType,
      this.props.payload,
      this.props.theme,
      this.props.onListItemClick,
      this.props.onSeeMoreClick,
    );
  }
}
