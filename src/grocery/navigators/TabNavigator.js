import React from 'react';
import {  Text,  Dimensions, View, StyleSheet } from 'react-native';
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();

function GroMyTabs() {
  const { GroCartData } = React.useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="GroHome"
      screenOptions={{
        tabBarActiveTintColor: colours.kapraWhite,
        tabBarInactiveTintColor: colours.kapraBlackLow,
        tabBarShowLabel:false,
        tabBarStyle: styles.tabCon,
        tabBarLabelStyle: { fontFamily: 'Lexend-Light',  fontSize: getFontontSize(14)}
      }}
      
    >
      <Tab.Screen
        name="GroHome"
        component={GroHomeScreen}
        options={{
          headerShown:false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('home', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1,{color:color}]}>
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
          headerShown:false,
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('category', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1,{color:color}]}>
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
          headerShown:false,
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('heart', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1,{color:color}]}>
                Wishlist
              </Text>
              {/* {Object.keys(GroCartData).length > 0 && (
                <Badge value={Object.keys(GroCartData).length} containerStyle={{ position: 'absolute', top: -3, right: -10, color:colours.primaryWhite}} badgeStyle={{backgroundColor:colours.primaryRed, borderColor: colours.primaryRed}}  />
              )} */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="GroProfile"
        component={GroProfileScreen}
        options={{
          headerShown:false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.singleTabCon}>
              <View style={styles.iconCon}>
                {showIcon('Profile2', color, windowWidth * (5 / 100))}
              </View>
              <Text
                style={[styles.fontStyle1,{color:color}]}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabCon: {
    height: windowHeight*(8/100), 
    paddingBottom:windowHeight*(1/100),
    backgroundColor: colours.kapraBrownDark, 
    elevation:0, 
    borderTopWidth:2, 
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    borderTopColor: colours.lowWhite
  },
  singleTabCon: {
    alignItems:'center', 
    justifyContent:'space-evenly', 
    height: windowHeight*(5/100),
  },
  iconCon: {
    width: windowHeight*(3.5/100),
    height: windowHeight*(3.5/100)
  },
  fontStyle1: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    paddingTop:5
  },
});

export default GroMyTabs;