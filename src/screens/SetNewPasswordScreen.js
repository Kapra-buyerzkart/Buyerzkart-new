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
} from 'react-native';

import HeaderTextField from '../components/HeaderTextField';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
const windowWidth = Dimensions.get('window').width;
export default function SetNewPasswordScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [terms, setTerms] = React.useState(false);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Image
        source={require('../assets/logo/logo.png')}
        style={{
          height: windowWidth * (20 / 100),
          width: windowWidth * (60 / 100),
          marginBottom: '15%',
          resizeMode: 'contain',
        }}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.fontStyle1}>
          Forgot passwor? Reset your password here..
        </Text>

        <HeaderTextField
          HeaderText={'Enter OTP'}
          OnChangeText={() => null}
        />
        <HeaderTextField
          HeaderText={'NEW PASSWORD*'}
          OnChangeText={() => null}
          SecureEntry={true}
        />
        <HeaderTextField
          HeaderText={'CONFIRM PASSWORD*'}
          OnChangeText={() => null}
          SecureEntry={true}
        />

        <AuthButton
          BackgroundColor={colours.kapraMain}
          OnPress={() => navigation.navigate('DrawerNavigator')}
          ButtonText={'SET NEW PASSWORD'}
          ButtonWidth={88}
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.fontStyle2}>Already have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.fontStyle3}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.authScreens.background,
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
    color: colours.headerTextInput,
    width: windowWidth * (88 / 100),
    paddingBottom: '6%',
  },
  loginContainer: {
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '2%',
    bottom: 0,
    position: 'absolute',
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.grey,
    fontSize: 12,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    color: colours.secondaryPink,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 12,
  },
});
