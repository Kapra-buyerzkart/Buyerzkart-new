import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import Header from '../components/Header';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import AuthButton from '../components/AuthButton';
import ShadowTextInput from '../components/ShadowTextInput';
import LoginTextInput from '../components/LoginTextInput';
import {
  addAddress,
  getCartList,
  getCountry,
  updateAddress,
  getState,
  getDistrict,
  areaList,
  changePincode
} from '../api';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import { getFontontSize } from '../globals/GroFunctions';
import Marker  from 'react-native-maps';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroAddAddressScreen({ navigation, route }) {
  let fromPayment = route?.params?.fromPayment ? true : false;
  const { profile } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [isSelected, setSelection] = React.useState(
    route?.params?.Data?.isDefaultShippingAddress
      ? route?.params?.Data?.isDefaultShippingAddress
      : false,
  );

  const [isSelected1, setSelection1] = React.useState(
    route?.params?.Data?.isDefaultBillingAddress
      ? route?.params?.Data?.isDefaultBillingAddress
      : false,
  );
  const [fname, setFname] = React.useState(
    route?.params?.Data?.firstName ? route?.params?.Data?.firstName : '',
  );
  const [lname, setLname] = React.useState(
    route?.params?.Data?.lastName ? route?.params?.Data?.lastName : '',
  );
  const [address1, setAddress1] = React.useState(
    route?.params?.Data?.addLine1 ? route?.params?.Data?.addLine1 : '',
  );
  const [address2, setAddress2] = React.useState(
    route?.params?.Data?.addLine2 ? route?.params?.Data?.addLine2 : '',
  );
  const [phone, setPhone] = React.useState(
    route?.params?.Data?.phone ? route?.params?.Data?.phone : '',
  );
  const [email, setEmail] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [landmark, setLandmark] = React.useState(
    route?.params?.Data?.landmark ? route?.params?.Data?.landmark : '',
  );
  const [state, setState] = React.useState(
    route?.params?.Data?.state ? route?.params?.Data?.state : 'STATE',
  );
  const [district, setDistrict] = React.useState(
    route?.params?.Data?.district
      ? route?.params?.Data?.district
      : 'AREA',
  );
  const [country, setCountry] = React.useState(
    route?.params?.Data?.country ? route?.params?.Data?.country : 'INDIA',
  );

  const [region, setRegion] = React.useState({
    latitude:  parseFloat(route?.params?.addressComponent.geometry.location.lat),
    longitude: parseFloat(route?.params?.addressComponent.geometry.location.lng),
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  });
  const [formattedAddress, setFormattedAddress] = React.useState("SEARCH LOCATION HERE..")
  
  const [openRole, setOpenRole] = React.useState(false);
  const [valueRole, setValueRole] = React.useState(null);
  const [itemsRole, setItemsRole] = React.useState(null);
  const [pincodeList, setPincodeList] = React.useState(null);

  const [countryList, setCountryList] = React.useState([]);
  const [stateList, setstateList] = React.useState([]);
  const [districtList, setdistrictList] = React.useState([]);

  const [NameError, setNameError] = React.useState(false);
  const [LastNameError, setLastNameError] = React.useState(false);
  const [Address1Error, setAddress1Error] = React.useState(false);
  const [Address2Error, setAddress2Error] = React.useState(false);
  const [PhoneError, setPhoneError] = React.useState(false);
  const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [PincodeError, setPincodeError] = React.useState(false);
  const [PincodeErrorMessage, setPincodeErrorMessage] = React.useState(false);
  const [LandmarkError, setLandmarkError] = React.useState(false);
  const [StateError, setStateError] = React.useState(false);
  const [DistrictError, setDistrictError] = React.useState(false);
  const [CountryError, setCountryError] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible1, setModalVisible1] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [countryKeyword, setCountryKeyword] = React.useState('');
  const [stateKeyword, setStateKeyword] = React.useState('');
  const [cityKeyword, setCityKeyword] = React.useState('');
  const [addLabel, setAddLabel] = React.useState(route?.params?.Data?.addLine3 ? route?.params?.Data?.addLine3 : 'Home')

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
        if(!area && area.length == 0 ){
          setPincodeErrorMessage('*No Delivery Area Available');
          setPincodeError(true);
        }
      } catch (error) {
        setPincodeErrorMessage('*No Delivery Area Available');
        setPincodeError(true);
      }
    }
  }

  const handleSubmit = async () => {
    const nameError = fname === '';
    // const lastNameError = lname === '';
    const address1Error = address1 === '';
    // const address2Error = address2 === '';
    const phoneError = phone === '';
    const phoneLengthError = phone.length !== 10 || isNaN(phone);
    const emailError = email === '';
    const pincodeError = pincode.length !== 6 || isNaN(pincode)
    const landmarkError = landmark === '';
    const stateError = state === 'STATE';
    // const districtError = district === 'AREA';
    const countryError = country === 'COUNTRY';

    if (!phoneError) {
      if (phoneLengthError) {
        setPhoneErrorMessage('Enter A Valid Mobile Number');
        setPhoneError(true);
      }
    } else if (phoneError) {
      setPhoneError(phoneError);
      setPhoneErrorMessage('Required');
    }
    setNameError(nameError);
    setAddress1Error(address1Error);
    // setAddress2Error(address2Error);
    setPincodeError(pincodeError);
    setLandmarkError(landmarkError);
    // setLastNameError(lastNameError);
    setStateError(stateError);
    // setDistrictError(districtError);
    setCountryError(countryError);
    if (
      !(
        nameError ||
        address1Error ||
        // address2Error ||
        phoneError ||
        phoneLengthError ||
        pincodeError ||
        landmarkError ||
        // lastNameError ||
        stateError ||
        // districtError ||
        countryError
      )
    ) {
      if(valueRole == null) {
        Toast.show('Please choose area')
      } else {
        try {
          if (route?.params?.Data) {
            await updateAddress({
              addLine1: address1,
              addLine2: address2,
              addLine3: addLabel,
              phone: phone,
              custId: profile.groceryCustId ? profile.groceryCustId : '',
              firstName: fname,
              lastName: lname,
              pincodeAreaId: valueRole,
              landmark: landmark,
              district: '',
              state: state,
              country: country,
              addressType: 'ship / bill',
              isDefaultShippingAddress: isSelected,
              isDefaultBillingAddress: isSelected1,
              custAdressId: route?.params?.Data?.custAdressId,
              longitude: region.longitude,
              latitude: region.latitude,
            });
            Toast.show('Address Updated');
            navigation.goBack();
          } else {
  
            await addAddress({
              addLine1: address1,
              addLine2: address2,
              addLine3: addLabel,
              phone: phone,
              custId: profile.groceryCustId ? profile.groceryCustId : '',
              firstName: fname,
              middleName:'',
              lastName: lname,
              pincodeAreaId: valueRole,
              landmark: landmark,
              district: '',
              state: state,
              country: country,
              addressType: 'ship / bill',
              isDefaultShippingAddress: isSelected,
              isDefaultBillingAddress: isSelected1,
              longitude: region.longitude,
              latitude: region.latitude,
              taluk:"",
              delDate:""
            });
            Toast.show('Address Added');
            navigation.goBack();
          }
        } catch (error) {
          Toast.show(error);
        }
      }
    }
  };

  const _fetchHomeData = async () => {
    try {
      //showLoader(true);
      // let res3 = await getCountry();
      // setCountryList(res);
      let res = await getState(101);
      setstateList(res);
      setState(route?.params?.Data?.state ? route?.params?.Data?.state : res.find(obj => obj.name == 'Kerala').name);
      if(route?.params?.Data?.pincodeAreaId){
        let area = await changePincode('');
        var result = area.find(item => item.pincodeId == route?.params?.Data?.pincodeAreaId);
        handlePostcode(result.pincode,)
        setValueRole(route?.params?.Data?.pincodeAreaId?route?.params?.Data?.pincodeAreaId:null)
      }
      if (route?.params?.Data?.countryId) {
        let state = await getState(route?.params?.Data?.countryId);
        setstateList(state);
      }
      if (route?.params?.Data?.stateId) {
        let city = await getDistrict(route?.params?.Data?.stateId);
        setdistrictList(city);
      }
      showLoader(false);
    } catch (err) {
      showLoader(false);
    }
  };

  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  const _getStates = async (country) => {
    setModalVisible(false);
    setCountry(country.name);
    setCountryError(false);
    setState('STATE');
    setDistrict('AREA');
    setstateList([]);
    setdistrictList([]);
    setCountryKeyword('');
    try {
      showLoader(true);
      let res = await getState(country.id);
      setstateList(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
    }
  };

  const _getDistrict = async (state) => {
    setModalVisible1(false);
    setState(state.name);
    setStateError(false);
    setDistrict('AREA');
    setdistrictList([]);
    setStateKeyword('');
    try {
      // showLoader(true);
      let res = await getDistrict(state.id);
      showLoader(false);
      setdistrictList(res);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  const _handlePhone = (text) => {
    setPhone(text);
    setPhoneError(false);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!text.match(phoneno)) {
      setPhoneErrorMessage('Enter A Valid Mobile Number');
      setPhoneError(true);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Address</Text>
      </View>

      {/* Inputs  */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={styles.scrollCon}
        >
          <View style={styles.labelCon}>
            <TouchableOpacity onPress={()=>setAddLabel('Home')} style={[styles.labelBtn,{backgroundColor: addLabel == 'Home' ? colours.kapraOrangeLight : colours.kapraWhite}]}>
              <View style={styles.labelIcon}>
                {showIcon('home1', addLabel == 'Home' ? colours.kapraWhite : colours.kapraBlack, windowWidth*(5/100))}
              </View>
              <Text style={[styles.dropdownText1,{color : addLabel == 'Home' ? colours.kapraWhite : colours.kapraBlack}]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setAddLabel('Work')} style={[styles.labelBtn,{backgroundColor: addLabel == 'Work' ? colours.kapraOrangeLight : colours.kapraWhite}]}>
              <View style={styles.labelIcon}>
                {showIcon('work', addLabel == 'Work' ? colours.kapraWhite : colours.kapraBlack, windowWidth*(5/100))}
              </View>
              <Text style={[styles.dropdownText1,{color : addLabel == 'Work' ? colours.kapraWhite : colours.kapraBlack}]}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setAddLabel('Others')} style={[styles.labelBtn,{backgroundColor: addLabel == 'Others' ? colours.kapraOrangeLight : colours.kapraWhite}]}>
              <View style={styles.labelIcon}>
                {showIcon('others', addLabel == 'Others' ? colours.kapraWhite : colours.kapraBlack, windowWidth*(5/100))}
              </View>
              <Text style={[styles.dropdownText1,{color : addLabel == 'Others' ? colours.kapraWhite : colours.kapraBlack}]}>Others</Text>
            </TouchableOpacity>
          </View>
          <LoginTextInput
            OnChangeText={(text) => {
              setFname(text);
              setNameError(false);
            }}
            Width={88}
            Placeholder={'Enter Your First Name'}
            Title={'First Name'}
            Error={NameError}
            value={fname}
            Height={12}
          />
          <LoginTextInput
            OnChangeText={(text) => {
              setAddress1(text);
              setAddress1Error(false);
            }}
            Width={88}
            Placeholder={'Enter Address Line1'}
            Title={'Address Line1'}
            Error={Address1Error}
            value={address1}
            Height={12}
          />
          <LoginTextInput
            Width={88}
            OnChangeText={_handlePhone}
            Placeholder={'Phone No ' + "(+91)"}
            Title={'Mobile Number'}
            Error={PhoneError}
            value={phone}
            ErrorText={PhoneErrorMessage}
            Height={12}
          />
          <Dropdown
            State={country}
            Title={'Country'}
            Error={CountryError}
          />
          <Dropdown
            State={state}
            Title={'State'}
            OnPress={() =>
              stateList.length === 0
                ? Toast.show('State List Is Empty')
                : setModalVisible1(true)
            }
            Error={StateError}
          />
          <LoginTextInput
            Width={88}
            OnChangeText={(text) => {
              setLandmark(text);
              setLandmarkError(false);
            }}
            Placeholder={'Your Address Landmark'}
            Title={'Landmark'}
            Error={LandmarkError}
            value={landmark}
            Height={12}
          />
          <LoginTextInput
            Width={88}
            OnChangeText={(text) => {
              handlePostcode(text);
            }}
            Placeholder={'Your Address Pincode'}
            Title={'Pincode'}
            Error={PincodeError}
            ErrorText={PincodeErrorMessage}
            value={pincode}
            Height={12}
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
                  placeholder={'Select Area'}
                  setOpen={setOpenRole}
                  setValue={setValueRole}
                  setItems={setItemsRole}
                  style={styles.areaDropCon}
                  dropDownContainerStyle={styles.areaDropDownCon}
                  labelStyle={styles.dropdownText1}
                  textStyle={styles.dropdownText2}
                  placeholderStyle={styles.dropdownText2}
                />
              </View>
            )
          }

          {/* Checkbox  */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
              disabled={false}
              tintColors={{ true: colours.kapraOrange, false:colours.kapraOrangeLight}}
              onCheckColor={colours.kapraOrangeLight}
              onTintColor={colours.kapraOrangeLight}
            />
            <Text style={styles.label}>{'Make As Default Shipping Address'}</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected1}
              onValueChange={setSelection1}
              style={styles.checkbox}
              disabled={false}
              tintColors={{ true: colours.kapraOrange, false:colours.kapraOrangeLight}}
              onCheckColor={colours.kapraOrangeLight}
              onTintColor={colours.kapraOrangeLight}
            />
            <Text style={styles.label}>{'Make As Default Billing Address'}</Text>
          </View>

          {/* Buttons  */}
          <View style={{ marginTop: '1%' }}>
            {route?.params?.Data ? (
              <AuthButton
                FirstColor={colours.kapraOrange}
                SecondColor={colours.kapraOrangeDark}
                OnPress={()=> handleSubmit()}
                ButtonText={'Update'}
                Icon={'save'}
                ButtonWidth={88}
              />
            ) : (
              <AuthButton
                FirstColor={colours.kapraOrange}
                SecondColor={colours.kapraOrangeDark}
                OnPress={()=> handleSubmit()}
                ButtonText={'Save'}
                Icon={'save'}
                ButtonWidth={88}
              />
            )}
          </View>
        </ScrollView>

        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: windowHeight*(10/100),
                backgroundColor: '#fff',
                // borderRadius:10,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                paddingLeft: 10,
                paddingRight: 10,
                width: windowWidth * (85 / 100),
                paddingTop: 10,
              }}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: getFontontSize(22),
                    marginLeft: '10%',
                  }}>
                  {'Select A Country'}
                </Text>
              </View>
              <View
                style={{
                  width: windowWidth * (10 / 100),
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ padding: 10 }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: windowWidth * (85 / 100),
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 10,
                paddingTop: 10,
              }}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setCountryKeyword(text)}
                value={countryKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={{
                backgroundColor: '#fff',
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 20,
                padding: 30,
                paddingTop: 10,
                alignItems: 'center',
                width: windowWidth * (85 / 100),
              }}>
              {countryList
                .filter((country) =>
                  country.name
                    .toUpperCase()
                    .includes(countryKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => _getStates(item)}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.name.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>

        {/* State Modal  */}
        {stateList.length > 0 && (
          <Modal visible={modalVisible1} animationType="fade" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalHeader}>
                <View style={{ width: windowWidth * (60 / 100) }}>
                  <Text style={styles.headerText}>{'Select A State'}</Text>
                </View>
                <View style={styles.modalCloseCon}>
                  <TouchableOpacity
                    onPress={() => setModalVisible1(false)}
                    style={{ padding: 10 }}
                  >
                    <Text style={styles.headerText}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={styles.modalSearchCon}>
                <TextInput
                  style={styles.searchTextInput}
                  placeholder={'Search'}
                  placeholderTextColor={colours.primaryGrey}
                  onChangeText={(text) => setStateKeyword(text)}
                  value={stateKeyword}
                />
              </View>
              <ScrollView
                contentContainerStyle={styles.modalScrollCon}>
                {stateList
                  .filter((state) =>
                    state.name.toUpperCase().includes(stateKeyword.toUpperCase()),
                  )
                  .map((item, i) => (
                    <TouchableOpacity
                      style={styles.modalRow}
                      key={i}
                      onPress={() => _getDistrict(item)}>
                      <Text style={styles.modalRowText} numberOfLines={1}>
                        {item.name.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </Modal>
        )}

        {/* District Modal  */}
        {districtList.length > 0 && (
          <Modal animationType="fade" transparent={true} visible={modalVisible2}>
            <View style={styles.centeredView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: windowHeight*(10/100),
                  backgroundColor: '#fff',
                  // borderRadius:10,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  paddingLeft: 10,
                  paddingRight: 10,
                  width: windowWidth * (85 / 100),
                  paddingTop: 10,
                }}>
                <View
                  style={{
                    width: windowWidth * (60 / 100),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: getFontontSize(18),
                      marginLeft: '10%',
                    }}>
                    {'Select A City/District'}
                  </Text>
                </View>
                <View
                  style={{
                    width: windowWidth * (10 / 100),
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible2(false)}
                    style={{ padding: 10 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: windowWidth * (85 / 100),
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 10,
                  paddingTop: 10,
                }}>
                <TextInput
                  style={styles.searchTextInput}
                  placeholder={'Search'}
                  placeholderTextColor={colours.primaryGrey}
                  onChangeText={(text) => setCityKeyword(text)}
                  value={cityKeyword}
                />
              </View>
              <ScrollView
                contentContainerStyle={{
                  backgroundColor: '#fff',
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 20,
                  padding: 30,
                  paddingTop: 10,
                  alignItems: 'center',
                  width: windowWidth * (85 / 100),
                }}>
                {districtList
                  .filter((city) =>
                    city.name.toUpperCase().includes(cityKeyword.toUpperCase()),
                  )
                  .map((item, i) => (
                    <TouchableOpacity
                      style={styles.modalRow}
                      key={i}
                      onPress={() => {
                        setDistrict(item.name);
                        setDistrictError(false);
                        setModalVisible2(false);
                        setCityKeyword('');
                      }}>
                      <Text style={styles.modalRowText} numberOfLines={1}>
                        {item.name.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </Modal>
        )}
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
  scrollCon: {
    paddingTop: '5%',
    paddingBottom: windowHeight * (10 / 100),
    alignItems: 'center',
    width: windowWidth
  },
  dropDownCon: {
    width: windowWidth * (88 / 100),
    height: windowHeight * (6 / 100),
    marginBottom: windowHeight * (2 / 100),
    paddingHorizontal: windowWidth * (4 / 100),
    backgroundColor: colours.kapraWhiteLow,
    flexDirection:'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: windowHeight*(10/100),
    backgroundColor: colours.kapraWhite,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    width: windowWidth * (85 / 100),
    paddingTop: 10,
  },
  modalCloseCon: {
    width: windowWidth * (10 / 100),
    alignItems: 'flex-end',
  },
  modalSearchCon: {
    width: windowWidth * (85 / 100),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  modalScrollCon: {
    backgroundColor: '#fff',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    padding: 30,
    paddingTop: 10,
    alignItems: 'center',
    width: windowWidth * (85 / 100),
  },
  areaDropCon: {
    width: windowWidth*(88/100), 
    height: windowHeight*(6/100), 
    backgroundColor: colours.kapraWhiteLow,
    borderColor: colours.kapraWhiteLow,
    borderRadius:5, 
    paddingHorizontal:windowWidth*(8/100), 
    fontFamily: 'Lexend-SemiBold', 
    fontSize: 14, 
  },
  areaDropDownCon: {
    borderColor: colours.kapraWhiteLow, 
    color:colours.kapraBlack, 
    width: windowWidth*(88/100), 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 20,
    marginTop: '3%',
    width: windowWidth * (88 / 100),
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: colours.primaryGrey,
  },
  searchTextInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    color: colours.primaryBlack,
    borderColor: colours.primaryGrey,
    borderRadius:10,
    fontFamily: 'Lexend-SemiBold',
    paddingHorizontal: 10
  },
  centeredView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRow: {
    padding: 10,
    borderBottomColor: colours.primaryGrey,
    borderBottomWidth: 1,
  },
  labelCon: {
    width: windowWidth*(90/100),
    height: windowHeight*(7/100),
    marginBottom: windowHeight*(2/100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelBtn: {
    width: windowWidth*(27/100),
    height: windowHeight*(5/100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
    borderRadius: 10,
  },
  labelIcon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    justifyContent: 'center',
    alignItems: 'center',
  },


  // Font style
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  headerText2: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  titleFont: {
    color: colours.kapraBlackLow,
    fontFamily:'Lexend-Light',
    fontSize: getFontontSize(12),
    marginBottom:5
  },
  modalRowText: {
    padding: 5,
    color: colours.kapraBlackLow,
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(14),
    width: windowWidth * (62 / 100),
  },
  dropdownText1: {
    fontFamily:'Lexend-SemiBold', 
    fontSize: getFontontSize(14), 
    color: colours.kapraBlack
  },
  dropdownText2: {
    fontFamily:'Lexend-SemiBold', 
    fontSize: getFontontSize(14), 
    color: colours.kapraBlack
  },
  label: {
    marginLeft:10,
    color: colours.kapraBlackLow,
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(14),
  },
  
});

const Dropdown = ({ State, OnPress, Error, Title }) => {
  return (
    <TouchableOpacity onPress={OnPress} >
      <Text style={styles.titleFont}>{Title}</Text>
      <View style={styles.dropDownCon}>
        <Text
          style={[
            {
              fontFamily: 'Montserrat-SemiBold',
              fontSize: getFontontSize(14),
              color: '#9aa0a6',
            },
            State == 'STATE' || State == 'AREA' || State == 'COUNTRY'
              ? { color: colours.kapraLight }
              : { color: colours.primaryBlack },
          ]}>
          {State.toUpperCase()}
        </Text>
        <View>{showIcon('downArrow', colours.kapraOrangeLight, 18)}</View>
      </View>
      {Error && <Text style={[styles.titleFont,{ paddingRight:windowWidth*(4/100), width:windowWidth*(88/100),textAlign:'right', color: colours.kapraRed}]}>Required</Text>}
    </TouchableOpacity>
  );
};
