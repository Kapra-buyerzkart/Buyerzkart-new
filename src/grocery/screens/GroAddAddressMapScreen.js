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
} from 'react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { StackActions } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { MAP_TYPES, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { getFontontSize } from '../globals/GroFunctions';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import AuthButton from '../components/AuthButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroAddAddressMapScreen = ({ navigation, route }) => {

  const [ dummy, setDummy ] = React.useState(false);
  const [addressComponent, setAddressComponent] = React.useState(null);

  const [region, setRegion] = React.useState({
    latitude: route?.params?.Data?.latitude ? parseFloat(route?.params?.Data?.latitude) : 10.0224066, 
    longitude: route?.params?.Data?.longitude ? parseFloat(route?.params?.Data?.longitude) : 76.3041375,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005
  });

  
  React.useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS == 'ios') {
      if(route?.params?.Data?.latitude && route?.params?.Data?.longitude){
        reverseGeocode(route?.params?.Data?.latitude, route?.params?.Data?.longitude)
      }else{
        getOneTimeLocation();
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location to fetch your address location',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if(route?.params?.Data?.latitude && route?.params?.Data?.longitude){
            reverseGeocode(route?.params?.Data?.latitude), parseFloat(route?.params?.Data?.longitude)
          }else{
            getOneTimeLocation();
          }
        } 
      } catch (err) {
      }
    }
  };

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setRegion({
          latitude: Number(currentLatitude),
          longitude: Number(currentLongitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        });
        reverseGeocode(currentLatitude, currentLongitude)
      },
      (error) => {
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
    );
  };

  const funSetAddComponent = async( value ) => {
    setAddressComponent(value);
    setDummy(!dummy)
  }

  const reverseGeocode = (latitude, longitude) => {
    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    axios.get(url)
      .then(response => {
        const address = response.data.results[0].formatted_address;
          var addressComponent = response.data.results[0];
          funSetAddComponent(addressComponent);
      })
      .catch(error => {
      });
  };


  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.modalView}>  

        {/* Map view  */}
        <MapView
          style={{ height: windowHeight, width: windowWidth * (100 / 100)}}
          region={region}
          onRegionChangeComplete={region => {
            setRegion({
                latitude: Number((region?.latitude).toFixed(6)),
                longitude: Number((region?.longitude).toFixed(6)),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            });
            reverseGeocode(region.latitude, region.longitude)
          }}
        >
        </MapView>

        {/* Location Pin */}
        <View style={styles.locationPinIcon}>
              <LottieView 
                source={require('../../assets/Lottie/Location.json')} 
                style={{
                    height:  windowHeight*(8/100),
                    width:  windowHeight*(8/100),
                }} 
                autoPlay
                loop
              />
        </View>

        {/* Current Location Button  */}
        <TouchableOpacity 
            onPress={()=>getOneTimeLocation()}
            style={styles.currentLocCon}
        >
          <View style={styles.currentLocTextCon}>
            <Text style={[styles.fontStyle2,{textAlign:'center', color: colours.primaryWhite}]}>Current Location</Text>
          </View>
        </TouchableOpacity>

        {/* Back & Search Con  */}
        <View style={styles.locationSearch2}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
          <GooglePlacesAutocomplete
              placeholder={ 'Search a new address'}
              textInputProps={styles.searchTextCon}
              styles={styles.searchTextIn}
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
        </View>
      </View>

      {/* Address Component  */}
      <View style={styles.addressContainer}>
        <Text style={styles.fontStyle2}>
            {addressComponent?addressComponent.formatted_address:"Loading.."}
        </Text>
        <AuthButton
            FirstColor={colours.kapraOrange}
            SecondColor={colours.kapraOrangeDark}
            OnPress={
              ()=> addressComponent&&(navigation.dispatch(
                StackActions.replace('GroAddAddressScreen', { 
                  addressComponent: addressComponent, 
                  addressRegion: region, 
                  Data: route?.params?.Data?route?.params?.Data:null,
                })
              ))
            }
            ButtonText={'Confirm & Continue'}
            ButtonWidth={80}
        />
      </View>
    </SafeAreaView>
  );
};

export default GroAddAddressMapScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
  },
  modalView:{
    height:windowHeight*(55/100), 
    width:windowWidth, 
    alignItems:'center',
  },
  locationPinIcon: {
    position:'absolute', 
    alignItems:'center', 
    justifyContent:'center',
    marginTop: windowHeight*(47/100),
    height:windowHeight*(4/100)
  },
  currentLocCon: {
    position:'absolute', 
    justifyContent:'center',
    marginTop:windowHeight*(63/100),
    width:windowWidth*(25/100), 
    alignItems:'center', 
    left:windowWidth*(70/100)
  },
  currentLocTextCon: {
    backgroundColor: colours.kapraBrownDark, 
    width:windowWidth*(25/100), 
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius:windowHeight*(5/100), 
    borderWidth:0.5, 
    borderColor: colours.kapraBlackLow, 
    paddingVertical:5
  },
  locationSearch2: {
    width:windowWidth,
    paddingHorizontal: windowWidth*(3/100),
    position:'absolute', 
    backgroundColor: colours.primaryWhite,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    marginRight: windowWidth*(5/100),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  searchTextCon: {
    placeholderTextColor: colours.kapraBlackLow,
    returnKeyType: "search",
    color: colours.kapraBlack,
    fontFamily: 'Lexend-SemiBold',
    backgroundColor: colours.kapraWhiteLow
  },
  searchTextIn: {
    textInput: {
      color:colours.kapraBlackLow,
      fontFamily: 'Lexend-SemiBold',
      fontSize: getFontontSize(13),
    },
    listView: {
      borderRadius:5,
      backgroundColor: colours.primaryWhite,
      height: windowHeight*(20/100), 
      left: -windowWidth*(15/100), 
      width: windowWidth*(95/100), 
    },
    row: {
      borderRadius:5,
    }
  },
  addressContainer: {
    position:'absolute', 
    justifyContent: 'space-between',
    padding: windowWidth*(5/100),
    width: windowWidth*(90/100), 
    height: windowHeight*(20/100), 
    backgroundColor: colours.primaryWhite, 
    marginTop: Platform.OS === 'ios'? windowHeight*(70/100) : windowHeight*(75/100),
  },



  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(13),
    color: colours.primaryBlack,
    lineHeight: getFontontSize(20),
  },
  fontStyle2: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(13),
    color: colours.primaryBlack
  },

});
