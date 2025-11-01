import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import { AppContext } from '../Context/appContext';

import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
export default function PaymentSuccessScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.fontStyle1}>PAYMENT SUCCESS!</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.fontStyle2}>ORDER#: </Text>
        <Text style={styles.fontStyle2}>AABCD87674573</Text>
      </View>
      <Text style={styles.fontStyle3}>
        All the details of your transactions will be sent on your registered
        email id.
      </Text>
      <AuthButton
        BackgroundColor={colours.grey}
        OnPress={() => navigation.navigate('Transaction')}
        ButtonText={'MY ORDERS'}
        Border={true}
        BorderColor={'#fff'}
      />
      <AuthButton
        BackgroundColor={colours.secondaryColour}
        OnPress={() => navigation.navigate('Home')}
        ButtonText={'CONTINUE SHOPPING'}
        Border={true}
        BorderColor={'#fff'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontStyle1: {
    color: '#fff',
    fontSize: 30,
    paddingBottom: '5%',
  },
  fontStyle2: {
    color: '#fff',
    fontSize: 20,
  },
  fontStyle3: {
    color: '#fff',
    fontSize: 15,
    width: '80%',
    textAlign: 'center',
    paddingTop: '5%',
    paddingBottom: '10%',
  },
});
