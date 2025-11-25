import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid, Platform, SafeAreaView, Modal, KeyboardAvoidingView, TouchableOpacity, ScrollView, FlatList, Alert, Linking, AppState } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BlurView } from '@react-native-community/blur';

import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { getFontontSize } from '../../globals/functions';
import { AppContext } from '../../Context/appContext';
import AuthButton from '../components/AuthButton';
import { areaListPincodeWise, getPolicies } from '../api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';

// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroLocationFetch = ({ navigation }) => {
  const { profile, editPincode } = React.useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [addressComponent, setAddressComponent] = useState(null);
  const [locationSelectionModal, setLocationSelectionModal] = useState(false);
  const [locationSearchModal, setLocationSearchModal] = useState(false);
  const [listOfLocations, setListOfLocations] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dummy, setDummy] = useState(false);
  const [locationNotFetched, setLocationNotFetched] = useState(false);

  const [region, setRegion] = useState({
    latitude: 10.0224066,
    longitude: 76.3041375,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });

  const insets = useSafeAreaInsets();
  const userInteractedRef = useRef(false); // 🟢 Track user interaction
  const timeoutRef = useRef(null); // 🕐 Store timer reference

  useEffect(() => {
    // if (Platform.OS === 'android') {
    //   requestLocationPermission();
    // } else {
    //   fetchLocation();
    // }
    checkLocationServicesAndPermission();

    // 🕒 Start 10-sec fallback timer
    startAutoNavigateTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const openLocationSettings = () => {
    if (Platform.OS !== 'android') return;

    // Try all safe fallback options
    Linking.openSettings().catch(() => { });
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(() => { });
    Linking.openURL('package:com.android.settings').catch(() => { });
  };

  const checkLocationServicesAndPermission = async () => {
    try {
      // ---- 1. CHECK APP PERMISSION ----
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      let result = await check(permission);

      // console.log('result', result)

      if (result === RESULTS.DENIED) {
        result = await request(permission);
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Location Permission Off',
          'Please enable location permission for Kapra Daily to continue.',
          [
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ]
        );
        return false;
      }

      // ---- 2. CHECK IF LOCATION SERVICES / GPS IS ENABLED ----
      const gpsEnabled = await DeviceInfo.isLocationEnabled();

      if (!gpsEnabled) {
        Alert.alert(
          'Location Services Off',
          'Please enable GPS/location services to continue.',
          [
            {
              text: 'Open Location Settings',
              onPress: () => openLocationSettings(),
            },
          ]
        );
        return false;
      }

      // ---- 3. EVERYTHING OK → Fetch Location ----
      fetchLocation();
      return true;

    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (nextState === 'active') {
          // User returned from settings
          const gpsEnabled = await DeviceInfo.isLocationEnabled();

          if (gpsEnabled) {
            fetchLocation();       // 🔥 Fetch again automatically
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  const startAutoNavigateTimer = () => {
    timeoutRef.current = setTimeout(() => {
      // Navigate only if user has NOT interacted
      if (!userInteractedRef.current && showConfirm) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'GroHomeScreen',
              params: {
                screen: 'GroHome',
                params: {
                  locationNotFetched: false,
                },
              },
            },
          ],
        });
      }
    }, 10000); // 10 seconds
  };

  const stopAutoNavigateTimer = () => {
    // 🛑 Stop the 10-sec auto navigation when user interacts
    userInteractedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchLocation();
      } else {
        Alert.alert('Location Permission Denied');
      }
    } catch (err) { }
  };

  const fetchLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        });
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log('Location fetch error', error);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  const reverseGeocode = (latitude, longitude) => {
    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    axios
      .get(url)
      .then((response) => {
        // console.log("response", response)
        const address = response.data.results[0].formatted_address;
        var addressComponent = response.data.results[0];
        funSetAddComponent(addressComponent);
        const postalCode = addressComponent?.address_components.find((component) =>
          component.types.includes('postal_code')
        )?.long_name;
        // console.log('postalCode', postalCode)
        getLocationPincodeAreas(postalCode);
        setTimeout(funSetLoading, 4000);
      })
      .catch((error) => {
        console.log('Reverse geocode error', error);
      });
  };

  const getLocationPincodeAreas = async (postcode) => {
    try {
      let area = await areaListPincodeWise(postcode);
      if (area?.length > 1) {
        // console.log("1111111")
        if (area.find((obj) => obj?.pincodeId == profile?.pincode)) {
          // console.log("2222222")
          setTimeout(() => {
            if (!userInteractedRef.current) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'GroHomeScreen',
                    params: {
                      screen: 'GroHome',
                      params: {
                        locationNotFetched: false,
                      },
                    },
                  },
                ],
              });
            }
          }, 2000);
        } else {
          // console.log("33333")
          setShowConfirm(true);
          setListOfLocations(area);
        }
      } else if (area?.length == 1) {
        // console.log("444444444")
        await editPincode(area[0]);
        setTimeout(() => {
          if (!userInteractedRef.current) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'GroHomeScreen',
                  params: {
                    screen: 'GroHome',
                    params: {
                      locationNotFetched: false,
                    },
                  },
                },
              ],
            });
          }
        }, 2000);
      }
    } catch (error) {
      console.log('API error:', error);
      // Do not navigate immediately; let fallback timer handle it
      // setLocationNotFetched(true)
      // navigation.reset({
      //   index: 0,
      //   routes: [{
      //     name: 'GroHomeScreen',
      //     params: {
      //       locationNotFetched
      //     }
      //   }],
      // });
      await editPincode("")
      setTimeout(() => {
        if (!userInteractedRef.current) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'GroHomeScreen',
                params: {
                  screen: 'GroHome',
                  params: {
                    locationNotFetched: true,
                  },
                },
              },
            ],
          });
        }
      }, 10000);
      Toast.show("Delivery is not available to your location")
    }
  };

  const funSetLoading = () => {
    setLoading(false);
    setDummy(!dummy);
  };

  const funSetAddComponent = (value) => {
    setAddressComponent(value);
    setDummy(!dummy);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>

      {/* Map */}
      <MapView style={{ height: windowHeight, width: windowWidth }} region={region} scrollEnabled={false} />

      {/* Skip Button */}
      <View
        style={[
          styles.iconMainCon,
          { top: Platform.OS == 'ios' ? windowHeight * 0.01 : windowHeight * 0.03 },
        ]}
      >
        <AuthButton
          FirstColor={colours.kapraRed}
          SecondColor={colours.kapraOrange}
          OnPress={() => {
            // stopAutoNavigateTimer();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'GroHomeScreen',
                  params: {
                    screen: 'GroHome',
                    params: {
                      locationNotFetched: false,
                    },
                  },
                },
              ],
            });
          }}
          FSize={14}
          ButtonText={'Skip'}
          ButtonWidth={20}
          ButtonHeight={3}
        />
      </View>

      {/* Location Pin */}
      <View style={styles.animation}>
        <LottieView
          source={require('../../assets/Lottie/Location.json')}
          style={{
            width: windowWidth * 0.2,
            height: windowWidth * 0.2,
          }}
          autoPlay
          loop
        />
      </View>

      {/* Search & Location Buttons */}
      <View style={styles.iconMainCon}>
        <TouchableOpacity
          style={styles.iconCmnCon}
        // onPress={() => {
        //   stopAutoNavigateTimer();
        //   fetchLocation();
        // }}
        >
          {showIcon('location', colours.kapraOrangeLight, windowWidth * 0.05)}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconCmnCon}
          onPress={() => {
            stopAutoNavigateTimer();
            setLocationSearchModal(true);
          }}
        >
          {showIcon('search', colours.kapraOrangeLight, windowWidth * 0.05)}
        </TouchableOpacity>
      </View>

      {/* Address Format */}
      <View style={[
        styles.addressCon,
        {
          paddingBottom: insets.bottom + 20, // adds space for safe area
        },
      ]}>
        {addressComponent ? (
          <Text style={styles.fontStyle2} numberOfLines={3}>
            {addressComponent?.formatted_address}
          </Text>
        ) : (
          <>
            <Text style={styles.fontStyle2}>We Are Fetching Your Location...</Text>
            <Text style={styles.fontStyle5}>
              (You can also search it from our search option)
            </Text>
          </>
        )}
        <Text />
        {showConfirm && (
          <AuthButton
            FirstColor={colours.kapraOrangeLight}
            SecondColor={colours.kapraOrange}
            OnPress={() => {
              stopAutoNavigateTimer();
              setLocationSelectionModal(true);
              setShowConfirm(false);
            }}
            ButtonText={'Confirm'}
            ButtonWidth={80}
            ButtonHeight={5}
          />
        )}
      </View>

      {/* Location Search Modal */}
      <Modal animationType="slide" visible={locationSearchModal} transparent>
        <KeyboardAvoidingView behavior="position" enabled>
          <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={1}
            overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
            reducedTransparencyFallbackColor="black"
          />
          <View
            style={[
              styles.updateModalView1,
              { height: windowHeight * 0.37, marginTop: windowHeight * 0.63, paddingTop: 0 },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.fontStyle1}>Search your area</Text>
              <TouchableOpacity
                style={styles.iconCmnCon}
                onPress={() => {
                  stopAutoNavigateTimer();
                  setLocationSearchModal(false);
                }}
              >
                {showIcon('close', colours.kapraOrangeLight, windowWidth * 0.05)}
              </TouchableOpacity>
            </View>

            <View style={styles.locationSearch2}>
              <GooglePlacesAutocomplete
                placeholder={'Search a new address'}
                textInputProps={styles.searchTextCon}
                styles={styles.searchTextIn}
                debounce={200}
                renderRow={(rowData) => {
                  const title = rowData.structured_formatting.main_text;
                  const address = rowData.structured_formatting.secondary_text;
                  return (
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.iconCmnCon}>
                          {showIcon('address', colours.kapraOrangeLight, 15)}
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={[styles.fontStyle3, { paddingBottom: 2 }]}>{title}</Text>
                          <Text style={[styles.fontStyle5, { color: colours.primaryBlack }]}>
                            {address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                onPress={(data, details = null) => {
                  stopAutoNavigateTimer();
                  setRegion({
                    latitude: Number(details.geometry.location.lat),
                    longitude: Number(details.geometry.location.lng),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  });
                  funSetAddComponent(details);
                  reverseGeocode(
                    Number(details.geometry.location.lat),
                    Number(details.geometry.location.lng)
                  );
                  setLocationSearchModal(false);
                }}
                query={{
                  key: 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y',
                  language: 'en',
                  components: 'country:IN',
                }}
                fetchDetails={true}
                listViewDisplayed={false}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Pincode Locations Modal */}
      <Modal animationType="slide" visible={locationSelectionModal} transparent>
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
          <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={1}
            overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
            reducedTransparencyFallbackColor="black"
          />
          <View
            style={[
              styles.updateModalView1,
              {
                paddingBottom: Platform.OS === "android" ? insets.bottom + 20 : 0, // ensures safe spacing above nav bar
                paddingTop: 10,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.fontStyle1}>Choose your area</Text>
              <TouchableOpacity
                style={styles.iconCmnCon}
                onPress={() => {
                  stopAutoNavigateTimer();
                  setLocationSelectionModal(false);
                }}
              >
                {showIcon('close', colours.kapraOrangeLight, windowWidth * 0.05)}
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FlatList
                data={listOfLocations}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.locationCon}
                    onPress={() => {
                      stopAutoNavigateTimer();
                      setSelectedLocation(item);
                    }}
                  >
                    <Text style={styles.fontStyle2}>{item?.area}</Text>
                    {selectedLocation && selectedLocation?.pincodeId == item?.pincodeId && (
                      <View>{showIcon('tick', colours.kapraOrange, windowWidth * 0.05)}</View>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>

            {listOfLocations && listOfLocations.length > 1 && (
              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidth * 0.9,
                  justifyContent: 'space-between',
                  marginTop: 5
                }}
              >
                <AuthButton
                  FirstColor={colours.primaryRed}
                  SecondColor={colours.lightRed}
                  OnPress={() => {
                    // stopAutoNavigateTimer();
                    setLocationSelectionModal(false);
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'GroHomeScreen',
                          params: {
                            screen: 'GroHome',
                            params: {
                              locationNotFetched: false,
                            },
                          },
                        },
                      ],
                    });
                  }}
                  ButtonText={'Skip'}
                  ButtonWidth={44}
                  ButtonHeight={5}
                />
                <AuthButton
                  FirstColor={colours.kapraOrangeLight}
                  SecondColor={colours.kapraOrange}
                  OnPress={async () => {
                    // stopAutoNavigateTimer();
                    await editPincode(selectedLocation);
                    setSelectedLocation(null);
                    setLocationSelectionModal(false);
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'GroHomeScreen',
                          params: {
                            screen: 'GroHome',
                            params: {
                              locationNotFetched: false,
                            },
                          },
                        },
                      ],
                    });
                  }}
                  ButtonText={'Apply'}
                  ButtonWidth={44}
                  ButtonHeight={5}
                />
              </View>
            )}
          </View>
        </SafeAreaView>

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
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',

  },
  iconMainCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight * (7 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: windowWidth * (5 / 100),
    top: Platform.OS == 'ios' ? windowHeight * (65 / 100) : windowHeight * (69 / 100),
  },
  iconCmnCon: {
    width: windowHeight * (5 / 100),
    height: windowHeight * (5 / 100),
    backgroundColor: colours.kapraWhite,
    marginLeft: 10,
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
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: null,
    overflow: 'hidden'
  },
  // updateModalView1: {
  //   height: windowHeight * (35 / 100),
  //   marginTop: windowHeight * (65 / 100),
  //   paddingTop: windowHeight * (1 / 100),
  //   paddingBottom: windowHeight * (2 / 100),
  //   backgroundColor: colours.kapraWhite,
  //   borderTopRightRadius: 40,
  //   borderTopLeftRadius: 40,
  //   elevation: 10,
  //   alignItems: "center",
  //   justifyContent: 'flex-start'
  // },
  updateModalView1: {
    backgroundColor: colours.kapraWhite,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colours.kapraOrangeLight,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  locationSearch2: {
    width: windowWidth,
    backgroundColor: colours.primaryWhite,
    justifyContent: 'center',
    height: windowHeight * (30 / 100),

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
      height: windowHeight * (6 / 100),
      width: windowWidth * (90 / 100),
      color: colours.kapraBlackLow,
      fontFamily: 'Lexend-SemiBold',
      fontSize: getFontontSize(13),
    },
    listView: {
      borderRadius: 5,
      backgroundColor: colours.primaryWhite,
      height: windowHeight * (20 / 100),
      width: windowWidth
    },
    row: {
      borderRadius: 5,
    }
  },
  locationCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colours.kapraOrangeLow,
    marginTop: 10,
    borderRadius: 5
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
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS == 'ios' ? windowHeight * (42 / 100) : windowHeight * (46 / 100),
    height: windowHeight * (4 / 100),
  },

  firstCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
  },
  lottieCon2: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? windowHeight * (43 / 100) : windowHeight * (44 / 100),
    height: windowHeight * (4 / 100)
  },
  // addressCon: {
  //   position: 'absolute',
  //   width: windowWidth,
  //   height: windowHeight * (25 / 100),
  //   top: Platform.OS == 'ios' ? windowHeight * (72 / 100) : windowHeight * (76 / 100),
  //   paddingHorizontal: windowWidth * (10 / 100),
  //   paddingVertical: windowHeight * (4.5 / 100),
  //   backgroundColor: colours.primaryWhite,
  // },
  addressCon: {
    position: 'absolute',
    bottom: 0, // ⬅️ instead of top
    width: windowWidth,
    paddingHorizontal: windowWidth * 0.1,
    // paddingTop: windowHeight * 0.02,
    // paddingBottom: windowHeight * 0.03,
    paddingVertical: windowHeight * 0.04,
    backgroundColor: colours.primaryWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
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
    textDecorationLine: 'underline'
  },


});

export default GroLocationFetch;