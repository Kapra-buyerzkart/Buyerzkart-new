
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Linking,
  Modal,
  Image,
  TextInput,
  Platform
} from 'react-native';
import CONFIG from '../globals/config';
import { CommonActions } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Header from '../components/Header';
import OrderitemCard from '../components/OrderitemCard';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import {
  getSingleOrder,
  getSingleOrderStatus,
  CancelOrder,
  ReturnRequest,
  postDeliveryReview,
  getETA,
  deliveryStuck,
  postReOrder,
  initiatePayment
} from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../../Context/appContext';
import PriceCard from '../components/PriceCard';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import OrderCountDown from '../components/OrderCountDown';
import { AirbnbRating } from 'react-native-ratings';
import OrderImageTimerCard from '../components/OrderImageTimerCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import RNFetchBlob from 'rn-fetch-blob';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import ReactNativeBlobUtil from 'react-native-blob-util'
import LottieView from 'lottie-react-native';
import { WebView } from 'react-native-webview';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import RazorpayCheckout from 'react-native-razorpay';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroSingleOrderScreen({ navigation, route }) {
  const { profile, GroUpdateCart, GroCartData } = React.useContext(AppContext);
  const { orderId } = route.params;
  const [data, setData] = React.useState({});
  const [orderStatus, setOrderStatus] = React.useState(null);
  const [trackOrderModal, setTrackOrderModal] = React.useState(false);
  const [deliveryReviewModal, setDeliveryReviewModal] = React.useState(false);
  const [deliveryRating, setDeliveryRating] = React.useState(0);
  const [deliveryReview, setDeliveryReview] = React.useState('')
  const [eta, setEta] = React.useState(null);
  const [delBoyViewState, setDelBoyViewState] = React.useState(false);
  const [statusViewState, setStatusViewState] = React.useState(false);
  const [dummy, setDummy] = React.useState(true);
  const [isShown, setIsShown] = useState(false);

  const { showLoader } = React.useContext(LoaderContext);

  const insets = useSafeAreaInsets();

  const checkPermission = async (value) => {
    if (Platform.OS === 'ios') {
      downloadImage(value);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Storage Permission needed for download invoices',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadImage(value);
        } else {
          Toast.show('Storage Permission Not Granted');
        }
      } catch (err) {
      }
    }
  };

  const downloadImage = (value) => {
    const { config, fs } = ReactNativeBlobUtil;
    const { dirs: { DownloadDir, DocumentDir } } = ReactNativeBlobUtil.fs;
    const PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let image_URL = CONFIG.image_base_url + value;
    let ext = '.pdf';
    const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
    const fPath = aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.pdf';
    const options = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        notification: true,
      },
      android: {
        fileCache: true,
        path: PictureDir + '/Buyerskart' + '.pdf',
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: 'Invoice',
          description: 'PDF',

        },
      },
    });
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        Toast.show('Download Completed');
        if (Platform.OS === "ios") {
          ReactNativeBlobUtil.ios.openDocument(res.data);
        }
      });
  };

  const _fetchOrderList = async () => {
    try {
      let res2 = await getSingleOrderStatus(orderId);
      if (orderStatus == null) {
        setData({})
        let res = await getSingleOrder(orderId);
        setData(res);
        setOrderStatus(res2);
        if (
          res.OrderDetails.status === 'Order Placed' ||
          res.OrderDetails.status === 'Order Accepted' ||
          res.OrderDetails.status === 'Order Packed' ||
          res.OrderDetails.status === 'Order Dispatched'
        ) {
          let res3 = await getETA(res?.OrderDetails?.deliveryAgentId ? res?.OrderDetails?.deliveryAgentId : '', orderId);
          setEta(res3)
          setDummy(!dummy)
          if (res.OrderDetails.status === 'Order Dispatched') {
            let stuckEta = await AsyncStorage.getItem(`StuckETA${orderId}`);
            if (!stuckEta) {
              let b = [];
              b.push(res3.eta)
              await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
            } else {
              if (stuckEta !== 'true') {
                if (JSON.parse(stuckEta).length == 10) {
                  let arr = JSON.parse(stuckEta);
                  const allEqual = arr => arr.every(v => v === arr[0]);
                  if (allEqual(arr)) {
                    let b = JSON.parse(stuckEta).slice(1, 10);
                    b.push(res3.eta)
                    await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                    try {
                      let response = await deliveryStuck(orderId);
                      await AsyncStorage.setItem(`StuckETA${orderId}`, 'true');
                    } catch (err) {
                    }
                  } else {
                    let b = JSON.parse(stuckEta).slice(1, 10);
                    b.push(res3.eta)
                    await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                  }
                } else if (JSON.parse(stuckEta).length < 10) {
                  let b = JSON.parse(stuckEta);
                  b.push(res3.eta)
                  await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                }
              }
            }
          }
        }
      } else {
        if (orderStatus.length == res2.length) {
          setOrderStatus(res2);
          if (
            data?.OrderDetails.status === 'Order Placed' ||
            data?.OrderDetails.status === 'Order Accepted' ||
            data?.OrderDetails.status === 'Order Packed' ||
            data?.OrderDetails.status === 'Order Dispatched'
          ) {
            let res3 = await getETA(data?.OrderDetails?.deliveryAgentId ? data?.OrderDetails?.deliveryAgentId : '', orderId);
            setEta(res3)
            setDummy(!dummy)
            if (data?.OrderDetails.status === 'Order Dispatched') {
              let stuckEta = await AsyncStorage.getItem(`StuckETA${orderId}`);
              if (!stuckEta) {
                let b = [];
                b.push(res3.eta)
                await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
              } else {
                if (stuckEta !== 'true') {
                  if (JSON.parse(stuckEta).length == 10) {
                    let arr = JSON.parse(stuckEta);
                    const allEqual = arr => arr.every(v => v === arr[0]);
                    if (allEqual(arr)) {
                      let b = JSON.parse(stuckEta).slice(1, 10);
                      b.push(res3.eta)
                      await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                      try {
                        let response = await deliveryStuck(orderId);
                        await AsyncStorage.setItem(`StuckETA${orderId}`, 'true');
                      } catch (err) {
                      }
                    } else {
                      let b = JSON.parse(stuckEta).slice(1, 10);
                      b.push(res3.eta)
                      await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                    }
                  } else if (JSON.parse(stuckEta).length < 10) {
                    let b = JSON.parse(stuckEta);
                    b.push(res3.eta)
                    await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                  }
                }
              }
            }
          }
        } else if (orderStatus.length < res2.length) {
          setData({})
          let res = await getSingleOrder(orderId);
          setData(res);
          setOrderStatus(res2);
          if (
            res.OrderDetails.status === 'Order Placed' ||
            res.OrderDetails.status === 'Order Accepted' ||
            res.OrderDetails.status === 'Order Packed' ||
            res.OrderDetails.status === 'Order Dispatched'
          ) {
            let res3 = await getETA(res?.OrderDetails?.deliveryAgentId ? res?.OrderDetails?.deliveryAgentId : '', orderId);
            setEta(res3)
            setDummy(!dummy)
            if (res.OrderDetails.status === 'Order Dispatched') {
              let stuckEta = await AsyncStorage.getItem(`StuckETA${orderId}`);
              if (!stuckEta) {
                let b = [];
                b.push(res3.eta)
                await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
              } else {
                if (stuckEta !== 'true') {
                  if (JSON.parse(stuckEta).length == 10) {
                    let arr = JSON.parse(stuckEta);
                    const allEqual = arr => arr.every(v => v === arr[0]);
                    if (allEqual(arr)) {
                      let b = JSON.parse(stuckEta).slice(1, 10);
                      b.push(res3.eta)
                      await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                      try {
                        let response = await deliveryStuck(orderId);
                        await AsyncStorage.setItem(`StuckETA${orderId}`, 'true');
                      } catch (err) {
                      }
                    } else {
                      let b = JSON.parse(stuckEta).slice(1, 10);
                      b.push(res3.eta)
                      await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                    }
                  } else if (JSON.parse(stuckEta).length < 10) {
                    let b = JSON.parse(stuckEta);
                    b.push(res3.eta)
                    await AsyncStorage.setItem(`StuckETA${orderId}`, JSON.stringify(b));
                  }
                }
              }
            }
          }
        }
      }

    } catch (err) {

    }
    setDummy(!dummy)
  };

  React.useEffect(() => {
    _fetchOrderList();
  }, []);

  const _cancelOrder = async () => {
    try {
      showLoader(true);
      let res = await CancelOrder(orderId);
      showLoader(false);
      Toast.show('Order Cancelled');

      _fetchOrderList();

    } catch (err) {
      showLoader(false);
      log("Error in cancel order", err);
    }
  }

  const ReOrder = async () => {
    try {
      showLoader(true);
      let res = await postReOrder(orderId);
      showLoader(false);
      await GroUpdateCart();
      Toast.show('Items aaded to cart, Please place order.');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'GroHomeScreen' },
            {
              name: 'GroCartScreen',
            },
          ],
        })
      )

    } catch (err) {
    }
  }

  const submitDeliveryReview = async () => {
    try {
      showLoader(true);
      let res = await postDeliveryReview({
        custId: profile.bkCustId,
        orderId: orderId,
        rating: deliveryRating,
        reviewText: deliveryReview
      });
      showLoader(false);
      Toast.show('Delivery review submitted');
      setDeliveryReviewModal(false)
      setData({})
      let res2 = await getSingleOrder(orderId);
      setData(res2);

    } catch (err) {
      showLoader(false);
      setDeliveryReviewModal(false)
    }
  }


  React.useEffect(() => {
    const timeoutID = setTimeout(async () => {
      setIsShown(!isShown)
      await _fetchOrderList();
      // myFunction();
    }, 45000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [isShown]);


  const razorPayUpdate = async () => {

    let res = await initiatePayment(orderId)

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
      theme: { color: colours.primaryBlue },
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
              params: { orderNo: res.orderNumber, orderId: res.orderId, },
            },
          ],
        })
      )
    }).catch((error) => {
      navigation.navigate('GroOrderUnsuccessScreen', {
        data: res
      });
    });
  }

  if (Object.keys(data).length === 0) return (
    <SafeAreaView style={styles.mainContainer}>

      <View style={styles.headerStyle}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View>
            {showIcon('back', colours.primaryGrey, windowWidth * (5 / 100))}
          </View>
          <Text style={[styles.fontStyle1, { color: colours.primaryGrey }]}>
            {"   "}Order Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('GroWriteToUsScreen')}>
          <View>
            {showIcon('whatsapp', colours.primaryGrey, windowWidth * (5 / 100))}
          </View>
          <Text style={[styles.fontStyle1, { color: colours.primaryGrey }]}>
            {"   "}GET HELP
          </Text>
        </TouchableOpacity>
      </View>

      <SkeletonPlaceholder highlightColor={colours.lowBlue}>
        <View style={{
          width: windowWidth * (90 / 100),
          height: windowWidth,
          borderRadius: 10,
          marginTop: 10
        }}
        />
        <View style={{
          width: windowWidth * (90 / 100),
          height: windowWidth * (20 / 100),
          borderRadius: 10,
          marginTop: 10
        }}
        />
        <View style={{
          width: windowWidth * (90 / 100),
          height: windowWidth * (30 / 100),
          borderRadius: 10,
          marginTop: 10
        }}
        />
        <View style={{
          width: windowWidth * (90 / 100),
          height: windowWidth * (10 / 100),
          borderRadius: 10,
          marginTop: 10
        }}
        />
        <View style={{
          width: windowWidth * (90 / 100),
          height: windowWidth * (40 / 100),
          borderRadius: 10,
          marginTop: 10
        }}
        />
      </SkeletonPlaceholder>
    </SafeAreaView>

  );

  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={() => navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth * (5 / 100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Summary</Text>
      </View>

      {/* OTP Show  */}
      {
        data?.OrderDetails?.OTP && (
          <View style={{ width: windowWidth, backgroundColor: colours.primaryRed, alignItems: 'center', paddingVertical: 5 }}>
            <Text style={[styles.otpFont, { color: colours.primaryWhite }]}>Delivery confirmation OTP : {data?.OrderDetails?.OTP}</Text>
          </View>
        )
      }


      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>

        {/* Delivery Animation  */}
        {
          eta && (
            <OrderImageTimerCard
              Status={data?.OrderDetails.status}
              DeliveryMode={data?.OrderDetails.deliveryMode}
              ETA={eta}
              SlotDate={data?.OrderDetails.slotDate}
              SlotFromTime={data?.OrderDetails.fromTime}
              SlotToTime={data?.OrderDetails.toTime}
            />
          )
        }

        {/* Order Status  */}
        {
          orderStatus && (
            <View style={styles.statusMainCon}>
              <TouchableOpacity style={styles.statusHeaderCon}
                onPress={() => setStatusViewState(!statusViewState)}
              >
                <Text style={styles.fontStyle3}></Text>
                <View style={{ width: windowWidth * (10 / 100), height: windowWidth * (10 / 100) }}>{showIcon(!statusViewState ? 'downArrow' : 'upArrow', colours.primaryBlack, windowWidth * (5 / 100))}</View>
              </TouchableOpacity>
              {
                !statusViewState ?
                  <View>
                    <View style={[styles.statusCon2]}>
                      <View style={[styles.iconStatusCon]}>{showIcon('rightTickRound', colours.primaryGreen, windowWidth * (6 / 100))}</View>
                      <View style={{ marginLeft: 10, borderBottomWidth: 1, width: windowWidth * (60 / 100), borderColor: colours.lowGrey }}>
                        <Text style={styles.fontStyle3}>{orderStatus[orderStatus.length - 1]?.status}</Text>
                        <Text style={styles.fontStyle4}>{moment(orderStatus[orderStatus.length - 1]?.statusDate).format('Do MMM YYYY hh : mm A')}</Text>
                        <Text />
                      </View>
                    </View>
                  </View>
                  :
                  <View>
                    {
                      orderStatus.map((item, index) => (
                        <View style={[styles.statusCon, { borderLeftWidth: orderStatus.length == index + 1 ? 0 : 3 }]}>
                          <View style={[styles.iconStatusCon]}>{showIcon('rightTickRound', colours.primaryGreen, windowWidth * (6 / 100))}</View>
                          <View style={{ marginLeft: 10, borderBottomWidth: 1, width: windowWidth * (60 / 100), borderColor: colours.lowGrey }}>
                            <Text style={styles.fontStyle3}>{item?.status}</Text>
                            <Text style={styles.fontStyle4}>{moment(item?.statusDate).format('Do MMM YYYY hh : mm A')}</Text>
                            <Text />
                          </View>
                        </View>
                      )
                      )}
                  </View>
              }
            </View>
          )
        }

        {/* Track Order  */}
        {
          !(data.OrderDetails.status == 'Order Cancelled' || data.OrderDetails.status == 'Order Pending' || data.OrderDetails.status == 'Order Return' || data.OrderDetails.status == 'Order Delivered') && (data.OrderDetails.deliveryAgent || data.OrderDetails.deliveryAgentPhone || data.OrderDetails.trackingLink) ?

            <View style={styles.commonCon}>
              <View>

                {
                  data.OrderDetails.trackingLink && (data.OrderDetails.status === 'Order Dispatched') && (
                    <TouchableOpacity
                      style={[styles.dateContainer, { paddingVertical: 5 }]}
                      // onPress={()=>Linking.openURL(data.OrderDetails.trackingLink)}
                      onPress={() => setTrackOrderModal(true)}
                    >
                      <Text style={[styles.fontStyle3, { color: colours.primaryWhite }]}>Track Order</Text>
                    </TouchableOpacity>
                  )
                }
              </View>
            </View>
            :
            null
        }

        {/* Review Order  */}
        {
          data.OrderDetails.status == 'Order Delivered' && !data.OrderDetails.deliveryReviewAdded && (
            <View style={[styles.commonCon, { alignItems: 'flex-end' }]}>
              <AuthButton
                FirstColor={colours.kapraOrange}
                SecondColor={colours.kapraOrangeLight}
                OnPress={() => setDeliveryReviewModal(true)}
                ButtonText={'Review Delivery'}
                ButtonWidth={35}
                FSize={13}
                ButtonHeight={4.5}
              />
            </View>
          )
        }

        {/* Delivery Agent  */}
        {
          (data?.OrderDetails?.deliveryAgent || data?.OrderDetails?.deliveryAgentPhone) && orderStatus && orderStatus[orderStatus?.length - 1]?.status !== 'Order Delivered' && (

            <View style={styles.statusMainCon}>

              <TouchableOpacity style={[styles.statusHeaderCon, { paddingHorizontal: windowWidth * (3 / 100), marginBottom: 0 }]}
                onPress={() => setDelBoyViewState(!delBoyViewState)}
              >
                <Text style={styles.fontStyle3}>Contact Delivery Boy</Text>
                <View style={{ width: windowWidth * (10 / 100), height: windowWidth * (10 / 100) }}>{showIcon(!delBoyViewState ? 'downArrow' : 'upArrow', colours.primaryBlack, windowWidth * (5 / 100))}</View>
              </TouchableOpacity>

              {
                delBoyViewState && (
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: windowWidth * (3 / 100),
                    padding: 5,
                  }}>
                    <View style={styles.deliveryIconCon}>
                      {showIcon('profile', colours.kapraMain, windowWidth * (6 / 100))}
                    </View>
                    <View style={{ width: windowWidth * (50 / 100) }}>
                      <Text style={styles.fontStyle2}>{data?.OrderDetails?.deliveryAgent}</Text>
                      <Text style={styles.fontStyle4}>{data?.OrderDetails?.deliveryAgentPhone}</Text>

                    </View>
                    <TouchableOpacity style={[styles.deliveryIconCon, { backgroundColor: colours.kapraOrangeLow }]} onPress={() => Linking.openURL(`tel:${data?.OrderDetails?.deliveryAgentPhone}`)} >
                      {showIcon('call', colours.kapraMain, windowWidth * (6 / 100))}
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>
          )
        }

        {/* Delivery Address  */}
        <View style={[styles.commonCon, { paddingHorizontal: windowWidth * (2 / 100) }]}>
          <View style={styles.addressCon}>
            <View style={{ height: windowWidth * (10 / 100), width: windowWidth * (10 / 100), backgroundColor: colours.kapraWhite, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
              {showIcon('shop', colours.kapraBlack, windowWidth * (5 / 100))}
            </View>
            <View style={{ paddingVertical: 2, borderRadius: 20, marginTop: 5, }}>
              <Text style={styles.fontStyle3}>{data?.OrderDetails?.superMarketName}</Text>
              <Text style={[styles.fontStyle4, { color: colours.primaryGrey }]}>{data?.OrderDetails?.supermarketCode}</Text>
            </View>
          </View>
          <View style={styles.addressCon}>
            <View style={{ height: windowWidth * (10 / 100), width: windowWidth * (10 / 100), backgroundColor: colours.kapraWhite, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
              {showIcon('home1', colours.kapraBlack, windowWidth * (5 / 100))}
            </View>
            <View style={{ paddingVertical: 2, borderRadius: 20, marginTop: 5, }}>
              <Text style={styles.fontStyle3}>{data.ShippingAddress.firstName} {data.ShippingAddress.lastName}</Text>
              <Text style={[styles.fontStyle4, { color: colours.primaryGrey }]}>{data.ShippingAddress.addLine1}, {data.ShippingAddress.addLine2}, {data.ShippingAddress.district}, {data.ShippingAddress.state}, {data.ShippingAddress.country}, {data.ShippingAddress.phone}</Text>
            </View>
          </View>
          <View
            style={{
              height: windowHeight * (4 / 100),
              borderLeftWidth: 2,
              borderStyle: Platform.OS == 'ios' ? 'solid' : 'dotted',
              borderColor: colours.kapraBlackLow,
              position: 'absolute',
              left: windowWidth * (8 / 100),
              top: windowHeight * (5.5 / 100),
            }}
          />

        </View>

        {/* Orderd Items  */}
        <FlatList
          data={data?.OrderItemsDetails}
          contentContainerStyle={{
            width: windowWidth,
            backgroundColor: colours.kapraWhite,
            paddingHorizontal: windowWidth * (2.5 / 100),
            paddingVertical: 10,
            marginBottom: 15
          }}
          ListHeaderComponent={
            <Text style={[styles.headerText, { fontSize: getFontontSize(14), paddingVertical: 10 }]}>  {data?.OrderItemsDetails?.length} item(s) in this order</Text>
          }
          renderItem={({ item, index }) => (
            <OrderitemCard
              Name={item.prName}
              Image={item.imageUrl}
              Price={item.productPrice}
              SpecialPrice={item.productSpecialPrice}
              ProductWeight={item.prWeight}
              QTY={item.qty}
              Reviewstatus={item.Reviewstatus}
              ReturnStatus={item.Returnstatus}
              OrderStatus={data.OrderDetails.status}
              OnPress={() => {
                if (item.urlKey !== null) {
                  navigation.navigate('GroSingleItemScreen', {
                    UrlKey: item.urlKey,
                    ItemData: item
                  });
                } else {
                  Toast.show("Url Key Is Null");
                }
              }}
              WriteReviewPress={
                () => {
                  if (profile.bkCustId) {
                    navigation.dispatch(
                      StackActions.replace('GroWriteReviewScreen', {
                        ProdDetails: item,
                      })
                    );
                    // navigation.navigate('WriteReview', {
                    //   ProdDetails: item,
                    // });
                  } else {
                    Toast.show('Please Login For Write Review');
                  }
                }
              }
              RequestReturn={
                async () => {
                  try {
                    showLoader(true);
                    await ReturnRequest(data.OrderDetails.orderId, item.productId, parseInt(item.qty));
                    Toast.show("Return requested.");
                    // _fetchOrderList();
                    setData({})
                    let res2 = await getSingleOrder(orderId);
                    setData(res2);
                    showLoader(false);
                  } catch (error) {
                    showLoader(false);
                    Toast.show(error);
                  }

                }
              }
            />

          )}
          keyExtractor={(item, i) => i.toString()}
        />

        {/* Bill Summary  */}
        <View style={styles.commonCon}>
          <Text style={[styles.headerText, { fontSize: getFontontSize(14), paddingVertical: 10 }]}>Bill Details</Text>

          <View style={styles.priceItemCon}>
            <Text style={[styles.fontStyle5]}>Subtotal : </Text>
            <PriceCard
              UnitPrice={data.OrderDetails.subTotal}
              FontSize={getFontontSize(13)}
            />
          </View>
          {
            data?.OrderDetails?.orderDiscount > 0 && (
              <View style={styles.priceItemCon}>
                <Text style={[styles.fontStyle5]}>Discount(-) : </Text>
                <PriceCard
                  UnitPrice={data.OrderDetails.orderDiscount}
                  FontSize={getFontontSize(13)}
                />
              </View>
            )
          }
          {
            data?.OrderDetails?.couponDiscount > 0 && (
              <View style={styles.priceItemCon}>
                <Text style={[styles.fontStyle5]}>Coupon Discount(-) : </Text>
                <PriceCard
                  UnitPrice={data.OrderDetails.couponDiscount}
                  FontSize={getFontontSize(13)}
                />
              </View>
            )
          }
          {
            data?.OrderDetails?.giftCarDamount > 0 && (
              <View style={styles.priceItemCon}>
                <Text style={[styles.fontStyle5]}>Smart Point Discount(-) : </Text>
                <PriceCard
                  UnitPrice={data.OrderDetails.giftCarDamount}
                  FontSize={getFontontSize(13)}
                />
              </View>
            )
          }
          {
            data?.OrderDetails?.bcoinsAppplied > 0 && (
              <View style={styles.priceItemCon}>
                <Text style={[styles.fontStyle5]}>B-Coin Applied(-) : </Text>
                <PriceCard
                  UnitPrice={data.OrderDetails.bcoinsAppplied}
                  FontSize={getFontontSize(13)}
                />
              </View>
            )
          }
          {
            data?.OrderDetails?.giftCarDamount > 0 && (
              <View style={styles.priceItemCon}>
                <Text style={[styles.fontStyle5]}>Smart Point Discount(-) : </Text>
                <PriceCard
                  UnitPrice={data.OrderDetails.giftCarDamount}
                  FontSize={getFontontSize(13)}
                />
              </View>
            )
          }
          {
            data?.OrderDetails?.orderDeliveryCharge > 0 && (
              <View style={styles.priceItemCon}>
                <Text style={[styles.fontStyle5]}>Shipping(+) : </Text>
                <PriceCard
                  UnitPrice={data.OrderDetails.orderDeliveryCharge}
                  FontSize={getFontontSize(13)}
                />
              </View>
            )
          }

          <View style={[styles.priceItemCon, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colours.kapraLow }]}>
            <Text style={[styles.fontStyle2, { fontSize: getFontontSize(14) }]}>Order Total : </Text>
            <PriceCard
              UnitPrice={data.OrderDetails.orderAmount}
              FontSize={getFontontSize(17)}
              Color={colours.kapraBlackLight}
            />
          </View>
        </View>

        {/* Order Summary  */}
        <View style={styles.commonCon}>
          <View>
            <Text style={[styles.fontStyle4, { color: colours.primaryGrey }]}>Order ID</Text>
            <Text style={[styles.fontStyle3]}>
              ORD {data?.OrderDetails?.orderNumber}
            </Text>
            <Text />

            <Text style={[styles.fontStyle4, { color: colours.primaryGrey }]}>Payment</Text>
            <Text style={[styles.fontStyle3]}>
              {data?.OrderDetails?.PayMethod}
            </Text>
            <Text />

            <Text style={[styles.fontStyle4, { color: colours.primaryGrey }]}>Delivery Mode</Text>
            <Text style={[styles.fontStyle3]}>
              {data?.OrderDetails?.deliveryMode}
            </Text>
            <Text />


            <Text style={[styles.fontStyle4, { color: colours.primaryGrey }]}>Order Placed</Text>
            <Text style={[styles.fontStyle3]}>
              Placed on {moment(data.OrderDetails.orderDate).utcOffset('+05:30').format('MMM DD, YYYY')} at {moment(data.OrderDetails.orderDate).utcOffset('+05:30').format('hh:mm a').toUpperCase()}
            </Text>
            <Text />

            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.dateContainer, { borderRadius: 2, backgroundColor: (data.OrderDetails.status === 'Order Cancelled' || data.OrderDetails.status === 'Order Pending') ? colours.primaryRed : data.OrderDetails.status == 'Delivery agent assigned' ? colours.primaryOrange : colours.primaryGreen }]}>
                <Text style={[styles.fontStyle3, { color: colours.primaryWhite }]}>{data.OrderDetails.status}</Text>
              </View>

              {
                data.OrderDetails.RefundTotal && data.OrderDetails.RefundTotal !== 0 && (
                  <View style={[styles.dateContainer, { borderRadius: 2, backgroundColor: colours.primaryRed }]}>
                    <Text style={[styles.fontStyle3, { color: colours.primaryWhite }]}>Refunded</Text>
                  </View>
                )}

            </View>
          </View>
        </View>

        {/* Bottom Buttons  */}
        <View style={styles.commonCon}>
          {
            (data.OrderDetails.status == 'Order Cancelled' || data.OrderDetails.status === 'Order Delivered') && (
              <AuthButton
                BackgroundColor={colours.lightPink}
                OnPress={() => ReOrder()}
                ButtonText={'Re-Order'}
                ButtonWidth={90}
                ButtonHeight={5}
              />
            )
          }
          {
            data.OrderDetails.status == 'Order Pending' && data.OrderDetails.PayMethod.toUpperCase() == "ONLINE" && (
              <AuthButton
                BackgroundColor={colours.lightPink}
                OnPress={() => razorPayUpdate(orderId)}
                ButtonText={'Retry Payment'}
                ButtonWidth={90}
                ButtonHeight={5}
              />
            )
          }
          {
            data?.InvoiceDetails?.invoiceUrl && data.OrderDetails.status === 'Order Delivered' && (
              <AuthButton
                FirstColor={colours.kapraLight}
                SecondColor={colours.kapraLight}
                OnPress={() => checkPermission(data.InvoiceDetails.invoiceUrl)}
                ButtonText={'Download Invoice'}
                ButtonWidth={90}
                Icon={'download'}
                ButtonHeight={5}
              />
            )
          }
          {
            data.OrderDetails.status === 'Order Placed' && (
              <AuthButton
                FirstColor={colours.lightRed}
                SecondColor={colours.lightRed}
                OnPress={() =>
                  Alert.alert(
                    'CANCEL',
                    'Are you sure want to cancel this order?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: async () => {
                          await _cancelOrder();
                        },
                      },
                    ],
                    { cancelable: false },
                  )}
                ButtonText={'Cancel Order'}
                ButtonWidth={90}
                ButtonHeight={5}
              />
            )
          }
        </View>

      </ScrollView>

      {/* Track Order Modal  */}
      <Modal
        animationType="slide"
        visible={trackOrderModal}
        transparent={true}
      >
        <View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)' }}>
          <View style={styles.trackOrderModalCon}>
            <View style={styles.modalHeadCon}>
              <Text style={styles.fontStyle2}>Live Track</Text>
              <TouchableOpacity onPress={() => setTrackOrderModal(false)}>{showIcon('close', colours.primaryRed, windowWidth * (5 / 100))}</TouchableOpacity>
            </View>
            <WebView source={{ uri: data.OrderDetails.trackingLink }} style={{
              height: windowHeight * (60 / 100),
              width: windowWidth,
            }} />
          </View>
        </View>
      </Modal>

      {/* Review Modal  */}
      <Modal
        animationType="slide"
        visible={deliveryReviewModal}
        transparent={true}
      >
        <View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)' }}>
          <View style={[styles.trackOrderModalCon, {
            paddingBottom: Platform.OS === "android" ? insets.bottom + 40 : windowHeight * (2 / 100),
          }]}>
            <View style={styles.modalHeadCon}>
              <Text style={styles.fontStyle2}>Delivery Review</Text>
              <TouchableOpacity onPress={() => setDeliveryReviewModal(false)}>{showIcon('close', colours.primaryRed, windowWidth * (5 / 100))}</TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{
                width: windowWidth * (90 / 100),
                paddingVertical: windowHeight * (2 / 100),
              }}>
                <Text style={styles.fontStyle2}>Rate this delivery out of 5</Text>
                <Text />
                <Text />
                <AirbnbRating
                  defaultRating={0}
                  count={5}
                  size={windowWidth * (10 / 100)}
                  showRating={false}
                  onFinishRating={(value) => {
                    setDeliveryRating(value);
                  }}
                />
              </View>
              <View style={{
                width: windowWidth * (90 / 100),
                paddingVertical: windowHeight * (2 / 100),
              }}>
                <Text style={styles.fontStyle2}>Write about our delivery</Text>
                <Text />
                <TextInput
                  placeholder={'Write Your Review'}
                  style={[
                    styles.textInput,
                    {
                      height: windowWidth * (35 / 100),
                      marginBottom: 5,
                      justifyContent: 'flex-start',
                      textAlignVertical: 'top',
                      paddingTop: 15
                    },
                  ]}
                  placeholderTextColor={colours.kapraBlackLow}
                  numberOfLines={6}
                  maxLength={250}
                  multiline={true}
                  onChangeText={(text) => setDeliveryReview(text)}
                />
              </View>
            </ScrollView>
            <AuthButton
              FirstColor={colours.kapraOrangeLight}
              SecondColor={colours.kapraOrange}
              OnPress={() => deliveryRating == 0 ? Toast.show('Please rate our delivery') : submitDeliveryReview()}
              ButtonText={'Submit Review'}
              ButtonWidth={90}
            />



          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhiteLow,
    alignItems: 'center',
  },
  headerCon: {
    width: windowWidth,
    height: windowHeight * (8 / 100),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: windowWidth * (5 / 100),
    backgroundColor: colours.kapraWhite,
  },
  backButtonCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (10 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusMainCon: {
    width: windowWidth,
    backgroundColor: colours.kapraWhite,
    borderRadius: 10,
    padding: windowWidth * (2.5 / 100),
    marginBottom: 15
  },
  iconStatusCon: {
    height: windowHeight * (3 / 100),
    width: windowHeight * (3 / 100),
    borderRadius: windowHeight * (5 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.kapraWhite,
    marginLeft: -(windowWidth * (3.5 / 100))
  },
  statusHeaderCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    width: '100%',
  },
  statusCon2: {
    width: windowWidth * (85 / 100),
    flexDirection: 'row',
    paddingLeft: windowWidth * (5 / 100),
  },
  statusCon: {
    width: windowWidth * (84 / 100),
    paddingBottom: windowHeight * (4 / 100),
    marginLeft: windowWidth * (10 / 100),
    borderLeftWidth: 3,
    borderColor: colours.kapraOrange,
    flexDirection: 'row',
  },
  addressCon: {
    width: windowWidth,
    backgroundColor: colours.kapraWhite,
    padding: windowWidth * (1 / 100),
    marginBottom: windowHeight * (1 / 100),
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonCon: {
    width: windowWidth,
    backgroundColor: colours.kapraWhite,
    paddingHorizontal: windowWidth * (5 / 100),
    paddingVertical: windowWidth * (1 / 100),
    marginBottom: 15,

  },







  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  otpFont: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(14),
    color: colours.kapraWhite,
  },
  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryWhite,
  },
  fontStyle2: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(12),
    color: colours.kapraBlack
  },
  fontStyle3: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(13),
    color: colours.kapraBlack,
  },
  fontStyle4: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(13),
    color: colours.kapraBlackLow,
    lineHeight: getFontontSize(22),
  },
  fontStyle5: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(13),
    color: colours.kapraBlackLow,
  },











  headerStyle: {
    width: windowWidth,
    height: windowHeight * (8 / 100),
    paddingHorizontal: windowWidth * (3 / 100),
    backgroundColor: colours.lowWhite,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  helpButton: {
    borderWidth: 1,
    borderColor: colours.primaryGrey,
    height: windowHeight * (5 / 100),
    paddingHorizontal: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  container2: {
    width: windowWidth,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    backgroundColor: colours.lowWhite
  },
  dateContainer: {
    backgroundColor: colours.primaryGreen,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 5,
    marginRight: 5,
    alignItems: 'center'
  },
  container3: {
    width: windowWidth,
    paddingHorizontal: windowWidth * (3 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colours.lowWhite,
    marginTop: 1,
    paddingVertical: 10
  },
  container4: {
    width: windowWidth,
    paddingHorizontal: windowWidth * (3 / 100),
    alignItems: 'center',
    backgroundColor: colours.lowWhite,
    marginTop: 5,
    paddingVertical: 10
  },
  bottomContainer: {
    //flexDirection: 'row',
    width: windowWidth * (90 / 100),
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    marginTop: '5%',
    marginBottom: '20%',
  },
  priceItemCon: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  trackOrderModalCon: {
    height: windowHeight * (70 / 100),
    marginTop: windowHeight * (30 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
  },
  modalHeadCon: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: colours.lowGrey
  },
  textInput: {
    marginTop: '3%',
    borderRadius: 25,
    width: windowWidth * (90 / 100),
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: colours.kapraWhiteLow,
    color: colours.primaryBlack,
    marginBottom: 25,
    fontFamily: 'Lexend-SemiBold',
    fontSize: 12,
  },
  deliveryIconCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colours.kapraWhiteLow
  },
  timerMainCon: {
    height: windowWidth * (90 / 100),
    width: windowWidth,
    alignItems: 'center',
  },
  skeletonCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight,
    borderRadius: 10,
    marginTop: 10
  },
  timerConImgBG: {
    height: windowWidth * (70 / 100),
    width: windowWidth * (70 / 100),
    resizeMode: 'contain',
  },
  timerConLottie: {
    height: windowWidth * (50 / 100),
    width: windowWidth * (50 / 100),
    top: Platform.OS == 'ios' ? - 35 : -45,
  },
  timerConCountDown: {
    position: 'absolute',
    height: windowWidth * (25 / 100),
    width: windowWidth * (25 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS == 'ios' ? -56 : -45,
    left: Platform.OS == 'ios' ? 49 : 44,
  },






});
