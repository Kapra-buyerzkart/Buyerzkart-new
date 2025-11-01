import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStackNavigator } from '@react-navigation/stack';

import BuyerzHomeScreen from '../../navigators/DrawerNavigator';
import GroHomeScreen from '../screens/GroHomeScreen';
import GroCartScreen from '../screens/GroCartScreen';
import GroCategoryScreen from '../screens/GroCategoryScreen';
import GroShopByCategoryScreen from '../screens/GroShopByCategoryScreen';
import GroSearchModalScreen from '../screens/GroSearchModalScreen';
import GroSearchScreen from '../screens/GroSearchScreen';
import GroFilterScreen from '../screens/GroFilterScreen';
import GroSingleItemScreen from '../screens/GroSingleItemScreen';
import GroWishListScreen from '../screens/GroWishListScreen';
import GroLoginScreen from '../screens/GroLoginScreen';
import GroRegisterScreen from '../screens/GroRegisterScreen';
import GroEnterOTPScreen from '../screens/GroEnterOTPScreen';
import GroAddressScreen from '../screens/GroAddressScreen';
import GroAddAddressScreen from '../screens/GroAddAddressScreen';
import GroWriteToUsScreen from '../screens/GroWriteToUsScreen';
import GroOrderSuccessScreen from '../screens/GroOrderSuccessScreen';
import GroOrderUnsuccessScreen from '../screens/GroOrderUnsuccessScreen';
import GroSingleOrderScreen from '../screens/GroSingleOrderScreen';
import GroImageViewScreen from '../screens/GroImageViewScreen';
import GroEditProfileScreen from '../screens/GroEditProfileScreen';
import GroMyOrdersScreen from '../screens/GroMyOrdersScreen';
import GroReferralScreen from '../screens/GroReferralScreen';
import GroWalletScreen from '../screens/GroWalletScreen';
import GroChangePasswordScreen from '../screens/GroChangePasswordScreen';
import GroForgotPasswordScreen from '../screens/GroForgotPasswordScreen';
import GroChangeForgotPasswordScreen from '../screens/GroChangeForgotPasswordScreen';
import GroCategoryArchiveScreen from '../screens/GroCategoryArchiveScreen';
import GroProductRegisterScreen from '../screens/GroProductRegisterScreen';
import GroWriteReviewScreen from '../screens/GroWriteReviewScreen';
import GroReviewScreen from '../screens/GroReviewScreen';
import GroAddAddressMapScreen from '../screens/GroAddAddressMapScreen';
import GroLeadGenScreen from '../screens/GroLeadGenScreen';
import GroBCoinScreen from '../screens/GroBCoinScreen';
import GroLocationFetch from '../screens/GroLocationFetch';

import TestScreen from '../screens/TestScreen';

import GroMyTabs from './TabNavigator';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={'GroLocationFetch'}
      // initialRouteName={'GroHomeScreen'}
    >
      <Stack.Screen name="GroHomeScreen" component={GroMyTabs} />
      <Stack.Screen name="BuyerzHomeScreen" component={BuyerzHomeScreen} />
      <Stack.Screen name="GroCartScreen" component={GroCartScreen} />
      <Stack.Screen name="GroBCoinScreen" component={GroBCoinScreen} />
      <Stack.Screen name="GroCategoryScreen" component={GroCategoryScreen} />
      <Stack.Screen name="GroShopByCategoryScreen" component={GroShopByCategoryScreen} />
      <Stack.Screen name="GroSearchModalScreen" component={GroSearchModalScreen} />
      <Stack.Screen name="GroSearchScreen" component={GroSearchScreen} />
      <Stack.Screen name="GroFilterScreen" component={GroFilterScreen} />
      <Stack.Screen name="GroSingleItemScreen" component={GroSingleItemScreen} />
      <Stack.Screen name="GroWishListScreen" component={GroWishListScreen} />
      <Stack.Screen name="GroLoginScreen" component={GroLoginScreen} />
      <Stack.Screen name="GroRegisterScreen" component={GroRegisterScreen} />
      <Stack.Screen name="GroEnterOTPScreen" component={GroEnterOTPScreen} />
      <Stack.Screen name="GroAddressScreen" component={GroAddressScreen} />
      <Stack.Screen name="GroAddAddressScreen" component={GroAddAddressScreen} />
      <Stack.Screen name="GroWriteToUsScreen" component={GroWriteToUsScreen} />
      <Stack.Screen name="GroOrderSuccessScreen" component={GroOrderSuccessScreen} />
      <Stack.Screen name="GroOrderUnsuccessScreen" component={GroOrderUnsuccessScreen} />
      <Stack.Screen name="GroSingleOrderScreen" component={GroSingleOrderScreen} />
      <Stack.Screen name="GroImageViewScreen" component={GroImageViewScreen} />
      <Stack.Screen name="GroEditProfileScreen" component={GroEditProfileScreen} />
      <Stack.Screen name="GroMyOrdersScreen" component={GroMyOrdersScreen} />
      <Stack.Screen name="GroReferralScreen" component={GroReferralScreen} />
      <Stack.Screen name="GroWalletScreen" component={GroWalletScreen} />
      <Stack.Screen name="GroChangePasswordScreen" component={GroChangePasswordScreen} />
      <Stack.Screen name="GroForgotPasswordScreen" component={GroForgotPasswordScreen} />
      <Stack.Screen name="GroChangeForgotPasswordScreen" component={GroChangeForgotPasswordScreen} />
      <Stack.Screen name="GroCategoryArchiveScreen" component={GroCategoryArchiveScreen} />
      <Stack.Screen name="GroProductRegisterScreen" component={GroProductRegisterScreen} />
      <Stack.Screen name="GroWriteReviewScreen" component={GroWriteReviewScreen} />
      <Stack.Screen name="GroReviewScreen" component={GroReviewScreen} />
      <Stack.Screen name="GroAddAddressMapScreen" component={GroAddAddressMapScreen} />
      <Stack.Screen name="GroLeadGenScreen" component={GroLeadGenScreen} />
      <Stack.Screen name="GroLocationFetch" component={GroLocationFetch} />






      <Stack.Screen name="TestScreen" component={TestScreen} />




    </Stack.Navigator>
  );
}
