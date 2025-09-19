/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  MIN_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  MAX_TOOL_BAR_HEIGHT,
  MAX_INPUT_TEXT_LENGTH,
} from '../../constants/Constant';
import Color from '../../theme/Color';
import {invertColor, normalize} from '../../utils/helpers';
import {useCallbackOne} from 'use-memo-one';
import {isAndroid, isIOS} from '../../utils/PlatformCheck';
import {IThemeType} from '../../theme/IThemeType';
import {SvgIcon} from '../../utils/SvgIcon';

export interface ComposerProps {
  composerHeight?: number;
  text?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  textInputProps?: Partial<TextInputProps>;
  textInputStyle?: TextInputProps['style'];
  textInputAutoFocus?: boolean;
  keyboardAppearance?: TextInputProps['keyboardAppearance'];
  multiline?: boolean;
  disableComposer?: boolean;
  onTextChanged?(text: string): void;
  onInputSizeChanged?(layout: {width: number; height: number}): void;
  theme: IThemeType;
  onSpeakerClicked?(isSpeek: boolean): void;
  isTTSenable?: boolean;
}

export function Composer({
  composerHeight = MIN_COMPOSER_HEIGHT,
  disableComposer = false,
  keyboardAppearance = 'default',
  multiline = true,
  onInputSizeChanged = () => {},
  onTextChanged = () => {},
  placeholder = DEFAULT_PLACEHOLDER,
  placeholderTextColor = Color.defaultColor,
  text = '',
  textInputAutoFocus = false,
  textInputProps = {},
  theme,
  onSpeakerClicked = () => {},
  isTTSenable = false,
}: ComposerProps): React.ReactElement {
  const dimensionsRef = useRef<{width: number; height: number}>();
  const [isTTS, setTTS] = useState(false);
  //onSpeakerClicked(false);

  // Sync local state with parent state when it changes
  useEffect(() => {
    setTTS(isTTSenable);
  }, [isTTSenable]);

  const composerHeightNew: number = composerHeight || 35;

  const determineInputSizeChange = useCallbackOne(
    (dimensions: {width: number; height: number}) => {
      // Support earlier versions of React Native on Android.
      if (!dimensions) {
        return;
      }

      if (
        !dimensionsRef ||
        !dimensionsRef.current ||
        (dimensionsRef.current &&
          (dimensionsRef.current.width !== dimensions.width ||
            dimensionsRef.current.height !== dimensions.height))
      ) {
        dimensionsRef.current = dimensions;
        onInputSizeChanged(dimensions);
      }
    },
    [onInputSizeChanged],
  );

  const handleContentSizeChange = ({
    nativeEvent: {contentSize},
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
    determineInputSizeChange(contentSize);
  const maxHeight = MAX_TOOL_BAR_HEIGHT || 180;
  const bgColor = theme?.v3?.footer?.compose_bar?.bg_color || Color.white;
  const outLineColor =
    theme?.v3?.footer?.compose_bar?.['outline-color'] || Color.gray;
  //const bubbleTheme = getBubbleTheme(theme);
  const textColor = invertColor(bgColor, true);
  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: Color.transparent,
        },
        isIOS && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: outLineColor,
          borderRadius: 4,
          backgroundColor: bgColor,
          minHeight: normalize(composerHeightNew + 16),
        },
      ]}>
      <View
        style={[
          {
            justifyContent: 'center',
            maxHeight: normalize(maxHeight),
            flexDirection: 'row',
          },
          isAndroid && {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: outLineColor,
            borderRadius: 4,
            backgroundColor: bgColor,
            minHeight: normalize(composerHeightNew + 16),
          },
        ]}>
        <TextInput
          testID={placeholder}
          accessible
          accessibilityLabel={placeholder}
          placeholder={
            theme?.v3?.footer?.compose_bar?.placeholder || placeholder
          }
          placeholderTextColor={placeholderTextColor}
          selectionColor={textColor}
          multiline={multiline}
          maxLength={MAX_INPUT_TEXT_LENGTH}
          editable={!disableComposer}
          onContentSizeChange={handleContentSizeChange}
          onChangeText={onTextChanged}
          style={[
            styles.textInput,

            {
              minHeight: normalize(composerHeightNew),
              paddingRight: theme?.v3?.footer?.buttons?.emoji?.show ? 4 : 8,
            },
            {
              color: textColor, //bubbleTheme.BUBBLE_LEFT_TEXT_COLOR,
            },
          ]}
          autoFocus={textInputAutoFocus}
          value={text}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={keyboardAppearance}
          {...textInputProps}
        />

        {theme?.v3?.footer?.buttons?.speaker?.show && (
          <TouchableOpacity
            onPress={() => {
              const spacker = !isTTS;
              setTTS(spacker);
              onSpeakerClicked(spacker);
            }}
            style={{
              padding: 10,
              backgroundColor: Color.transparent,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgIcon
              name={isTTS ? 'SpeakerIcon' : 'SpeakerOffIcon'}
              width={normalize(18)}
              height={normalize(18)}
              color={textColor}
            />
          </TouchableOpacity>
        )}
        {/* Present not implimenting in mobile device as discuss with Sudeer */}
        {/* {theme?.v3?.footer?.buttons?.emoji?.show && (
          <TouchableOpacity style={styles.emoji_main}>
            <SvgIcon
              name={'HappyIcon'}
              width={normalize(22)}
              height={normalize(22)}
              color={
                theme?.v3?.footer?.buttons?.attachment?.icon_color ||
                theme?.v3?.footer?.icons_color ||
                '#697586'
              }
            />
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji_main: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingEnd: 5,
    paddingStart: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  card_main: {
    backgroundColor: '#FAFAFA',
    //height: normalize(80),
    //position: 'absolute',
    // bottom: 10,
    //alignSelf: 'center',
    //justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: normalize(16),
    paddingLeft: 8,
    paddingRight: 8,
    minHeight: normalize(isIOS ? 34 : 36),
    paddingVertical: isIOS ? 8 : 6,
    textAlignVertical: 'center',
    color: Color.text_color,
  },
});
