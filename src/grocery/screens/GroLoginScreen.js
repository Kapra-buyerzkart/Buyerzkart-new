import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground
} from 'react-native';
import Toast from 'react-native-simple-toast';

import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import { AppContext } from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import { getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroLoginScreen({ navigation, route }) {
  const { GroLogin } = React.useContext(AppContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const handleLogin = async () => {
    const EmailError = email === '';
    const PasswordError = password === '';
    if (!(EmailError || PasswordError)) {
      let data = {
        userName: email,
        password,
      };
      try {
        showLoader(true);
        let reg = await GroLogin(data);
        // console.log('regggg', reg)
        Toast.show(reg);
        if (route?.params?.fromCart) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'GroHomeScreen' }, { name: 'GroCartScreen' }],
          });
        }
        else if (route?.params?.fromProd) {
          navigation.goBack();
        }
        else navigation.reset({
          index: 0,
          routes: [{ name: 'GroHomeScreen' }],
        });
        showLoader(false);
      } catch (error) {
        if (error.status == 401) {
          Toast.show(error.Message);
        }
        else if (error === "StatusCode:404, Please Reset Your Password") {
          Toast.show(error);
          // navigation.navigate('ExistingUserPasswordReset');
        } else Toast.show(error);
        showLoader(false);
      }
    } else {
      setEmailError(EmailError);
      setPasswordError(PasswordError);
      setEmailErrorMessage("Required*");
      setPasswordErrorMessage("Required*");
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require('../../assets/images/BG1.png')}
            style={styles.topImageCon}
          >
            <TouchableOpacity style={styles.backButtonCon} onPress={() => navigation.goBack()}>
              {showIcon('back', colours.kapraWhite, windowWidth * (5 / 100))}
            </TouchableOpacity>
          </ImageBackground>
          <View style={styles.contentCon}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={styles.logoImg}
            />
            <Text style={styles.fontStyle1}>Login</Text>
            <Text style={styles.fontStyle2}>Please Login to continue</Text>
            <Text />
            <Text />
            <Text />
            <LoginTextInput
              OnChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
              }}
              Width={90}
              Title={'Phone Number / Email'}
              Placeholder={"Enter Phone Number / Email"}
              value={email}
              Error={emailError}
              ErrorText={emailErrorMessage}
              PhoneCode={email == '' ? null : isNaN(email.charAt(0)) ? false : true}
              Length={email == '' ? 100 : isNaN(email.charAt(0)) ? 100 : 10}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                setPassword(text);
                setPasswordError(false);
              }}
              Width={90}
              Title={'Password'}
              Placeholder={"Enter Password"}
              value={password}
              Error={passwordError}
              ErrorText={passwordErrorMessage}
              Height={12}
              secureEntry
            />
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate('GroForgotPasswordScreen')}>
              <Text style={[styles.forgotPasswordText, { textDecorationLine: 'underline', textDecorationStyle: 'solid', textAlign: 'right', width: windowWidth * (90 / 100) }]}>Forgot Password ?</Text>
            </TouchableOpacity>
            <AuthButton
              OnPress={handleLogin}
              FirstColor={colours.kapraOrange}
              SecondColor={colours.kapraOrangeDark}
              ButtonText={'Login'}
              ButtonWidth={88}
            />
            <Text />
            <Text />
            <Text />
            <View style={styles.registerContainer}>
              <Text style={styles.fontStyle2}>New to Kapra Daily?   </Text>
              <TouchableOpacity onPress={() => navigation.navigate('GroRegisterScreen')}>
                <Text style={styles.fontStyle3}>Register Now</Text>
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
    height: windowWidth * (50 / 100),
    resizeMode: 'cover'
  },
  contentCon: {
    alignItems: 'center',
    top: -windowWidth * (15 / 100),
    width: windowWidth,
    height: windowHeight * (80 / 100),
    borderTopLeftRadius: windowWidth * (15 / 100),
    borderTopRightRadius: windowWidth * (15 / 100),
    backgroundColor: colours.kapraWhite,
  },
  logoImg: {
    height: windowWidth * (25 / 100),
    width: windowWidth * (35 / 100),
    marginBottom: '8%',
    resizeMode: 'contain',
    marginTop: '8%',
  },
  registerContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '2%',
  },
  backButtonCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (10 / 100),
    marginLeft: windowWidth * (5 / 100),
    marginTop: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
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
});
