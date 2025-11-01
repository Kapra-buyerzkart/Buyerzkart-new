import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';

import showIcon from '../globals/icons';
import ShadowTextInput from '../components/ShadowTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import Header from '../components/Header';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import { checkUser, getProfile, updateProfile } from '../api';
import HeaderTextField from '../components/HeaderTextField';
import Toast from 'react-native-simple-toast';


const windowWidth = Dimensions.get('window').width;

export default function EditProfileScreen({ navigation }) {
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { editProfile, profile } = React.useContext(AppContext);
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
        setPhoneErrorMessage('Enter A Valid Mobile Numbe');
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
      let res = await editProfile(email, phone, name);
      Toast.show('Profile Updated Successfull');
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
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'Edit Profile'}
          Cart
          WishList
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* <Text>{showIcon('profile', colours.black, windowWidth * (50 / 100))}</Text> */}
            <HeaderTextField
              HeaderText={'User Name'}
              OnChangeText={(text) => {
                setName(text);
                setNameError(false);
              }}
              Error={NameError}
              value={name}
              errtxt={NameErrorMessage}
            />
            <HeaderTextField
              HeaderText={'Email ID'}
              OnChangeText={handlemail}
              // OnChangeText={(text) => {
              //   setEmail(text), setEmailError(false);
              // }}
              Error={EmailError}
              value={email}
              errtxt={EmailErrorMessage}
            />
            <HeaderTextField
              HeaderText={'Mobile'}
              OnChangeText={_handlePhone}
              Error={PhoneError}
              value={phone}
              errtxt={PhoneErrorMessage}
              PhoneNo={true}
            />
            <View style={{ marginBottom: '6%', marginTop: '5%' }}></View>
            <AuthButton
              BackgroundColor={colours.kapraMain}
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
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.primaryWhite,
  },
  fontStyle1: {
    fontWeight: '500',
    color: colours.primaryBlack,
    fontSize: 40,
    marginBottom: '10%',
  },
});
