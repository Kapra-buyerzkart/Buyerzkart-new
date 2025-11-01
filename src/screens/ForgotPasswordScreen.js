/* eslint-disable react-native/no-inline-styles */
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
  KeyboardAvoidingView
} from 'react-native';

import { LoaderContext } from '../Context/loaderContext';
import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { forgotPassword } from '../api';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import showIcon from '../globals/icons';
import Header from '../components/Header';
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').width;
export default function LoginScreen({ navigation }) {
  const [data, setData] = React.useState('');
  const [DataError, setDataError] = React.useState(false);
  const [DataErrorMessage, setDataErrorMessage] = React.useState('');
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const handleSubmit = async () => {
    const dataError = data === '';
    if (!dataError) {
      let flag = data.includes('@');
      try {
        let url;
        showLoader(true);
        if (flag) {
          url = await forgotPassword('', data);
        } else {
          url = await forgotPassword(data, '');
        }
        navigation.navigate('OTP', {
          type: 'forgot',
          otpUrlKey: url,
        });
        showLoader(false);
      } catch (error) {
        showLoader(false);
        Toast.show(error);
      }
    } else {
      setDataErrorMessage('Required');
      setDataError(dataError);
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <Header navigation={navigation} backEnable LightMode/>
          <Image
            source={require('../assets/images/Forgot.png')}
            style={{
              height: windowWidth * (40 / 100),
              width: windowWidth ,
              marginBottom: '20%',
              marginTop: '5%',
              resizeMode: 'contain',
            }}
          />
          <View style={styles.innerContainer}>
            <Text style={styles.fontStyle4}>Forgot Password!</Text>
            <Text style={[styles.fontStyle2,{width: windowWidth * (88 / 100),}]}>Don't worry it happens!</Text>
            <Text/>

            <LoginTextInput
              OnChangeText={(txt) => {
                setData(txt);
                setDataError(false);
              }}
              Width={90}
              Placeholder={"Enter Phone Number / Email"}
              value={data}
              Error={DataError}
              ErrorText={DataErrorMessage}
              // PhoneCode={data ==''?null: isNaN(data.charAt(0))?false:true}
              // Length={data ==''?100: isNaN(data.charAt(0))?100:10}
              // KeyboardType={data ==''?'default': isNaN(data.charAt(0))?'default':'numeric'}
              Height={windowWidth * (14 / 100)}
            />

            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={handleSubmit}
              ButtonText={'Send OTP'}
              ButtonWidth={88}
              Icon={'lightning'}
            />
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.fontStyle2}>{'Already Have An Account'} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.fontStyle3}>{'Login'}</Text>
            </TouchableOpacity>
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
    paddingTop: '5%',
    alignItems: 'center',
  },
  forgotButton: {
    paddingBottom: '12%',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.kapraLight,
    width: windowWidth * (88 / 100),
    paddingBottom: '10%',
  },
  loginContainer: {
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '8%',
    width: windowWidth,
    justifyContent: 'center'
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
    fontSize: 12,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlack,
    fontSize: getFontontSize(25),
    width: windowWidth * (88 / 100),
    textAlign: 'left',
    paddingBottom: '3%',
  },
  socialLogin: {
    flexDirection: 'row',
    width: windowWidth * (88 / 100),
    justifyContent: 'space-between',
  },
  languageContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowWidth * (10 / 100),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});
