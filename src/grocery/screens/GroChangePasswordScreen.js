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
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-simple-toast';


import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import { changePassword, forgotPasswordReset } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import showIcon from '../../globals/icons';
import { getFontontSize } from '../globals/GroFunctions';
import LoginTextInput from '../components/LoginTextInput';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroChangePasswordScreen({ navigation, route }) {

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [oldPasswordError, setOldPasswordError] = React.useState(false);
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [conPasswordError, setConPasswordError] = React.useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState(false);
  const [conPasswordErrorMessage, setConPasswordErrorMessage] = React.useState(false);
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = React.useState(false);
  const { showLoader, loading } = React.useContext(LoaderContext);

  const oldPasswordHandler = (textEnterd) => {
    setOldPassword(textEnterd);
    setOldPasswordError(false);
  };

  const newPasswordHandler = (textEnterd) => {
    setNewPassword(textEnterd);
    setNewPasswordError(false);
    if (textEnterd.length < 6) {
      setNewPasswordErrorMessage(
        'Minimum 6 Characters Required',
      );
      setNewPasswordError(true);
    } else if (oldPassword === textEnterd) {
      setNewPasswordErrorMessage(`Can't Use Current Password`);
      setNewPasswordError(true);
    }
  };

  const confirmPasswordHandler = (textEnterd) => {
    setConfirmPassword(textEnterd);
    setConPasswordError(false);
    if (textEnterd !== newPassword) {
      setConPasswordErrorMessage('Password Does not Match');
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
    if (oldPassword === '') {
      setOldPasswordErrorMessage('Required');
      setOldPasswordError(true);
    } else if (newPassword.length < 6) {
      setNewPasswordErrorMessage(
        'Minimum 6 Characters Required',
      );
      setNewPasswordError(true);
    } else if (oldPassword === newPassword) {
      setNewPasswordErrorMessage(`Can't Use Current Password`);
      setNewPasswordError(true);
    } else if (confirmPassword !== newPassword) {
      setConPasswordErrorMessage('Password Does not Match');
      setConPasswordError(true);
    } else {
      if (route?.params?.url) {
        try {
          showLoader(true);
          let res = await forgotPasswordReset(newPassword, route?.params?.url);
          if (res) {
            Toast.show('Password Changed Successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showLoader(false);
          }
        } catch (err) {
          showLoader(false);
          Toast.show(err);
        }
      } else {
        try {
          showLoader(true);
          let res = await changePassword(oldPassword, newPassword);
          if (res) {
            Toast.show('Password Changed Successfully');
            navigation.goBack();
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
          showLoader(false);
        } catch (err) {
          showLoader(false);
          Toast.show(err);
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
        <Text style={styles.headerText}>Change Password</Text>
      </View>
      
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
                tintColor: colours.kapraMain
              }}
              
            />
          </View>
          <LoginTextInput
            OnChangeText={oldPasswordHandler}
            Width={90}
            Title={'Old Password'}
            Placeholder={'Enter Old Password'}
            value={oldPassword}
            Error={oldPasswordError}
            ErrorText={oldPasswordErrorMessage}
            Height={12}
          />
          <LoginTextInput
            OnChangeText={newPasswordHandler}
            Width={90}
            Title={'New Password'}
            Placeholder={'Enter New Password'}
            value={newPassword}
            Error={newPasswordError}
            ErrorText={newPasswordErrorMessage}
            Height={12}
          />
          <LoginTextInput
            OnChangeText={confirmPasswordHandler}
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
              FirstColor={colours.kapraMain}
              SecondColor={colours.kapraLight}
              OnPress={formHandler}
              ButtonText={'Change Password'}
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
