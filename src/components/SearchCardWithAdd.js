import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Platform
} from 'react-native';
import showIcon from '../globals/icons';
import colours from '../globals/colours';
import { removeAllFromCart, addToCart, decreaseCartItemByURLKey } from '../api';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import PriceCard from '../components/PriceCard';
import WishIcon from './WishIcon';
import { AppContext } from '../Context/appContext';
import { getImage } from '../globals/functions';
import FastImage from 'react-native-fast-image'
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function SearchCardWithAdd({
  Name,
  UnitPrice,
  SpecialPrice,
  IsCarted,
  ImageUri,
  Rating,
  IsWishlisted,
  onCardPress,
  AddToCart,
  AddToWishlist,
  RemoveFromCart,
  RemoveFromWishlist,
  dealTo,
  urlKey,
  Variations,
  Quantity,
  Stock,
  ProductID,
  BTValue
}) {
  const [cart, setCart] = React.useState(IsCarted);
  const [wishlist, setWishlist] = React.useState(IsWishlisted);
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [stockData, setStockData] = React.useState(Stock);
  const [noDays, setNoDays] = React.useState(0);
  const [Date, SetDate] = React.useState({});
  const [Data, SetData] = React.useState({});
  const [selectedPickerValue, SetSelectedPickerValue] = React.useState(null);
  const [varientsData, setVarientsData] = React.useState( null);
  const [indicatorStatus, setIndicatorStatus] = React.useState(false);
  const [countPlusStatus, setCountPlusStatus] = React.useState(false);
  const [countSubStatus, setCountSubStatus] = React.useState(false);
  const { Language } = React.useContext(AppContext);
  const { loadCart, updateCart, wishListData, cartData } = React.useContext(AppContext);
  const [cartCount, setCartCount] = React.useState(Quantity);
  const Lang = Language;
  useEffect(() => {
    try {
      JSON.parse(Variations);
      setVarientsData(JSON.parse(Variations))
    } catch (e) {
      setVarientsData(null)
    }
    let date =
      moment()
        .utcOffset('+05:30')
        .format('YYYY-MM-DD hh:mm:ss');
    // let expirydate = '2020-11-14 20:28:45';
    let expirydate = moment(dealTo)
      .utcOffset('+05:30')
      .format();
    let showDate = moment(dealTo)
      .utcOffset('+05:30')
      .format('Do MMM');

    let diffr =
      moment
        .duration(moment(expirydate)
          .diff(moment(date)));
    var hours = parseInt(diffr.asHours());
    var minutes = parseInt(diffr.minutes());
    var seconds = parseInt(diffr.seconds());
    var d = hours * 60 * 60 + minutes * 60 + seconds;
    SetDate(showDate);
    setNoDays(hours);
    setTotalDuration(d);
    let obj = {
      productName: Name,
      productImage: ImageUri,
      productRating: Rating,
      productStock: Stock ? Stock : "In Stock",
      productSpecialPrice: SpecialPrice,
      productUnitPrice: UnitPrice,
      producturlKey: urlKey,
    };
    SetData(obj);
  }, [totalDuration]);


  const cartAdd = async () => {
    let count = cartCount;
    try {
      setIndicatorStatus(true);
      setCountPlusStatus(true);
      await addToCart(Data.producturlKey);
      setIndicatorStatus(false);
      setCart(true);
      setCartCount(count + 1);
      await updateCart(ProductID);
      await loadCart();
      setCountPlusStatus(false);
    } catch (error) {
      setIndicatorStatus(false);
      if (error.status == 401) {
        Alert.alert(
          "Cart",
          error.Message,
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                setIndicatorStatus(true);
                await removeAllFromCart();
                let response = await addToCart(Data.producturlKey);
                setCart(true);
                await updateCart();
                await loadCart();
                setIndicatorStatus(false);
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
  }

  const cartCountChange = async (value) => {
    if (value === "+") {
      cartAdd();
    }
    else {
      let count = cartCount;
      if (count > 1) {
        try {
          setCountSubStatus(true);
          setIndicatorStatus(true);
          await decreaseCartItemByURLKey(Data.producturlKey);
          setIndicatorStatus(false);
          setCart(true);
          setCartCount(count - 1);
          await updateCart();
          await loadCart();
          setCountSubStatus(false);
        } catch (error) {
          setIndicatorStatus(false);
        }
      }
      else if (count === 1) {
        try {
          setIndicatorStatus(true);
          await RemoveFromCart();
          setCart(false);
          setCartCount(0);
          await updateCart();
          await loadCart();
          setIndicatorStatus(false);
        } catch (error) {
          setIndicatorStatus(false);
        }
      }

    }
  }
  const productDataChange = (item) => {

    setStockData(item.prStock ? item.prStock : "In Stock");
    let obj = {
      productName: item.prName,
      productImage: getImage(item.prFeaturedImage),
      productRating: item.prRating,
      productStock: item.prStock ? item.prStock : "In Stock",
      productSpecialPrice: item.prSpecialPrice,
      productUnitPrice: item.prPrice,
      producturlKey: item.prUrlkey,
    };
    SetData(obj);
  }

  const pickerChange = (value) => {
    SetSelectedPickerValue(value);
    varientsData[0].AttrValues.map((item, i) => (
      item.AttrValueid === value ?
        productDataChange(item)
        :
        null
    ))
  }

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onCardPress} >
      {
        stockData.toLowerCase() === "in stock" ?
          <FastImage
            style={styles.imageContainer}
            source={{
              uri: Data.productImage,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          :
          <ImageBackground
            style={styles.imageContainer}
            resizeMode='contain'
            source={{
              uri: Data.productImage,
            }}>
            <View style={styles.outofstockContainer}>
              <Text style={styles.outofstockFont}>OUT OF STOCK</Text>
            </View>
          </ImageBackground>
      }

      <View style={styles.detailsContainer}>
        <View style={styles.rowStyle}>
          <Text
            style={[styles.fontStyle1, { width: windowWidth * (50 / 100), lineHeight: windowWidth * (5 / 100) }]}
            numberOfLines={2}>
            {Data.productName}
          </Text>
          <View style={[styles.ratingContainer, { backgroundColor: null }]}>
            <WishIcon
              ProductID={ProductID}
              urlKey={urlKey}
            />
          </View>
        </View>
        <View style={{
            width: windowWidth*(45/100),
        }}>
            {
                BTValue && BTValue>0 ?
                    (<Text style={styles.fontStyle4}>Redeem upto <Text style={[styles.fontStyle4,{fontFamily: 'Montserrat-Bold'}]}>{BTValue}</Text> B-Token</Text>)
                    :
                    null
            }  
        </View>
        <View style={[styles.rowStyle, { width: windowWidth * (53 / 100), justifyContent: 'flex-start' }]}>
          <PriceCard
            SpecialPrice={parseFloat(Data.productSpecialPrice)}
            UnitPrice={parseFloat(Data.productUnitPrice)}
            FontSize={windowWidth * (3.5 / 100)}
          />
          {Data.productSpecialPrice && Data.productSpecialPrice !== Data.productUnitPrice ? (
            <View>
              <Text style={styles.offerText}> (
                {" " + (100 - (Data.productSpecialPrice * 100) / Data.productUnitPrice).toFixed(0)} % OFF )
              </Text>
            </View>
          )
            :
            null
          }
        </View>
        {Rating > 0 && (
          <View style={[styles.ratingContainer, { backgroundColor: Rating === 0 ? colours.primaryGrey : Rating <= 3 ? colours.primaryOrange : colours.primaryRed }]}>
            <Text style={{ marginLeft: '5%', marginTop: Platform.OS === 'ios' ? 5 : 0 }}>
              {showIcon('star', colours.primaryWhite, windowWidth * (3.2 / 100))}
            </Text>
            {
              Rating > 0 ?
                <Text style={[styles.offerText, { color: colours.primaryWhite }]}> {Rating.toFixed(1)}</Text>
                :
                null
            }

          </View>
        )}
        {/* <TouchableOpacity style={[styles.rowStyle, { height: windowWidth * (8 / 100) }]}> */}
          {/* {
            stockData.toLowerCase() === "in stock" ?
              cartData["p" + ProductID] == null || cartData["p" + ProductID] === 0 ?
                indicatorStatus || countPlusStatus ?
                  <View style={{ alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, padding: 2, width: windowWidth * (15 / 100) }}>
                    <ActivityIndicator size={20} color={colours.primaryGreen} />
                  </View>
                  :
                  <TouchableOpacity
                    style={{
                      backgroundColor: colours.primaryColor,
                      paddingHorizontal: 20,
                      paddingVertical: 3,
                      borderRadius: 5,
                      //width: windowWidth * (20 / 100),
                      alignItems: 'center'
                    }
                    }
                    onPress={() => cartAdd()}
                  >
                    <Text
                      style={{
                        fontFamily: 'Proxima Nova Alt Semibold',
                        color: colours.primaryWhite,
                        fontSize: windowWidth * (3.5 / 100),
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                :
                indicatorStatus ?
                  <View style={{ alignItems: 'center', backgroundColor: colours.lightWhite, borderRadius: 5, padding: 2, width: windowWidth * (15 / 100) }}>
                    <ActivityIndicator size={20} color={colours.primaryGreen} />
                  </View>
                  :
                  cartCount > 0 ?
                    <TouchableOpacity style={styles.cartCountContainer}>
                      <TouchableOpacity style={styles.qtyContainer}
                        onPress={() => cartCountChange("-")}>
                        {
                          cartCount != 1 ?
                            <Text>{showIcon('mathminus', colours.primaryWhite, windowWidth * (3 / 100),)}</Text>
                            :
                            <Text>{showIcon('bin1', colours.primaryWhite, windowWidth * (3.25 / 100),)}</Text>
                        }

                      </TouchableOpacity>

                      <Text style={[styles.fontStyle5, { fontSize: windowWidth * (4 / 100), marginLeft: 5, marginRight: 5, color: colours.primaryGreen }]}>
                        {countPlusStatus ? cartData["p" + ProductID] + 1 : countSubStatus ? cartData["p" + ProductID] - 1 : cartData["p" + ProductID]}
                      </Text>
                      <TouchableOpacity style={styles.qtyContainer}
                        onPress={() => cartCountChange("+")}>
                        <Text>{showIcon('mathplus', colours.primaryWhite, windowWidth * (3 / 100),)}</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                    :
                    <>
                    </>
              :
              <View style={{ alignItems: 'center', backgroundColor: colours.lightWhite, borderRadius: 5, padding: 2, width: windowWidth * (15 / 100) }}
              />
          } */}




          {
            dealTo && totalDuration > 0 ?

              <TouchableOpacity style={[styles.rowStyle, { height: windowWidth * (8 / 100) }]}>
                <View style={{ height: windowWidth * (5 / 100), flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', paddingBottom: 3 }}>
                  {
                    noDays > 24 ?
                      <>
                        <Text style={styles.textStyle2}>Ends on: </Text>
                        <Text style={styles.textStyle3}>{Date}</Text>
                      </>

                      :
                      <>
                        <Text style={styles.textStyle2}>Ends in: </Text>
                        <CountDown
                          until={totalDuration}
                          size={windowWidth * (3.5 / 100)}
                          //onFinish={() => alert('Finished')}
                          digitStyle={{ width: windowWidth * (5.5 / 100), }}
                          digitTxtStyle={{ color: colours.primaryRed }}
                          timeToShow={['H', 'M', 'S']}
                          separatorStyle={{ color: colours.primaryRed, width: 2 }}
                          timeLabels={{ m: null, s: null }}
                          showSeparator
                        />
                      </>
                  }
                </View>
              </TouchableOpacity>
              :
              null
          }

        {/* </TouchableOpacity> */}
      </View>
    </TouchableOpacity >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (90 / 100),
    //height: windowHeight * (16 / 100),
    padding:5,
    backgroundColor: colours.lowWhite,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  imageContainer: {
    width: windowWidth * (25 / 100),
    height: windowWidth * (25 / 100),
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 5,
  },
  outofstockContainer: {
    width: windowWidth * (25 / 100),
    borderRadius: 5,
  },
  detailsContainer: {
    width: windowWidth * (63 / 100),
    justifyContent: 'space-between',
    marginLeft: windowWidth * (2 / 100),
    paddingTop: windowHeight * (1 / 100),
  },
  qtyContainer: {
    width: windowWidth * (6 / 100),
    height: windowWidth * (6 / 100),
    borderRadius: windowWidth * (3 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.primaryGreen,
    paddingTop: Platform.OS === 'ios' ? 5 : null,
  },
  cartCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.lightWhite,
    borderRadius: 5,
    padding: 5,
    width: windowWidth * (22 / 100),
  },
  rowStyle: {
    flexDirection: 'row',
    width: windowWidth * (63 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: windowWidth * (4 / 100),
    fontWeight: 'bold'
  },
  fontStyle5: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: windowWidth * (5 / 100),
    color: colours.kapraMain,
  },
  outofstockFont: {
    backgroundColor: colours.lightOrange,
    textAlign: 'center',
    color: colours.primaryWhite,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: windowWidth * (3 / 100),
  },
  offerContainer: {
    position: 'absolute',
    right: -32,
    backgroundColor: colours.primaryRed,
    paddingVertical: 1,
    paddingHorizontal: 6,
    marginLeft: 10,
    borderRadius: 5
  },
  offerText: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: windowWidth * (3 / 100),
    color: colours.primaryOrange,
  },
  ratingContainer: {
    backgroundColor: colours.primaryRed,
    flexDirection: 'row',
    width: windowWidth * (12 / 100),
    height: windowWidth * (5 / 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 4,
    marginTop: 2
  },
  textStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    //width: windowWidth * (8 / 100),
    fontSize: windowWidth * (3.5 / 100),
    color: colours.primaryRed,
  },
  textStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    //width: windowWidth * (18 / 100),
    fontSize: windowWidth * (3.5 / 100),
    color: colours.primaryRed,
  },
  fontStyle4: {
      fontFamily:'Proxima Nova Alt Semibold',
      fontSize: getFontontSize(12),
      color: colours.primaryWhite,
      backgroundColor: colours.kapraMain,
      borderRadius:5,
      textAlign:'center'
  },
});
