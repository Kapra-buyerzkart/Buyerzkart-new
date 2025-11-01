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
  KeyboardAvoidingView,
  ImageBackground,
  Platform
} from 'react-native';
import Toast from 'react-native-simple-toast';

import { LoaderContext } from '../../Context/loaderContext';
import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import { forgotPassword } from '../api';
import { getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroForgotPasswordScreen({ navigation }) {

  const [data, setData] = React.useState('');
  const [DataError, setDataError] = React.useState(false);
  const [DataErrorMessage, setDataErrorMessage] = React.useState('');
  const { showLoader, loading } = React.useContext(LoaderContext);

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
        navigation.navigate('GroEnterOTPScreen', {
          type: 'forgot',
          otpUrlKey: url,
        });
        showLoader(false);
      } catch (error) {
        showLoader(false);
        Toast.show(error);
      }
    } else {
      setDataErrorMessage('*Required');
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
              <Text style={styles.fontStyle1}>Forgot Password!</Text>
              <Text style={styles.fontStyle2}>Don't worry it happens!</Text>
              <Text/>
              <Text/>
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
                PhoneCode={data ==''?null: isNaN(data.charAt(0))?false:true}
                Length={data ==''?100: isNaN(data.charAt(0))?100:10}
                Height={12}
              />

              <AuthButton
                FirstColor={colours.kapraOrange}
                SecondColor={colours.kapraOrangeDark}
                OnPress={handleSubmit}
                ButtonText={'Send OTP'}
                ButtonWidth={88}
                Icon={'lightning'}
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
    height: windowHeight*(80/100),
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
  loginContainer: {
    height: windowHeight*(8/100),
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
