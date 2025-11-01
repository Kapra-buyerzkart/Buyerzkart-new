import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';

import { RadioButton } from 'react-native-paper';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { getImage } from '../globals/functions';
import PaymentCard from '../components/PaymentCard';
import AuthButton from '../components/AuthButton';
import { AppContext } from '../Context/appContext';
import { placeOrder, initiatePayment, getPaymentMethods, getCartSummary } from '../api';
import { addressList, getCartList } from '../api';
import Toast from 'react-native-simple-toast';
import { LoaderContext } from '../Context/loaderContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import PriceCard from '../components/PriceCard';
import { CommonActions } from '@react-navigation/native';
import { getFontontSize } from '../globals/functions';
import RazorpayCheckout from 'react-native-razorpay';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PaymentScreen({ navigation, route }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const { showLoader, loading } = React.useContext(LoaderContext);

  //let address = route?.params?.address ? route?.params?.address : null;
  let pickupFromStore = route?.params?.pickupFromStore ? true : false;
  const subTotal = route?.params?.subTotal ? route?.params?.subTotal : 0;
  const { profile } = React.useContext(AppContext);
  const [isSelected, setSelection] = React.useState(false);
  const isFocused = useIsFocused();
  const [addData, setAddData] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [checked, setChecked] = React.useState('COD');
  const [modalVisibleBilling, setModalVisibleBilling] = React.useState(false);
  const [modalVisibleShipping, setModalVisibleShipping] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  const [patmentMethods, setPaymentMethods] = React.useState(null);
  const [shipAddress, setShipAddress] = React.useState({});
  const [billAddress, setBillAddress] = React.useState({});
  const [ cartSummary, setCartSummary ] = React.useState(null);

  const _fetchAddressData = async () => {
    try {
      showLoader(true);
      let resCS = await getCartSummary()
      setCartSummary(resCS)
      let res = await getCartList();
      setData(res.cartList);
      let res1 = await addressList();
      setAddData(res1);
      if (res1.length != 0) {
        res1.map((item, i) => {
          if (item.isDefaultBillingAddress) {
            setBillAddress(item);
          }
          if (item.isDefaultShippingAddress) {
            setShipAddress(item);
          }
        });
      }
      let res2 = await getPaymentMethods();
      setPaymentMethods(res2);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  // React.useEffect(() => {
  //   _fetchAddressData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      _fetchAddressData();
    }, []),
  );

  const razorPayUpdate = async(res) => {
    var options = {
      description: `Payment of ${res.orderNumber}`,
      currency: 'INR',
      key: res.rpUserName,
      name: 'Kapra Daily',
      order_id: res.rpToken,
      prefill: {
        email: res.custEmail,
        contact: res.custPhone,
        name: res.custName
      },
      theme: {color: colours.kapraMain},
      notes : {
          transactionMode:"Buyerzkart"
      }
    }
    RazorpayCheckout.open(options).then(async(data) => {
      navigation.dispatch(
        CommonActions.reset({
        index: 1,
        routes: [
            { name: 'DrawerNavigator' },
            {
                name: 'OrderSuccessScreen',
                params: { orderNo: res.orderNumber, orderId: res.orderId, },
            },
        ],
        })
      )
    }).catch((error) => {
      navigation.dispatch(
        CommonActions.reset({
        index: 1,
        routes: [
            { name: 'DrawerNavigator' },
            {
                name: 'OrderUnsuccessScreen',
                params: { data:res },
            },
        ],
        })
      )
    });
  }
  
  let _placeOrder = async () => {
    try {
      showLoader(true);
      let res = await placeOrder({
        custBillAdressId: billAddress.custAdressId,
        custShipAdressId: shipAddress.custAdressId,
        payMethod: checked,
      });

      if(checked =="COD"){
        navigation.dispatch(
          CommonActions.reset({
          index: 1,
          routes: [
              { name: 'DrawerNavigator' },
              {
                  name: 'OrderSuccessScreen',
                  params: { orderNo: res.orderNumber, orderId: res.orderId, },
              },
          ],
          })
        )
        showLoader(false);
      } else{
        let res1 = await initiatePayment(res.orderId)
        showLoader(false);
        razorPayUpdate(res1)
      }
    } catch (error) {
      showLoader(false);
      Toast.show(error);
      if(error == 'Customer is deleted'){
               alert('Your account has been deactivated by admin');
               logout();
      }
    }
  };


  if (addData === null) {
    return null;
  } else {
    if (addData.length === 0)
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.primaryWhite }}>
          <Header
            backEnable
            navigation={navigation}
            HeaderText={'My Addresses'}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colours.primaryWhite,
              height: windowHeight * (70 / 100),
              //paddingBottom: windowHeight * (10 / 100),
              paddingTop: windowHeight * (20 / 100),
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle6}>{'My Address Empty'}</Text>
            {/* <Text style={styles.fontStyle4}>
            It is a Long Established fact that a Reader will be distracted by the
            readable content
          </Text> */}
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() => navigation.navigate('AddAddressMap')}
              ButtonText={'Add New'}
              ButtonWidth={90}
            />
          </View>
        </SafeAreaView>
      );
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header navigation={navigation} HeaderText={'Checkout'} backEnable />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.borderBottomContainer}>
            <Text style={[styles.fontStyle1, { color: colours.kapraMain }]}>Personal Info</Text>
            <Text style={styles.fontStyle2}>{profile.custName}</Text>
            <Text style={styles.fontStyle2}>{profile.phoneNo}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={[styles.fontStyle1, { width: windowWidth * (70 / 100), color: colours.kapraMain }]}>Billing Address</Text>
              <TouchableOpacity onPress={() => setModalVisibleBilling(true)}>
                <Text style={[styles.fontStyle1, { width: windowWidth * (20 / 100), color: colours.primaryRed }]}>Change</Text>
              </TouchableOpacity>
            </View>
            {/* <Text style={styles.fontStyle2}>
              {billAddress.firstName} {billAddress.lastName}
            </Text> */}
            <Text style={styles.fontStyle2}>{billAddress.addLine1}, {billAddress.addLine2}, {billAddress.district}, {`${billAddress.state}, ${billAddress.country}`}, </Text>
            <Text style={styles.fontStyle2}>+91 {billAddress.phone}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={[styles.fontStyle1, { width: windowWidth * (70 / 100), color: colours.kapraMain }]}>Shipping Address</Text>
              <TouchableOpacity onPress={() => setModalVisibleShipping(true)}>
                <Text style={[styles.fontStyle1, { width: windowWidth * (20 / 100), color: colours.primaryRed }]}>Change</Text>
              </TouchableOpacity>
            </View>
            {/* <Text style={styles.fontStyle2}>
              {shipAddress.firstName} {shipAddress.lastName}
            </Text> */}
            <Text style={styles.fontStyle2}>{shipAddress.addLine1}, {billAddress.addLine2}, {billAddress.district},  {`${shipAddress.state} ${shipAddress.country}`}</Text>
            <Text style={styles.fontStyle2}>+91 {shipAddress.phone}</Text>
          </View>

          <View style={[styles.borderBottomContainer, { paddingTop: '4%' }]}>
            <Text style={[styles.fontStyle1, { color: colours.kapraMain }]}>Cart Items : </Text>
            {data.length !== 0 && (
              data.map((item, i) => (
                <PaymentCard
                  key={i}
                  Name={item.prName.toUpperCase()}
                  SoldBy={item.venderName}
                  Price={item.itemTotal}
                  UnitPrice={item.unitPrice}
                  OutofStock={item.stockAvailability}
                  ImageUri={getImage(item.imageUrl)}
                  qty={item.qty}
                  maxQty={item.maxQtyInOrders}
                  QOH={item.qoh}
                  BackOrder={item.backOrders}
                  IsAvailable={item.IsAvailPincode}
                />
              )))}
          </View>
          <View style={styles.borderBottomContainer}>
            <View style={styles.Pricing}>
              <View style={{ paddingRight: 10, width: windowWidth * (90 / 100), }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                  <Text style={styles.fontStyle7}>Subtotal :</Text>
                  <PriceCard
                    UnitPrice={cartSummary.subTotal}
                    FontSize={getFontontSize(12)}
                    Color={colours.primaryGrey}
                  />
                </View>
                {cartSummary.discountAmount > 0 && (
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                      <Text style={styles.fontStyle7}>Discount :</Text>
                      <PriceCard
                        UnitPrice={cartSummary.discountAmount}
                        FontSize={getFontontSize(12)}
                        Color={colours.primaryGrey}
                      />
                    </View>
                  </View>
                )}
                {cartSummary.bcoinsAppplied > 0 && (
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                      <Text style={styles.fontStyle7}>B-Coin :</Text>
                      <PriceCard
                        UnitPrice={cartSummary.bcoinsAppplied}
                        FontSize={getFontontSize(12)}
                        Color={colours.primaryGrey}
                      />
                    </View>
                  </View>
                )}
                {cartSummary.couponAmount > 0 && (
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                      <Text style={[styles.fontStyle7, { width: windowWidth * (65 / 100) }]}>CouponDiscount ( {cartSummary.cpcode} ):</Text>
                      <PriceCard
                        UnitPrice={cartSummary.couponAmount}
                        FontSize={getFontontSize(12)}
                        Color={colours.primaryGrey}
                      />
                    </View>
                  </View>
                )}
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={styles.fontStyle7}>Shipping : </Text>
                    {cartSummary.deliveryCharge > 0 ?
                      <PriceCard
                        UnitPrice={cartSummary.deliveryCharge}
                        FontSize={getFontontSize(12)}
                        Color={colours.primaryGrey}
                      />
                      :
                      <Text style={[styles.fontStyle7, { color: colours.primaryGreen }]}>FREE</Text>
                    }
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.Pricing, { justifyContent: 'space-between' }]}>
              <Text style={styles.fontStyle7}>Total</Text>
              <PriceCard
                UnitPrice={cartSummary.grandTotal}
                FontSize={getFontontSize(14)}
                Color={colours.kapraMain}
              />
            </View>
            <View style={[styles.Pricing, { justifyContent: 'space-between' }]}>
              <Text style={styles.fontStyle7}>Total B-Tokens :</Text>
              <Text style={[styles.fontStyle7,{fontWeight:'bold'}]}>{cartSummary.totalBTokenValue}</Text>
            </View>
          </View>




          <View style={[styles.borderBottomContainer, { paddingTop: '4%' }]}>
            <Text style={[styles.fontStyle1, { color: colours.kapraMain }]}>Payment Methods</Text>
            {
              patmentMethods&&patmentMethods.map((item, i)=>(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ borderWidth: Platform.OS === 'ios' ? 0.5 : 0, borderRadius: 5, margin: 5 }}>
                    <RadioButton
                      value={item.paymentModeName}
                      status={checked === item.paymentModeName ? 'checked' : 'unchecked'}
                      onPress={() => setChecked(item.paymentModeName)}
                      color={colours.primaryRed}
                    />
                  </View>
                  <Text style={styles.fontStyle3}>{item.paymentModeName}</Text>
                </View>
              ))
            }
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ borderWidth: Platform.OS === 'ios' ? 0.5 : 0, borderRadius: 5, margin: 5 }}>
                <RadioButton
                  value="COD"
                  status={checked === 'COD' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('COD')}
                  color={colours.primaryRed}
                />
              </View>
              <Text>{showIcon('COD', colours.primaryGreen, windowWidth * (8 / 100))}</Text>
              <Text style={styles.fontStyle3}>Cash On Delivery</Text>
            </View> */}
          </View>
        </ScrollView>


        <View style={{ justifyContent: 'center' }}>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={modalVisibleBilling}
            >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisibleBilling(!modalVisibleBilling);
                  }}
                  style={{ width: 50, height: 50, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: getFontontSize(34), color: colours.primaryWhite }}>
                    X
                  </Text>
                </TouchableOpacity>
                <View style={{ marginBottom: windowWidth * (25 / 100), backgroundColor: colours.primaryWhite, borderTopLeftRadius:30, borderTopRightRadius: 30 }}>
                  <ScrollView >
                    <View style={{ bottom: 0, alignItems: 'center', paddingTop: ' 5%' }}>
                      <AuthButton
                        BackgroundColor={colours.kapraMain}
                        OnPress={() => { setModalVisibleBilling(!modalVisibleBilling), navigation.navigate('AddAddressMap') }}
                        ButtonText={'Add New'}
                        ButtonWidth={90}
                      />
                    </View>
                    {addData.map((item, i) => {
                      return (
                        <TouchableOpacity
                          style={{ width: windowWidth * (100 / 100), height: windowWidth * (25 / 100), backgroundColor: colours.kapraLow, marginBottom: 10, paddingLeft: 30, justifyContent: 'center' }}
                          key={i}
                          onPress={
                            () => { setBillAddress(item), setModalVisibleBilling(!modalVisibleBilling) }
                          }
                        >
                          <Text style={styles.fontStyle2}>
                            {item.addLine1}, {item.addLine2}
                          </Text>
                          <Text style={styles.fontStyle2}>
                            {item.state}, {item.country},
                          </Text>
                          <Text style={styles.fontStyle2}>
                            {item.landmark}
                          </Text>
                          <Text style={styles.fontStyle2}>
                            {item.phone}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={modalVisibleShipping}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisibleShipping(!modalVisibleShipping);
                  }}
                  style={{ width: 50, height: 50, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: getFontontSize(34), color: colours.primaryWhite }}>
                    X
                  </Text>
                </TouchableOpacity>
                <View style={{ marginBottom: windowWidth * (25 / 100), backgroundColor: colours.primaryWhite, borderTopLeftRadius:30, borderTopRightRadius: 30 }}>
                  <ScrollView >
                    <View style={{ bottom: 0, alignItems: 'center', paddingTop: ' 5%' }}>
                      <AuthButton
                        BackgroundColor={colours.kapraMain}
                        OnPress={() => { setModalVisibleShipping(!modalVisibleShipping), navigation.navigate('AddAddressMap', { fromPayment: true }) }}
                        ButtonText={'Add New'}
                        ButtonWidth={90}
                      />
                    </View>
                    {addData.map((item, i) => {
                      return (
                        <TouchableOpacity
                          style={{ width: windowWidth * (100 / 100), height: windowWidth * (25 / 100), backgroundColor: colours.kapraLow, marginBottom: 10, paddingLeft: 30, justifyContent: 'center' }}
                          key={i}
                          onPress={
                            () => { setShipAddress(item), setModalVisibleShipping(!modalVisibleShipping) }
                          }
                        >

                          <Text style={styles.fontStyle2}>
                            {item.addLine1}, {item.addLine2}
                          </Text>
                          <Text style={styles.fontStyle2}>
                            {item.state}, {item.country},
                          </Text>
                          <Text style={styles.fontStyle2}>
                            {item.landmark}
                          </Text>
                          <Text style={styles.fontStyle2}>
                            {item.phone}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={[styles.borderBottomContainer, { width: windowWidth }]}>
          <AuthButton
            BackgroundColor={colours.kapraMain}
            OnPress={_placeOrder}
            ButtonText={'Place Order'}
            ButtonWidth={90}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
  },
  scroll: {
    alignItems: 'center',
  },
  modalContainer: {
    width: windowWidth * (100 / 100),
    //height: windowWidth * (20 / 100),
    alignItems: "flex-end",
    marginTop: windowWidth * (15 / 100)
  },
  borderBottomContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colours.primaryGrey,
    paddingVertical: 10,
    width: windowWidth * (94 / 100),
    alignItems: 'center',
  },
  fontStyle1: {
    width: windowWidth * (90 / 100),
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(16),
    paddingBottom: '1%',
  },
  fontStyle2: {
    width: windowWidth * (90 / 100),
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  },
  innerContainer: {
    paddingTop: '1%',
    width: windowWidth * (90 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontStyle3: {
    width: windowWidth * (70 / 100),
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize:getFontontSize(12),
    color: colours.primaryGrey,
    paddingLeft: 10
  },
  fontStyle6: {
    //width: windowWidth * (75 / 100),
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12),
    color: colours.primaryGrey,
  },
  fontStyle4: {
    width: windowWidth * (90 / 100),
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(10),
  },
  fontStyle7: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraMain
  },
  bottomContainer: {
    width: windowWidth * (90 / 100),
    alignItems: 'center',
  },
  rowContainer: {
    width: windowWidth * (90 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: '2%',
  },
  fontStyle5: {
    width: windowWidth * (90 / 100),
    fontFamily: 'Proxima Nova Alt Light',
    fontSize: getFontontSize(12),
    paddingBottom: '3%',
  },
  deliveryTime: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    height: windowHeight * (6 / 100),
    width: windowWidth * (92 / 100),
    paddingRight: windowWidth * (7 / 100),
    paddingLeft: windowWidth * (5 / 100),
  },
  textField: {
    width: windowWidth * (62 / 100),
    height: windowHeight * (6 / 100),
    paddingLeft: 20,
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12),
  },
  apply: {
    height: windowHeight * (4 / 100),
    width: windowWidth * (28 / 100),
    borderRadius: 5,
    backgroundColor: colours.kapraMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    height: windowHeight * (4 / 100),
    width: windowWidth * (28 / 100),
    borderRadius: 5,
    backgroundColor: colours.primaryRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontStyle8: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(12),
    color: colours.primaryWhite,
  },
  Pricing: {
    //height: windowHeight * (5 / 100),
    width: windowWidth * (94 / 100),
    backgroundColor: colours.kapraLow,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10

  },
  coupon: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (94 / 100),
    marginLeft: windowWidth * (3 / 100),
    backgroundColor: colours.lightWhite,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center'

  },
});
