import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import Header from '../components/Header';
import OrdersCard from '../components/OrdersCard';
import {getImage} from '../globals/functions';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';

const DATA = {
  Message: '',
  Data: [
    {
      status: 'Order Cancelled',
      customer: 'Fasal Cochin',
      Products: 'Green Apple (1 item(s) more)',
      ProductCount: '2',
      Address: null,
      ProductImgUrl:
        'assets\\images\\uploads\\productimages\\imgDr.OdinMultiFunctionNon-ContactForeheadInfraredThermometerwithIRSensor,ColorChangingDisplayandMemoryButton20200612T093755.jpg',
      orderId: 84,
      cartID: 0,
      custId: 18,
      custBillingAdressId: null,
      orderDate: '2020-08-06T04:17:06.81',
      orderAmount: 941.49,
      orderTax: 1.49,
      orderDiscount: 499,
      orderStatus: null,
      orderDeliveryDate: null,
      orderCancelledDate: null,
      orderReturnDate: null,
      orderReturnStatus: null,
      returnOrderId: null,
      delDate: null,
      orderDeliveryCharge: null,
      orderNumber: 'ORD8782939853',
      custShippingAdressId: null,
      cpId: null,
      couponDiscount: null,
      AgencyCommissions: [],
      OrderItems: [],
      OrderPayments: [],
      OrderStatus1: [],
      ReferalCommissions: [],
      Refunds: [],
    },
    {
      status: 'Order Placed',
      customer: 'Fasal Cochin',
      Products:
        'AGARO NB- 21 Compressor Nebulizer with 5 Air filters, Adult & Child Mask',
      ProductCount: '1',
      Address: null,
      ProductImgUrl:
        'assets\\images\\uploads\\productimages\\imgAGARONB-21CompressorNebulizerwith5Airfilters,Adult&ChildMask20200612T091710.jpg',
      orderId: 59,
      cartID: 0,
      custId: 18,
      custBillingAdressId: null,
      orderDate: '2020-07-23T08:42:35.567',
      orderAmount: 1499,
      orderTax: 1,
      orderDiscount: 0,
      orderStatus: null,
      orderDeliveryDate: null,
      orderCancelledDate: null,
      orderReturnDate: null,
      orderReturnStatus: null,
      returnOrderId: null,
      delDate: null,
      orderDeliveryCharge: null,
      orderNumber: 'ORD3844132571',
      custShippingAdressId: null,
      cpId: null,
      couponDiscount: null,
      AgencyCommissions: [],
      OrderItems: [],
      OrderPayments: [],
      OrderStatus1: [],
      ReferalCommissions: [],
      Refunds: [],
    },
  ],
};

export default function RecentOrderScreen({navigation}) {
  const [data, setData] = React.useState(DATA);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} HeaderText={'My Recent Orders'} sideNav />
      <OrdersCard
        Product={data.Data[0].Products}
        Date={data.Data[0].orderDate}
        ProductCount={data.Data[0].ProductCount}
        ImageUri={getImage(data.Data[0].ProductImgUrl)}
        OnPress={() => alert('Click')}
      />
      <OrdersCard
        Product={data.Data[1].Products}
        Date={data.Data[1].orderDate}
        ProductCount={data.Data[1].ProductCount}
        ImageUri={getImage(data.Data[1].ProductImgUrl)}
        OnPress={() => alert('Click')}
      />
      <OrdersCard
        Product={data.Data[1].Products}
        Date={data.Data[1].orderDate}
        ProductCount={data.Data[1].ProductCount}
        ImageUri={getImage(data.Data[1].ProductImgUrl)}
        OnPress={() => alert('Click')}
      />
      <View style={{bottom: 0, position: 'absolute'}}>
        <AuthButton
          BackgroundColor={colours.primaryBlue}
          OnPress={() => alert('CLick')}
          ButtonText={'View All Orders'}
          ButtonWidth={90}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
});
