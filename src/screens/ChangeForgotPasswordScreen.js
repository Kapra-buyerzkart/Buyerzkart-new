import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import Header from '../components/Header';
import AuthTextField from '../components/AuthTextField';
import colours from '../globals/colours';
import AuthButton from '../components/AuthButton';
import { changePassword, forgotPasswordReset } from '../api';
import Toast from 'react-native-simple-toast';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
export default function ChangeForgotPasswordScreen({ navigation, route }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
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
      setConPasswordErrorMessage('Please Enter Confirm Password');
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
          showLoader(true);
          await forgotPasswordReset(newPassword, route?.params?.url.otpUrlKey);
          Toast.show('Password Changed Successfully');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          showLoader(false);
          navigation.navigate('Login');
        } catch (err) {
          showLoader(false);
          Toast.show(err);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainConatiner}>
      <Header
        navigation={navigation}
        HeaderText={'Reset Password'}
        backEnable
        Cart
        WishList
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/icons/lock.png')}
              style={{
                width: windowWidth * (30 / 100),
                height: windowWidth * (30 / 100),
              }}
            />
          </View>
          <AuthTextField
            Placeholder={'New Password'}
            BackgroundColor={colours.primaryWhite}
            TextColor={colours.primaryBlack}
            SecureText
            Border={colours.primaryGrey}
            OnChangeText={newPasswordHandler}
            Value={newPassword}
            Error={newPasswordError}
            ErrorText={newPasswordErrorMessage}
          />
          <AuthTextField
            Placeholder={'Confirm Password'}
            BackgroundColor={colours.primaryWhite}
            TextColor={colours.primaryBlack}
            SecureText
            Border={colours.primaryGrey}
            OnChangeText={confirmPasswordHandler}
            Value={confirmPassword}
            Error={conPasswordError}
            ErrorText={conPasswordErrorMessage}
          />
          <View style={{ marginTop: '3%' }}>
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={formHandler}
              ButtonText={'Reset Password'}
              ButtonWidth={78}
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
