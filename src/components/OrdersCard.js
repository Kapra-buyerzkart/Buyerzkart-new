import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';
import colours from '../globals/colours';
import moment from 'moment';
import { getImage, getFontontSize } from '../globals/functions';
import PriceCard from '../components/PriceCard';
import { getOrderList, getSingleOrderStatus } from '../api';
import { AppContext } from '../Context/appContext';
import { I18nManager } from "react-native";
import StepIndicator from 'react-native-step-indicator';
import showIcon from '../globals/icons';
import FastImage from 'react-native-fast-image'
import AuthButton from './AuthButton';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function OrdersCard({ navigation,
  OrderNo,
  Status,
  Product,
  Date,
  ProductCount,
  OrderAmount,
  Status1,
  ImageUri,
  OnPress,
  qty,
  fromOrder,
  orderId,
  trackShippment,
  ProductDetails,
  WriteReviewPress,
  Reviewstatus,
  Returnstatus,
  IsCanCancelOrder,
  RequestReturn,
  CancelOrder
}) {
  const [stepCount, setStepCount] = React.useState(0);
  const [statusArray, setStatusArray] = React.useState([]);
  const [statusData, setStatusData] = React.useState({});
  const [modalVisibleStatus, setModalVisibleStatus] = React.useState(false);
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
  const trackOrder = async (orderId) => {
    let res2 = await getSingleOrderStatus(orderId);
    setStatusData(res2[0]);
    if (res2[0] !== null) {
      res2.map((item, i) => (
        statusArray.push(item.status),
        item.status === "Order Placed" && stepCount <= 0 ?
          setStepCount(0) :
          item.status === "Order Accepted" && stepCount <= 1 ?
            setStepCount(1) :
            item.status === "Order Picked" && stepCount <= 2 ?
              setStepCount(2) :
              item.status === "Order Delivered" && stepCount <= 3 ?
                setStepCount(3) : null

      ))
    }
    setModalVisibleStatus(true)

  }
  return (
    <View>
      <TouchableOpacity onPress={OnPress} style={styles.mainContainer}>
        <View style={styles.detailsContainer}>
          {OrderNo ? (
            <Text>
              <Text style={{ fontFamily: 'Proxima Nova Alt Semibold', fontSize: getFontontSize(17), color: colours.primaryBlack }}>
                #{' '}
              </Text>
              <Text style={styles.fontStyle1} numberOfLines={1}>
                {OrderNo}
              </Text>
            </Text>
          ) : null}
          <View >
            {Status && fromOrder ? (
              <Text
                style={[
                  styles.fontStyle2,
                  Status === 'Order Cancelled'
                    ? { color: colours.primaryRed }
                    : { color: colours.primaryGreen },
                ]}
                numberOfLines={2}>
                {Status.toUpperCase()}
              </Text>
            ) : (
              null
            )}

          </View>

          <Text style={styles.fontStyle3} numberOfLines={2}>
            {Product}
          </Text>
          {
            fromOrder && (
              <Text style={styles.fontStyle4} numberOfLines={1}>
                {'Date :'} {moment(Date).format('DD-MM-YYYY')}
              </Text>
            )
          }

          {ProductCount > 1 && (
            <Text style={styles.fontStyle5} numberOfLines={1}>
              (+{ProductCount - 1} More Items )
            </Text>
          )}
          {qty > 0 && (
            <Text style={styles.fontStyle5} numberOfLines={1}>
              Quantity {qty}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              width: windowWidth * (50 / 100),
              justifyContent: 'space-between',
              //paddingTop: '3%',
            }}>
            {OrderAmount ? (
              <PriceCard
                UnitPrice={OrderAmount}
                FontSize={14}
                Color={colours.kapraMain}
              />
              //<Text style={styles.fontStyle6}>INR {OrderAmount}</Text>
            ) : (
              <Text></Text>
            )}

            {Status1 ? (
              <Text style={styles.fontStyle7}>Invoice</Text>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.imageStyle}
            source={{
              uri: ImageUri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          {
            Status === 'Order Delivered' && !fromOrder && Reviewstatus != 0 ?
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={WriteReviewPress}
                ButtonText={"Write A Review"}
                ButtonWidth={30}
                FSize={getFontontSize(12)}
                ButtonHeight={3.5}
              />
              :
              null
          }
          {
            IsCanCancelOrder &&fromOrder && Status !== 'Order Cancelled'?
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={CancelOrder}
                ButtonText={"Cancel Order"}
                ButtonWidth={30}
                FSize={getFontontSize(12)}
                ButtonHeight={3.5}
              />
              :null
          }
          {
            Returnstatus !=0 && !fromOrder ?
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={RequestReturn}
                ButtonText={"Request Return"}
                ButtonWidth={30}
                FSize={getFontontSize(12)}
                ButtonHeight={3.5}
              />
              :
              null
          }
        </View>
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={modalVisibleStatus} >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', height: windowHeight }}>
          <View style={styles.modalStyle}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.imageContainer}>
                <FastImage
                  style={styles.imageStyle}
                  source={{
                    uri: ImageUri,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View style={[styles.detailsContainer, { width: windowWidth * (45 / 100), justifyContent: 'center' }]}>
                <Text style={[styles.fontStyle3, { width: windowWidth * (45 / 100) }]} numberOfLines={2}>
                  {Product}
                </Text>
                {OrderAmount ? (
                  <PriceCard
                    UnitPrice={OrderAmount}
                    FontSize={14}
                    Color={colours.kapraMain}
                  />
                  //<Text style={styles.fontStyle6}>INR {OrderAmount}</Text>
                ) : (
                  <Text></Text>
                )}
              </View>
              <View style={{ width: windowWidth * (10 / 100), alignItems: 'flex-end', height: windowHeight * (6 / 100) }}>
                <TouchableOpacity onPress={() => setModalVisibleStatus(false)}>
                  <Text>{showIcon('close', colours.kapraMain, windowWidth * (6 / 100))}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ width: windowWidth * (90 / 100) }}>
              <StepIndicator
                customStyles={customStyles}
                currentPosition={stepCount}
                stepCount={4}
                labels={labels}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (95 / 100),
    //height: windowHeight * (21 / 100),
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: '3%',

    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6.68,

    elevation: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingVertical: 5
  },
  imageContainer: {
    width: windowWidth * (35 / 100),
    height: windowWidth * (40 / 100),
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    width: windowWidth * (56 / 100),
    height: windowHeight * (20 / 100),
    justifyContent: 'space-around',
  },
  fontStyle1: {
    color: colours.kapraMain,
    fontSize: getFontontSize(16),
    width: windowWidth * (50 / 100),
    fontFamily: 'Proxima Nova Alt Bold',
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
    width: windowWidth * (50 / 100),
    color: colours.primaryBlack
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(18),
    width: windowWidth * (60 / 100),
    paddingTop: '2%',
    color: colours.primaryBlack,
    paddingLeft: I18nManager.isRTL ? 15 : 0,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    width: windowWidth * (50 / 100),
  },
  fontStyle5: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12),
    width: windowWidth * (50 / 100),
    color: colours.primaryBlack
  },
  fontStyle6: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
  },
  fontStyle7: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize:getFontontSize(12),
    color: colours.kapraMain,
  },
  imageStyle: {
    width: windowWidth * (30 / 100),
    height: windowWidth * (30 / 100),
    borderRadius: 5,
    resizeMode: 'contain',
  },
  modalStyle: {
    height: windowHeight * (27 / 100),
    width: windowWidth,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: windowHeight * (37 / 100),
    borderWidth: 15,
    borderRightColor: colours.kapraMain,
    borderLeftColor: colours.kapraMain,
    borderTopColor: colours.primaryWhite,
    borderBottomColor: colours.primaryWhite,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
  }
});
