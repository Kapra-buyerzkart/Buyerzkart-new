import React, { useRef, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  FlatList,
  ImageBackground
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import RNOtpVerify from 'react-native-otp-verify';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import {getHash} from 'react-native-otp-verify';
import OTPTextView from 'react-native-otp-textinput';
import Toast from 'react-native-simple-toast';

import { LoaderContext } from '../../Context/loaderContext';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import { AppContext } from '../../Context/appContext';
import { forgotPasswordVerify, resendOTP } from '../api';
import { getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroEnterOTPScreen({ navigation, route }) {

  const refTimer = useRef();
  const [OTP, setOTP] = React.useState('');
  const { GroRegister } = React.useContext(AppContext);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [ resendStatus, setResendStatus ] = React.useState(true);
  const [ shareModal, setShareModal ] = React.useState(false);
  const [ choosenRef, setChoosenRef ] = React.useState('');


  useEffect(() => {
    getHash().then(hash => null).catch();
    RNOtpVerify.getOtp()
    .then (p => RNOtpVerify.addListener(otpHandler))
    .catch (p => null);
    return () => RNOtpVerify.removeListener();;
  }, []);

  const otpHandler = (message) => {
    const otp = /(\d{5})/g.exec(message)[1];
      setOTP(otp)
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  }

  const handleSubmit = async () => {
    if (route?.params?.type === 'forgot') {
      if (OTP && OTP !='') {
        try {
          showLoader(true);
          let url = await forgotPasswordVerify(OTP, route.params.otpUrlKey);
          Toast.show('OTP Verified');
          showLoader(false);
          navigation.navigate('GroChangeForgotPasswordScreen', { url });
        } catch (error) {
          showLoader(false);
          // Toast.show(error);
        }
      } else{
        Toast.show("Please enter valid OTP")
      }
    } else {
      if (OTP && OTP !='') {
        try {
          showLoader(true);
          await GroRegister(
            OTP,
            route.params.details.otpUrlKey,
            route.params.details,
            choosenRef
          );
          showLoader(false);
          Toast.show('Your registration completed successfully')
          navigation.reset({
            index: 0,
            routes: [{ name: 'GroceryHome' }],
          });
        } catch (error) {
          Toast.show(error?error:'Something went wrong');
          showLoader(false);
        }
      } else{
        Toast.show("Please enter valid OTP")
      }
    }
  };

  const changeTimerStatus = async() => {
    setResendStatus(!resendStatus);
  }


  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{alignItems:'center'}}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>

          <ImageBackground
            source={require('../../assets/images/BG1.png')}
            style={styles.topImageCon}
          >
            <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
              {showIcon('back', colours.kapraWhite, windowWidth*(5/100))}
            </TouchableOpacity>
          </ImageBackground>
          
          <View style={styles.contentCon}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={styles.logoImg}
            />
            <Text style={styles.fontStyle1}>Enter OTP</Text>
            <Text style={styles.fontStyle2}>A 5 digits code has been sent to your number/Email.</Text>
            <Text/>
            <Text/>
            <Text/>
            <OTPTextView
              containerStyle={{width: windowWidth*(90/100), height: windowWidth * (34 / 100)}}
              handleTextChange={(text) => {
                setOTP(text);
              }}
              tintColor={colours.kapraOrange}
              inputCount={5}
              keyboardType="numeric"
            />
            <AuthButton
              FirstColor={colours.kapraOrange}
              SecondColor={colours.kapraOrangeDark}
              ButtonText={'Verify'}
              ButtonWidth={88}
              OnPress={()=> OTP && OTP !=''? route?.params?.type == 'register' && route?.params?.details?.recommendationsList?.length >0 ? setShareModal(true) :handleSubmit():Toast.show('Please enter valid OTP')}
            />
            {
              resendStatus?
              <View style={styles.timerCon}>
                <Text style={[styles.fontStyle2]}>Resend OTP in </Text>
                <CountDownTimer
                  ref={refTimer}
                  timestamp={120}
                  timerCallback={()=>setResendStatus(false)}
                  containerStyle={styles.timerShowCon}
                  textStyle={styles.timerFont}
                />
                <Text style={[styles.fontStyle2]}> Sec </Text>
              </View>
              :
              <TouchableOpacity
                onPress={async () => {
                  try {
                    showLoader(true);
                    await resendOTP(
                      route?.params?.type === 'forgot'
                        ? route.params.otpUrlKey
                        : route.params.details.otpUrlKey,
                    );
                    setResendStatus(true);
                    showLoader(false);

                    Toast.show('OTP Sent');
                  } catch (error) {
                    showLoader(false);
                    // Toast.show(error);
                  }
                }}
                style={{
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lexend-SemiBold',
                    color: colours.kapraOrange,
                  }}>
                  {'Resend OTP'}
                </Text>
              </TouchableOpacity>
            }
          </View>
        </ScrollView>

      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        visible={shareModal}
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior="position"
          enabled
        >
          <View style={styles.modalMainCon}>
            <View style={styles.updateModalView}>
              <Image
                  source={require('../../assets/logo/logo.png')}
                  style={styles.modalImg}
              />
              <Text/>
              <FlatList
                contentContainerStyle={styles.listStyle}
                data={route?.params?.details?.recommendationsList}
                ListHeaderComponent={
                  <View style={[styles.listItemStyle,{borderTopWidth:0}]}>
                    <Text style={styles.fontStyle4}>Name</Text>
                    <Text style={styles.fontStyle4}>Phone Number     </Text>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <View style={styles.listItemStyle}>
                    <Text style={styles.fontStyle4}>
                      {index+1}. {item.custName}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems:'center'
                    }}>
                      <Text style={styles.fontStyle4}>{item.CustPhone}{'  '}</Text>
                      <CheckBox
                        value={choosenRef == item.custId?true:false}
                        onValueChange={()=>choosenRef == ''?setChoosenRef(item.custId) : choosenRef == item.custId? setChoosenRef(''): setChoosenRef(item.custId)}
                        style={styles.checkbox}
                        disabled={false}
                        tintColors={{ true: colours.kapraLight, false:colours.kapraBlackLight}}
                        onCheckColor={colours.kapraLight}
                        onTintColor={colours.kapraLight}
                      />
                    </View>
                  </View>
                  )}
                keyExtractor={(item, i) => i.toString()}
              />
              <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                  <AuthButton
                      FirstColor={colours.lightRed}
                      SecondColor={colours.primaryRed}
                      OnPress={() => { setChoosenRef('') ,setShareModal(false),  handleSubmit()}}
                      ButtonText={'Skip & Sign Up'}
                      ButtonWidth={40}
                      FSize={15}
                  />
                  <AuthButton
                      FirstColor={colours.kapraLight}
                      SecondColor={colours.kapraMain}
                      OnPress={() => { choosenRef === ''? Toast.show('Choose one referrer') :( setShareModal(false),  handleSubmit())}}
                      ButtonText={'+Referral & Verify'}
                      ButtonWidth={40}
                      FSize={15}
                  />
              </View>
            </View> 
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.kapraWhite,
  },
  topImageCon: {
    width: windowWidth,
    height: windowWidth*(50/100),
    resizeMode: 'cover'
  },
  contentCon: {
    alignItems:'center',
    top: -windowWidth*(15/100),
    width: windowWidth,
    borderTopLeftRadius:windowWidth*(15/100),
    borderTopRightRadius:windowWidth*(15/100),
    backgroundColor: colours.kapraWhite,
  },
  logoImg: {
    height: windowWidth * (25 / 100),
    width: windowWidth * (35 / 100),
    marginBottom: '8%',
    resizeMode: 'contain',
    marginTop: '8%',
  },
  modalImg: {
    height: windowWidth * (15 / 100),
    width: windowWidth * (40 / 100),
    resizeMode: 'contain',
  },
  loginContainer: {
    alignItems:'flex-end',
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '1%',
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    marginLeft: windowWidth*(5/100),
    marginTop: windowWidth*(5/100),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  timerCon: {
    flexDirection: 'row', 
    width: windowWidth*(94/100), 
    justifyContent:'center', 
    alignItems:'center'
  },
  timerShowCon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth*(20/100)
  },

  modalMainCon: {
    width:windowWidth, 
    height: windowHeight, 
    backgroundColor: 'rgba(10,54,127,0.4)',
    marginBottom:windowHeight*(2/100)
  },
  updateModalView: {
    height: windowHeight * (70 / 100),
    marginTop: windowHeight * (30 / 100),
    paddingTop: windowHeight * (5 / 100),
    paddingBottom: windowHeight * (2 / 100),
    paddingHorizontal: windowWidth*(5/100),
    backgroundColor: colours.kapraWhite,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent:'space-between'
  },
  listStyle: {
    borderWidth:2,
    borderColor: colours.kapraWhiteLow,
    borderRadius:10
  },
  listItemStyle: {
    width: windowWidth * (88 / 100),
    height: windowHeight * (7 / 100),
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth*(5/100),
    borderTopWidth:2,
    borderColor: colours.lightBlue,
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: colours.primaryGrey,
  },


  fontStyle1: {
    fontFamily: 'Lexend-Medium',
    color: colours.kapraBlack,
    fontSize: getFontontSize(25),
  },
  forgotPasswordText: {
    fontFamily: 'Lexend-Regular',
    color: colours.kapraOrange,
    fontSize: getFontontSize(12),
  },
  forgotButton: {
    paddingBottom: '7%',
  },
  fontStyle2: {
    fontFamily: 'Lexend-Light',
    color: colours.primaryGrey,
    fontSize: getFontontSize(12),
  },
  fontStyle3: {
    fontFamily: 'Lexend-SemiBold',
    color: colours.kapraOrange,
    fontSize: getFontontSize(14),
  },
  timerFont: {
    fontSize: windowWidth*(4/100),
    color: colours.kapraOrange,
    fontFamily: 'Lexend-SemiBold',
    letterSpacing: 0.25,
  },
  fontStyle4: {
    fontFamily: 'Lexend-Medium',
    color: colours.kapraLight,
    fontSize:  getFontontSize(15),
  },




});
