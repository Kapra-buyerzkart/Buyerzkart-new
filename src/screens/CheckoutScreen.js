import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { AppContext } from '../Context/appContext';
const windowWidth = Dimensions.get('window').width;

import Header from '../components/Header';
import colours from '../globals/colours';
export default function CheckoutScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'Checkout'}
        Cart={false}
        WishList={false}
        BgColor={'#fff'}
        IconColor={'#003366'}
        TextColor={'#000'}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.rowContainer}>
          <Text style={styles.fontStyle1}>Delivery Address</Text>
          <TouchableOpacity>
            <Text style={styles.fontStyle2}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boredrBottomContainer}>
          <Text style={styles.fontStyle2}>Christopher I. Harvey</Text>
          <Text
            style={[
              styles.fontStyle3,
              { paddingTop: '2%', paddingBottom: '2%' },
            ]}>
            (+1) 309-634-4689
          </Text>
          <Text style={styles.fontStyle3}>
            2503 Garfield Road Bartonville, Illinois 6160
          </Text>
        </View>
        <View style={styles.boredrBottomContainer}>
          <Text style={styles.fontStyle1}>Delivery Options</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '3%',
            }}>
            <Text style={styles.fontStyle2}>Free : </Text>
            <Text style={styles.fontStyle3}>Standard Delivery</Text>
          </View>
          <Text style={styles.fontStyle3}>
            Delivered on or before monday, 25 June 2020
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '3%',
            }}>
            <Text style={styles.fontStyle2}>$18 : </Text>
            <Text style={styles.fontStyle3}>Express Delivery</Text>
          </View>
          <Text style={styles.fontStyle3}>
            Delivered on or After Friday, 02 July 2020
          </Text>
        </View>
        <View style={styles.boredrBottomContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.fontStyle1}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.fontStyle2}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginTop: '4%' }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                backgroundColor: colours.secondaryColour,
                marginRight: '5%',
              }}></View>
            <View>
              <Text style={styles.fontStyle2}>HDFC Back Credit Card</Text>
              <Text style={styles.fontStyle3}>48** **** **** 4687</Text>
            </View>
          </View>
        </View>
        <View style={styles.boredrBottomContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.fontStyle3}>Sub Total:</Text>
            <Text style={styles.fontStyle2}>$442.42</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.fontStyle3}>Delivery: </Text>
            <Text style={styles.fontStyle2}>Free</Text>
          </View>
        </View>
        <View style={[styles.rowContainer, { paddingTop: '5%' }]}>
          <Text style={styles.fontStyle2}>Total:</Text>
          <Text style={styles.fontStyle2}>$442.42</Text>
        </View>
        <View style={[styles.rowContainer, { marginTop: '10%' }]}>
          <TextInput
            style={styles.textInput}
            placeholder={'Enter Voucher Code'}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>APPLY COUPON</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth * (90 / 100),
  },
  fontStyle1: {
    color: colours.secondaryColour,
    fontWeight: 'bold',
    fontSize: 17,
  },
  fontStyle2: {
    color: colours.grey,
    fontWeight: 'bold',
    fontSize: 14,
  },
  fontStyle3: {
    fontWeight: 'bold',
    fontSize: 11,
    color: colours.grey,
  },
  boredrBottomContainer: {
    width: windowWidth * (90 / 100),
    paddingTop: '5%',
    paddingBottom: '5%',
    borderBottomWidth: 1,
    borderBottomColor: colours.grey,
  },
  textInput: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colours.grey,
    borderRadius: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colours.secondaryColour,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkoutButton: {
    marginTop: '10%',
    marginBottom: '20%',
    paddingVertical: 10,
    width: windowWidth * (90 / 100),
    backgroundColor: colours.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
