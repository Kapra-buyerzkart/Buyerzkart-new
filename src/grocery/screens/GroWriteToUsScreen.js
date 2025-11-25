import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import Toast from 'react-native-simple-toast';

import Header from '../components/Header';
import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import LoginTextInput from '../components/LoginTextInput';
import ShadowTextInput from '../components/ShadowTextInput';
import MultilineShadowTextInput from '../components/MultilineShadowTextInput';
import { writeToUs } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import showIcon from '../../globals/icons';
import { getFontontSize } from '../globals/GroFunctions';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroWriteToUsScreen = ({ navigation }) => {

  const { showLoader } = React.useContext(LoaderContext);
  const [isSelected, setSelection] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');

  const [emailError, setEmailError] = React.useState(false);
  const [phoneError, setPhoneError] = React.useState(false);
  const [titleError, setTitleError] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);

  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [titleErrorMessage, setTitleErrorMessage] = React.useState('');
  const [messageErrorMessage, setMessageErrorMessage] = React.useState('');
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const _formValidate = () => {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const EmailError = email === '';
    const PhoneError = phone === '';
    const TitleError = title === '';
    const MessageError = message === '';
    const emailTypeError = !email.match(mailformat);
    const phoneTypeError = !phone.match(phoneno);

    setEmailError(EmailError);
    setPhoneError(PhoneError);
    setTitleError(TitleError);
    setMessageError(MessageError);

    if (!EmailError) {
      if (!email.match(mailformat)) {
        setEmailErrorMessage('Enter Valid Mail ID');
        setEmailError(true);
      }
    } else if (EmailError) {
      setEmailErrorMessage('Required');
      setEmailError(true);
    }

    if (!PhoneError) {
      if (!phone.match(phoneno)) {
        setPhoneErrorMessage('Enter A Valid Mobile Number');
        setPhoneError(true);
      }
    } else if (PhoneError) {
      setPhoneErrorMessage('Required');
      setPhoneError(true);
    }

    if (
      !(
        EmailError ||
        PhoneError ||
        TitleError ||
        MessageError ||
        emailTypeError ||
        phoneTypeError
      )
    ) {
      if (!isSelected) {
        _writeToUs();
      } else {
        _writeToUs();
      }
    }
  };

  const _writeToUs = async () => {
    try {
      showLoader(true);
      let res = await writeToUs(email, phone, title, message);
      Toast.show('New Support Request Added');
      showLoader(false);
      setSelection(false);
      setEmail('');
      setPhone('');
      setTitle('');
      setMessage('');
    } catch (err) {
      Toast.show(err);
    }
  };

  const handlemail = async (text) => {
    setEmail(text), setEmailError(false);
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!text.match(mailformat)) {
      setEmailErrorMessage('Enter Valid Mail ID');
      setEmailError(true);
    }
  };

  const handlePhone = async (text) => {
    setPhone(text);
    setPhoneError(false);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!text.match(phoneno)) {
      setPhoneErrorMessage('Enter A Valid Mobile Number');
      setPhoneError(true);
    }
  };

  return (
    <SafeAreaView style={styles.mainConatiner}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Support</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            width: windowWidth,
          }}>
          <View style={{ alignItems: 'center',  paddingBottom: windowHeight * (10 / 100) }}>
            <View style={styles.addressContainer}>
              <View>
                <Text style={styles.fontStyle1}>
                  HEAD OFFICE:
                </Text>
                <Text style={styles.fontStyle3}>
                Kapra Buyerzkart Digital Commerce Pvt. Ltd
                </Text>
                <Text style={styles.fontStyle3}>
                2nd floor, Nandhanam Tower
                </Text>
                <Text style={styles.fontStyle3}>
                kaniyappilly road
                </Text>
                <Text style={styles.fontStyle3}>
                Chakkaraparambu, Ernakulam
                </Text>
                <Text style={styles.fontStyle3}>
                Kerala 682028
                </Text>
                <Text style={[styles.fontStyle3, { color: colours.kapraMain }]}>
                customerservice@kapradaily.com
                </Text>
                <Text style={[styles.fontStyle3, { color: colours.reviewBoxRed }]}>
                  +91-9539701110
                </Text>
              </View>
              <View style={{ justifyContent: 'space-evenly' }}>
                <TouchableOpacity 
                  onPress={() => Linking.openURL(`tel:${9539701110}`)} 
                  style={{ height: windowHeight * (6 / 100) }}
                >
                  <Text>{showIcon('call', colours.kapraOrange, windowWidth * (7 / 100))}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => Linking.openURL('mailto:customerservice@kapradaily.com')} 
                  style={{ height: windowHeight * (6 / 100) }}
                >
                  <Text>{showIcon('mail', colours.kapraOrange, windowWidth * (7 / 100))}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => Linking.openURL('whatsapp://send?text=Hi Kapra Daily..&phone=+919539701110')} 
                  style={{ height: windowHeight * (6 / 100) }}
                >
                  <Text>{showIcon('whatsapp', colours.kapraOrange, windowWidth * (8 / 100))}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text/>
            <LoginTextInput
              value={email}
              Width={90}
              Height={12}
              Title={'Email ID'}
              Placeholder={'Enter Email ID'}
              OnChangeText={handlemail}
              Error={emailError}
              ErrorText={emailErrorMessage}
            />
            <LoginTextInput
              value={phone}
              Width={90}
              Height={12}
              Title={'Phone Number'}
              Placeholder={'Phone' + '+91'}
              OnChangeText={handlePhone}
              Error={phoneError}
              ErrorText={phoneErrorMessage}
            />
            <LoginTextInput
              value={title}
              Width={90}
              Height={12}
              Title={'Title'}
              Placeholder={'Enter Title'}
              OnChangeText={(text) => {
                setTitleError(false);
                setTitle(text);
              }}
              Error={titleError}
              ErrorText={titleErrorMessage}
            />
            <MultilineShadowTextInput
                value={message}
                Width={90}
                Title={'Message'}
                Placeholder={'Enter Your Message'}
                Height={150}
                OnChangeText={(text) => {
                    setMessageError(false);
                    setMessage(text);
                }}
                top
                Error={messageError}
                ErrorText={messageErrorMessage}
            />
            {/* <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={isSelected}
                onValueChange={(newValue) => setSelection(newValue)}
              />
              <Text style={styles.label}>AGREE</Text>
            </View> */}
            <AuthButton
              FirstColor={colours.kapraOrangeDark}
              SecondColor={colours.kapraOrange}
              OnPress={_formValidate}
              ButtonText={'Send Message'}
              ButtonWidth={90}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GroWriteToUsScreen;

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

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingTop: '3%',
    width: windowWidth * (90 / 100),
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: colours.grey,
  },
  label: {
    margin: 8,
    color: colours.authText,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
  },
  fontStyle1: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    marginLeft: '5%',
  },
  fontStyle2: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 10,
    marginLeft: '5%',
    marginRight: '5%',
    color: colours.grey,
  },
  fontStyle3: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: windowWidth * (3.4 / 100),
    marginLeft: '10%',
    width: windowWidth*(60/100)
    //color: colours.grey
  },
  addressContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    backgroundColor: '#fff',
    marginTop: '5%',
    paddingVertical: '4%',
    paddingHorizontal: '4%',
    backgroundColor: colours.kapraWhiteLow,
    borderRadius:5,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    justifyContent: 'space-between',
  }
});
