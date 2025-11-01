import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  RefreshControl
} from 'react-native';
import CONFIG from '../globals/config';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Header from '../components/Header';
import OrdersCard from '../components/OrdersCard';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { getSingleOrder, getSingleOrderStatus, CancelOrder, ReturnRequest, initiatePayment } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import moment, { lang } from 'moment';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import PriceCard from '../components/PriceCard';
import StepIndicator from 'react-native-step-indicator';
import { getImage, getFontontSize } from '../globals/functions';
import RazorpayCheckout from 'react-native-razorpay';

// import RNFetchBlob from 'rn-fetch-blob';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import ReactNativeBlobUtil from 'react-native-blob-util'

export default function SingleOrderScreen({ navigation, route }) {
  const { profile } = React.useContext(AppContext);
  const { orderId } = route.params;
  const [data, setData] = React.useState({});
  const [statusArray, setStatusArray] = React.useState([]);
  const [statusData, setStatusData] = React.useState({});
  const [stepCount, setStepCount] = React.useState(0);

  const labels = ["Placed", "Accepted", "Shipped", "Delivered"];

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colours.kapraMain,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colours.kapraMain,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: colours.kapraMain,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: colours.kapraMain,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: getFontontSize(15),
    currentStepIndicatorLabelFontSize: getFontontSize(15),
    stepIndicatorLabelCurrentColor: colours.kapraMain,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: colours.kapraMain
  }

  const { showLoader } = React.useContext(LoaderContext);



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
    const { dirs: {DownloadDir, DocumentDir} } = ReactNativeBlobUtil.fs; 
    const PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let image_URL = CONFIG.image_base_url + value;
    let ext = '.pdf';
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
    const fPath = aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2)+'.pdf';     
    const options = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
       notification: true,
      },
      android: {
        fileCache: true,
        path: PictureDir +'/Buyerskart' + '.pdf',
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title:'Invoice',
          description: 'PDF',

        },
      },
    });
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        Toast.show('Download Completed');
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.openDocument(res.data);  
        }
      });
    };

  const _fetchOrderList = async () => {
    try {
      showLoader(true);
      let res = await getSingleOrder(orderId);
      setData(res);
      setStatusArray([]);
      let res2 = await getSingleOrderStatus(orderId);
      //setStatusData(res2[0].Order);
      // if (res2[0] !== null) {
      //   res2.map((item, i) => (
      //     statusArray.push(item.status),
      //     item.status === "Order Placed" && stepCount <= 0 ?
      //       setStepCount(0) :
      //       item.status === "Order Accepted" && stepCount <= 1 ?
      //         setStepCount(1) :
      //         item.status === "Order Picked" && stepCount <= 2 ?
      //           setStepCount(2) :
      //           item.status === "Order Delivered" && stepCount <= 3 ?
      //             setStepCount(3) : null

      //   ))
      // }
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchOrderList();
  }, []);

  const _cancelOrder = async() => {
    try{
      showLoader(true);
      let res = await CancelOrder(orderId);
      showLoader(false);
      _fetchOrderList();

    } catch (err){
      showLoader(false);
    }
  }

  const razorPayUpdate = async() => {

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
      navigation.navigate('OrderUnsuccessScreen', {
        data:res
    });
    });
  }


  if (Object.keys(data).length === 0) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'Order Details'}
        backEnable
        WishList
        Cart
      />
      <View style={styles.topContainer}>
        <Text
          style={[styles.fontStyle1, { width: windowWidth * (75 / 100) }]}
          numberOfLines={1}>
          {'Order No'} :{' '}
          <Text style={{ color: colours.kapraMain }}>
            {data.OrderDetails.orderNumber}
          </Text>
        </Text>
      </View>
      <View style={styles.topContainer}>
        <Text
          style={[styles.fontStyle1, { width: windowWidth * (70 / 100) }]}
          numberOfLines={1}>
          Ordered on :{' '}
          <Text style={{ color: colours.kapraMain }}>
            {moment(data.OrderDetails.orderDate).format('DD-MM-YYYY')}
          </Text>
        </Text>
      </View>
      <View style={styles.topContainer}>
        <Text
          style={[styles.fontStyle1, { width: windowWidth * (75 / 100) }]}
          numberOfLines={1}>
          Status :{' '}
          <Text style={{ color: colours.kapraMain }}>
            {data.OrderDetails.status}
          </Text>
        </Text>
      </View>


      {/* <View style={{ width: windowWidth * (90 / 100) }}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={stepCount}
          stepCount={4}
          labels={labels}
        />
      </View> */}


      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchOrderList} />
        }
      >
        <View style={styles.addContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.fontStyle1, { width: windowWidth * (70 / 100), color: colours.kapraMain }]}>Delivery Address</Text>
          </View>
          <Text style={styles.fontStyle4}>{data.ShippingAddress.addLine1}, {data.ShippingAddress.addLine2}, {data.ShippingAddress.district}, {`${data.ShippingAddress.state}, ${data.ShippingAddress.country}`}, {data.ShippingAddress.pincode} ({data.ShippingAddress.landmark})</Text>
          <Text style={styles.fontStyle4}>+91 {data.ShippingAddress.phone}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: windowWidth, justifyContent: 'center' }}>
          <Text style={[styles.fontStyle3, { width: windowWidth * (50 / 100), paddingRight: 10, marginLeft: 0 }]} numberOfLines={2}>Having Trouble? Contact Us to get help.
          </Text>
          <AuthButton
            BackgroundColor={colours.kapraMain}
            OnPress={() => navigation.navigate('WriteToUsScreen')}
            ButtonText={"Contact Us"}
            ButtonWidth={30}
            ButtonHeight={5}
          />
        </View>
        <FlatList
          data={data.OrderItemsDetails}
          renderItem={({ item }, i) => (
            <OrdersCard
              qty={item.qty}
              Status={item.status}
              Product={item.prName}
              Date={data.OrderDetails.orderDate}
              OrderAmount={item.productPrice}
              ImageUri={getImage(item.imageUrl)}
              ProductDetails={item}
              Reviewstatus={item.Reviewstatus}
              Returnstatus={data.OrderDetails.status==="Order Delivered"}
              WriteReviewPress={
                () => {
                  if (profile.bkCustId) {
                    navigation.dispatch(
                      StackActions.replace('WriteReview', {
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
                async()=>{
                  try{
                    await ReturnRequest(data.OrderDetails.orderId,item.productId, parseInt(item.qty));
                    Toast.show("Return requested.");
                    _fetchOrderList();
                  }catch(error){
                    Toast.show(error);
                  }
                  
                }
              }
              OnPress={() =>
                navigation.navigate('SingleItemScreen', {
                  UrlKey: item.urlKey,
                })
              }
            />
          )}
          keyExtractor={(item, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            width: windowWidth,
            alignItems: 'center',
            paddingBottom: '5%',
          }}
        // ListFooterComponent={() => (

        // )}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>

          <View style={styles.bottomContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[styles.fontStyle2, { fontSize: getFontontSize(15) }]}>Subtotal : </Text>
              <PriceCard
                UnitPrice={data.OrderDetails.subTotal}
                FontSize={getFontontSize(15)}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[styles.fontStyle2, { fontSize: getFontontSize(15) }]}>Discount(-) : </Text>
              <PriceCard
                UnitPrice={data.OrderDetails.orderDiscount}
                FontSize={getFontontSize(15)}
              />
            </View>
            {
              data.OrderDetails.couponDiscount > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[styles.fontStyle2, { fontSize: getFontontSize(15) }]}>Coupon Discount(-) : </Text>
                  <PriceCard
                    UnitPrice={data.OrderDetails.couponDiscount}
                    FontSize={getFontontSize(15)}
                  />
                </View>
              )
            }
            {
              data.OrderDetails.bcoinsAppplied > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[styles.fontStyle2, { fontSize: getFontontSize(15) }]}>B-Coin Applied(-) : </Text>
                  <PriceCard
                    UnitPrice={data.OrderDetails.bcoinsAppplied}
                    FontSize={getFontontSize(15)}
                  />
                </View>
              )
            }
            {
              data.OrderDetails.orderDeliveryCharge > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[styles.fontStyle2, { fontSize: getFontontSize(15) }]}>Shipping(+) : </Text>
                  <PriceCard
                    UnitPrice={data.OrderDetails.orderDeliveryCharge}
                    FontSize={getFontontSize(15)}
                  />
                </View>
              )
            }

            <View style={{ flexDirection: 'row', alignItems: 'baseline', borderTopWidth: 1 }}>
              <Text style={styles.fontStyle2}>Order Total : </Text>
              <PriceCard
                UnitPrice={data.OrderDetails.orderAmount}
                FontSize={getFontontSize(20)}
                Color={colours.kapraMain}
              />
            </View>
          </View>
          {
            data.InvoiceDetails.invoiceUrl ?
              <AuthButton
                BackgroundColor={colours.primaryRed}
                OnPress={() => checkPermission(data.InvoiceDetails.invoiceUrl)}
                ButtonText={'Download Invoice'}
                ButtonWidth={90}
                Icon={'download'}
              />
              :
              null
          }



        </View>
      </ScrollView>

      {
          data.OrderDetails.status == 'Order Pending'&& data.OrderDetails.PayMethod.toUpperCase() == "ONLINE" &&(
            <AuthButton
                BackgroundColor={colours.lightPink}
                OnPress={()=>razorPayUpdate(orderId)}
                ButtonText={'Retry Payment'}
                ButtonWidth={90}
            />
          )
        }
      {
        data.OrderDetails.status === 'Order Placed'&&(
          <AuthButton
            BackgroundColor={colours.primaryRed}
            OnPress={() => _cancelOrder()}
            ButtonText={'Cancel Order'}
            ButtonWidth={90}
          />
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  addContainer: {
    width: windowWidth * (95 / 100),
    //height: windowHeight * (21 / 100),
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: '3%',
    marginHorizontal: windowWidth * (2.5 / 100),
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 2,
    borderRadius: 5,
    justifyContent: 'center',
    padding: 15
  },
  topContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
    color: colours.primaryOrange,
  },
  bottomContainer: {
    //flexDirection: 'row',
    width: windowWidth * (90 / 100),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: '5%',
    marginBottom: '20%',
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(20),
    color: colours.primaryOrange,
  },
  fontStyle4: {
    width: windowWidth * (90 / 100),
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.kapraMain,
  },
});
