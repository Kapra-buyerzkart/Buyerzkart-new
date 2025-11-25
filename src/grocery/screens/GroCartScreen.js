import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  Image,
  Modal,
  Alert,
  Pressable,
  ImageBackground,
  Platform
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import LottieView from 'lottie-react-native';
import Geolocation from '@react-native-community/geolocation';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { BlurView } from "@react-native-community/blur";

import PriceCard from '../components/PriceCard';
import CartCard from '../components/CartCard';
import CouponCard from '../components/CouponCard';
import { AppContext } from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import AuthButton from '../components/AuthButton';
import LoginTextInput from '../components/LoginTextInput';

import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import { getImage, getFontontSize } from '../globals/GroFunctions';


import {
  GroGetCartList,
  addressList,
  RemoveCartItemByUrlkey,
  placeOrder,
  addtoCart,
  decreaseCartItemByURLKey,
  getCoupons,
  getGiftCards,
  applyCoupon,
  removeCoupon,
  getDeliverySlots,
  UpdateDeliveryMode,
  getEmptyCart,
  getPaymentMethods,
  getShortestAddress,
  getCartSummary,
  initiatePayment,
  postApplyGiftCard,
  getPolicies,
  removeBCoin,
  applyBCoin,
  checkAvailability
} from '../api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroCartScreen = ({ navigation, route }) => {

  const { profile, GroUpdateCart, logout, editPincode } = React.useContext(AppContext);
  const { showLoader, loading } = React.useContext(LoaderContext);

  const scrollViewRef = useRef();

  const date = new Date();

  const [dummy, setDummy] = React.useState(false)

  const [cartItemData, setItemCartData] = React.useState(null);
  const [productAvailability, setProductAvailability] = React.useState(true);
  const [recommendedProducts, setRecommendedProducts] = React.useState(null);
  const [cartSummary, setCartSummary] = React.useState(null);
  const [summaryLoading, setSummaryLoading] = React.useState(false)
  const [checked, setChecked] = React.useState('');
  const [couponData, setCouponData] = React.useState(null);
  const [modalCouponVisible, setModalCouponVisible] = React.useState(false);
  const [addressData, setAddressData] = React.useState(null);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [deliverySlots, setDeliverySlots] = React.useState(null);
  const [deliveryMode, setDeliveryMode] = React.useState('Express');
  const [slotAvailableDates, setSlotAvailableDates] = React.useState([]);
  const [selectedSlotDate, setSelectedSlotDate] = React.useState(null);
  const [choosenDeliverySlot, setChoosenDeliverySlot] = React.useState(null);
  const [acceptablePayMode, setAcceptablePayMode] = React.useState('Both');

  const [couponCode, setCouponCode] = React.useState('')
  const [couponCodeError, setCouponCodeError] = React.useState(false)
  const [couponCodeErrorMsg, setCouponCodeErrorMsg] = React.useState('')

  const [availablePayMethods, setAvailablePayMethods] = React.useState(null)

  const [choosenCodPayMethod, setChoosenCodPayMethod] = React.useState(null);

  const [addressModalVisible, setAddressModalVisible] = React.useState(false);
  const [deliveryOptionModal, setDeliveryOptionModal] = React.useState(false);
  const [cartItemModal, setCartItemModal] = React.useState(false);

  const [giftCardData, setGiftCardData] = React.useState(null)
  const [giftCardModal, setGiftCardModal] = React.useState(false);
  const [appliedGiftCards, setAppliedGiftCards] = React.useState('')
  const [appliedGiftCardsSum, setAppliedGiftCardsSum] = React.useState(0)

  const [storeCloseModalVisible, setStoreCloseModalVisible] = React.useState(false);
  const [storeCloseData, setStoreCloseData] = React.useState(null);
  const [availabiltyLoading, setAvailabiltyLoading] = useState(false)
  const [cartItemsIds, setCartItemsIds] = useState([])

  const insets = useSafeAreaInsets();

  const reloadData = async () => {
    setProductAvailability(true)
    setAcceptablePayMode('Both')
    try {
      let res = await GroGetCartList(selectedAddress ? selectedAddress?.custAdressId : 0, deliveryMode);
      setItemCartData(res?.cartList);
      for (let i = 0; i < res?.cartList.length; i++) {
        if ((res?.cartList[i].maxQtyInOrders && res?.cartList[i].maxQtyInOrders < res?.cartList[i].qty && res?.cartList[i].maxQtyInOrders != 0) || res?.cartList[i].stockAvailability === 'Out Of Stock' || res?.cartList[i].qoh < res?.cartList[i].qty || res?.cartList[i].IsAvailPincode == false) {
          setProductAvailability(false);
        }
      }
      if (res?.cartList.find((obj) => obj.deliveryMode == 'COD')) {
        setAcceptablePayMode('COD')
      } else if (res?.cartList.find((obj) => obj.deliveryMode == 'Online')) {
        setAcceptablePayMode('Online')
      } else {
        setAcceptablePayMode('Both')
      }
    } catch (err) {
    }
    setDummy(!dummy)

  }

  // const checkStoreClose = async () => {
  //   let res = await getPolicies();
  //   if (res && res?.find(obj => obj.stName == 'isStoreOpenInArea').stValue == '0') {
  //     setStoreCloseData(res)
  //     setStoreCloseModalVisible(true);
  //     setDummy(!dummy)
  //   } else {
  //     setStoreCloseData(null)
  //     setStoreCloseModalVisible(false);
  //     setDummy(!dummy)

  //   }

  // }

  const checkStoreClose = async () => {
    // console.log("11111")
    const res = await getPolicies();

    const isStoreClosed =
      res &&
      res.find(obj => obj.stName === 'isStoreOpenInArea')?.stValue === '0';

    if (isStoreClosed) {
      setStoreCloseData(res);
      setStoreCloseModalVisible(true);
    } else {
      setStoreCloseData(null);
      setStoreCloseModalVisible(false);
    }

    setDummy(prev => !prev);

    return isStoreClosed;  // <-- 🚨 important
  };

  const fetchCartData = async () => {
    // setItemCartData(null);
    setSummaryLoading(true)
    checkStoreClose();
    setProductAvailability(true);
    try {
      let res = await GroGetCartList(selectedAddress ? selectedAddress?.custAdressId : 0, deliveryMode);
      setItemCartData(res?.cartList);
      for (let i = 0; i < res?.cartList.length; i++) {
        if ((res?.cartList[i].maxQtyInOrders && res?.cartList[i].maxQtyInOrders < res?.cartList[i].qty && res?.cartList[i].maxQtyInOrders != 0) || res?.cartList[i].stockAvailability === 'Out Of Stock' || res?.cartList[i].qoh < res?.cartList[i].qty || res?.cartList[i].IsAvailPincode == false) {
          setProductAvailability(false);
        }
      }
      if (res?.cartList.find((obj) => obj.deliveryMode == 'COD')) {
        setAcceptablePayMode('COD')
      } else if (res?.cartList.find((obj) => obj.deliveryMode == 'Online')) {
        setAcceptablePayMode('Online')
      } else {
        setAcceptablePayMode('Both')
      }
      if (profile.groceryCustId) {
        let res3 = await getCoupons();
        setCouponData(res3);
        let res7 = await getGiftCards();
        setGiftCardData(res7);
        let res4 = await addressList();
        setAddressData(res4 ? res4 : []);
        if (res4.length == 1) {
          if (res4[0].latitude !== null || res4[0].longitude !== null) {

            Alert.alert(
              'ALERT',
              `To ensure the best delivery experience, we've automatically selected the available delivery address for you. You can proceed with this address or cancel to add more address and choose from your saved addresses.`,
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async () => {
                    await editPincode({
                      pincodeId: res4[0].pincodeAreaId,
                      area: res4[0].area,
                    });
                    setSelectedAddress(res4[0])
                    await checkStoreClose()
                    let res2 = await getCartSummary(res4[0] ? res4[0]?.custAdressId : 0, deliveryMode);

                    setCartSummary(res2);
                    setSummaryLoading(false)
                    setAppliedGiftCards(res2.giftCardsApplied)
                    setAppliedGiftCardsSum(res2.giftCarDamount)
                    await reloadData()
                  },
                },
              ],
              { cancelable: false },
            );

            // Toast.show('Your location changed. Please confirm the location before place an order!')
          }
        } else if (!selectedAddress) {
          Geolocation.getCurrentPosition(async (info) => {
            let res6 = await getShortestAddress(info.coords.latitude, info.coords.longitude);
            let add = res4.find((obj) => obj.custAdressId == res6.custAddressId)
            if (add && (add.latitude !== null && add.longitude !== null)) {
              // Toast.show('Your sddress location changed. Please confirm the sddress location before place an order!')
              await editPincode({
                pincodeId: add.pincodeAreaId,
                area: add.area,
              });
              setSelectedAddress(add)
              await checkStoreClose()
              let res2 = await getCartSummary(add ? add?.custAdressId : 0, deliveryMode);
              setCartSummary(res2);
              setSummaryLoading(false)
              setAppliedGiftCards(res2.giftCardsApplied)
              setAppliedGiftCardsSum(res2.giftCarDamount)
              await reloadData()
              // Alert.alert(
              //   'ALERT',
              //   `To ensure the best delivery experience, we've automatically selected the nearest delivery address for you. You can proceed with this address or cancel to choose from your saved addresses.`,
              //   [
              //     {
              //       text: 'Cancel',
              //       onPress: () => null,
              //       style: 'cancel',
              //     },
              //     {
              //       text: 'Proceed',
              //       onPress: async () =>{
              //         await editPincode({
              //           pincodeId: add.pincodeAreaId,
              //           area: add.area,
              //         });
              //         setSelectedAddress(add)
              //         let res2 = await getCartSummary(add?add?.custAdressId:0,deliveryMode);
              //         setCartSummary(res2);
              //         setSummaryLoading(false)
              //         setAppliedGiftCards(res2.giftCardsApplied)
              //         setAppliedGiftCardsSum(res2.giftCarDamount)
              //         await reloadData()
              //       },
              //     },
              //   ],
              //   { cancelable: false },
              // );
            }
          });
        } else {
          let res2 = await getCartSummary(selectedAddress ? selectedAddress?.custAdressId : 0, deliveryMode);
          setCartSummary(res2);
          setSummaryLoading(false)
          setAppliedGiftCards(res2.giftCardsApplied)
          setAppliedGiftCardsSum(res2.giftCarDamount)
        }
      }
      let res5 = await getDeliverySlots();
      const newArray = [];
      if (res5.length != 0) {
        res5.forEach(obj => {
          if (!newArray.some(o => moment(o.slotDate).utcOffset('+05:30').format('DD-MM-YYYY') === moment(obj.slotDate).utcOffset('+05:30').format('DD-MM-YYYY'))) {
            newArray.push({ ...obj })
          }
        });
      }
      setSlotAvailableDates(newArray);
      setSelectedSlotDate(newArray[0]);
      setDeliverySlots(res5);
      let res6 = await getPaymentMethods();
      setAvailablePayMethods(res6);
    } catch (err) {
      showLoader(false);
    }
  }

  const _placeOrder = async () => {
    try {
      showLoader(true);
      let res = await placeOrder({
        custBillAdressId: selectedAddress.custAdressId,
        custShipAdressId: selectedAddress.custAdressId,
        payMethod: checked,
        deliveryMode: deliveryMode,
        slotId: deliveryMode === 'Standard' ? choosenDeliverySlot.vendorSlotId : null,
        slotDate: deliveryMode === 'Standard' ? choosenDeliverySlot.slotDate : null,
      });
      showLoader(false);
      await GroUpdateCart();
      if (checked == "COD") {
        showLoader(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'GroHomeScreen' },
              {
                name: 'GroOrderSuccessScreen',
                params: { orderNo: res?.orderNumber, orderId: res?.orderId, cartSum: cartSummary },
              },
            ],
          })
        )
      } else {
        let res1 = await initiatePayment(res?.orderId)
        showLoader(false);
        razorPayUpdate(res1)
      }
      await GroUpdateCart();
    } catch (err) {
      showLoader(false);
      fetchCartData();
      if (err == 'Customer is deleted') {
        Toast.show('Your account has been deactivated. Please contact admin');
        logout();
      }
    }
  }

  // React.useEffect(() => {
  //   fetchCartData();
  // }, []);


  useFocusEffect(
    React.useCallback(() => {
      setItemCartData(null)
      fetchCartData()
      showLoader(false);
    }, []),
  );

  const checkProductAvailability = async () => {
    try {
      setAvailabiltyLoading(true);
      const response = await checkAvailability();
      // console.log("res.status", response.status)
      // console.log("res.data", response.data)
      // if (response.status === 200) {
      //   // setSuccessModalVisible(true);
      // } else if (response.status === 400) {
      //   // setErrorModalVisible(true);
      // } else {
      //   console.log("Unhandled status:", response.status);
      // }
      if (response.status === 200) {
        if (response.data.Data.cartList.length === 0) {
          _placeOrder()
        } else {
          // console.log('response.status', response.status)
          // console.log('response', response)
          // console.log("2222222")
          const cartItemsIds = response.data.Data.cartList.map(item => item.cartItemsId);
          // console.log('cartItemsIds', cartItemsIds)
          setCartItemsIds(cartItemsIds)
        }
      }
    } catch (error) {
      // console.error("API Error:", error.status);
      // setErrorModalVisible(true);
      // if (error === "No columns were selected, ") {
      //   _placeOrder()
      // }
      if (error.status === 400) {
        _placeOrder()
      }
      else {
        Alert.alert("Error", "Something went wrong");
      }
    } finally {
      setAvailabiltyLoading(false);
    }
  };

  // useEffect(() => {
  //   checkProductAvailability()
  // }, [])

  const AddtoCart = async (URLKey) => {
    try {
      showLoader(true);
      let res = await addtoCart(URLKey);
      await GroUpdateCart();
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const DecreaseCartCount = async (URLKey) => {
    try {
      showLoader(true);
      let res = await decreaseCartItemByURLKey(URLKey);
      await GroUpdateCart();
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const deleteFromCart = async (URLKey) => {
    try {
      showLoader(true);
      let res = await RemoveCartItemByUrlkey(URLKey);
      await GroUpdateCart();
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const applyCouponFun = async (item) => {
    try {
      showLoader(true);
      let res = await applyCoupon(item);
      await GroUpdateCart();
      Toast.show('Coupon Applied');
      setCouponCode('');
      setCouponCodeError(false);
      fetchCartData();
      setModalCouponVisible(false);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      setCouponCode('');
      setCouponCodeError(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const removeCouponFun = async () => {
    try {
      showLoader(true);
      let res = await removeCoupon();
      await GroUpdateCart();
      Toast.show('Coupon Removed');
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const applyBCoinFun = async (value) => {
    try {
      showLoader(true);
      let res = await applyBCoin(value);
      await GroUpdateCart();
      Toast.show('B-Coin Applied');
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const removeBCoinFun = async () => {
    try {
      showLoader(true);
      let res = await removeBCoin();
      await GroUpdateCart();
      Toast.show('B-Coin Removed');
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }


  const updateGiftCard = async (value) => {
    if (appliedGiftCards.includes(value.id)) {
      let data = appliedGiftCards.split(`${value.id},`).join("").split(`${value.id}`).join("");
      setAppliedGiftCards(data);
      setAppliedGiftCardsSum(appliedGiftCardsSum - value.gAmount)
      setDummy(!dummy)
    } else {
      if (cartSummary && cartSummary?.grandTotal >= appliedGiftCardsSum) {
        if (appliedGiftCardsSum == 0 || cartSummary?.grandTotal >= value.gAmount) {
          let data = `${value.id},` + appliedGiftCards;
          setAppliedGiftCards(data);
          setAppliedGiftCardsSum(appliedGiftCardsSum + value.gAmount)
          setDummy(!dummy)
        } else {
          Toast.show("The total Smart Point discount exceeds the order total.");
        }
      } else {
        Toast.show("The total Smart Point discount exceeds the order total.");
      }
    }
  }

  const applyGiftCards = async () => {
    showLoader(true);
    try {
      let res = await postApplyGiftCard(appliedGiftCards);
      setSummaryLoading(true)
      let res2 = await getCartSummary(selectedAddress ? selectedAddress?.custAdressId : 0, deliveryMode);
      setCartSummary(res2);
      setSummaryLoading(false)
      setAppliedGiftCards(res2.giftCardsApplied)
      setAppliedGiftCardsSum(res2.giftCarDamount)
      setDummy(!dummy);
      setGiftCardModal(false)
      showLoader(false);
    } catch (err) {
      showLoader(false);
      setGiftCardModal(false)
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }
  }

  const emptyCart = async () => {
    try {
      showLoader(true);
      let res = await getEmptyCart();
      Toast.show(res?.Message);
      await GroUpdateCart();
      fetchCartData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      if (typeof err == 'string') {
        Toast.show(err);
      } else {
        Toast.show(err?.Message ? err?.Message : "Something wrong!");
      }
    }

  }

  const applyDeliveryMode = async () => {
    setDeliveryOptionModal(false);
    try {
      // showLoader(true);
      // let res = await UpdateDeliveryMode(deliveryMode === 'Standard'?'Slotted Delivery':'Express Shipping');
      // Toast.show(res?.Message);
      // fetchCartData();
      setSummaryLoading(true)
      let res2 = await getCartSummary(selectedAddress ? selectedAddress?.custAdressId : 0, deliveryMode);
      setCartSummary(res2);
      setSummaryLoading(false)
      setAppliedGiftCards(res2.giftCardsApplied)
      setAppliedGiftCardsSum(res2.giftCarDamount)
      setDummy(!dummy);
      showLoader(false);
      // scrollViewRef.current.scrollToEnd({ animated: true })
    } catch (err) {
      showLoader(false);
    }
  }

  const setNewAddress = async (value) => {
    try {
      showLoader(true)
      // let res = await CheckAddressDeliverable(value.custAdressId);
      if (value.latitude !== null || value.longitude !== null) {
        await editPincode({
          pincodeId: value.pincodeAreaId,
          area: value.area,
        });
        const isStoreClosed = await checkStoreClose();
        setSelectedAddress(value);
        setSummaryLoading(true)
        let res2 = await getCartSummary(value ? value?.custAdressId : 0, deliveryMode);
        setCartSummary(res2);
        setSummaryLoading(false)
        setAppliedGiftCards(res2.giftCardsApplied)
        setAppliedGiftCardsSum(res2.giftCarDamount)
        await reloadData()
        setAddressModalVisible(false)
        if (!isStoreClosed) {
          setDeliveryOptionModal(true)
        }
        // scrollViewRef.current.scrollToEnd({ animated: true })
      } else {
        Toast.show('Failed to locate your address. Please edit address or Add new one')
      }

    } catch (err) {
    } finally {
      showLoader(false)
    }
  }

  const razorPayUpdate = async (res) => {
    var options = {
      description: `Payment of ${res?.orderNumber}`,
      currency: 'INR',
      key: res?.rpUserName,
      name: 'Kapra Daily',
      order_id: res?.rpToken,
      prefill: {
        email: res?.custEmail,
        contact: res?.custPhone,
        name: res?.custName
      },
      theme: { color: colours.kapraMain },
      notes: {
        transactionMode: "Grocery"
      }
    }
    RazorpayCheckout.open(options).then(async (data) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'GroHomeScreen' },
            {
              name: 'GroOrderSuccessScreen',
              params: { orderNo: res?.orderNumber, orderId: res?.orderId, cartSum: cartSummary },
            },
          ],
        })
      )
    }).catch((error) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'GroHomeScreen' },
            {
              name: 'GroOrderUnsuccessScreen',
              params: { data: res, cartSum: cartSummary },
            },
          ],
        })
      )
    });
  }

  if (cartItemData == null || cartItemData.length == 0) return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={() => navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth * (5 / 100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Cart</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={fetchCartData}
          />
        }
      >
        {
          cartItemData && cartItemData.length == 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                //paddingTop: '20%',
                width: windowWidth,
                height: windowHeight * (80 / 100),
              }}>
              <View style={{ height: windowHeight * (20 / 100) }}>
                <Text>{showIcon('bin1', colours.primaryRed, 130)}</Text>
              </View>
              <Text style={[styles.fontStyle3, { fontSize: getFontontSize(20) }]}>{'Cart Empty'}</Text>
              <Text style={[styles.fontStyle4, { width: '90%', textAlign: 'center', marginVertical: 20 }]}>
                No items in your cart
              </Text>
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={() => navigation.navigate('GroSearchModalScreen')}
                ButtonText={'Browse'}
                ButtonWidth={90}
                FirstColor={colours.kapraMain}
                SecondColor={colours.kapraMain}
              />
            </View>
          )
            :
            (
              <>
                <SkeletonPlaceholder highlightColor={colours.lowBlue}>
                  <View style={styles.skeltonCard} />
                  <View style={styles.skeltonCard} />
                  <View style={styles.skeltonCard} />
                  <View style={styles.skeltonCard} />
                  <View style={styles.skeltonCard} />
                  <View style={styles.skeltonCard} />
                  <View style={styles.skeltonCard} />
                </SkeletonPlaceholder>
              </>
            )
        }
      </ScrollView>
    </SafeAreaView>
  );

  if (availabiltyLoading) {
    return (
      <SafeAreaView style={[styles.mainContainer, { justifyContent: "center" }]}>
        <Text style={styles.fontStyle1}>Checking the availability of the products</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={() => navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth * (5 / 100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Cart</Text>
      </View>

      {/* Min Del Con  */}
      <View style={styles.minDeliveryCon}>
        <View style={styles.minDeliveryIcon}>
          {showIcon('timer', colours.primaryGreen, windowWidth * (6 / 100))}
        </View>
        <View style={{ paddingLeft: 10 }}>
          <Text style={styles.fontStyle2}>20 minutes delivery</Text>
          <Text style={styles.fontStyle5}>Shipment of {cartItemData.length} item(s)</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        ref={scrollViewRef}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchCartData} />}
      >

        {/* Store Close Message  */}
        {
          storeCloseData && storeCloseModalVisible && (
            <View style={styles.closeMsgCon}>
              <LottieView
                source={require('../../assets/Lottie/warning.json')}
                style={styles.warningLottie}
                autoPlay
                loop
              />
              <Text style={[styles.storeCloseText, { width: windowWidth * (75 / 100) }]} numberOfLines={2}>{storeCloseData?.find(obj => obj.stName == 'storeCloseMsg').stValue}</Text>
            </View>
          )
        }

        {/* Free Delivery Msg  */}
        {
          cartSummary?.deliveryCharge == 0 && (
            <View style={[styles.closeMsgCon, { backgroundColor: colours.kapraWhiteLow, justifyContent: 'flex-start', }]}>
              <LottieView
                source={require('../../assets/Lottie/popper.json')}
                style={styles.warningLottie}
                autoPlay
                loop
              />
              <Text style={[styles.fontStyle6, { fontSize: getFontontSize(13) }]} numberOfLines={2}>Yay! You get FREE delivery with this order.</Text>
            </View>
          )
        }

        {/* Items List  */}
        <View style={{ width: windowWidth, alignItems: 'center' }}>
          {/* {console.log("cartItemData", cartItemData)} */}
          <FlatList
            contentContainerStyle={{
              alignItems: 'center',
              width: windowWidth,
            }}
            data={cartItemData}
            renderItem={({ item }, i) => (
              <CartCard
                key={i}
                onCardPress={() =>
                  navigation.navigate('GroSingleItemScreen', { UrlKey: item.urlKey })
                }
                cartItemsId={item.cartItemsId}
                cartItemsIds={cartItemsIds}
                Name={item.prName}
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
                Delete={async () => {
                  Alert.alert(
                    'DELETE',
                    'Are you sure want to remove this item from cart?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: async () => await deleteFromCart(item.urlKey),
                      },
                    ],
                    { cancelable: false },
                  );
                }}
                CartIncrease={async () => await AddtoCart(item.urlKey)}
                CartDecrease={async () => await DecreaseCartCount(item.urlKey)}
              />
            )}
            keyExtractor={(item, i) => i.toString()}
          />
        </View>


        {/* BTokenValue and BcoinsApplied */}
        {
          profile.groceryCustId && (
            cartSummary && cartSummary?.totalBTokenValue > 0 && (
              <View style={styles.couponContainer}>
                <Text style={styles.subTitles}>Total B-Tokens</Text>
                <Text style={styles.subTitles}>{cartSummary?.totalBTokenValue}</Text>
              </View>
            )
          )
        }
        {
          profile.groceryCustId && (
            cartSummary && cartSummary?.bcoinsAppplied > 0 ?
              <View style={styles.couponContainer}>
                <Text style={styles.subTitles}>B-Coins Applied</Text>
                <TouchableOpacity onPress={() => removeBCoinFun()} style={{ padding: 5, backgroundColor: colours.kmPink, borderRadius: 5, marginLeft: 10 }}>
                  <Text style={[styles.subTitles, { color: colours.kapraRed, backgroundColor: colours.kapraRedLow, padding: 5 }]}>Remove</Text>
                </TouchableOpacity>
              </View>
              :
              <View style={styles.couponContainer} >
                <Text style={styles.subTitles}>B-Coins : {cartSummary?.availableBCoins}</Text>
                <TouchableOpacity onPress={() => cartSummary?.availableBCoins > 0 ? applyBCoinFun(cartSummary?.availableBCoins) : Toast.show('0 B-Coins')} style={{ padding: 5, backgroundColor: colours.kmPink, borderRadius: 5, }}>
                  <Text style={[styles.subTitles, { color: colours.kapraRed, backgroundColor: colours.kapraRedLow, padding: 5 }]}>Apply</Text>
                </TouchableOpacity>
              </View>
          )
        }

        {/* Coupon Code  */}
        {
          profile.groceryCustId && (cartSummary && cartSummary?.couponAmount ?
            <TouchableOpacity style={styles.couponContainer}>
              <Text style={styles.subTitles}>Coupon Applied : {cartSummary?.cpcode}</Text>

              <TouchableOpacity onPress={() => removeCouponFun()} style={{ padding: 5, backgroundColor: colours.kmPink, borderRadius: 5, marginLeft: 10 }}>
                <Text style={[styles.subTitles, { color: colours.kapraRed, backgroundColor: colours.kapraRedLow, padding: 5 }]}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.couponContainer} onPress={() => setModalCouponVisible(true)}>

              <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={styles.subTitles}>Avail offers / Coupons</Text>
              </View>

              <Text>
                {showIcon('rightarrow', colours.kapraRed, windowWidth * (5 / 100))}
              </Text>
            </TouchableOpacity>)
        }


        {/* Smart Point  */}
        {
          profile.groceryCustId && (cartSummary && cartSummary?.giftCarDamount ?
            <TouchableOpacity style={styles.couponContainer}>
              <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={styles.subTitles}>Smart Point</Text>
              </View>
              <TouchableOpacity onPress={() => setGiftCardModal(true)} style={{ padding: 5, backgroundColor: colours.kmPink, borderRadius: 5, marginLeft: 10 }}>
                <Text style={[styles.subTitles, { color: colours.kapraRed }]}>Update</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.couponContainer} onPress={() => !selectedAddress ? Toast.show('To see the available gift cars, please first pick the address.') : setGiftCardModal(true)}>
              <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={styles.subTitles}>Smart Point</Text>
              </View>

              <Text>
                {showIcon('rightarrow', colours.primaryGreen, windowWidth * (5 / 100))}
              </Text>
            </TouchableOpacity>)
        }


        {/* Delivery Slot  */}
        {
          deliveryMode === 'Standard' && choosenDeliverySlot && (
            <TouchableOpacity style={styles.rowItemCon} onPress={() => setDeliveryOptionModal(true)}>
              <View style={styles.headerView}>
                <Text style={styles.subTitles}>Delivery Slot Details</Text>
                <Text style={[styles.fontStyle1, { color: colours.kapraOrange }]}>Change</Text>
              </View>
              <View style={{ flexDirection: 'row', width: windowWidth * (54 / 100), justifyContent: 'space-between', marginHorizontal: windowWidth * (3 / 100) }}>
                <Text style={[styles.subTitles, { color: colours.kapraOrange }]}>{moment(choosenDeliverySlot.slotDate).utcOffset('+05:30').format('DD-MM-YYYY')}  </Text>
                <Text style={[styles.subTitles, { color: colours.kapraOrange }]}>
                  {choosenDeliverySlot.fromtime} - {choosenDeliverySlot.totime}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
        {
          deliveryMode === 'Express' && (
            <TouchableOpacity style={styles.rowItemCon}
              onPress={() => setDeliveryOptionModal(true)}
            >
              <View style={styles.headerView}>
                <Text style={styles.subTitles}>Delivery Slot Details</Text>
                <Text style={[styles.fontStyle1, { color: colours.kapraOrange }]}>Change</Text>
              </View>
              <View style={{ flexDirection: 'row', width: windowWidth * (54 / 100), justifyContent: 'space-between', marginHorizontal: windowWidth * (3 / 100) }}>
                <Text style={[styles.subTitles, { color: colours.kapraOrange }]}>
                  20 Minutes Delivery
                </Text>
              </View>
            </TouchableOpacity>
          )
        }


        {/* Saving Amount  */}
        {
          cartSummary && (cartSummary?.discountAmount > 0 || cartSummary?.couponAmount > 0) && (
            <View style={styles.savingsCon}
            >
              <Text style={[styles.fontStyle1, { color: colours.kapraWhite }]}>₹{cartSummary?.discountAmount + cartSummary?.couponAmount + cartSummary?.bcoinsAppplied} saved on this order</Text>
            </View>
          )
        }

        {/* Cart Summary  */}
        {
          cartSummary && (
            <>
              <Text style={[styles.fontStyle1, { width: windowWidth * (90 / 100) }]}>Bill Details</Text>
              <Text />

              <View style={styles.priceRowCon}>
                <Text style={styles.subTitles}>Subtotal:</Text>
                <PriceCard
                  UnitPrice={cartSummary?.subTotal}
                  FontSize={getFontontSize(13)}
                  Color={colours.kapraMain}
                />
              </View>
              {cartSummary?.discountAmount > 0 && (
                <View style={styles.priceRowCon}>
                  <Text style={styles.subTitles}>Discount:</Text>
                  <PriceCard
                    UnitPrice={cartSummary?.discountAmount}
                    FontSize={getFontontSize(13)}
                    Color={colours.kapraMain}
                  />
                </View>
              )}
              {cartSummary?.couponAmount > 0 && (
                <View style={styles.priceRowCon}>
                  <Text style={[styles.subTitles, { width: windowWidth * (65 / 100) }]}>Coupon Discount </Text>
                  <PriceCard
                    UnitPrice={cartSummary?.couponAmount}
                    FontSize={getFontontSize(13)}
                    Color={colours.kapraMain}
                  />
                </View>
              )}
              {cartSummary?.bcoinsAppplied > 0 && (
                <View style={styles.priceRowCon}>
                  <Text style={[styles.subTitles, { width: windowWidth * (65 / 100) }]}>B-Coin Discount </Text>
                  <PriceCard
                    UnitPrice={cartSummary?.bcoinsAppplied}
                    FontSize={getFontontSize(13)}
                    Color={colours.kapraMain}
                  />
                </View>
              )}
              {cartSummary?.giftCarDamount > 0 && (
                <View style={styles.priceRowCon}>
                  <Text style={[styles.subTitles, { width: windowWidth * (65 / 100) }]}>Giftcard Applied </Text>
                  <PriceCard
                    UnitPrice={cartSummary?.giftCarDamount}
                    FontSize={getFontontSize(13)}
                    Color={colours.kapraMain}
                  />
                </View>
              )}
              {
                cartSummary?.deliveryCharge > 0 && (
                  <View style={styles.priceRowCon}>
                    <Text style={styles.subTitles}>Shipping:</Text>
                    {cartSummary?.deliveryCharge > 0 ?
                      <PriceCard
                        UnitPrice={cartSummary?.deliveryCharge}
                        FontSize={getFontontSize(13)}
                        Color={colours.kapraMain}
                      />
                      :
                      <Text style={[styles.subTitles, { color: colours.primaryGreen }]}>FREE</Text>
                    }
                  </View>
                )
              }
              <Text />
              <View style={[styles.priceRowCon, { borderTopWidth: 2, borderBottomWidth: 2, borderColor: colours.kapraWhiteLow }]}>
                <Text style={styles.fontStyle1}>Total</Text>
                <PriceCard
                  UnitPrice={cartSummary?.grandTotal}
                  FontSize={getFontontSize(17)}
                  Color={colours.kapraMain}
                />
              </View>
              <Text />
              <Text />
              <View style={styles.priceRowCon}>
                <Text style={styles.fontStyle2}>Total B-Tokens :</Text>
                <Text style={styles.fontStyle2}>{cartSummary?.totalBTokenValue}</Text>
              </View>
            </>
          )
        }



        {/* Payment Methods  */}
        {
          profile.groceryCustId && (
            <View style={[styles.borderBottomContainer, { paddingTop: '4%', }]}>
              <Text style={[styles.fontStyle1, { fontFamily: 'Lexend-Regular', color: colours.kapraBlack }]}>Payment Methods</Text>
              <FlatList
                data={availablePayMethods}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item }, i) => (
                  (item.paymentModeName.toUpperCase() == acceptablePayMode.toUpperCase() || acceptablePayMode == 'Both') && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                        width: windowWidth * (45 / 100)
                      }}
                      onPress={() => { setChecked(item.paymentModeName), setDummy(!dummy) }}
                    >
                      <View style={{ margin: 3, padding: 10 }}>
                        <CustomRadioButton
                          captionText={""}
                          Value={item.paymentModeName}
                          state={checked}
                          OnPress={() => { setChecked(item.paymentModeName), setDummy(!dummy) }}
                        />
                      </View>
                      <View>{showIcon(item.paymentModeName == 'COD' ? 'deliveryCod' : 'card', colours.kapraOrangeLight, windowWidth * (4 / 100))}</View>
                      <Text style={[styles.fontStyle3, { color: colours.kapraRed }]}> {item.paymentModeName}</Text>
                    </TouchableOpacity>
                  )
                )}
                keyExtractor={(item, i) => i.toString()}
              />
            </View>

          )
        }


        {/* Address Selection  */}
        {
          selectedAddress ?
            <TouchableOpacity
              style={styles.addressCon}
              onPress={() => setAddressModalVisible(true)}
            >
              <View style={{ padding: 10, backgroundColor: colours.lowWhite, borderRadius: 5, height: windowWidth * (10 / 100) }} >
                {showIcon('addressPin', colours.primaryGreen, windowWidth * (6 / 100))}
              </View>
              <View style={{ justifyContent: 'space-evenly', marginLeft: 5 }}>
                <View style={{ flexDirection: 'row', width: windowWidth * 75 / 100, justifyContent: 'space-between' }}>
                  <Text style={styles.subTitles}>
                    Deliver to : {selectedAddress.firstName} {selectedAddress.lastName}
                  </Text>
                  <Text style={[styles.subTitles, { color: colours.kapraOrange }]}>Change</Text>
                </View>
                <Text />
                <Text style={[styles.fontStyle3, { width: windowWidth * (75 / 100), lineHeight: getFontontSize(17) }]} numberOfLines={2}>
                  {selectedAddress.addLine1} {selectedAddress.addLine2} {selectedAddress.district} {selectedAddress.state} {selectedAddress.country}
                </Text>
              </View>

            </TouchableOpacity>
            :
            null
        }
      </ScrollView>

      {/* Bottom Buttons */}
      <>
        {
          profile.groceryCustId ?
            productAvailability ?
              !selectedAddress ?
                <View style={styles.bottomButtonContainer}>
                  <TouchableOpacity style={styles.botoomButton} onPress={() => setAddressModalVisible(true)}>
                    <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                      SELECT ADDRESS TO PROCEED
                    </Text>
                  </TouchableOpacity>
                </View>
                :
                !choosenDeliverySlot && deliveryMode !== 'Express' ?
                  <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.botoomButton} onPress={() => setDeliveryOptionModal(true)}>
                      <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                        SELECT DELIVERY OPTIONS
                      </Text>
                    </TouchableOpacity>
                  </View>
                  :
                  (storeCloseData && storeCloseModalVisible) ?
                    null
                    :
                    !checked ?
                      <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity
                          style={styles.botoomButton}
                        // onPress={()=> {scrollViewRef.current.scrollToEnd({ animated: true })}}
                        >
                          <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                            SELECT PAYMENT OPTION
                          </Text>
                        </TouchableOpacity>
                      </View>
                      :
                      summaryLoading ?
                        <View style={styles.bottomButtonContainer}>
                          <TouchableOpacity style={styles.botoomButton} >
                            <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                              Loading..
                            </Text>
                          </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.bottomButtonContainer}>
                          <TouchableOpacity style={[styles.botoomButton, { justifyContent: 'space-between', paddingHorizontal: windowWidth * (3 / 100) }]} onPress={() => {
                            Alert.alert(
                              'PLEASE CONFIRM DELIVERY ADDRESS',
                              `${selectedAddress.firstName} ${selectedAddress.lastName}, ${selectedAddress.addLine1} ${selectedAddress.addLine2} ${selectedAddress.district} ${selectedAddress.state} ${selectedAddress.country}, ${selectedAddress.pincode}
                      `,
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => null,
                                  style: 'cancel',
                                },
                                {
                                  text: 'Proceed',
                                  // onPress: async () => _placeOrder(),
                                  onPress: async () => checkProductAvailability(),
                                },
                              ],
                              { cancelable: false },
                            );
                          }}>
                            <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >₹{cartSummary?.grandTotal}
                            </Text>
                            <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                              {checked == 'Online' ? 'Proceed To Pay' : 'Place Order'}
                            </Text>
                          </TouchableOpacity>
                        </View>
              :
              <View style={styles.bottomButtonContainer}>
                <TouchableOpacity style={styles.botoomButton} onPress={() => setAddressModalVisible(true)}>
                  <Text style={[styles.fontStyle1, { color: colours.primaryWhite, fontSize: getFontontSize(13) }]} >
                    Some products are not available, check cart list!
                  </Text>
                </TouchableOpacity>
              </View>
            :
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.botoomButton} onPress={() => navigation.navigate('GroLoginScreen')}>
                <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                  Login
                </Text>
              </TouchableOpacity>
            </View>

        }
      </>

      {/* MODAL  */}

      {/* ADDRESS MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={addressModalVisible}
          onRequestClose={() => setAddressModalVisible(false)}
          animationInTiming={2000}
          animationOutTiming={2000}
        >
          <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={1}
            overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
            reducedTransparencyFallbackColor='black'
          />
          <Pressable style={styles.commonModalStyle}>

            <View style={styles.modalHeader}>
              <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                Select a delivery address
              </Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Text>
                  {showIcon('close', colours.primaryWhite, windowWidth * (7 / 100))}
                </Text>
              </TouchableOpacity>
            </View>
            {
              addressData && (
                <FlatList
                  contentContainerStyle={styles.couponModalView}
                  ListHeaderComponent={
                    <AuthButton
                      FirstColor={colours.kapraOrange}
                      SecondColor={colours.kapraOrangeDark}
                      OnPress={() => { setAddressModalVisible(false), navigation.navigate("GroAddAddressMapScreen") }}
                      ButtonText={'Add New Address'}
                      ButtonWidth={95}
                      ButtonHeight={5}
                    />
                  }
                  data={addressData}
                  renderItem={({ item }, i) => (
                    <TouchableOpacity style={{ marginTop: 5, width: windowWidth * (94 / 100), paddingHorizontal: windowWidth * (3 / 100), borderRadius: 5, flexDirection: 'row', backgroundColor: colours.primaryWhite, paddingVertical: 5 }} onPress={() => { item.IsAvailableCartProducts == false ? Toast.show("Delivery not available to this address") : setNewAddress(item) }}>
                      <View style={{ padding: 10, backgroundColor: colours.lowWhite, borderRadius: 5, height: windowWidth * (10 / 100), width: windowWidth * (10 / 100) }} >
                        {showIcon('home', colours.kmPink, windowWidth * (8 / 100))}
                      </View>
                      <View style={{ justifyContent: 'space-evenly', marginLeft: 5, width: windowWidth * 65 / 100 }}>
                        <Text style={styles.fontStyle1}>
                          Deliver to : {item.addressType}
                        </Text>
                        <Text style={[styles.fontStyle3, { width: windowWidth * 63 / 100 }]} numberOfLines={2}>
                          {item.addLine1} {item.addLine2} {item.district} {item.state} {item.country}
                        </Text>
                      </View>
                      <TouchableOpacity style={{ padding: 10, backgroundColor: colours.lowWhite, borderRadius: 5, height: windowWidth * (10 / 100), width: windowWidth * (10 / 100) }} onPress={() => { setAddressModalVisible(false), navigation.navigate('GroAddAddressMapScreen', { Data: item }) }}>
                        {showIcon('edit', colours.kapraOrangeDark, windowWidth * (7 / 100))}
                      </TouchableOpacity>

                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, i) => i.toString()}
                />
              )
            }
          </Pressable>
        </Modal>
      </View>

      {/* SLOT MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={deliveryOptionModal}
          onRequestClose={() => setDeliveryOptionModal(false)}
          animationInTiming={2000}
          animationOutTiming={2000}
        >
          <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={1}
            overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
            reducedTransparencyFallbackColor='black'
          />
          <Pressable onPress={() => setDeliveryOptionModal(false)} style={{ height: windowHeight * (25 / 100), width: windowWidth }} />
          <View style={[styles.commonModalStyle, { paddingBottom: windowHeight * (5 / 100), height: windowHeight * (75 / 100), marginTop: 0 }]}>

            <View style={styles.modalHeader}>
              <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                Select a delivery option
              </Text>
              <TouchableOpacity onPress={() => setDeliveryOptionModal(false)}>
                <Text>
                  {showIcon('close', colours.primaryWhite, windowWidth * (7 / 100))}
                </Text>
              </TouchableOpacity>
            </View>
            {
              deliverySlots && deliverySlots[0].expressDeliveryAmount >= 0 && (
                <TouchableOpacity
                  style={styles.deliveryOptionView}
                  onPress={() => { setDeliveryMode('Express') }
                  }
                >
                  <CustomRadioButton
                    captionText={""}
                    Value={'Express'}
                    state={deliveryMode}
                    // check_button={() => setTerms(true)}
                    OnPress={() => { setDeliveryMode('Express') }
                    }
                  />
                  <View style={{ width: windowWidth * (83 / 100) }}>
                    <Text style={[styles.fontStyle1]} >
                      20 Minutes Delivery
                    </Text>
                    <Text style={[styles.fontStyle4, { fontSize: getFontontSize(10) }]}>
                      ( Amount calculated based on address chosen )
                    </Text>
                  </View>
                </TouchableOpacity>

              )
            }
            <TouchableOpacity
              style={styles.deliveryOptionView}
              onPress={() => { setDeliveryMode('Standard') }
              }
            >
              <CustomRadioButton
                captionText={""}
                Value={'Standard'}
                state={deliveryMode}
                // check_button={() => setTerms(true)}
                OnPress={() => { setDeliveryMode('Standard') }
                }
              />
              <View style={{ width: windowWidth * (83 / 100) }}>
                <Text style={[styles.fontStyle1]} >
                  Slot Delivery
                </Text>
              </View>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>

              {
                deliveryMode === 'Standard' && (
                  <>
                    <View style={[styles.deliveryOptionView, { justifyContent: 'flex-start', height: null, marginBottom: 15 }]}>
                      {
                        selectedSlotDate && (

                          slotAvailableDates.map((item, i) => (
                            <TouchableOpacity style={{ padding: windowWidth * (3 / 100), marginVertical: 5, borderRadius: 10, backgroundColor: moment(item.slotDate).format('DD MM YYYY') === moment(selectedSlotDate.slotDate).format('DD MM YYYY') ? colours.kapraMain : colours.lowBlue, borderColor: colours.kapraMain, alignItems: 'center' }} onPress={() => setSelectedSlotDate(item)}>
                              <Text style={[styles.fontStyle1, { color: moment(item.slotDate).format('DD MM YYYY') === moment(selectedSlotDate.slotDate).format('DD MM YYYY') ? colours.primaryWhite : colours.primaryBlack }]}>
                                {
                                  date.getDate() == moment(item.slotDate).utcOffset('+05:30').format('DD') ? "Today" : date.getDate() + 1 == moment(item.slotDate).utcOffset('+05:30').format('DD') ? "Tommorow" : moment(item.slotDate).utcOffset('+05:30').format('dddd')
                                }
                              </Text>
                              <Text style={[styles.fontStyle1, { color: moment(item.slotDate).format('DD MM YYYY') === moment(selectedSlotDate.slotDate).format('DD MM YYYY') ? colours.primaryWhite : colours.primaryBlack }]}>
                                {moment(item.slotDate).utcOffset('+05:30').format('DD MMM')}
                              </Text>
                            </TouchableOpacity>
                          ))

                        )
                      }
                    </View>
                    <View style={{ width: windowWidth * (94 / 100) }}>
                      <Text style={styles.fontStyle1}>Select a slot</Text>
                    </View>
                    {
                      slotAvailableDates && slotAvailableDates.length > 0 && (
                        <FlatList
                          data={deliverySlots}
                          numColumns={2}
                          renderItem={({ item }, i) => (
                            moment(item.slotDate).utcOffset('+05:30').format('DD MMM') === moment(selectedSlotDate.slotDate).utcOffset('+05:30').format('DD MMM') && (
                              item.status == true && (
                                <TouchableOpacity style={{ height: windowHeight * (5 / 100), marginRight: 5, width: windowWidth * (46 / 100), marginTop: 10, paddingHorizontal: 10, backgroundColor: choosenDeliverySlot && choosenDeliverySlot.fromtime == item.fromtime && choosenDeliverySlot.totime == item.totime ? colours.kapraMain : colours.lowBlue, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: choosenDeliverySlot && choosenDeliverySlot.fromtime == item.fromtime && choosenDeliverySlot.totime == item.totime ? colours.kapraMain : colours.lightBlue }} onPress={() => { setChoosenDeliverySlot(item), setSelectedSlotDate(item) }}>
                                  <Text style={[styles.fontStyle1, { color: choosenDeliverySlot && choosenDeliverySlot.fromtime == item.fromtime && choosenDeliverySlot.totime == item.totime ? colours.primaryWhite : colours.kapraMain, }]}>
                                    {item.fromtime} - {item.totime}
                                  </Text>
                                </TouchableOpacity>
                              )
                            )
                          )}
                          keyExtractor={(item, i) => i.toString()}
                        />
                      )
                    }
                    {
                      slotAvailableDates && slotAvailableDates.length == 0 && (
                        <View style={{ justifyContent: 'center', height: windowHeight * (40 / 100) }}>
                          <Text style={[styles.fontStyle2, { color: colours.primaryRed }]}>No slots available</Text>
                        </View>
                      )
                    }
                  </>

                )
              }
            </ScrollView>
            {
              deliveryMode !== '' &&
              (
                <AuthButton
                  FirstColor={colours.kapraOrange}
                  SecondColor={colours.kapraOrangeDark}
                  OnPress={() => deliveryMode == 'Express' ? applyDeliveryMode() : choosenDeliverySlot ? applyDeliveryMode() : Toast.show('Please choose a slot.')}
                  ButtonText={'Apply'}
                  ButtonWidth={95}
                  ButtonHeight={5}
                />
              )
            }
          </View>
        </Modal>
      </View>

      {/* Coupon Modal */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true} visible={modalCouponVisible}
          onRequestClose={() => setModalCouponVisible(false)}
          animationInTiming={2000}
          animationOutTiming={2000}
        >
          <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={1}
            overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
            reducedTransparencyFallbackColor='black'
          />
          <Pressable style={[styles.commonModalStyle, {
            height: windowHeight * (65 / 100),
            marginTop: windowHeight * (35 / 100),
            // paddingBottom: windowHeight * (2 / 100),
            paddingBottom: Platform.OS === "android" ? insets.bottom + 40 : windowHeight * (2 / 100),
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                Available Coupons
              </Text>
              <TouchableOpacity onPress={() => setModalCouponVisible(false)}>
                <Text>
                  {showIcon('close', colours.kapraWhite, windowWidth * (6 / 100))}
                </Text>
              </TouchableOpacity>
            </View>
            {
              !profile.groceryCustId ?
                <View style={{ alignItems: 'center' }}>
                  <Text style={[styles.cartHeader, { color: colours.primaryBlack, fontSize: getFontontSize(23), paddingVertical: 10 }]}>
                    You don't have access.
                  </Text>
                  <Text style={[styles.cartHeader, { color: colours.primaryGrey, fontSize: getFontontSize(13), marginBottom: 20 }]}>
                    Log in or sign up to proceed
                  </Text>
                  <TouchableOpacity style={{ borderWidth: 2, borderRadius: 5, borderColor: colours.kmPink }} onPress={() => { setModalCouponVisible(false), navigation.navigate('LoginOTPScreen') }}>
                    <Text style={[styles.cartHeader, { color: colours.kmPink, fontSize: getFontontSize(23), paddingHorizontal: 20, paddingVertical: 10 }]}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
                :

                couponData && (
                  <>
                    <Text />
                    <LoginTextInput
                      OnChangeText={(text) => {
                        setCouponCode(text);
                        setCouponCodeError(false);
                      }}
                      Width={90}
                      Title={'Coupon Code'}
                      Placeholder={"Enter Coupon Code"}
                      value={couponCode}
                      Error={couponCodeError}
                      ErrorText={couponCodeErrorMsg}
                      Height={12}
                    />
                    <ScrollView>

                    </ScrollView>
                    {/* <FlatList
                        contentContainerStyle={styles.couponModalView}
                        data={couponData}
                        ListEmptyComponent={(
                          <View style={{
                            width: windowWidth*(90/100),
                            alignItems:'center',
                          }}>
                            <Text>No coupons available! Try code you have.</Text>
                          </View>
                        )}
                        renderItem={({ item}, i) => (
                          <>
                            <CouponCard
                              Data={item}
                              OnPress={()=>applyCouponFun(item.cpCode)}
                              CartSum={cartSummary&&cartSummary?.grandTotal?cartSummary?.grandTotal:0}
                            />
                          </>
                        )}
                        keyExtractor={(item, i) => i.toString()}
                    /> */}
                    <AuthButton
                      BackgroundColor={colours.primaryColor}
                      OnPress={() => couponCode.trim() == '' ? Toast.show("Pleas enter a valid coupon code") : applyCouponFun(couponCode)}
                      ButtonText={'APPLY'}
                      ButtonWidth={90}
                      FirstColor={colours.kapraOrangeDark}
                      SecondColor={colours.kapraOrange}
                    />
                  </>
                )
            }


          </Pressable>
        </Modal>
      </View>

      {/* Gift card Modal */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={giftCardModal}
          onRequestClose={() => setGiftCardModal(false)}
          animationInTiming={2000}
          animationOutTiming={2000}
        >
          <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={1}
            overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
            reducedTransparencyFallbackColor='black'
          />
          <Pressable style={[styles.commonModalStyle, {
            height: windowHeight * (65 / 100), marginTop: windowHeight * (35 / 100),
            // paddingBottom: windowHeight * (2 / 100) 
            paddingBottom: Platform.OS === "android" ? insets.bottom + 40 : windowHeight * (2 / 100)
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.fontStyle1, { color: colours.primaryWhite }]} >
                Available Smart Point
              </Text>
              <TouchableOpacity onPress={() => setGiftCardModal(false)}>
                <Text>
                  {showIcon('close', colours.primaryWhite, windowWidth * (6 / 100))}
                </Text>
              </TouchableOpacity>
            </View>
            {
              !profile.groceryCustId ?
                <View style={{ alignItems: 'center' }}>
                  <Text style={[styles.cartHeader, { color: colours.primaryBlack, fontSize: getFontontSize(23), paddingVertical: 10 }]}>
                    You don't have access.
                  </Text>
                  <Text style={[styles.cartHeader, { color: colours.primaryGrey, fontSize: getFontontSize(13), marginBottom: 20 }]}>
                    Log in or sign up to proceed
                  </Text>
                  <TouchableOpacity style={{ borderWidth: 2, borderRadius: 5, borderColor: colours.kmPink }} onPress={() => { setGiftCardModal(false), navigation.navigate('LoginOTPScreen') }}>
                    <Text style={[styles.cartHeader, { color: colours.kmPink, fontSize: getFontontSize(23), paddingHorizontal: 20, paddingVertical: 10 }]}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
                :

                giftCardData ? (
                  <>
                    <Text style={styles.fontStyle4}>Choose the gift cards you want to use.</Text>
                    <FlatList
                      contentContainerStyle={styles.couponModalView}
                      data={giftCardData}
                      ListEmptyComponent={(
                        <View>
                          <View style={{ height: windowHeight * (20 / 100) }}>
                            <Text>{showIcon('bin1', colours.primaryRed, 130)}</Text>
                          </View>
                          <Text>Nothing to show</Text>
                        </View>
                      )}
                      renderItem={({ item }, i) => (
                        <Pressable style={styles.giftMainContainer} onPress={() => updateGiftCard(item)}>
                          <ImageBackground
                            source={require('../../assets/images/Giftcard1.jpg')}
                            style={styles.imgCon}
                            imageStyle={[styles.imgCon, { borderColor: colours.primaryPink, borderWidth: appliedGiftCards.includes(item.id) ? 2 : 0 }]}
                          >
                            <View style={styles.contentCon1}>
                              <Text style={styles.giftFontStyle1} numberOfLines={2}>{item.giftCode.toUpperCase()}</Text>
                            </View>
                            <View style={styles.contentCon2}>
                              <Text style={styles.giftFontStyle3}>
                                Get Flat ₹{item.gAmount} OFF
                              </Text>
                            </View>
                            <View style={styles.contentCon3}>

                              <View style={styles.dateCon}>
                                <Text style={[styles.giftFontStyle1, { color: colours.lightPink }]}>{moment(item.expieryDate).format("DD")}</Text>
                                <Text style={[styles.giftFontStyle3]}>{moment(item.expieryDate).format("MMM YY")}</Text>
                              </View>
                            </View>

                          </ImageBackground>
                        </Pressable>
                      )}
                      keyExtractor={(item, i) => i.toString()}
                    />
                    <AuthButton
                      BackgroundColor={colours.kapraMain}
                      OnPress={() => applyGiftCards()}
                      ButtonText={'APPLY'}
                      ButtonWidth={90}
                      FirstColor={colours.lightRed}
                      SecondColor={colours.primaryPink}
                    />
                  </>
                )
                  :
                  <View style={{
                    width: windowWidth,
                    alignItems: 'center'
                  }}>
                    <View style={{ height: windowHeight * (20 / 100) }}>
                      <Text>{showIcon('bin1', colours.primaryRed, 130)}</Text>
                    </View>
                    <Text style={styles.fontStyle1}>You don't have any Smartpoints to redeem</Text>
                  </View>

            }


          </Pressable>
        </Modal>
      </View>



    </SafeAreaView>
  );
};

export default GroCartScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
  },
  headerCon: {
    width: windowWidth,
    height: windowHeight * (8 / 100),
    backgroundColor: colours.kapraWhite,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: windowWidth * (5 / 100)
  },
  backButtonCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (10 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningLottie: {
    height: windowHeight * (6 / 100),
    width: windowHeight * (6 / 100),
  },
  rowItemCon: {
    width: windowWidth * (95 / 100),
    backgroundColor: colours.kapraWhiteLow,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10
  },
  savingsCon: {
    width: windowWidth,
    height: windowHeight * (4 / 100),
    marginVertical: windowHeight * (2 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    backgroundColor: colours.primaryGreen,
    justifyContent: 'center'
  },
  priceRowCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * (90 / 100)
  },
  addressCon: {
    marginTop: 5,
    width: windowWidth,
    paddingHorizontal: windowWidth * (3 / 100),
    flexDirection: 'row',
    backgroundColor: colours.lowWhite,
    paddingVertical: 5
  },
  blurStyle: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: null,
    overflow: 'hidden'
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    backgroundColor: colours.kapraOrangeLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: windowWidth * (3 / 100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  minDeliveryCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (7 / 100),
    flexDirection: 'row',
    alignItems: 'center',
  },
  minDeliveryIcon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    backgroundColor: colours.kapraWhiteLow,
    alignItems: 'center',
    justifyContent: 'center'
  },





  // Fonts 
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  storeCloseText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(15),
    color: colours.primaryBlack,
    lineHeight: getFontontSize(22),
  },
  subTitles: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraBlack,
  },









  skeltonCard: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (25 / 100),
    borderRadius: 10,
    marginBottom: 10
  },
  cartHeaderContainer: {
    width: windowWidth,
    height: windowHeight * (6 / 100),
    backgroundColor: colours.kmDarkOurple,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerBackButton: {
    width: windowWidth * (15 / 100),
    height: windowHeight * (6 / 100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerView: {
    width: windowWidth * (94 / 100),
    paddingLeft: windowWidth * (3 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartHeader: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.kapraMain

  },
  commonModalStyle: {
    width: windowWidth,
    height: windowHeight * (50 / 100),
    marginTop: windowHeight * (50 / 100),
    backgroundColor: colours.kapraWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    alignItems: 'center'
  },
  couponModalView: {
    width: windowWidth,
    paddingHorizontal: windowWidth * (3 / 100),
    marginTop: windowHeight * (2 / 100),
    paddingBottom: windowHeight * (10 / 100)
  },
  couponContainer: {
    width: windowWidth,
    marginTop: 5,
    height: windowHeight * (5 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deliveryOptionView: {
    width: windowWidth * (94 / 100),
    height: windowHeight * (7 / 100),
    borderRadius: 5,
    paddingLeft: windowWidth * (3 / 100),
    alignItems: 'center',
    borderWidth: 0.3,
    borderColor: colours.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colours.lowBlue,
    marginTop: 10
  },
  borderBottomContainer: {
    marginTop: 5,
    paddingVertical: 10,
    width: windowWidth,
    paddingHorizontal: windowWidth * (2.5 / 100),
  },
  bottomButtonContainer: {
    width: windowWidth,
    height: windowHeight * (6 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.primaryWhite,
    marginTop: 5
  },
  botoomButton: {
    width: windowWidth * (94 / 100),
    height: windowHeight * (5 / 100),
    backgroundColor: '#F04B1B',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Pricing: {
    //height: windowHeight * (5 / 100),
    width: windowWidth * (91 / 100),
    marginLeft: windowWidth * (4.5 / 100),
    backgroundColor: colours.lowWhite,
    marginTop: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10

  },
  closeMsgCon: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colours.lowRed,
    paddingHorizontal: windowWidth * (5 / 100)
  },

  // GIFT CARD


  giftMainContainer: {
    width: windowWidth * (94 / 100),
    // height: windowWidth*(30/100),
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  imgCon: {
    width: windowWidth * (94 / 100),
    height: windowWidth * (42 / 100),
    flexDirection: 'row',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  contentCon1: {
    width: windowWidth * (45 / 100),
    height: windowWidth * (42 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth * (4 / 100),
  },
  contentCon2: {
    width: windowWidth * (30 / 100),
    height: windowWidth * (42 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth * (4 / 100),
  },
  contentCon3: {
    width: windowWidth * (20 / 100),
    height: windowWidth * (42 / 100),
  },
  dateCon: {
    width: windowWidth * (16 / 100),
    height: windowWidth * (15 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftFontStyle1: {
    fontFamily: 'Lexend-Bold',
    fontSize: getFontontSize(20),
    color: colours.primaryPink,
    textAlign: 'center'
  },
  giftFontStyle2: {
    width: windowWidth * (30 / 100),
    height: windowWidth * (25 / 100),
    position: 'absolute',
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(17),
    color: colours.primaryWhite,
    transform: [{ rotate: '270deg' }],
    paddingBottom: windowWidth * (4 / 100),
    textAlign: 'center'
  },
  giftFontStyle3: {
    fontFamily: 'Lexend-Bold',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
    textAlign: 'center'
  },
  giftFontStyle4: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(12),
    color: colours.kapraMain,
  },





  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(15),
    color: colours.primaryBlack,
    lineHeight: getFontontSize(22),
  },
  fontStyle2: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(13),
    color: colours.primaryBlack
  },
  fontStyle3: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
    lineHeight: getFontontSize(24)
  },
  fontStyle4: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
    lineHeight: getFontontSize(20)
  },
  fontStyle5: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(10),
    color: colours.kapraBlackLow,
  },
  fontStyle6: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    color: colours.kapraBlack,
  },
  centeredView: {
    // backgroundColor: '#0009',
    backgroundColor: colours.primaryWhite,
    backgroundColor: '#0009',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  RadioButton: {
    height: windowWidth * (4 / 100),
    width: windowWidth * (4 / 100),
    borderRadius: windowWidth * (2 / 100),
    borderWidth: 1,
    borderColor: colours.kapraOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedButton: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colours.kapraRed,
  },


});



const CustomRadioButton = ({ state, OnPress, captionText, Value }) => {

  return (
    <TouchableOpacity
      onPress={OnPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={styles.RadioButton}
      >
        <View style={state === Value ? styles.checkedButton : ''} />
      </View>
      <Text style={[styles.fontStyle1, { color: colours.primaryGrey }]}>{captionText} </Text>
    </TouchableOpacity>
  );
};