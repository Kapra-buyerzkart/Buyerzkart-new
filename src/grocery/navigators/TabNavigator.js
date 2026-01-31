import React from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { Badge } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import GroHomeScreen from '../screens/GroHomeScreen';
import GroShopByCategoryScreen from '../screens/GroShopByCategoryScreen';
import GroCartScreen from '../screens/GroCartScreen';
import GroProfileScreen from '../screens/GroProfileScreen';
import GroWishListScreen from '../screens/GroWishListScreen';

import { AppContext } from '../../Context/appContext';
import { getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();

function GroMyTabs() {
  const { GroCartData } = React.useContext(AppContext);

  const insets = useSafeAreaInsets();

  // const KshopeButton = () => {
  //   return (
  //     <TouchableOpacity style={styles.KshopeButton}>
  //       {/* <Text style={styles.KshopeButtonText}>K-shope</Text> */}
  //       <Image source={require("../../../src/assets/images/kshope.png")} style={{
  //         width: wp("19.53%"),
  //         height: hp("3%"),
  //         resizeMode: "contain"
  //       }} />
  //     </TouchableOpacity>)
  // }

  const EmptyScreen = () => {
    return null;
  };

  const KshopeButton = () => {
    const navigation = useNavigation();

    const handleKshopePress = async () => {
      try {
        await AsyncStorage.setItem('currentApp', 'BUYERZ');

        navigation.reset({
          index: 0,
          routes: [{ name: 'BuyerzHomeScreen' }],
        });
      } catch (error) {
        console.log('Kshope switch error:', error);
      }
    };

    return (
      <TouchableOpacity
        style={styles.KshopeButton}
        onPress={handleKshopePress}
        activeOpacity={0.8}
      >
        <Image
          source={require("../../../src/assets/images/kshope.png")}
          style={{
            width: wp("19.53%"),
            height: hp("3%"),
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="GroHome"
      screenOptions={{
        // tabBarActiveTintColor: colours.kapraWhite,
        tabBarActiveTintColor: '#F25000',
        // tabBarInactiveTintColor: colours.kapraBlackLow,
        tabBarInactiveTintColor: null,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabCon, {
          height: Platform.OS === "android" ? hp("7%") + insets.bottom : hp("8%"),
        }],
        tabBarLabelStyle: { fontFamily: 'Lexend-Light', fontSize: getFontontSize(14) }
      }}

    >
      <Tab.Screen
        name="GroHome"
        component={GroHomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('homeTwo', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1, { color: color }]}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="GroCategory"
        component={GroShopByCategoryScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('grid', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1, { color: color }]}>
                Categories
              </Text>
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="GroCart"
        component={GroCartScreen}
        options={{
          headerShown:false,
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('Cart2', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1,{color:color}]}>
                Cart
              </Text>
              {Object.keys(GroCartData).length > 0 && (
                <Badge value={Object.keys(GroCartData).length} containerStyle={{ position: 'absolute', top: -3, right: -10, color:colours.primaryWhite}} badgeStyle={{backgroundColor:colours.primaryRed, borderColor: colours.primaryRed}}  />
              )}
            </View>
          ),
        }}
      /> */}
      <Tab.Screen
        name="GroWishList"
        component={GroWishListScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('heartTwo', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1, { color: color }]}>
                Wishlist
              </Text>
              {/* {Object.keys(GroCartData).length > 0 && (
                <Badge value={Object.keys(GroCartData).length} containerStyle={{ position: 'absolute', top: -3, right: -10, color:colours.primaryWhite}} badgeStyle={{backgroundColor:colours.primaryRed, borderColor: colours.primaryRed}}  />
              )} */}
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="GroProfile"
        component={GroProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('Profile2', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1, { color: color }]}>
                Profile
              </Text>
            </View>
          ),
        }}
      /> */}
      {/* <Tab.Screen
        name="Kshope"
        // component={KshopeScreen}
        options={{
          tabBarButton: (props) => (
            <KshopeButton />
          ),
        }} /> */}
      <Tab.Screen
        name="Kshope"
        component={EmptyScreen}
        options={{
          tabBarButton: () => <KshopeButton />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabCon: {
    height: windowHeight * (8 / 100),
    paddingBottom: windowHeight * (1 / 100),
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderTopWidth: 2,
    // borderTopLeftRadius:15,
    // borderTopRightRadius:15,
    borderTopColor: colours.lowWhite,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  singleTabCon: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: windowHeight * (5 / 100),
    position: 'absolute',
    top: hp("1%"),
  },
  iconCon: {
    width: windowHeight * (3.5 / 100),
    height: windowHeight * (3.5 / 100)
  },
  fontStyle1: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    paddingTop: 5
  },
  KshopeButton: {
    width: wp("28.84%"),
    height: hp("5.26"),
    backgroundColor: "#990EE2",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("0.8%"),
    marginRight: wp('3%')
  },
});

export default GroMyTabs;