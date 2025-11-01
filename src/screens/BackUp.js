// Location Fetch Grocery 





import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid, Platform, Button, SafeAreaView, Modal, KeyboardAvoidingView, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import MapView, { MAP_TYPES, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-simple-toast';

import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { getFontontSize } from '../../globals/functions';
import { AppContext } from '../../Context/appContext';
import AuthButton from '../components/AuthButton';

import { areaListPincodeWise, getPolicies } from '../api';
import { log } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const GroLocationFetch = ({ navigation }) => {
  const { profile, editPincode } = React.useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [addressComponent, setAddressComponent] = React.useState(null);
  const [locationSelectionModal, setLocationSelectionModal] = React.useState(false)
  const [locationSearchModal, setLocationSearchModal] = React.useState(false)
  const [listOfLocations, setListOfLocations] = React.useState(null)
  const [selectedLocation, setSelectedLocation] = React.useState(null)
  const [ dummy, setDummy ] = React.useState(false);

  const [region, setRegion] = React.useState({
    latitude: 10.0224066, 
    longitude: 76.3041375,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008
  });


  useEffect(() => {
    _fetchData();
  }, []);

  const _fetchData = async() => {
    try{
      // let res = await getPolicies();
      // if (res && res.find(obj => obj.stName == 'leadgeneration').stValue == '0') {
        if (Platform.OS === 'android') {
          requestLocationPermission();
        } else {
          fetchLocation();
        }
      // } else{
      //   navigation.navigate('GroHomeScreen')
      // }
    } catch(err){
    }
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Required",
          message: "This app needs to access your location",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchLocation();
      } else {
        Alert.alert("Location Permission Denied");
      }
    } catch (err) {
      // console.log("Err : ", err);
      Alert.alert(
        'ALERT',
        `We're having some problems getting the location. Kindly adjust your location in the next screen.`,
        [
          {
            text: 'OK',
            onPress: async () =>{
              setLocationSelectionModal(false),
              navigation.reset({
                  index: 0,
                  routes: [
                      {
                          name: 'GroHomeScreen',
                      }
                  ],
              })
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const fetchLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          latitude: position?.coords?.latitude, 
          longitude: position?.coords?.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008
        })
        reverseGeocode(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        setTimeout(funSetLoading, 2000);

        // console.log("Err : ", error);
        Alert.alert(
          'ALERT',
          `We're having some problems getting the location. Kindly adjust your location in the next screen.`,
          [
            {
              text: 'OK',
              onPress: async () =>{
                setLocationSelectionModal(false)
                // navigation.reset({
                //     index: 0,
                //     routes: [
                //         {
                //             name: 'GroHomeScreen',
                //         }
                //     ],
                // })
              },
            },
          ],
          { cancelable: false },
        );
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  const reverseGeocode = (latitude, longitude) => {
    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    axios.get(url)
      .then(response => {
        const address = response.data.results[0].formatted_address;
        var addressComponent = response.data.results[0];
        funSetAddComponent(addressComponent);
        getLocationPincodeAreas(addressComponent?.address_components.find(component => component.types.includes("postal_code"))?.long_name)
        setTimeout(funSetLoading, 4000);
      })
      .catch(error => {
        Alert.alert(
          'ALERT',
          `We're having some problems getting the location. Kindly adjust your location in the next screen.`,
          [
            {
              text: 'OK',
              onPress: async () =>{
                setLocationSelectionModal(false),
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'GroHomeScreen',
                        }
                    ],
                })
              },
            },
          ],
          { cancelable: false },
        );
      });
  };

  const getLocationPincodeAreas = async (postcode) => {
    try {
      let area = await areaListPincodeWise(postcode);
      if(area?.length > 1){
        if(area.find((obj)=> obj?.pincodeId == profile?.pincode)){
          setTimeout( async function () {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'GroHomeScreen',
                    }
                ],
            })
          }, 3000)
        } else{
          setLocationSelectionModal(true)
          setListOfLocations(area)
        }
      } else if(area?.length == 1){
        await editPincode(area[0]);
        setTimeout( async function () {
          navigation.reset({
              index: 0,
              routes: [
                  {
                      name: 'GroHomeScreen',
                  }
              ],
          })
        }, 3000)
      } else {
        Alert.alert(
          'ALERT',
          `Delivery not available in selected location..`,
          [
            {
              text: 'Search Again',
            },
            {
              text: 'Skip',
              onPress: async () =>{
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'GroHomeScreen',
                        }
                    ],
                })
              },
            },
          ],
          { cancelable: false },
        );
      }

    } catch (error) {
      Alert.alert(
        'ALERT',
        `Delivery not available in selected location..`,
        [
          {
            text: 'Search Again',
          },
          {
            text: 'Skip',
            onPress: async () =>{
              navigation.reset({
                  index: 0,
                  routes: [
                      {
                          name: 'GroHomeScreen',
                      }
                  ],
              })
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const funSetLoading = () => {
    setLoading(false);
    setDummy(!dummy)
  }

  const funSetAddComponent = async( value ) => {
    setAddressComponent(value);
    setDummy(!dummy)
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Map  */}
      <MapView
        style={{ height: windowHeight, width: windowWidth}}
        region={region}
      />

      {/* Content above map  */}
      <View style={styles.secondCon}>

        {/* Location Pin  */}
        <View style={styles.animation}>
              <LottieView 
                source={require('../../assets/Lottie/Location.json')} 
                style={{
                  width: windowWidth*(20/100),
                  height:windowWidth*(20/100),
                  top: Platform.OS == 'ios'? windowHeight*(1/100): windowHeight*(2/100),
                }}
                autoPlay
                loop
              />
        </View>
        
        {/* Search & Location Buttons  */}
        <View style={styles.iconMainCon}>
          <TouchableOpacity style={styles.iconCmnCon}>
            {showIcon('location', colours.kapraOrangeLight, windowWidth*(5/100))}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCmnCon} onPress={()=> setLocationSearchModal(true)}>
            {showIcon('search', colours.kapraOrangeLight, windowWidth*(5/100))}
          </TouchableOpacity>

        </View>

        {/* Address Format  */}
        <View style={styles.addressCon}>
          {addressComponent ? (
            <Text style={styles.fontStyle2}>
              {addressComponent?addressComponent.formatted_address:''}
            </Text>
          ) : (
            <>
              <Text style={styles.fontStyle2}>We Are Fetching Your Location...</Text>
              <Text style={styles.fontStyle5}>(You can also search it from our search option)</Text>
            </>
          )}
        </View>

      </View>

      {/* Location Search Modal  */}
      <Modal
        animationType="slide"
        visible={locationSearchModal}
        transparent={true}
      >

      <KeyboardAvoidingView
        behavior="position"
        enabled
      >
        <BlurView
          style={styles.blurStyle}
          blurType="light"
          blurAmount={1}
          overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
          reducedTransparencyFallbackColor='black'
        />
        <View style={[styles.updateModalView1,{height: windowHeight * (37 / 100), marginTop: windowHeight * (63 / 100),paddingTop:0}]}>

          {/* Modal Head  */}
          <View style={styles.modalHeader}>
            <Text style={styles.fontStyle1}>Search your area</Text>
            <TouchableOpacity style={styles.iconCmnCon} onPress={()=> setLocationSearchModal(false)}>
              {showIcon('close', colours.kapraOrangeLight, windowWidth*(5/100))}
            </TouchableOpacity>
          </View>
              
          {/*  Search Con  */}
          <View style={styles.locationSearch2}>
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
                          <View style={styles.iconCmnCon}>{showIcon('address', colours.kapraOrangeLight, 15)}</View>
                          <View style={{marginLeft:10}}>
                            <Text style={[styles.fontStyle3,{paddingBottom:2}]}>{title}</Text>
                            <Text style={[styles.fontStyle5,{ color: colours.primaryBlack}]}>{address}</Text>
                          </View>
                        </View>
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
                  reverseGeocode(Number(details.geometry.location.lat), Number(details.geometry.location.lng))
                  setLocationSearchModal(false)
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
      </KeyboardAvoidingView>
      </Modal>


      {/* Picode Locations Modal  */}
      <Modal
        animationType="slide"
        visible={locationSelectionModal}
        transparent={true}
      >
      <BlurView
        style={styles.blurStyle}
        blurType="light"
        blurAmount={1}
        overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
        reducedTransparencyFallbackColor='black'
      />
          <View style={[styles.updateModalView1,{height: windowHeight * (55 / 100), marginTop: windowHeight * (45 / 100),paddingTop:0}]}>
              <View style={styles.modalHeader}>
                <Text style={styles.fontStyle1}>Choose your area</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <FlatList
                  data={listOfLocations}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={styles.locationCon}
                      onPress={async()=>{setSelectedLocation(item)}}
                    >
                      <Text style={styles.fontStyle2}>{item?.area}</Text>
                      {
                        selectedLocation&&selectedLocation?.pincodeId == item?.pincodeId&&(
                          <View>{showIcon('tick', colours.kapraOrange, windowWidth*(5/100))}</View>
                        )
                      }
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>
              {
                listOfLocations&&listOfLocations.length>1&&(
                  <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-between'}}>
                    <AuthButton
                      FirstColor={colours.primaryRed}
                      SecondColor={colours.lightRed}
                      OnPress={() => { setLocationSelectionModal(false)
                        // navigation.reset({
                        //     index: 0,
                        //     routes: [
                        //         {
                        //             name: 'GroHomeScreen',
                        //         }
                        //     ],
                        // }) 
                      }}
                      ButtonText={'Skip'}
                      ButtonWidth={44}
                      ButtonHeight={5}
                    />
                    <AuthButton
                      FirstColor={colours.kapraOrangeLight}
                      SecondColor={colours.kapraOrange}
                      OnPress={async() => { 
                          await editPincode(selectedLocation);
                          setSelectedLocation(null)
                          setLocationSelectionModal(false);
                          navigation.reset({
                              index: 0,
                              routes: [
                                  {
                                      name: 'GroHomeScreen',
                                  }
                              ],
                          })
                       }}
                      ButtonText={'Apply'}
                      ButtonWidth={44}
                      ButtonHeight={5}
                    />
                  </View>
                )
              }
          </View> 
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    alignItems:'center',
    justifyContent: 'flex-end',
    overflow:'hidden',
    
  },
  iconMainCon: {
    width: windowWidth,
    height: windowHeight*(7/100),
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'flex-end',
    paddingHorizontal: windowWidth*(5/100),
  },
  iconCmnCon: {
    width: windowHeight*(5/100),
    height: windowHeight*(5/100),
    backgroundColor: colours.kapraWhite,
    marginLeft:10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Android Shadow
    elevation: 5,
  },

  // Modal Styles 
  blurStyle: {
    width: windowWidth,
    height: windowHeight,
    position:'absolute',
    alignItems:'center', 
    justifyContent:'center' ,
    backgroundColor: null,
    overflow: 'hidden'
  },
  updateModalView1: {
    height: windowHeight * (35 / 100),
    marginTop: windowHeight * (65 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.kapraWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
    justifyContent:'flex-start'
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight*(7/100),
    paddingHorizontal: windowWidth*(5/100),
    alignItems:'center',
    justifyContent: 'space-between',
    flexDirection:'row',
    backgroundColor: colours.kapraOrangeLight,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  locationSearch2: {
    width:windowWidth,
    backgroundColor: colours.primaryWhite,
    justifyContent:'center',
    height: windowHeight*(30/100),

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Android Shadow
    elevation: 5,
  },
  searchTextCon: {
    placeholderTextColor: colours.kapraBlackLow,
    returnKeyType: "search",
    color: colours.kapraBlack,
    fontFamily: 'Lexend-SemiBold',
    backgroundColor: colours.kapraWhiteLow,
  },
  searchTextIn: {
    textInput: {
      height: windowHeight*(6/100),
      width:windowWidth*(90/100),
      color:colours.kapraBlackLow,
      fontFamily: 'Lexend-SemiBold',
      fontSize: getFontontSize(13),
    },
    listView: {
      borderRadius:5,
      backgroundColor: colours.primaryWhite,
      height: windowHeight*(20/100),  
      width: windowWidth
    },
    row: {
      borderRadius:5,
    }
  },
  locationCon: {
    width: windowWidth*(90/100),
    height: windowHeight*(5/100),
    paddingHorizontal: windowWidth*(5/100),
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor: colours.kapraOrangeLow,
    marginTop:10,
    borderRadius:5
  },






  // Fonts 
  fontStyle1: {
    fontFamily: 'Lexend-Bold',
    fontSize: getFontontSize(18),
    color: colours.primaryWhite
  },
  fontStyle2: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(16),
    color: colours.kapraOrangeLight
  },
  fontStyle3: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(15),
    color: colours.kapraBlackLight
  },
  fontStyle5: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    color: colours.kapraBlackLow,
  },






















  animation: {
    width: windowWidth*(80/100),
    height: windowHeight*(50/100),
    alignItems:'center',
    justifyContent:'center'
    // marginTop: windowHeight*(10/100)
  },

  firstCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    alignItems:'center',
  },
  lottieCon2: {
    position:'absolute', 
    alignItems:'center', 
    justifyContent:'center',
    marginTop:Platform.OS == 'ios'? windowHeight*(43/100) : windowHeight*(44/100),
    height:windowHeight*(4/100)
  },
  addressCon: {
    width: windowWidth,
    height: windowHeight * (25/100),
    paddingHorizontal: windowWidth*(10/100),
    paddingVertical:  windowHeight * (4.5/100),
    backgroundColor: colours.primaryWhite,
  },
  headerFont: {
    fontFamily: 'Montserrat-BoldItalic',
    fontSize: getFontontSize(18),
    color: colours.primaryWhite
  },
  fontStyle4: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(14),
    color: colours.primaryGreen,
    textDecorationLine:'underline'
  },
});

export default GroLocationFetch;