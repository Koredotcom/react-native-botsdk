import {StyleSheet} from 'react-native';
import Color from '../../utils/Color';
import {normalize} from '../../utils/helpers';
import {TEMPLATE_STYLE_VALUES} from '../../utils/styles';
export default StyleSheet.create({
  composer_inputText: {
    color: '#222B45',
    backgroundColor: Color.lavender,

    textAlign: 'left',
    justifyContent: 'center',
    //alignSelf: 'flex-start',

    // borderRadius: 5,
    // borderWidth: 0.2,
    // borderColor: Color.black,
  },
  send_main_container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  send_container: {
    width: 38,
    height: 36,
    borderRadius: 6.4,

    //color: '#ffffff',
    //fontSize: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goTextStyle: {
    color: '#ffffff',
    fontSize: normalize(12),
    fontWeight: '500',
    fontStyle: 'normal',
    fontFamily: 'Inter',
  },
  rootContainer: {
    flex: 1,
    backgroundColor: Color.transparent,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
  },
  titleText: {fontSize: 18, fontWeight: '500', color: 'black'},
  mainStyle2: {flex: 1, flexDirection: 'column', backgroundColor: 'white'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    //padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  m_con2: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  close_btn_con: {
    backgroundColor: Color.white,
    paddingEnd: 10,
    paddingStart: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderTopEndRadius: TEMPLATE_STYLE_VALUES.BUBBLE_RADIUS,
  },
  close_btn_txt: {
    color: Color.blue,
    fontSize: normalize(18),
  },
  m_main_con: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  branding_load: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Color.yellow,
  },
});
