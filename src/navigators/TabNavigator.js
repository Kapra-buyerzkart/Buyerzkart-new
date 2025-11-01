import React from 'react';
import {  Text,  Dimensions, View } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/CartScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShopByCategoryScreen from '../screens/ShopByCategoryScreen';
import SearchModalScreen from '../screens/SearchModalScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { AppContext } from '../Context/appContext';
import { Badge } from 'react-native-elements';
import { getFontontSize } from '../globals/functions';
import LinearGradient from 'react-native-linear-gradient';

import showIcon from '../globals/icons';
import colours from '../globals/colours';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();

function MyTabs() {
  const { cartData, Language } = React.useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colours.primaryOrange,
        tabBarInactiveTintColor: colours.lightGrey,
        tabBarShowLabel:false,
        tabBarStyle: {height: windowHeight*(8/100), paddingBottom:windowHeight*(1/100),backgroundColor: colours.primaryWhite, elevation:0, borderTopWidth:2, borderTopColor: colours.lowWhite},
        tabBarLabelStyle: { fontFamily: 'Proxima Nova Alt Bold',  fontSize: getFontontSize(14)}
      }}
      
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown:false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems:'center', justifyContent:'space-evenly', height: windowHeight*(7/100)}}>
              <View style={{width: windowHeight*(4/100),height: windowHeight*(4/100)}}>
                {showIcon('home', color, windowWidth * (7 / 100))}
              </View>
              {/* <Text
                style={{
                  fontFamily: 'Proxima Nova Alt Bold',
                  fontSize: getFontontSize(12),
                  color:color,
                  paddingTop:5
                }}>
                Home
              </Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Category"
        component={ShopByCategoryScreen}
        options={{
          tabBarLabel: 'Categories',
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems:'center', justifyContent:'space-evenly', height: windowHeight*(7/100) }}>
              <View style={{width: windowHeight*(4/100),height: windowHeight*(4/100)}}>
                {showIcon('list', color, windowWidth * (7 / 100))}
              </View>
              {/* <Text
                style={{
                  fontFamily: 'Proxima Nova Alt Bold',
                  fontSize:getFontontSize(12),
                  color:color,
                  paddingTop:5
                }}>
                Category
              </Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <>
              <Text
                style={{
                  fontFamily: 'Proxima Nova Alt Bold',
                  fontSize: windowWidth*(4/100),
                }}>
                {showIcon('cart', color, windowWidth * (7 / 100))}
              </Text>
              {Object.keys(cartData).length > 0 && (
                <Badge value={Object.keys(cartData).length} containerStyle={{ position: 'absolute', top: 5, right: 15, color:colours.primaryColor}} badgeStyle={{backgroundColor:colours.primaryOrange, borderColor: colours.primaryOrange}}  />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notification',
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems:'center', justifyContent:'space-evenly', height: windowHeight*(7/100)}}>
              <View style={{width: windowHeight*(4/100),height: windowHeight*(4/100)}}>
                {showIcon('notifications', color, windowWidth * (7 / 100))}
              </View>
              {/* <Text
                style={{
                  fontFamily: 'Proxima Nova Alt Bold',
                  fontSize: getFontontSize(12),
                  color:color,
                  paddingTop:5
                }}>
                Notification
              </Text> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems:'center', justifyContent:'space-evenly', height: windowHeight*(7/100)}}>
              <View style={{width: windowHeight*(4/100),height: windowHeight*(4/100)}}>
                {showIcon('profile', color, windowWidth * (7 / 100))}
              </View>
              {/* <Text
                style={{
                  fontFamily: 'Proxima Nova Alt Bold',
                  fontSize: getFontontSize(12),
                  color:color,
                  paddingTop:5
                }}>
                Account
              </Text> */}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;