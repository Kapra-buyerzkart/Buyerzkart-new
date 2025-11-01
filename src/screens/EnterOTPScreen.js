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
  FlatList
} from 'react-native';

import { LoaderContext } from '../Context/loaderContext';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
import { forgotPasswordVerify, resendOTP } from '../api';
import Toast from 'react-native-simple-toast';
import showIcon from '../globals/icons';
import { getFontontSize } from '../globals/functions';
import OTPTextView from 'react-native-otp-textinput';
import Header from '../components/Header';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import RNOtpVerify from 'react-native-otp-verify';
import {
  getHash,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import CheckBox from '@react-native-community/checkbox';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EnterOTPScreen({ navigation, route }) {
  const refTimer = useRef();
  const [OTP, setOTP] = React.useState('');
  const { register } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [ resendStatus, setResendStatus ] = React.useState(true);
  const [ shareModal, setShareModal ] = React.useState(false);
  const [ choosenRef, setChoosenRef ] = React.useState('');


  useEffect(() => {
    getHash().then(hash => {
    }).catch();
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
          navigation.navigate('ChangeForgotPassword', { url });
        } catch (error) {
          showLoader(false);
          Toast.show(error);
        }
      } else{
        Toast.show("Please enter valid OTP")
      }
    } else {
      if (OTP && OTP !='') {
        try {
          showLoader(true);
          await register(
            OTP,
            route.params.details.otpUrlKey,
            route.params.details,
            choosenRef
          );
          showLoader(false);
          Toast.show('Your registration completed successfully')
          navigation.reset({
            index: 0,
            routes: [{ name: 'DrawerNavigator' }],
          });
        } catch (error) {
          Toast.show(error);
          showLoader(false);
        }
      } else{
        Toast.show("Please enter valid OTP")
      }
    }
    showLoader(false);
  };

  const changeTimerStatus = async() => {
    setResendStatus(!resendStatus);
  }



  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} backEnable LightMode/>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{alignItems:'center'}}
      >
      <ScrollView
        contentContainerStyle={{width:windowWidth*(90/100), alignItems:'center'}}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../assets/images/MyOtp.png')}
          style={{
            height: windowWidth * (40 / 100),
            width: windowWidth * (80 / 100),
            marginBottom: '15%',
            marginTop: '15%',
            resizeMode: 'contain',
          }}
        />
        <View style={styles.upperContainer}>
          <Text style={styles.fontStyle4}>Enter OTP</Text>
          <Text style={styles.fontStyle2}>A 5 digits code has been sent to your number/Email. </Text>
        </View>
        <OTPTextView
          containerStyle={{width: windowWidth*(90/100), height: windowWidth * (34 / 100)}}
          handleTextChange={(text) => {
            setOTP(text);
          }}
          tintColor={colours.kapraLight}
          inputCount={5}
          keyboardType="numeric"
        />

        <AuthButton
          BackgroundColor={colours.mozaButtonGreen}
          ButtonText={'Verify'}
          ButtonWidth={88}
          OnPress={()=> OTP && OTP !=''? route?.params?.type == 'register' && route?.params?.details?.recommendationsList?.length >0 ? setShareModal(true) :handleSubmit():Toast.show('Please enter valid OTP')}
        />
        {
          resendStatus?
          <View style={{flexDirection: 'row', width: windowWidth*(94/100), justifyContent:'center', alignItems:'center'}}>
            <Text style={[styles.fontStyle2]}>
                Resend OTP in 
            </Text>
            <CountDownTimer
              ref={refTimer}
              timestamp={120}
              timerCallback={()=>setResendStatus(false)}
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                width: windowWidth*(20/100)
              }}
              textStyle={{
                fontSize: windowWidth*(4/100),
                color: colours.kapraMain,
                fontWeight: 'bold',
                letterSpacing: 0.25,
              }}
            />
            <Text style={[styles.fontStyle2]}>
                 Sec
            </Text>
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
                Toast.show(error);
              }
            }}
            style={{
              marginTop: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Proxima Nova Alt Bold',
                color: colours.kapraMain,
              }}>
              {'Resend OTP'}
            </Text>
          </TouchableOpacity>
        }
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
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)', marginBottom:windowHeight*(2/100)}}>
          <View style={styles.updateModalView}>
            <Image
                source={require('../assets/logo/logo.png')}
                style={{
                    height: windowWidth * (15 / 100),
                    width: windowWidth * (80 / 100),
                    resizeMode: 'contain',
                }}
            />
            <Text/>
            <FlatList
              contentContainerStyle={styles.listStyle}
              data={route?.params?.details?.recommendationsList}
              ListHeaderComponent={
                <View style={[styles.listItemStyle,{borderTopWidth:0}]}>
                  <Text style={styles.fontStyle1}>
                    Name
                  </Text>
                  <Text style={styles.fontStyle1}>Phone Number     </Text>
                </View>
              }
              renderItem={({ item, index }) => (
                <View style={styles.listItemStyle}>
                  <Text style={styles.fontStyle1}>
                    {index+1}. {item.custName}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems:'center'
                  }}>
                    <Text style={styles.fontStyle1}>{item.CustPhone}{'  '}</Text>
                    <CheckBox
                      value={choosenRef == item.custId?true:false}
                      onValueChange={()=>choosenRef == ''?setChoosenRef(item.custId) : choosenRef == item.custId? setChoosenRef(''): setChoosenRef(item.custId)}
                      style={styles.checkbox}
                      disabled={false}
                      tintColors={{ true: colours.kapraLight, false:colours.kapraMain}}
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
                    FirstColor={colours.primaryRed}
                    SecondColor={colours.lightRed}
                    OnPress={() => { setChoosenRef('') ,setShareModal(false),  handleSubmit()}}
                    ButtonText={'Skip & Sign Up'}
                    ButtonWidth={40}
                />
                <AuthButton
                    BackgroundColor={colours.kapraMain}
                    OnPress={() => { choosenRef === ''? Toast.show('Choose one referrer') :( setShareModal(false),  handleSubmit())}}
                    ButtonText={'+Referral & Verify'}
                    ButtonWidth={40}
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
    backgroundColor: colours.kapraLow
  },
  loginContainer: {
    flexDirection: 'row',
    paddingBottom: '18%',
    paddingTop: '10%',
    bottom: 0,
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.primaryGrey,
    fontSize: getFontontSize(12),
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.primaryOrange,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: getFontontSize(15),
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.kapraLight,
    fontSize:  getFontontSize(15),
  },
  listStyle: {
    borderWidth:2,
    borderColor: colours.kapraLight,
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
    borderColor: colours.kapraLight,
  },
  upperContainer: {
    width: windowWidth * (88 / 100),
    alignItems: 'flex-start',
  },
  textInput: {
    width: windowWidth * (90 / 100),
    height: windowHeight*(7/100),
    borderRadius: windowHeight*(7/100),
    borderColor: colours.primaryGrey,
    backgroundColor: colours.kapraLow,
    paddingVertical: 8,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize:  getFontontSize(16),
    paddingLeft: windowWidth * (6 / 100),
    marginBottom: '10%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(25),
    color: colours.primaryBlack,
  },
  languageContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowWidth * (10 / 100),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: colours.primaryGrey,
  },
  underlineStyleBase: {
    borderRadius:windowWidth*(6/100),
    color: colours.kapraMain,
    fontFamily:'Proxima Nova Alt Bold',
    fontSize: getFontontSize(15),
    width:windowWidth*(15/100),
    height:windowWidth*(10/100),
    borderColor: colours.primaryWhite,
    backgroundColor: colours.primaryWhite
  },
  underlineStyleHighLighted: {
    borderColor: colours.secondaryColor,
  },
  updateModalView: {
      height: windowHeight * (70 / 100),
      marginTop: windowHeight * (30 / 100),
      paddingTop: windowHeight * (5 / 100),
      paddingBottom: windowHeight * (2 / 100),
      paddingHorizontal: windowWidth*(5/100),
      backgroundColor: colours.kapraLow,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      elevation: 10,
      alignItems: "center",
      justifyContent:'space-between'
  },
});
