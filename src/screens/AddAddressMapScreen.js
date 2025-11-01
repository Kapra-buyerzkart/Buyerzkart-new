import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Modal
} from 'react-native';
import { I18nManager } from "react-native";
import axios from 'axios';


import { getFontontSize } from '../globals/functions';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import { AppContext } from '../Context/appContext';
import { StackActions } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
// import Geolocation from 'react-native-geolocation-service';
import MapView, { MAP_TYPES, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// navigator.geolocation = require('@react-native-community/geolocation');
import Geocoder from 'react-native-geocoding';
import LottieView from 'lottie-react-native';
import Header from '../components/Header';
// import Language from '../globals/languagesJson';
Geocoder.init('AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddAddressMapScreen = ({ navigation, route }) => {
  const [currentLongitude, setCurrentLongitude] = React.useState(route?.params?.Data?.longitude ? parseFloat(route?.params?.Data?.longitude) : 76.3041375);
  const [currentLatitude, setCurrentLatitude] = React.useState( route?.params?.Data?.latitude ? parseFloat(route?.params?.Data?.latitude) : 10.0224066);
  const [addressComponent, setAddressComponent] = React.useState(null);
  const [locationStatus, setLocationStatus] = React.useState('');

  const [region, setRegion] = React.useState({
    latitude: route?.params?.Data?.latitude ? parseFloat(route?.params?.Data?.latitude) : 10.0224066, 
    longitude: route?.params?.Data?.longitude ? parseFloat(route?.params?.Data?.longitude) : 76.3041375,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  });
  const { profile, Language } = React.useContext(AppContext);

  const [ streetAddress, setStreetAddress ] = React.useState('');
  const [ streetNum, setStreetNum ] = React.useState('');
  
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {

      if(route?.params?.Data?.latitude && route?.params?.Data?.longitude){
        
        reverseGeocode(currentLatitude, currentLongitude)
        // Geocoder.from(currentLatitude, currentLongitude)
        // .then(json => {
        //   var addressComponent = json.results[0];
        //   funSetAddComponent(addressComponent);
        // })
        // .catch(error => null);
      }else{
        getOneTimeLocation();
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: Language.Location_Access_Msg ? Language.Location_Access_Msg : 'Location Access Required',
            message: Language.Desc ? Language.Location_Access_Desc : 'This App needs to Access your location to fetch your address location',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if(route?.params?.Data?.latitude && route?.params?.Data?.longitude){
            reverseGeocode(currentLatitude, currentLongitude)
            // Geocoder.from(currentLatitude, currentLongitude)
            // .then(json => {
            //   var addressComponent = json.results[0];
            //   funSetAddComponent(addressComponent);
            // })
            // .catch(error => null);
          }else{
            getOneTimeLocation();
          }
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
      }
    }
  };

  React.useEffect(() => {
    requestLocationPermission();
  }, []);

  const getOneTimeLocation = () => {

    Geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        setRegion({
          latitude: Number(currentLatitude),
          longitude: Number(currentLongitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        });
        reverseGeocode(currentLatitude, currentLongitude)
        // Geocoder.from(currentLatitude, currentLongitude)
        // .then(json => {
        //   var addressComponent = json.results[0];
        //   funSetAddComponent(addressComponent);
        // })
        // .catch(error => null);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
    );
  };


  const funSetAddComponent = async( value ) => {
    setAddressComponent(value);

    let address = '';
    let street_num = '';
    for (let i = 0; i < value.address_components.length; i++) {
      if (value.address_components[i].types[0] == 'subpremise') {
        address += value.address_components[i].long_name;
      } else if (value.address_components[i].types[0] == 'route') {
        if (address)
          address += ', ';
        address += value.address_components[i].long_name;
      } else if (value.address_components[i].types[0] == 'street_number') {
        street_num = value.address_components[i].long_name;
      }
    }
    setStreetAddress(address);
    setStreetNum(street_num)
  }


  const reverseGeocode = (latitude, longitude) => {
    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    axios.get(url)
      .then(response => {
        const address = response.data.results[0].formatted_address;
          var addressComponent = response.data.results[0];
          funSetAddComponent(addressComponent);
        // setAddress(address);
      })
      .catch(error => {
      });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} backEnable />
      <View style={styles.modalView}>  
        <MapView
          style={{ height: windowHeight * (95 / 100), width: windowWidth * (100 / 100)}}
          region={region}
          onRegionChangeComplete={region => {
            setRegion({
                latitude: Number((region?.latitude).toFixed(6)),
                longitude: Number((region?.longitude).toFixed(6)),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            });
            reverseGeocode(region?.latitude, region?.longitude)
            // Geocoder.from(region.latitude, region.longitude)
            // .then(json => {
            //   var addressComponent = json.results[0];
            //   funSetAddComponent(addressComponent);
            // })
            // .catch(error => null);
          }}
        >
        </MapView>
        <View style={{position:'absolute', alignItems:'center', justifyContent:'center',marginTop:Platform.OS == 'ios'? windowHeight*(43/100) : windowHeight*(44/100), height:windowHeight*(4/100)}}>
          {/* <Text>
            {showIcon('address', colours.lightRed, windowHeight*(5/100))}
          </Text> */}
              <LottieView 
                source={require('../assets/Lottie/Location.json')} 
                style={{
                    height:  windowHeight*(8/100),
                    width:  windowHeight*(8/100),
                }} 
                autoPlay
                loop
              />
        </View>
        <TouchableOpacity 
            onPress={()=>getOneTimeLocation()}
            style={{position:'absolute', justifyContent:'center',marginTop:windowHeight*(53/100),width:windowWidth*(25/100), alignItems:'center', left:windowWidth*(70/100)}}
        >
          <View style={{backgroundColor: colours.primaryBlack, width:windowWidth*(25/100), alignItems:'center', justifyContent:'center', borderRadius:windowHeight*(5/100), borderWidth:0.5, borderColor: colours. lightGrey, paddingVertical:5}}>
            <Text style={[styles.fontStyle2,{textAlign:'center', color: colours.primaryWhite}]}>Current Location</Text>
            {/* {showIcon('location', colours.lightRed, windowHeight*(3/100))} */}
          </View>
        </TouchableOpacity>
        {
          profile.cusLatitude ===null || profile.cusLongitude === null?
            <TouchableOpacity onPress={()=>{setSearchModalStatus(true)}} style={styles.locationSearch}>
              <Text style={styles.fontStyle1}>{Language.Search_Location_Here}</Text>
            </TouchableOpacity>
            :
            <View style={styles.locationSearch2}>
              <GooglePlacesAutocomplete
                  placeholder={Language.Search_Address ? Language.Search_Address : 'Search a new address'}
                  textInputProps={{
                    placeholderTextColor: colours.lightGrey,
                    returnKeyType: "search",
                    color: colours.primaryBlack,
                    fontFamily: 'Proxima Nova Alt Bold',
                    backgroundColor: colours.lightPink
                  }}
                  // styles={{color:colours.primaryBlack, fontFamily:'Proxima Nova Alt Semibold'}}
                  styles={{
                    textInput: {
                      color:colours.lightPink,
                      fontSize: 14,
                      fontFamily: 'Proxima Nova Alt Bold',
                    },
                    listView: {
                      borderRadius:5,
                      backgroundColor: colours.primaryWhite,
                      height: windowHeight*(20/100), 
                    },
                    row: {
                      borderRadius:5,
                    }
                  }}
                  focus
                  debounce={200}
                  renderRow={(rowData) => {
                    const title = rowData.structured_formatting.main_text;
                    const address = rowData.structured_formatting.secondary_text;
                    return (
                        <View> 
                          <View style={{flexDirection:'row'}}>
                            <View style={{width:20, height:20}}>{showIcon('address', colours.primaryBlack, 15)}</View>
                            <Text style={[styles.fontStyle1,{paddingBottom:2}]}>   {title}</Text>
                          </View>
                            <Text style={styles.fontStyle1}>{address}</Text>
                        </View>
                    );
                  }}
                  onPress={(data, details = null) => {
                    setRegion({
                      latitude: Number(details.geometry.location.lat),
                      longitude: Number(details.geometry.location.lng),
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005
                    });
                    funSetAddComponent(details);

                  }}
                  query={{
                      key: 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y',
                      language: 'en',
                      components: 'country:IN'
                  }}
                  fetchDetails={true}
                  textInputProp={styles.textInput}
                  listViewDisplayed={false}
                />
                {/* <TouchableOpacity onPress={()=>{navigation.goBack()}} style={styles.closeButton} >
                  <Text>
                    {showIcon('close', colours.primaryBlack, windowHeight*(3/100))}
                  </Text>
              </TouchableOpacity> */}
            </View>
        }
        
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.fontStyle2}>
            {addressComponent?addressComponent.formatted_address:"Loading.."}
        </Text>
        <AuthButton
            BackgroundColor={colours.primaryPink}
            OnPress={
              ()=> addressComponent&&(navigation.dispatch(
                StackActions.replace('AddAddress', { 
                  addressComponent: addressComponent, 
                  addressRegion: region, 
                  Data: route?.params?.Data?route?.params?.Data:null,
                  streetAddress: streetAddress,
                  streetNum: streetNum
                })
              ))
            }
            // OnPress={()=>AvailabilityCheck()}
            ButtonText={Language.Confirm_Continue?Language.Confirm_Continue : 'Confirm & Continue'}
            ButtonWidth={80}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddAddressMapScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
    // justifyContent:'space-between'
  },
  headerContainer: {
      width: windowWidth*(90/100),
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
  },
  hNameContainer: {
      width: windowWidth*(45/100),
      height: windowWidth*(25/100),
      justifyContent:'center',
  },
  topButton: {
      width: windowWidth*(20/100),
      height: windowHeight*(4/100),
      paddingVertical:5,
      paddingHorizontal:15,
      borderWidth: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colours.lightRed
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(13),
    color: colours.primaryBlack,
    lineHeight: getFontontSize(20),
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(15),
    color: colours.primaryBlack
  },
  modalView:{
    height:windowHeight*(55/100), 
    width:windowWidth, 
    // marginTop:windowHeight*(5/100), 
    alignItems:'center',
  },
  modalViewAlert: {
    width:windowWidth,
    height:windowHeight,
    justifyContent:'center',
    alignItems:'center'
  },
  bottomArea : {
    width:windowWidth*(94/100),
    height:windowHeight*(7/100), 
    borderRadius:windowHeight*(0.5/100), 
    alignItems:'center', 
    justifyContent:'center', 
    //borderRadius:windowHeight*(2/100),  
    marginBottom:windowHeight*(2/100), 
    backgroundColor:colours.lightWhite, 
    marginTop:windowHeight*(8/100), 
  },
  locationSearch: {
    height:windowHeight*(6/100), 
    width:windowWidth*(96/100), 
    backgroundColor:colours.primaryWhite, 
    position:'absolute', 
    marginTop:windowHeight*(2/100), 
    borderRadius:windowHeight*(1/100), 
    justifyContent:'center',
    paddingLeft:20
  },
  locationSearch2: {
    // height:windowHeight*(20/100), 
    width:windowWidth,
    paddingHorizontal: windowWidth*(3/100),
    position:'absolute', 
    backgroundColor: colours.primaryWhite,
    // marginTop:2, 
    borderRadius:windowHeight*(1/100), 
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  addressContainer: {
    position:'absolute', 
    justifyContent: 'space-between',
    padding: windowWidth*(5/100),
    width: windowWidth*(90/100), 
    height: windowHeight*(20/100), 
    backgroundColor: colours.primaryWhite, 
    marginTop: Platform.OS === 'ios'? windowHeight*(70/100) : windowHeight*(75/100),
    shadowColor: colours.primaryBlack,
    borderRadius:10,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5
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
    color:colours.black,
    fontSize: getFontontSize(11),
    borderColor: colours.lightRed,
    width: (windowWidth * 94) / 100,
    borderRadius:10,
    justifyContent: 'flex-start',
    marginTop:windowHeight*(5/100), 
    marginTop:windowHeight * (5 / 100),
    alignItems: 'center',
  },
  closeButton: {
    width:windowWidth*(12/100), 
    height:windowWidth*(11/100), 
    backgroundColor: 'rgba(11,11,11,0.3)', 
    borderRadius:5, 
    marginLeft:10, 
    justifyContent:'center', 
    alignItems:'center'
  }
});
