import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import { AppContext } from '../Context/appContext';
import { CommonActions } from '@react-navigation/native';
import { getFontontSize } from '../globals/functions';

export default function OrderConfirmScreen({ navigation, route }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const { orderNo, orderId } = route.params;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'Order Confirmation'}
        backEnable
      />
      <View style={styles.innerContainer}>
        <View
          style={{
            width: windowWidth * (90 / 100),
            height: windowHeight * (30 / 100),
            alignItems: 'center',
            paddingVertical: '5%',
          }}>
          <Text>{showIcon('tick', colours.primaryGreen, 100)}</Text>
          <Text style={[styles.fontStyle1,{color: colours.primaryGreen}]}>SUCCESS</Text>
        </View>
        <View
          style={{
            width: windowWidth * (90 / 100),
            alignItems: 'center',
            paddingVertical: '10%',
          }}>
          <Text style={styles.fontStyle1}>{'Your Order Received'}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SingleOrder', {
                orderId: orderId,
              })
            }>
            <Text
              style={[
                styles.fontStyle2,
                { paddingTop: '2%', paddingBottom: '2%' },
              ]}>
              {'Your Order'} : {orderNo}
            </Text>
          </TouchableOpacity>
        </View>
        <AuthButton
          BackgroundColor={colours.kapraMain}
          OnPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'DrawerNavigator' }],
          })}
          ButtonText={'Continue Shopping'}
          ButtonWidth={90}
        />
        <AuthButton
          BackgroundColor={colours.primaryRed}
          OnPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'DrawerNavigator' },
                  {
                    name: 'MyOrdersScreen',
                  },
                ],
              })
            )
          }
          ButtonText={'My Orders'}
          ButtonWidth={90}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: windowWidth * (90 / 100),
    height: windowHeight * (50 / 100)
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(22),
    color: colours.kapraMain,
  },

  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.kapraMain,
  },
});
