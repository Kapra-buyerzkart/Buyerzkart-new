import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { registerUser, checkUser, areaList } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import showIcon from '../globals/icons';
import { getFontontSize } from '../globals/functions';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPTextView from 'react-native-otp-textinput';
import { StackActions } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ProductRegisterScreen({ navigation, route }) {
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { refRegister, loadProfile } = React.useContext(AppContext);

  const [terms, setTerms] = React.useState(false);
  const [otpEnable, setOtpEnable] = React.useState(true);

  const [openRole, setOpenRole] = React.useState(false);
  const [valueRole, setValueRole] = React.useState(null);
  const [itemsRole, setItemsRole] = React.useState(null);

  const [name, setName] = React.useState('');
  const [NameError, setNameError] = React.useState(false);
  const [NameErrorMessage, setNameErrorMessage] = React.useState('');

  const [email, setEmail] = React.useState('');
  const [EmailError, setEmailError] = React.useState(false);
  const [EmailErrorMessage, setEmailErrorMessage] = React.useState('');

  const [phone, setPhone] = React.useState('');
  const [PhoneError, setPhoneError] = React.useState(false);
  const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [PasswordError, setPasswordError] = React.useState(false);
  const [PasswordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');

  const [pincode, setPincode] = React.useState('');
  const [PincodeError, setPincodeError] = React.useState(false);
  const [PincodeErrorMessage, setPincodeErrorMessage] = React.useState('');

  const [refcode, setRefcode] = React.useState('');
  const [RefCodeError, setRefCodeError] = React.useState(false);
  const [RefCodeErrorMessage, setRefCodeErrorMessage] = React.useState('');

  const [pincodeList, setPincodeList] = React.useState(null);

  const [areaname, setAreaname] = React.useState('');
  const [AreanameError, setAreanameError] = React.useState(false);
  const [AreanameErrorMessage, setAreanameErrorMessage] = React.useState('');

  const [otpModal, setOtpModal] = React.useState(false);
  const [otpUrlKey, setOtpUrlKey] = React.useState(null);
  const [OTP, setOTP] = React.useState('');

  const handlePostcode = async (text) => {
    setPincode(text),
    setPincodeError(false)
    var phoneno = /^\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/;
    if (!text.match(phoneno)) {
      setPincodeErrorMessage('Enter a valid post code');
      setPincodeError(true);
    } else {
      try {
        let area = await areaList(text);
        setPincodeList(area);
      } catch (error) {

      }
    }
  }

  const handleReffCode = async (text) => {
    setRefcode(text),
    setRefCodeError(false);
  }

  const handlemail = async (text) => {
    setEmail(text), setEmailError(false);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!text.match(mailformat)) {
      setEmailErrorMessage('Enter a valid email ID');
      setEmailError(true);
    } else {

      let usercheck = await checkUser(text);
      if (usercheck === true) {
        setEmailError(true);
        setEmailErrorMessage('Email ID already in use');
      }

    }
  };

  const handlePhone = async (text) => {
    setPhone(text);
    setPhoneError(false);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!text.match(phoneno)) {
      setPhoneErrorMessage('Enter a valid mobile number');
      setPhoneError(true);
    } else {
      try {
        await checkUser(text);
      } catch (error) {
        setPhoneErrorMessage('Mobile number already used');
        setPhoneError(true);
      }
    }
  };

  const handleRegister = async () => {

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const nameError = name.trim() === '';
    const phoneError = phone.trim() === '';
    const phoneTypeError = !phone.match(phoneno);
    const passwordErrror = password.length < 6;
    const confirmPasswordErrror = password != confirmPassword;
    const termsError = terms === false;
    const emailError = email.trim() === '';
    const emailTypeError = !email.match(mailformat);
    const pincodeError = pincode.trim() === '';
    const areaError = valueRole === null;
    if (!emailError) {
      if (!email.match(mailformat)) {
        setEmailErrorMessage('Enter a valid email ID');
        setEmailError(true);
      }
    } else if (emailError) {
      setEmailErrorMessage('Required');
      setEmailError(true);
    }

    if (!phoneError) {
      if (!phone.match(phoneno)) {
        setPhoneErrorMessage('Enter a valid mobile number');
        setPhoneError(true);
      }
    } else if (phoneError) {
      setPhoneErrorMessage('Required');
      setPhoneError(true);
    }
    if(areaError) {
      Toast.show('Please choose an area')
    }

    if (
      !(
        nameError ||
        emailError ||
        phoneError ||
        passwordErrror ||
        confirmPasswordErrror ||
        termsError ||
        emailTypeError ||
        phoneTypeError ||
        pincodeError ||
        areaError

      )
    ) {
      let data = {
        name,
        email,
        mobile: phone,
        password,
        pincodeAreaId: valueRole,
        // referredBy: refcode
      };
      try {
        // showLoader(true);
        let reg = await registerUser(data);
        setOtpUrlKey(reg);
        setOtpModal(true);
        Toast.show('OTP Sent');
        // showLoader(false);
      } catch (error) {
        showLoader(false);
        if (error.length > 0) {
          error.map((item) => {
            if (item.ErrType === 'Mobile Number') {
              setPhoneErrorMessage(item.Message);
              setPhoneError(true);
            }
            if (item.ErrType === 'Email') {
              setEmailErrorMessage(item.Message);
              setEmailError(true);
            }
            if (item.ErrType !== 'Mobile Number' || item.ErrType !== 'Email')
              Toast.show(item.Message);
          });
        }
      }
    } else {
      setNameErrorMessage('Required');
      setNameError(nameError);
      setPasswordErrorMessage('Minimum 6 characters required');
      setPasswordError(passwordErrror);
      setConfirmPasswordErrorMessage('Password does not match')
      setConfirmPasswordError(confirmPasswordErrror)
      setPincodeError(pincodeError);
      if (termsError) {
        Toast.show('Agree Terms & Conditions');
      }
    }
  };

  const verifyOTPFun = async() => {
    if (OTP && OTP !='') {
        try {
          showLoader(true);
          await refRegister(
            OTP,
            otpUrlKey.otpUrlKey,
            otpUrlKey,
            route.params.details
          );
          showLoader(false);
          Toast.show('Your registration completed successfully')
          setOtpModal(false);
          await AsyncStorage.removeItem('ProductRef')
          await loadProfile();
          navigation.goBack();
        } catch (error) {
          showLoader(false);
          Toast.show(error);
        }
      } else{
        Toast.show("Please enter valid OTP")
      }
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
    <Header navigation={navigation} backEnable LightMode />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom:windowHeight*(10/100) }}
          showsVerticalScrollIndicator={false}>
          <Text />
          <Text style={styles.headerText}>Sign Up</Text>
          <Text style={styles.fontStyle2}>Please signup to continue</Text>
          <Text/>
          
          <View style={styles.innerContainer}>
            <LoginTextInput
              OnChangeText={(text) => {
                setName(text);
                setNameError(false);
              }}
              Width={90}
              Placeholder={"Name"}
              value={name}
              Error={NameError}
              ErrorText={NameErrorMessage}
              Height={windowWidth * (14 / 100)}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                handlemail(text)
              }}
              Width={90}
              Placeholder={"Email"}
              value={email}
              Error={EmailError}
              ErrorText={EmailErrorMessage}
              Height={windowWidth * (14 / 100)}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                handlePhone(text)
              }}
              Width={90}
              Placeholder={"Phone Number"}
              value={phone}
              Error={PhoneError}
              ErrorText={PhoneErrorMessage}
              PhoneCode
              Length={10}
              KeyboardType={'numeric'}
              Height={windowWidth * (14 / 100)}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                setPassword(text);
                if (text.length <= 5) {
                  setPasswordErrorMessage('Minimum 6 characters required');
                  setPasswordError(true);
                } else {
                  setPasswordError(false);
                }
              }}
              secureEntry
              Width={90}
              Placeholder={"Password"}
              value={password}
              Error={PasswordError}
              ErrorText={PasswordErrorMessage}
              Height={windowWidth * (14 / 100)}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                setConfirmPassword(text);
                if (password != text) {
                  setConfirmPasswordErrorMessage('Password does not match');
                  setConfirmPasswordError(true);
                } else {
                  setConfirmPasswordError(false);
                }
              }}
              secureEntry
              Width={90}
              Placeholder={" Confirm Password"}
              value={confirmPassword}
              Error={confirmPasswordError}
              ErrorText={confirmPasswordErrorMessage}
              Height={windowWidth * (14 / 100)}
            />
            {/* <LoginTextInput
              OnChangeText={(text) => {
                handleReffCode(text);
              }}
              Width={90}
              Placeholder={"Referral Code (optional)"}
              value={refcode}
              Error={RefCodeError}
              ErrorText={RefCodeErrorMessage}
              Height={windowWidth * (14 / 100)}
            /> */}
            <LoginTextInput
              OnChangeText={(text) => {
                handlePostcode(text);
              }}
              Width={90}
              Placeholder={"Postcode"}
              value={pincode}
              Error={PincodeError}
              ErrorText={PincodeErrorMessage}
              Length={6}
              KeyboardType={'numeric'}
              Height={windowWidth * (14 / 100)}
            />

            {
              pincodeList&&pincodeList.length>0&&(
                <View>
                  {/* <View style={{marginLeft: windowWidth*(5/100)}}>
                    <Text style={[styles.fontStyle1]}>Select area</Text>
                  </View> */}
                  <DropDownPicker
                    schema={{
                        label: 'areaName',
                        value: 'pincodeAreaId'
                    }}
                    open={openRole}
                    value={valueRole}
                    items={pincodeList}
                    zIndex={3000}
                    zIndexInverse={1000}
                    dropDownDirection={'TOP'}
                    placeholder={'Select area'}
                    setOpen={setOpenRole}
                    setValue={setValueRole}
                    setItems={setItemsRole}
                    style={{width: windowWidth*(90/100), height: windowHeight*(6/100),borderColor: colours.primaryWhite,  marginBottom:10, borderRadius:20, backgroundColor: colours.primaryWhite, paddingHorizontal:windowWidth*(5/100)  }}
                    dropDownContainerStyle={{borderColor: colours.primaryWhite, color:colours.primaryBlack, }}
                    labelStyle={{fontFamily:'Proxima Nova Alt Bold', fontSize: getFontontSize(18), color: colours.primaryBlack}}
                    textStyle={{fontFamily:'Proxima Nova Alt Bold', fontSize: getFontontSize(18), color: colours.kapraLight}}
                    placeholderStyle={{fontFamily:'Proxima Nova Alt Bold', fontSize: getFontontSize(18), color: colours.kapraLight}}
                  />
                </View>
              )
            }
            <CustomRadioButton
              state={terms}
              check_button={() => setTerms(true)}
              onPress={() =>
                navigation.navigate('PolicyScreen', {
                  Type: 'Terms of Use',
                  fromReg: true,
                })
              }
            />

            <AuthButton
              OnPress={PhoneError || EmailError ? null : handleRegister}
              ButtonText={"Sign Up"}
              ButtonWidth={90}
            />

            <View style={styles.loginContainer}>
                <Text style={styles.fontStyle2}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Login', { fromProd: true }))}>
                <Text style={styles.fontStyle3}>Login</Text>
                </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
        <Modal
          animationType="slide"
          visible={otpModal}
          transparent={true}
        >
          <KeyboardAvoidingView
            behavior="position"
            enabled
          >
            <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)'}}>
              <View style={styles.optionModalView}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.headerText,{color:colours.kapraMain}]}>Enter OTP</Text>
                  <TouchableOpacity onPress={()=>setOtpModal(false)} style={{
                    width: windowWidth*(10/100),
                    height: windowWidth*(10/100),
                  }}>
                    <View>{showIcon('close',colours.lightRed ,windowWidth * (6 / 100))}</View>
                  </TouchableOpacity>
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
                  OnPress={()=>verifyOTPFun()}
                  ButtonText={'Verify OTP'}
                  ButtonWidth={80}
                />
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
    backgroundColor: colours.kapraLow,
  },
  innerContainer: {
    alignItems: 'center',
  },
  forgotButton: {
    paddingBottom: '12%',
  },
  loginContainer: {
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '1%',
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.primaryGrey,
    fontSize: 12,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.kapraMain,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 12,
  },
  headerText: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlack,
    fontSize: getFontontSize(25),
  },
  RadioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colours.kapraMain,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  checkedButton: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colours.kapraMain,
  },
  mainContainer1: {
    width: windowWidth,
    alignItems: 'center',
    paddingBottom: '5%',
  },
  upperContainer: {
    width: windowWidth * (84 / 100),
    alignItems: 'flex-start',
    paddingBottom: '2%',
  },
  languageContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowWidth * (10 / 100),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionModalView: {
    height: windowHeight * (40 / 100),
    marginTop: windowHeight * (60 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:'center',
    width: windowWidth*(90/100),
    height: windowHeight*(7/100),
    marginBottom:10,
    borderBottomWidth:0.5,
    borderBottomColor: colours.lowGrey
  },
  underlineStyleBase: {
    color: colours.kapraMain,
    fontFamily:'Lato-BoldItalic',
    fontSize: getFontontSize(15),
    width:windowWidth*(15/100),
    height:windowWidth*(10/100),
    borderWidth:0,
    borderBottomWidth:2,
    borderRadius:5,
    borderColor: colours.kapraMain,
  },
  underlineStyleHighLighted: {
    borderColor: colours.kapraMain,
  },
  fontStyle1: {
    color: colours.kapraLight,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  }
});

//Custom RadioButton
const CustomRadioButton = ({ state, check_button, un_check_button, onPress }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '4%',
      }}>
      <TouchableOpacity
        style={styles.RadioButton}
        onPress={state === false ? check_button : un_check_button}>
        <View style={state === true ? styles.checkedButton : ''} />
      </TouchableOpacity>
      <Text style={styles.fontStyle2}>{'I Read and agree to'} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.fontStyle3}>{'Terms & Conditions'}</Text>
      </TouchableOpacity>
    </View>
  );
};
