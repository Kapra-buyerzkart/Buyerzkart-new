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
  KeyboardAvoidingView
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import ShadowTextInput from '../components/ShadowTextInput';
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
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import { getFontontSize } from '../globals/functions';
import Marker  from 'react-native-maps';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function AddAddressScreen({ navigation, route }) {
  
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

  const handleSubmit = async () => {
    const nameError = fname === '';
    const lastNameError = lname === '';
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
    setLastNameError(lastNameError);
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
        lastNameError ||
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
              phone: phone,
              custId: profile.bkCustId ? profile.bkCustId : '',
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
            // navigation.navigate('Address');
          } else {
  
            await addAddress({
              addLine1: address1,
              addLine2: address2,
              addLine3:'',
              phone: phone,
              custId: profile.bkCustId ? profile.bkCustId : '',
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
      <Header backEnable navigation={navigation} HeaderText={'My Addresses'} Cart WishList />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{
            paddingTop: '5%',
            paddingBottom: windowHeight * (10 / 100),
            alignItems: 'center',
            width: windowWidth
          }}>



          {/* <View style={{ height: windowWidth * (75 / 100), width: windowWidth * (100 / 100) }}>
            <View>
              <MapView
                style={{ height: windowWidth * (70 / 100), width: windowWidth * (100 / 100), }}
                region={region}
                onRegionChangeComplete={region => { setRegion(region) }}
              >
                <MapView.Marker
                  coordinate={{
                    "latitude": region.latitude,
                    "longitude": region.longitude
                  }}
                  title={"Thank you, got your location."}
                  //draggable
                  onPress={(marker) => {
                    setRegion({
                      latitude: marker.nativeEvent.coordinate.latitude,
                      longitude: marker.nativeEvent.coordinate.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05
                    });
                  }}
                />
              </MapView>
              <View style={{  width: windowWidth * (100 / 100), position:'absolute', justifyContent:'center', paddingTop:5 }}>
                <GooglePlacesAutocomplete
                    placeholder='Search Location Here..'
                    onPress={(data, details = null) => {
                        setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        });
                        setFormattedAddress(details.formatted_address)
                        setAddress2(details.address_components[0].long_name);
                    }}
                    query={{
                        key: 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y',
                        language: 'en',
                        components: 'country:IN'
                    }}
                    textInputProps={{
                      color: colours.primaryGrey,
                      placeholderTextColor: colours.primaryGrey,
                    }}
                    fetchDetails={true}
                    styles={styles.searchContainer}
                />
              </View>
            </View>
          </View> */}

          <ShadowTextInput
            OnChangeText={(text) => {
              setFname(text);
              setNameError(false);
            }}
            Width={88}
            Placeholder={'First Name'}
            Error={NameError}
            value={fname}
            Height={windowWidth * (13 / 100)}
          />
          <ShadowTextInput
            OnChangeText={(text) => {
              setLname(text);
              setLastNameError(false);
            }}
            Width={88}
            Placeholder={'Last Name'}
            Error={LastNameError}
            value={lname}
            Height={windowWidth * (13 / 100)}
          />
          <ShadowTextInput
            OnChangeText={(text) => {
              setAddress1(text);
              setAddress1Error(false);
            }}
            Width={88}
            Placeholder={'Address Line1'}
            Error={Address1Error}
            value={address1}
            Height={windowWidth * (13 / 100)}
          />
          <ShadowTextInput
            OnChangeText={(text) => {
              setAddress2(text);
              setAddress2Error(false);
            }}
            Width={88}
            Placeholder={'Address Line2'}
            Error={Address2Error}
            value={address2}
            Height={windowWidth * (13 / 100)}
          />
          {/* <View style={styles.rowStyle}> */}
          <ShadowTextInput
            Width={88}
            OnChangeText={_handlePhone}
            Placeholder={'Phone No ' + "(+91)"}
            Error={PhoneError}
            value={phone}
            Height={windowWidth * (13 / 100)}
            ErrorText={PhoneErrorMessage}
          />
          {/* </View> */}
          <Dropdown
            State={country}
            // OnPress={() =>
            //   countryList.length === 0
            //     ? Toast.show(Lang.CountryListIsEmpty)
            //     : setModalVisible(true)
            // }
            Error={CountryError}
          />
          <Dropdown
            State={state}
            OnPress={() =>
              stateList.length === 0
                ? Toast.show('State List Is Empty')
                : setModalVisible1(true)
            }
            Error={StateError}
          />
          {/* <Dropdown
            State={district}
            OnPress={() =>
              districtList.length === 0
                ? Toast.show('District List Is Empty')
                : setModalVisible2(true)
            }
            Error={DistrictError}
          /> */}
          <ShadowTextInput
            Width={88}
            OnChangeText={(text) => {
              setLandmark(text);
              setLandmarkError(false);
            }}
            Placeholder={'Landmark'}
            Error={LandmarkError}
            value={landmark}
            Height={windowWidth * (13 / 100)}
          />
          <ShadowTextInput
            Width={88}
            OnChangeText={(text) => {
              handlePostcode(text);
            }}
            Placeholder={'Pincode'}
            Error={PincodeError}
            value={pincode}
            Height={windowWidth * (13 / 100)}
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
                  style={{width: windowWidth*(90/100), height: windowHeight*(6/100),borderColor: colours.kapraLow,  borderRadius:20, paddingHorizontal:windowWidth*(8/100), shadowOffset: {width: 0,height: 3,}, shadowOpacity: 0.36, shadowRadius: 6.68, elevation: 7, fontFamily: 'Proxima Nova Alt Bold', fontSize: 14, shadowColor:  colours.kapraLight, }}
                  dropDownContainerStyle={{borderColor: colours.kapraLow, color:colours.primaryBlack, width: windowWidth*(90/100), }}
                  labelStyle={{fontFamily:'Proxima Nova Alt Bold', fontSize: getFontontSize(14), color: colours.primaryBlack}}
                  textStyle={{fontFamily:'Proxima Nova Alt Bold', fontSize: getFontontSize(14), color: colours.kapraLight}}
                  placeholderStyle={{fontFamily:'Proxima Nova Alt Bold', fontSize: getFontontSize(14), color: colours.kapraLight}}
                />
              </View>
            )
          }
          {/* <ShadowTextInput
          OnChangeText={(text) => setNotes(text)}
          Width={88}
          Placeholder={'SPECIAL NOTES'}
          value={notes}
        /> */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
              disabled={false}
              tintColors={{ true: colours.kapraLight, false:colours.kapraMain}}
              onCheckColor={colours.kapraLight}
              onTintColor={colours.kapraLight}
            />
            <Text style={styles.label}>{'Make As Default Shipping Address'}</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected1}
              onValueChange={setSelection1}
              style={styles.checkbox}
              disabled={false}
              tintColors={{ true: colours.kapraLight, false:colours.kapraMain}}
              onCheckColor={colours.kapraLight}
              onTintColor={colours.kapraLight}
            />
            <Text style={styles.label}>{'Make As Default Billing Address'}</Text>
          </View>
          <View style={{ marginTop: '1%' }}>
            {route?.params?.Data ? (
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={()=> handleSubmit()}
                ButtonText={'Update'}
                Icon={'save'}
                ButtonWidth={80}
              />
            ) : (
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={()=> handleSubmit()}
                ButtonText={'Save'}
                Icon={'save'}
                ButtonWidth={80}
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
                    fontFamily: 'Proxima Nova Alt Bold',
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
                  <Text style={{ fontFamily: 'Proxima Nova Alt Bold', fontSize: getFontontSize(20), }}>X</Text>
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
        {stateList.length > 0 && (
          <Modal visible={modalVisible1} animationType="fade" transparent={true}>
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
                      fontFamily: 'Proxima Nova Alt Bold',
                      fontSize: getFontontSize(18),
                      marginLeft: '10%',
                    }}>
                    {'Select A State'}
                  </Text>
                </View>
                <View
                  style={{
                    width: windowWidth * (10 / 100),
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible1(false)}
                    style={{ padding: 10 }}>
                    <Text style={{ fontFamily: 'Proxima Nova Alt Bold', fontSize: getFontontSize(20), }}>X</Text>
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
                  onChangeText={(text) => setStateKeyword(text)}
                  value={stateKeyword}
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
                      fontFamily: 'Proxima Nova Alt Bold',
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
                    <Text style={{ fontFamily: 'Proxima Nova Alt Bold', fontSize: getFontontSize(20), }}>X</Text>
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
    backgroundColor: colours.primaryWhite,
  },
  rowStyle: {
    flexDirection: 'row',
    width: windowWidth * (88 / 100),
    justifyContent: 'space-between',
    paddingTop: '2%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingTop: '3%',
    width: windowWidth * (90 / 100),
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: colours.primaryGrey,
  },
  label: {
    margin: 8,
    color: colours.kapraLight,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  },
  searchTextInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    color: colours.primaryBlack,
    borderColor: colours.primaryGrey,
    borderRadius:10,
    fontFamily: 'Proxima Nova Alt Bold',
    paddingHorizontal: 10
  },
  textInput: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: '5%',
    paddingHorizontal: '8%',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 7,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    borderColor: colours.kapraLight,
    shadowColor: colours.kapraLight,
    width: (windowWidth * 88) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: windowWidth * (13 / 100),
    borderRadius: 20,
    alignItems: 'center',
  },
  error: {
    color: colours.primaryRed,
    marginTop: '2%',
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(11),
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
  modalView: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 35,
    alignItems: 'center',
  },
  modalRow: {
    padding: 10,
    borderBottomColor: colours.primaryGrey,
    borderBottomWidth: 1,
  },
  modalRowText: {
    padding: 5,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    width: windowWidth * (62 / 100),
  },
  searchContainer: {
      container: {
          flex: 1,
      },
      textInputContainer: {
          flexDirection: 'row',
          width:windowWidth*(90/100),
          marginLeft:windowWidth*(5/100),
          borderRadius:10
      },
      textInput: {
          backgroundColor: colours.primaryWhite,
          height: windowWidth*(10/100),
          borderRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontFamily:'Proxima Nova Alt Bold',
          fontSize: windowWidth*(4/100),
          flex: 1,
      },
      listView: {
          backgroundColor: colours.primaryWhite,
          padding: 13,
          borderRadius: 10,
          flexDirection: 'row',
          width:windowWidth*(90/100),
          marginLeft:windowWidth*(5/100),
          height: windowWidth * (55 / 100),
      },
      row: {
          backgroundColor: colours.primaryWhite,
          flexDirection: 'row',
          width:windowWidth*(80/100),
          height: windowWidth * (10 / 100),
      },
      description: {
          fontFamily:'Proxima Nova Alt Bold',
          fontSize: windowWidth*(4/100),
      },
    }
});

const Dropdown = ({ State, OnPress, Error }) => {
  return (
    <TouchableOpacity onPress={OnPress} style={{alignItems:'flex-end'}}>
      <View style={styles.textInput}>
        <Text
          style={[
            {
              fontFamily: 'Proxima Nova Alt Bold',
              fontSize: getFontontSize(14),
              color: '#9aa0a6',
            },
            State == 'STATE' || State == 'AREA' || State == 'COUNTRY'
              ? { color: colours.kapraLight }
              : { color: colours.primaryBlack },
          ]}>
          {State.toUpperCase()}
        </Text>
        <Text>{showIcon('downArrow', colours.kapraLight, 18)}</Text>
      </View>
      {Error && <Text style={[styles.error,{paddingRight:windowWidth*(4/100)}]}>Required</Text>}
    </TouchableOpacity>
  );
};
