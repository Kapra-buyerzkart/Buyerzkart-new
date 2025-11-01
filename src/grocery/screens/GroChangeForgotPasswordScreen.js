import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import { changePassword, forgotPasswordReset } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import { getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';
import LoginTextInput from '../components/LoginTextInput';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroChangeForgotPasswordScreen({ navigation, route }) {

  
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [conPasswordError, setConPasswordError] = React.useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState(
    false,
  );
  const [conPasswordErrorMessage, setConPasswordErrorMessage] = React.useState(
    false,
  );
  const { showLoader, loading } = React.useContext(LoaderContext);

  const oldPasswordHandler = (textEnterd) => {
    setOldPassword(textEnterd);
  };

  const newPasswordHandler = (textEnterd) => {
    setNewPassword(textEnterd);
    setNewPasswordError(false);
    if (textEnterd.length < 6) {
      setNewPasswordErrorMessage('Minimum 6 Characters Required');
      setNewPasswordError(true);
    }
  };

  const confirmPasswordHandler = (textEnterd) => {
    setConfirmPassword(textEnterd);
    setConPasswordError(false);
    if (textEnterd !== newPassword) {
      setConPasswordErrorMessage('Confirm password mismatch');
      setConPasswordError(true);
    }
  };

  const formHandler = async () => {
    let OldPasswordError = oldPassword === null;
    let NewPasswordError = newPassword === null;
    let ConfirmPasswordError = confirmPassword === null;

    if (!(OldPasswordError || NewPasswordError || ConfirmPasswordError)) {
      _changePassword();
    }
  };

  const _changePassword = async () => {
    if (newPassword.length < 6) {
      setNewPasswordErrorMessage(
        'Minimum 6 Characters Required',
      );
      setNewPasswordError(true);
    } else if (confirmPassword !== newPassword) {
      setConPasswordErrorMessage('Please Enter Confirm Password');
      setConPasswordError(true);
    } else {
      if (route?.params?.url) {
        try {
          // showLoader(true);
          await forgotPasswordReset(newPassword, route?.params?.url?.otpUrlKey);
          Toast.show('Password Changed Successfully');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          showLoader(false);
          navigation.navigate('GroLoginScreen');
        } catch (err) {
          showLoader(false);
          Toast.show(err?err:'Something went wrong');
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainConatiner}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Reset Password</Text>
      </View>
      
      {/* Value Input  */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/icons/lock.png')}
              style={{
                width: windowWidth * (30 / 100),
                height: windowWidth * (30 / 100),
              }}
            />
          </View>
          <LoginTextInput
            OnChangeText={(text) => newPasswordHandler(text)}
            Width={90}
            Title={'New Password'}
            Placeholder={'Enter New Password'}
            value={newPassword}
            Error={newPasswordError}
            ErrorText={newPasswordErrorMessage}
            Height={12}
          />
          <LoginTextInput
            OnChangeText={(text) => confirmPasswordHandler(text)}
            Width={90}
            Title={'Confirm Password'}
            Placeholder={'Enter Confirm Password'}
            value={confirmPassword}
            Error={conPasswordError}
            ErrorText={conPasswordErrorMessage}
            Height={12}
          />
          <View style={{ marginTop: '3%' }}>
            <AuthButton
              FirstColor={colours.kapraOrange}
              SecondColor={colours.kapraOrangeDark}
              OnPress={formHandler}
              ButtonText={'Reset Password'}
              ButtonWidth={90}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainConatiner: {
    backgroundColor: colours.primaryWhite,
    flex: 1,
    alignItems: 'center',
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingHorizontal: windowWidth*(5/100)
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },



  // Font style
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },





  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: windowWidth * (80 / 100),
    paddingBottom: '3%',
  },
});
