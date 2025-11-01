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
  KeyboardAvoidingView,
} from 'react-native';

import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import {AppContext} from '../../Context/appContext';
import {LoaderContext} from '../../Context/loaderContext';
import Toast from 'react-native-simple-toast';
import {getFontontSize} from '../globals/GroFunctions';
import Header from '../components/Header';
import {leadGeneration, areaList} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShadowTextInput from '../components/ShadowTextInput';
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroLeadGenScreen({navigation, route}) {

  const { showLoader, loading } = React.useContext(LoaderContext);
  const { editPincode } = React.useContext(AppContext)

  const [openRole, setOpenRole] = React.useState(false);
  const [valueRole, setValueRole] = React.useState(null);
  const [itemsRole, setItemsRole] = React.useState(null);

  const [phone, setPhone] = React.useState('');
  const [PhoneError, setPhoneError] = React.useState(false);
  const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');

  const [pincodeList, setPincodeList] = React.useState(null);

  const [pincode, setPincode] = React.useState('');
  const [PincodeError, setPincodeError] = React.useState(false);
  const [PincodeErrorMessage, setPincodeErrorMessage] = React.useState(false);

  const handleLogin = async () => {
    const PhoneError = phone === '';
    const pincodeError = pincode.length !== 6 || isNaN(pincode)
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const phoneTypeError = !phone.match(phoneno);
    if (!(PhoneError || phoneTypeError || pincodeError)) {
      try {
        showLoader(true);
        let res = await leadGeneration(phone, valueRole);
        await AsyncStorage.setItem('isOpenedBefore', 'true');
        await editPincode({
          pincodeId: valueRole,
          area: pincodeList.find((obj)=>obj.pincodeAreaId == valueRole).areaName,
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'GroHomeScreen'}],
        });
        Toast.show(`Welcome`)
        showLoader(false);
      } catch (error) {
        showLoader(false);
        await AsyncStorage.setItem('isOpenedBefore', 'true');
        navigation.reset({
          index: 0,
          routes: [{name: 'GroHomeScreen'}],
        });
      }
    } else {
      setPhoneError(PhoneError?PhoneError:phoneTypeError?phoneTypeError:false);
      setPhoneErrorMessage('Enter a valid mobile number');
      setPincodeError(pincodeError);
      setPincodeErrorMessage('Enter a valid post code');
    }
  };

  const handlePhone = async text => {
    setPhone(text);
    setPhoneError(false);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!text.match(phoneno)) {
      setPhoneErrorMessage('Enter a valid mobile number');
      setPhoneError(true);
    }
  };


  const handlePostcode = async (text) => {
    setPincode(text),
    setPincodeError(false)
    var phoneno = /^\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/;
    if (!text.match(phoneno)) {
      setPincodeErrorMessage('Enter a valid post code');
      setPincodeError(true);
    } else {
      try {
        let area = await areaList(text);
        setPincodeList(area);
      } catch (error) {

      }
    }
  }


  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <Text style={styles.headerText}></Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}>
          <Text />
          <Text />
          <Text />
          <Text />
          <Image
            source={require('../../assets/images/Cycle.png')}
            style={styles.topImage}
          />
          <Text />
          <Text
            style={[
              styles.fontStyle1,
              {fontSize: getFontontSize(25), color: colours.primaryBlack},
            ]}>
            Welcome to Kapra Daily
          </Text>
          <Text style={styles.fontStyle2}>
            Please enter your mobile number to continue
          </Text>
          <Text />
          <Text />
          <Text />
          <View style={styles.innerContainer}>
            <LoginTextInput
              OnChangeText={text => {
                handlePhone(text);
              }}
              Width={90}
              Title={'Phone Number'}
              Placeholder={'Enter Phone Number'}
              value={phone}
              Error={PhoneError}
              ErrorText={PhoneErrorMessage}
              PhoneCode
              Length={10}
              KeyboardType={'numeric'}
              Height={12}
            />
            <LoginTextInput
              Width={90}
              OnChangeText={(text) => {
                handlePostcode(text);
              }}
              Title={'Pincode'}
              Placeholder={'Enter Your Pincode'}
              value={pincode}
              Error={PincodeError}
              ErrorText={PincodeErrorMessage}
              Height={12}
              Length={6}
              KeyboardType={'numeric'}
            />
            {
              pincodeList&&pincodeList.length>0&&(
                <View>
                  <Text/>
                  <DropDownPicker
                    schema={{
                        label: 'areaName',
                        value: 'pincodeAreaId'
                    }}
                    open={openRole}
                    value={valueRole}
                    items={pincodeList}
                    zIndex={3000}
                    zIndexInverse={1000}
                    dropDownDirection={'TOP'}
                    placeholder={'Select area'}
                    setOpen={setOpenRole}
                    setValue={setValueRole}
                    setItems={setItemsRole}
                    style={styles.dropDownCon}
                    dropDownContainerStyle={styles.dropDownConStyle}
                    labelStyle={styles.dropDownLabel}
                    textStyle={styles.dropDownText}
                    placeholderStyle={styles.dropDownPlaceholderText}
                  />
                </View>
              )
            }
            <Text />
            <Text />
            <Text />
            <AuthButton
              OnPress={handleLogin}
              FirstColor={colours.kapraOrangeDark}
              SecondColor={colours.kapraOrange}
              ButtonText={'DONE'}
              ButtonWidth={90}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
  topImage: {
    height: windowWidth * (40 / 100),
    width: windowWidth * (90 / 100),
    marginBottom: '8%',
    resizeMode: 'contain',
    marginTop: '5%',
  },
  dropDownCon: {
    width: windowWidth*(90/100), 
    height: windowHeight*(6/100),
    borderColor: colours.kapraWhiteLow,  
    backgroundColor: colours.kapraWhiteLow,
    paddingHorizontal:windowWidth*(5/100),
    borderRadius:5, 
    fontFamily: 'Lexend-SemiBold', 
    fontSize: 14, 
  },
  dropDownConStyle: {
    borderColor: colours.kapraWhiteLow, 
    color:colours.kapraBlack, 
    width: windowWidth*(90/100), 
  },
  dropDownLabel: {
    fontFamily:'Lexend-SemiBold', 
    fontSize: getFontontSize(14), 
    color: colours.primaryBlack
  },
  dropDownText: {
    fontFamily:'Lexend-SemiBold', 
    fontSize: getFontontSize(14), 
    color: colours.kapraBlackLight
  },
  dropDownPlaceholderText: {
    fontFamily:'Lexend-SemiBold', 
    fontSize: getFontontSize(14), 
    color: colours.kapraBlackLow
  },




  // Font style
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    color: colours.kapraMain,
    fontSize: getFontontSize(15),
  },


  innerContainer: {
    alignItems: 'center',
  },
  forgotButton: {
    paddingBottom: '12%',
    paddingTop: '3%',
  },
  registerContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: '8%',
    paddingTop: '2%',
  },
  fontStyle2: {
    fontFamily: 'Montserrat-Medium',
    color: colours.primaryGrey,
    fontSize: getFontontSize(12),
  },
  fontStyle3: {
    fontFamily: 'Montserrat-SemiBold',
    color: colours.primaryPink,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: getFontontSize(14),
  },
  languageContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowWidth * (10 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
