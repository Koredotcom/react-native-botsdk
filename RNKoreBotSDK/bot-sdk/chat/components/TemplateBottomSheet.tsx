import { PureComponent, ReactNode } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { TEMPLATE_TYPES } from "../../constants/Constant";
import { SvgIcon } from "../../utils/SvgIcon";
import { normalize } from "../../utils/helpers";
import Color from "../../theme/Color";
import OTPTemplate from "../../templates/OTPTemplate";
import FeedbackTemplate from "../../templates/FeedbackTemplate";
import { IThemeType } from "../../theme/IThemeType";
import ResetPinTemplate from "../../templates/ResetPinTemplate";

interface TemplateBottomSheetProps{
    isShow: boolean,
    messageId: string,
    templateType: string,
    payload: any,
    theme: IThemeType,
    onListItemClick: any,
    onSliderClosed: any
}

interface TemplateBottomSheetState{}

export default class TemplateBottomSheet extends PureComponent<
  TemplateBottomSheetProps,
  TemplateBottomSheetState
> { 
    constructor(props: TemplateBottomSheetProps){
        super(props);
    }

    render() {
        let payload = this.props.payload;
        return <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
            if (this.props.onSliderClosed)
            this.props.onSliderClosed();
        }}>
        <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
            <View style={{ 
                backgroundColor: '#fff',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 10,
            }}>
            { this.props.templateType !== TEMPLATE_TYPES.FEEDBACK_TEMPLATE && (
                <TouchableOpacity
                style={{
                    marginBottom: 10,
                    alignSelf:'flex-end'
                }}
                onPress={() => {
                    if (this.props.onSliderClosed)
                        this.props.onSliderClosed();
                }}
                >
                <SvgIcon
                    name={'HeaderClose'}
                    width={normalize(20)}
                    height={normalize(20)}
                    color={Color.black}
                />
                </TouchableOpacity>
            )}
            {this.renderSlideTemplates(this.props.templateType, payload, this.props.theme)}
            </View>
        </View>
        </Modal>
    }

    renderSlideTemplates = (templateType: string, payload: any, theme: IThemeType) =>{
        switch(templateType) {
          case TEMPLATE_TYPES.OTP_TEMPLATE:
            return <OTPTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} onBottomSheetClose={this.props.onSliderClosed}/>
          case TEMPLATE_TYPES.FEEDBACK_TEMPLATE:
            return <FeedbackTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} onBottomSheetClose={this.props.onSliderClosed}/>
          case TEMPLATE_TYPES.RESET_PIN_TEMPLATE:
            return <ResetPinTemplate payload={payload} theme={theme} onListItemClick={this.props.onListItemClick} onBottomSheetClose={this.props.onSliderClosed}/>
          default: return null;
        }
      }
}