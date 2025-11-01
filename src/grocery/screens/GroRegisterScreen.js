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
  TextInput,
  KeyboardAvoidingView,
  ImageBackground
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import { registerUser, checkUser, areaList } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import { getFontontSize } from '../globals/GroFunctions';
import Header from '../components/Header';
import showIcon from '../../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroRegisterScreen({ navigation }) {
  const { showLoader, loading } = React.useContext(LoaderContext);

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

  const handlePostcode = async (text) => {
    setPincode(text),
    setPincodeError(false)
    var phoneno = /^\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/;
    if (!text.match(phoneno)) {
      setPincodeErrorMessage('Enter a valid Postcode');
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
    const pincodeError = pincode.trim() === '' || pincode.length < 6;
    const areaError = valueRole === null;
    if (!emailError) {
      if (!email.match(mailformat)) {
        setEmailErrorMessage('Enter a valid email ID');
        setEmailError(true);
      }
    } else if (emailError) {
      setEmailErrorMessage('*Required');
      setEmailError(true);
    }

    if (!phoneError) {
      if (!phone.match(phoneno)) {
        setPhoneErrorMessage('Enter a valid mobile number');
        setPhoneError(true);
      }
    } else if (phoneError) {
      setPhoneErrorMessage('*Required');
      setPhoneError(true);
    }
    if(areaError) {
      Toast.show('Please enter a valid Postcode and choose an area')
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
        otpEnable ?
          navigation.navigate('GroEnterOTPScreen', {
            type: 'register',
            details: reg,
          })
          :
          navigation.navigate('Home');
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
      setNameErrorMessage('*Required');
      setNameError(nameError);
      setPasswordErrorMessage('*Minimum 6 characters required');
      setPasswordError(passwordErrror);
      setConfirmPasswordErrorMessage('*Password does not match')
      setConfirmPasswordError(confirmPasswordErrror)
      setPincodeError(pincodeError);
      if (termsError) {
        Toast.show('Agree Terms & Conditions');
      }
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>

          {/* Top Con Img  */}
          <ImageBackground
            source={require('../../assets/images/BG1.png')}
            style={styles.topImageCon}
          >
            <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
              {showIcon('back', colours.kapraWhite, windowWidth*(5/100))}
            </TouchableOpacity>
          </ImageBackground>

          {/* Input Con  */}
          <View style={styles.contentCon}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={styles.logoImg}
            />
            <Text style={styles.fontStyle1}>Register</Text>
            <Text style={styles.fontStyle2}>Please register to continue</Text>
            <Text/>
            <Text/>
            <Text/>
            <LoginTextInput
              OnChangeText={(text) => {
                setName(text);
                setNameError(false);
              }}
              Width={90}
              Title={'Name'}
              Placeholder={"Enter Your Name"}
              value={name}
              Error={NameError}
              ErrorText={NameErrorMessage}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                handlemail(text)
              }}
              Width={90}
              Title={'Email ID'}
              Placeholder={"Enter Email ID"}
              value={email}
              Error={EmailError}
              ErrorText={EmailErrorMessage}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                handlePhone(text)
              }}
              Width={90}
              Title={'Phone Number'}
              Placeholder={"Enter Phone Number"}
              value={phone}
              Error={PhoneError}
              ErrorText={PhoneErrorMessage}
              PhoneCode
              Length={10}
              KeyboardType={'numeric'}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                setPassword(text);
                if (text.length <= 5) {
                  setPasswordErrorMessage('*Minimum 6 characters required');
                  setPasswordError(true);
                } else {
                  setPasswordError(false);
                }
              }}
              secureEntry
              Width={90}
              Title={'Password'}
              Placeholder={"Enter Password"}
              value={password}
              Error={PasswordError}
              ErrorText={PasswordErrorMessage}
              Height={12}
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
              Title={'Confirm Password'}
              Placeholder={"Enter Confirm Password"}
              value={confirmPassword}
              Error={confirmPasswordError}
              ErrorText={confirmPasswordErrorMessage}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                handlePostcode(text);
              }}
              Width={90}
              Title={'Postcode'}
              Placeholder={"Enter Postcode"}
              value={pincode}
              Error={PincodeError}
              ErrorText={PincodeErrorMessage}
              Length={6}
              KeyboardType={'numeric'}
              Height={12}
            />
            {
              pincodeList&&pincodeList.length>0&&(
                <View>
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
                    style={{width: windowWidth*(90/100), height: windowHeight*(6/100),  marginBottom:20, borderRadius:5, backgroundColor: colours.kapraWhiteLow, borderColor: colours.kapraWhiteLow   }}
                    dropDownContainerStyle={{width: windowWidth*(90/100), borderColor: colours.primaryWhite, color:colours.kapraBlackLight,}}
                    labelStyle={{fontFamily:'Lexend-Regular', fontSize: getFontontSize(15), color: colours.kapraBlackLight}}
                    textStyle={{fontFamily:'Lexend-Regular', fontSize: getFontontSize(15), color: colours.kapraBlack}}
                    placeholderStyle={{fontFamily:'Lexend-Regular', fontSize: getFontontSize(15), color: colours.kapraBlack}}
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
              FirstColor={colours.kapraOrange}
              SecondColor={colours.kapraOrangeDark}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.fontStyle2}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.fontStyle3}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: '4%',
    resizeMode: 'contain',
    marginTop: '4%',
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


  fontStyle1: {
    fontFamily: 'Lexend-Medium',
    color: colours.kapraBlack,
    fontSize: getFontontSize(25),
  },
  fontStyle2: {
    fontFamily: 'Lexend-Light',
    color: colours.primaryGrey,
    fontSize: getFontontSize(12),
  },
  forgotPasswordText: {
    fontFamily: 'Lexend-Regular',
    color: colours.kapraOrange,
    fontSize: getFontontSize(12),
  },
  fontStyle3: {
    fontFamily: 'Lexend-SemiBold',
    color: colours.kapraOrange,
    fontSize: getFontontSize(14),
  },


  RadioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colours.kapraOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  checkedButton: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colours.kapraOrangeDark,
  },
  
  
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
