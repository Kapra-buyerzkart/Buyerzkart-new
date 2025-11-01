import React from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-simple-toast';

import AuthButton from '../components/AuthButton';
import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import { checkUser, getProfile } from '../api';
import LoginTextInput from '../components/LoginTextInput';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroEditProfileScreen({ navigation  }) {
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { GroEditProfile, profile } = React.useContext(AppContext);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [changeBackground, SetChangeBackground] = React.useState(null);

  const [NameError, setNameError] = React.useState(false);
  const [EmailError, setEmailError] = React.useState(false);
  const [PhoneError, setPhoneError] = React.useState(false);

  const [NameErrorMessage, setNameErrorMessage] = React.useState('');
  const [EmailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');

  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let res = await getProfile();
      SetChangeBackground([]);
      setName(res.custName);
      setEmail(res.emailId);
      setPhone(res.phoneNo);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  const _formValidate = async () => {
    const EmailError = email === '';
    const PhoneError = phone === '';
    const NameError = name === '';
    if (!PhoneError) {
      if (phone.length !== 10) {
        setPhoneErrorMessage('Enter A Valid Mobile Number');
        setPhoneError(true);
      }
    } else {
      setPhoneErrorMessage('Required');
      setPhoneError(true);
    }
    if (!(EmailError || PhoneError || NameError || phone.length !== 10)) {
      let flag1 = false;
      let flag2 = false;
      try {
        if (profile.emailId !== email) {
          try {
            let emailRes = await checkUser(email);
            if (emailRes) {
              setEmailError(true);
              setEmailErrorMessage('Email ID Already In Use');
              flag1 = true;
            }
          } catch (error) {
            setEmailError(true);
            setEmailErrorMessage('Email ID Already In Use');
            flag1 = true;
          }
        }
        if (profile.phoneNo !== phone) {
          try {
            let phoneRes = await checkUser(phone);
            if (phoneRes) {
              setPhoneErrorMessage('Phone Number Already In Use');
              setPhoneError(true);
              flag2 = true;
            }
          } catch (error) {
            setPhoneError(true);
            setPhoneErrorMessage('Phone Number Already In Use');
            flag2 = true;
          }
        }
      } catch (err) {
        // Toast.show(err);
      }
      if (!(flag1) && !(flag2)) {

        if (
          profile.emailId !== email ||
          profile.phoneNo !== phone ||
          profile.custName !== name
        ) {
          _updateProfile();
        } else {
          Toast.show('Details Are Not Changed');
        }
      }
    } else {
      setEmailErrorMessage('Required');
      setNameErrorMessage('Required');
      setEmailError(EmailError);
      setNameError(NameError);
    }
  };

  const _updateProfile = async () => {
    try {
      showLoader(true);
      let res = await GroEditProfile(email, phone, name);
      Toast.show('Profile Updated Successfully');
      showLoader(false);
      navigation.goBack();
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  const handlemail = async (text) => {
    setEmail(text), setEmailError(false);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!text.match(mailformat)) {
      setEmailErrorMessage('Enter Valid Mail ID');
      setEmailError(true);
    } else {
      try {
        //await checkUser(text);
        let response = await checkUser(text);
        if (response) {
          setEmailError(true);
          setEmailErrorMessage('Email ID Already In Use');
        }
      } catch (error) {
        setEmailError(true);
        setEmailErrorMessage('Email ID Already InUse');
      }
    }
  };

  const _handlePhone = async (text) => {
    setPhone(text);
    setPhoneError(false);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!text.match(phoneno)) {
      setPhoneErrorMessage('Enter A Valid Mobile Number');
      setPhoneError(true);
    } else {
      try {
        // await checkUser(text);
        let res = await checkUser(text);
        if (res) {
          setPhoneErrorMessage('Mobile Number Already Exists');
          setPhoneError(true);
        }
      } catch (error) {
        setPhoneErrorMessage('Mobile Number Already Exists');
        setPhoneError(true);
      }
    }
  };

  if (changeBackground === null) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.mainContainer}>

        {/* Header Con  */}
        <View style={styles.headerCon}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        {/* Input Con  */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <LoginTextInput
              OnChangeText={(text) => {
                setName(text);
                setNameError(false);
              }}
              Width={90}
              Title={'Name'}
              Placeholder={'Enter Name'}
              value={name}
              Error={NameError}
              ErrorText={NameErrorMessage}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={handlemail}
              Width={90}
              Title={'Email ID'}
              Placeholder={'Enter Email ID'}
              value={email}
              Error={EmailError}
              ErrorText={EmailErrorMessage}
              Height={12}
            />
            <LoginTextInput
              OnChangeText={_handlePhone}
              Width={90}
              Title={'Mobile'}
              Placeholder={'Enter Mobile Number'}
              value={phone}
              Error={PhoneError}
              ErrorText={PhoneErrorMessage}
              Height={12}
              PhoneCode
            />
            <View style={{ marginBottom: '6%', marginTop: '5%' }}></View>
            <AuthButton
              FirstColor={colours.kapraOrangeDark}
              SecondColor={colours.kapraOrange}
              OnPress={() => _formValidate()}
              ButtonText={'Update'}
              ButtonWidth={90}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.kapraWhite,
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
});
