import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Dimensions,
  Alert
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

// import { BlurView } from "@react-native-community/blur";
import RadialGradient from 'react-native-radial-gradient';
import Animated from 'react-native-reanimated';
import { TouchableRipple, Title } from 'react-native-paper';



import { AppContext } from '../Context/appContext';
import { getFontontSize } from '../globals/functions';
import TabNavigator from './TabNavigator';
import ShopByCategoryScreen from '../screens/ShopByCategoryScreen';
import LatestArrivalScreen from '../screens/LatestArrivalScreen';
import WishListScreen from '../screens/WishListScreen';
import AddressScreen from '../screens/AddressScreen';
import PolicyScreen from '../screens/PolicyScreen';
import WriteToUsScreen from '../screens/WriteToUsScreen';
import CouponsScreen from '../screens/CouponsScreen';
import WalletScreen from '../screens/WalletScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import ReferralScreen from '../screens/ReferralScreen';


import colours from '../globals/colours';
import showIcon from '../globals/icons';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Drawer = createDrawerNavigator();

const UserView = ({ navigation, opacity }) => {

  const { profile, logout } = React.useContext(AppContext);
  return (
    <TouchableRipple
      onPress={() => {
        navigation.navigate('Profile')
      }}
    >
      <Animated.View style={[styles.drawerHeader, { opacity }]}>
        <Image style={styles.profileImage} source={require('../assets/logo/logo.png')} />
        <View>
          <Title style={styles.title}>{`Welcome ${profile.bkCustId ? profile.custName : 'Guest'}`}</Title>
          <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
          }}>
            <Text style={styles.subTitle}>
              {profile.emailId}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableRipple>
  )
}

const CustomDrawer = (props) => {
  const { profile, logout } = React.useContext(AppContext);

  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  const opacity = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.1, 1]
  })
  return (
    <RadialGradient style={{flex:1}}
      colors={[colours.kapraLight, 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
      stops={[0.1, 0.5, 1]}
      center={[145, 100]}
      radius={650}>
      {/* <BlurView
        style={styles.blurAbsolute}
        blurType="light"
        blurAmount={20}
        overlayColor="transparent"
        reducedTransparencyFallbackColor="white"//ios only
      /> */}
      <Animated.View style={{ flex: 1, transform: [{ translateX }], backgroundColor: 'transparent' }}>
        <DrawerContentScrollView {...props}>
          <UserView {...props} opacity={opacity} />
          <DrawerItemList {...props}
            activeTintColor={colours.kapraLight}
            inactiveTintColor={colours.primaryBlack}
          />
        </DrawerContentScrollView>
        <DrawerItem
          label={`${profile.bkCustId ? "Logout" : 'Login / Register'}`}
          style={{borderTopWidth:1, height: windowHeight*(10/100)}}
          onPress={profile.bkCustId ? () => 
            Alert.alert(
              'Logout',
              'Are you sure want to logout?',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async () => {
                    await logout();
                  },
                },
              ],
              { cancelable: false },
            )
            : () => props.navigation.navigate('Login')}
          // icon={({ color, size }) => <MaterialIcons color={color} size={size} name='logout' />}
          labelStyle={{ 
            fontSize: getFontontSize(16),
            fontFamily: 'Proxima Nova Alt Bold',
            color: colours.primaryRed,
            textAlign:'left',
            width:windowWidth*(60/100)
          }}
        />
      </Animated.View>
    </RadialGradient>
  )
}

export default function DrawerNavigator() {
  const { profile, logout } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <Drawer.Navigator
      drawerStyle={{
        width: windowWidth*(70/100),
        backgroundColor: 'transparent',
      }}
      drawerType={'front'}
      edgeWidth={100}
      drawerContentOptions={{
        labelStyle: { 
          fontSize: getFontontSize(16),
          fontFamily: 'Proxima Nova Alt Bold',
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>), headerShown: false}}/>
      <Drawer.Screen name="Shop By Category" component={ShopByCategoryScreen} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
      {
        profile.bkCustId &&(
          <>
          <Drawer.Screen name="My Orders" component={MyOrdersScreen} icon={<View>{showIcon('refer', colours.primaryBlack,windowWidth*(4/100))}</View>} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}}/>
          <Drawer.Screen name="My Wishlist" component={WishListScreen} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
          <Drawer.Screen name="My Referrals" component={ReferralScreen} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
          <Drawer.Screen name="My Wallet" component={WalletScreen} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
          {/* <Drawer.Screen name="Coupons and Offers" component={CouponsScreen} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} /> */}
          <Drawer.Screen name="Contact Us" component={WriteToUsScreen} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
          </>
        )
      }
      <Drawer.Screen name="Privacy Policy" component={PolicyScreen} initialParams={{
        Type: 'Privacy Policy',
        fromReg: true,
      }} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
      <Drawer.Screen name="About Us" component={PolicyScreen} initialParams={{
        Type: 'About Us',
        fromReg: true,
      }} options={{drawerIcon: () => (<View style={{height:10}}>{showIcon('rightarrow', colours.primaryBlack,windowWidth*(4/100))}</View>)}} />
    </Drawer.Navigator>
  );
}


const styles = StyleSheet.create({
  cardStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  drawerNavigator: {
    width: windowWidth*(70/100),
    backgroundColor: 'transparent',
    // backgroundColor: colours.accent,
  },
  absolute: {
    flex: 1,
    height: '100%',
  },
  icon: {
    paddingBottom: 2,
  },
  drawerHeader: {
    width: '100%',
    height: windowHeight*(20/100),
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
  },
  profileImage: {
    backgroundColor: colours.lightWhite,
    width: windowWidth*(25/100),
    height: windowWidth*(25/100),
    borderRadius: windowWidth*(20/100),
    borderWidth: 5,
    borderColor: colours.kapraMain,
    resizeMode:'contain',
  },
  title: {
    color: colours.primaryWhite,
    fontSize: getFontontSize(20),
    fontFamily: 'Proxima Nova Alt Bold',
    textAlign: 'center',
    marginTop: 10,
  },
  subTitle: {
    color: colours.lightWhite,
    fontSize: getFontontSize(14),
    fontFamily: 'Proxima Nova Alt Regular',
    textAlign: 'center',
  },
  blurAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})