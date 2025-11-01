import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStackNavigator } from '@react-navigation/stack';
import EditProfileScreen from '../screens/EditProfileScreen';
import WishListScreen from '../screens/WishListScreen';
import SingleItemScreen from '../screens/SingleItemScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TransactionScreen from '../screens/TransactionScreen';
import ReviewScreen from '../screens/ReviewScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import TabNavigator from './TabNavigator';
import DrawerNavigator from './DrawerNavigator';
import AuthNavigator from '../navigators/AuthNavigator';
import WriteToUsScreen from '../screens/WriteToUsScreen';
import CouponsScreen from '../screens/CouponsScreen';
import WalletScreen from '../screens/WalletScreen';

import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SingleOrderScreen from '../screens/SingleOrderScreen';
import RecentOrderScreen from '../screens/RecentOrderScreen';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SetNewPasswordScreen from '../screens/SetNewPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChangeForgotPasswordScreen from '../screens/ChangeForgotPasswordScreen';
import WriteReviewScreen from '../screens/WriteReviewScreen';
import FilterScreen from '../screens/FilterScreen';
import SearchAutoCompleteScreen from '../screens/SearchAutoCompleteScreen';
import OrderConfirmScreen from '../screens/OrderConfirmScreen';
import AddressScreen from '../screens/AddressScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddAddressMapScreen from '../screens/AddAddressMapScreen';
import EnterOTPScreen from '../screens/EnterOTPScreen';
import CategoryArchiveScreen from '../screens/CategoryArchiveScreen';
import DealOfTheDayScreen from '../screens/DealOfTheDayScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import SplashScreen from '../screens/SplashScreen';
import PolicyScreen from '../screens/PolicyScreen';
import MultivendorScreen from '../screens/MultivendorScreen';
import ImageViewScreen from '../screens/ImageViewScreen';
import OfferZoneScreen from '../screens/OfferZoneScreen';
import LatestArrivalScreen from '../screens/LatestArrivalScreen';
import Splash from '../screens/Splash';
import ExistingUserPasswordReset from '../screens/ExistingUserPasswordReset';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrderUnsuccessScreen from '../screens/OrderUnsuccessScreen';
import SearchModalScreen from '../screens/SearchModalScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ShopByCategoryScreen from '../screens/ShopByCategoryScreen';
import ReferralScreen from '../screens/ReferralScreen';
import SupportScreen from '../screens/SupportScreen';
import ProductRegisterScreen from '../screens/ProductRegisterScreen';
import BCoinScreen from '../screens/BCoinScreen';

import GroceryHome from '../grocery/navigators/HomeStackNavigator'

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  const [isOpenedBefore, setIOP] = React.useState(null);
  React.useEffect(() => {
    const asynceffect = async () => {
      let iop = await AsyncStorage.getItem('isOpenedBefore');
      setIOP(iop === null ? false : iop);
    };
    asynceffect();
  }, []);

  if (isOpenedBefore === null) return null;
  return (
    <Stack.Navigator
      initialRouteName={
        isOpenedBefore === 'true' ? 'Splash' : 'Splash'
      }
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="GroceryHome" component={GroceryHome} />
      <Stack.Screen name="ShopByCategoryScreen" component={ShopByCategoryScreen} />
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      <Stack.Screen name="BCoinScreen" component={BCoinScreen} />
      <Stack.Screen name="CouponsScreen" component={CouponsScreen} />
      <Stack.Screen name="Transaction" component={TransactionScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="SingleItemScreen" component={SingleItemScreen} />
      <Stack.Screen name="WishList" component={WishListScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="ProductRegisterScreen" component={ProductRegisterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchModalScreen" component={SearchModalScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SingleOrder" component={SingleOrderScreen} />
      <Stack.Screen name="RecentOrder" component={RecentOrderScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangeForgotPassword" component={ChangeForgotPasswordScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
      <Stack.Screen name="OrderConfirm" component={OrderConfirmScreen} />
      <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
      <Stack.Screen name="OrderUnsuccessScreen" component={OrderUnsuccessScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="AddAddressMap" component={AddAddressMapScreen} />
      <Stack.Screen name="OTP" component={EnterOTPScreen} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
      <Stack.Screen name="CategoryArchive" component={CategoryArchiveScreen} />
      <Stack.Screen name="DealOfTheDayScreen" component={DealOfTheDayScreen} />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
      <Stack.Screen name="MultivendorScreen" component={MultivendorScreen} />
      <Stack.Screen name="ImageViewScreen" component={ImageViewScreen} />
      <Stack.Screen name="offerZoneScreen" component={OfferZoneScreen} />
      <Stack.Screen name="LatestArrivalScreen" component={LatestArrivalScreen} />
      <Stack.Screen name="WriteToUsScreen" component={WriteToUsScreen} />
      <Stack.Screen name="ReferralScreen" component={ReferralScreen} />
      <Stack.Screen name="SearchAutoCompleteScreen" component={SearchAutoCompleteScreen} />
      <Stack.Screen name="ExistingUserPasswordReset" component={ExistingUserPasswordReset} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
    </Stack.Navigator>
  );
}
