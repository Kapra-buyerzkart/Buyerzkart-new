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
  KeyboardAvoidingView
} from 'react-native';

import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import Toast from 'react-native-simple-toast';
import showIcon from '../globals/icons';
import { getFontontSize } from '../globals/functions';
import Header from '../components/Header';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LoginScreen({ navigation, route }) {
  const { login } = React.useContext(AppContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

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
        let reg = await login(data);
        Toast.show(reg);
        if (route?.params?.fromCart) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'DrawerNavigator' }, { name: 'Cart' }],
          });
        } 
        else if (route?.params?.fromProd) {
          navigation.goBack();
        }
        else 
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerNavigator' }],
        });
        showLoader(false);
      } catch (error) {
        if (error.status == 401) {
          Toast.show(error.Message);
        }
        else if (error === "StatusCode:404, Please Reset Your Password") {
          Toast.show(error);
          navigation.navigate('ExistingUserPasswordReset');
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
    <Header navigation={navigation} backEnable Logo LightMode />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom:100 }}
          showsVerticalScrollIndicator={false}>
          <Image
            source={require('../assets/images/Cycle.png')}
            style={{
              height: windowWidth * (40 / 100),
              width: windowWidth * (90 / 100),
              marginBottom: '8%',
              resizeMode: 'contain',
              marginTop: '5%',
            }}
          />
          <Text/>
          <Text style={[styles.fontStyle1, { fontSize: getFontontSize(25), color: colours.primaryBlack }]}>Login</Text>
          <Text style={styles.fontStyle2}>Please Login to continue</Text>
          <Text/>
          <View style={styles.innerContainer}>
            <LoginTextInput
              OnChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
              }}
              Width={90}
              Placeholder={"Enter Phone Number / Email"}
              value={email}
              Error={emailError}
              ErrorText={emailErrorMessage}
              PhoneCode={email ==''?null: isNaN(email.charAt(0))?false:true}
              Length={email ==''?100: isNaN(email.charAt(0))?100:10}
              // KeyboardType={email ==''?'default': isNaN(email.charAt(0))?'default':'numeric'}
              Height={windowWidth * (14 / 100)}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                setPassword(text);
                setPasswordError(false);
              }}
              Width={90}
              Placeholder={"Enter Password"}
              value={password}
              Error={passwordError}
              ErrorText={passwordErrorMessage}
              Height={windowWidth * (14 / 100)}
              secureEntry
            />
            <View style={{ paddingTop: '3%' }}></View>
            <AuthButton
              OnPress={handleLogin}
              FirstColor={colours.kapraMain}
              SecondColor={colours.kapraMain}
              ButtonText={'Login'}
              ButtonWidth={88}
            />
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[styles.fontStyle1,{textDecorationLine: 'underline', textDecorationStyle: 'solid', textAlign:'right', width:windowWidth*(85/100)}]}>Forgot Password ?</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.fontStyle2}>New to Kapra Daily?   </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.fontStyle3}>Sign Up</Text>
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
    backgroundColor: colours.kapraLow,
  },
  innerContainer: {
    alignItems: 'center',
  },
  forgotButton: {
    paddingBottom: '12%',
    paddingTop: '3%',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.kapraMain,
    fontSize: getFontontSize(15),
  },
  registerContainer: {
    alignItems:'flex-end',
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '2%',
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.primaryGrey,
    fontSize: getFontontSize(12),
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.kapraMain,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: getFontontSize(14),
  },
  languageContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowWidth * (10 / 100),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});
