import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  ImageBackground,
  Image
} from 'react-native';

import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Header from '../components/Header';
import CartCard from '../components/CartCard';
import { getImage, getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {
  getCartList,
  removeFromCart,
  increaseCartItem,
  decreaseCartItem,
  applyCoupon,
  RemoveCartItemByUrlkey,
  removeCoupon,
  moveToWishlistFromCart,
  removeBuyNow,
  getGiftCards,
  postApplyGiftCard,
  getCartSummary,
  applyBCoin,
  removeBCoin
} from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import PincodeChange from '../components/PincodeChange';
import PriceCard from '../components/PriceCard';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CartScreen({ navigation, route }) {

  let buyNow = route?.params?.buyNow ? true : false;
  const isFocused = useIsFocused();
  const [data, setData] = React.useState(null);
  const [buttonStatus, SetButtonStatus] = React.useState(true);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { profile, cartData, updateWishCount, loadCart, updateCart } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [coupon, setCoupon] = React.useState('');
  const [ cartSummary, setCartSummary ] = React.useState(null);
  const [ summaryLoading, setSummaryLoading ] = React.useState(false)


  const [ giftCardData, setGiftCardData ] = React.useState(null)
  const [ giftCardModal, setGiftCardModal ] = React.useState(false);
  const [ appliedGiftCards, setAppliedGiftCards ] = React.useState('')
  const [ appliedGiftCardsSum, setAppliedGiftCardsSum ] = React.useState(0)

  
  const _fetchCartlistData = async () => {
    try {
      showLoader(true);
      //await loadCart();
      SetButtonStatus(true);
      setSummaryLoading(true)
      let resCS = await getCartSummary()
      setCartSummary(resCS)
      setSummaryLoading(false)
      buyNow ? null : profile.bkCustId ? await removeBuyNow() : null;
      let res = await getCartList();
      setData(res.cartList);
      if (res.cartList.length > 0) {
        setAppliedGiftCards(res?.cartList[0]?.giftCardsApplied?res?.cartList[0]?.giftCardsApplied:'')
        setAppliedGiftCardsSum(res.cartList[0].giftCarDamount)
      }

      if (res.cartList.length > 0) {
        let a = {};
        res.cartList.map((item, i) => {
          let key1 = "p" + item.productId;
          let qty = item.qty;
          a[key1] = qty;
        });
        await AsyncStorage.setItem('loacalCart', JSON.stringify(a));
      }

      if (res.cartList.length > 0) {
        res.cartList.map((item, i) => {
          if (item.IsAvailPincode) {
            if (item.backOrders) {
              if (item.qoh < item.qty) {
                SetButtonStatus(false);
              }
            }
            else {
              if (item.qoh < item.qty) {
                SetButtonStatus(false);
              }
            }
          }
          else {
            SetButtonStatus(false);
          }
        });
      }
      if(profile.bkCustId){
        let res7 = await getGiftCards();
        setGiftCardData(res7);
      }
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  // React.useEffect(() => {
  //   _fetchCartlistData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      _fetchCartlistData();
    }, []),
  );
  const backAction = async () => {
    buyNow ? null : profile.bkCustId ?
      await removeBuyNow() : null
      await updateCart();
      await loadCart();
      return true;
  };

  React.useEffect(() => {
    return () => backAction();
  }, []);

  // React.useEffect(() => {
  //   if (isFocused) _fetchCartlistData(true);
  // }, [isFocused]);

  const _applyCoupon = () => {
    if (coupon === '') {
      Toast.show('Coupon Field Empty');
    } else {
      _ApplyCoupon();
    }
  };

  const moveToWishList = (id) => {
    Alert.alert(
      "Alert",
      "Are you sure want to move this item to wishlist",
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            showLoader(true);
            await moveToWishlistFromCart(id);
            await updateWishCount();
            showLoader(false);
            await _fetchCartlistData();
            Toast.show('Added To Cart');
          },
        },
      ],
      { cancelable: false },
    );
  }


  const applyBCoinFun = async(value) => {
    try {
      showLoader(true);
      let res = await applyBCoin(value);
      Toast.show('B-Coin Applied');
      _fetchCartlistData();
      setDummy(!dummy);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err.Message?err.Message:"Something wrong!");
    }
  }

  const removeBCoinFun = async() => {
    try {
      showLoader(true);
      let res = await removeBCoin();
      Toast.show('B-Coin Removed');
      _fetchCartlistData();
      setDummy(!dummy);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err.Message?err.Message:"Something wrong!");
    }
  }
  
  const updateGiftCard = async(value) => {
    if(appliedGiftCards.includes(value.id)){
      let data = appliedGiftCards.split(`${value.id},`).join("").split(`${value.id}`).join("");
      setAppliedGiftCards(data);
      setAppliedGiftCardsSum(appliedGiftCardsSum-value.gAmount)
      setDummy(!dummy)
    } else{
      if( data && cartSummary.grandTotal >= appliedGiftCardsSum ){
        if(appliedGiftCardsSum == 0 || cartSummary.grandTotal>=value.gAmount){
          let data = `${value.id},` + appliedGiftCards;
          setAppliedGiftCards(data);
          setAppliedGiftCardsSum(appliedGiftCardsSum+value.gAmount)
          setDummy(!dummy)
        } else{
          Toast.show("The total Smart Point discount exceeds the order total.");
        }
      } else{
        Toast.show("The total Smart Point discount exceeds the order total.");
      }
    } 
  }

  const applyGiftCards = async() => {
    showLoader(true);
    try {
      let res = await postApplyGiftCard(appliedGiftCards);
      _fetchCartlistData();
      setDummy(!dummy);
      setGiftCardModal(false)
      showLoader(false);
    } catch (err) {
      showLoader(false);
      setGiftCardModal(false)
      Toast.show(err.Message?err.Message:"Something wrong!");
    }
  }


  const _ApplyCoupon = async () => {
    try {
      let res = await applyCoupon(coupon);
      Toast.show('Coupon Added');
      setCoupon('');
      _fetchCartlistData();
    } catch (err) {
      Toast.show(err);
    }
  };
  const _RemoveCoupon = async () => {
    try {
      let res = await removeCoupon();
      Toast.show("Coupon Removed");
      setCoupon('');
      _fetchCartlistData();
    } catch (err) {
      Toast.show(err);
    }
  };

  const _handleCoupon = (text) => {
    setCoupon(text);
  };

  if (data === null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ alignItems: 'center' }}
      >
        <Header navigation={navigation} HeaderText={'Cart'} backEnable Search WishList />

        <LinearGradient
          colors={[ colours.primaryWhite, colours.kapraLow]}
          style={{ width: windowWidth,}}
        >
          <View style={styles.deliveryTime}>
            <Text style={{ paddingRight: 10 }}>{showIcon('deliveryTruck', colours.reviewBoxRed, windowWidth * (10 / 100))}</Text>
            <Text style={[styles.fontStyle7]}>Delivery Within: 1-10 Days</Text>
          </View>
        </LinearGradient>

        {
            data[0]?.deliveryAmount == 0 && (
              <View style={[styles.closeMsgCon,{backgroundColor: colours.lowWhite}]}>
                <LottieView 
                    source={require('../assets/Lottie/popper.json')} 
                    style={{
                        height: windowHeight * (6 / 100),
                        width: windowHeight * (6 / 100),
                    }} 
                    autoPlay
                    loop
                />
                <Text style={[styles.cartHeader,{fontSize: getFontontSize(13)}]}  numberOfLines={2}>Yay! You get FREE delivery with this order.</Text>
              </View>
            )
          }
        {data.length === 0 && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={_fetchCartlistData}
                />
              }
            >
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
                <Text style={styles.fontStyle3}>{'Cart Empty'}</Text>
                <Text style={[styles.fontStyle4, { width: '90%' }]}>
                  No items in your cart
                </Text>
                <AuthButton
                  BackgroundColor={colours.kapraMain}
                  OnPress={() => navigation.navigate('SearchScreen')}
                  ButtonText={'Browse'}
                  ButtonWidth={90}
                />
              </View>
            </ScrollView>
          </>
        )}
        {data.length !== 0 && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={_fetchCartlistData}
                />
              }
              style={{ height: windowWidth * (150 / 100), marginTop: 10 }}
            >
              {data.map((item, i) => (
                <CartCard
                  key={i}
                  onCardPress={() =>
                    navigation.navigate('SingleItemScreen', { UrlKey: item.urlKey })
                  }
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
                          onPress: async () => {
                            await RemoveCartItemByUrlkey(item.urlKey);
                            await _fetchCartlistData();
                            await updateCart();
                            await loadCart();;
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }}
                  CartIncrease={async () => {
                    await increaseCartItem(item.cartItemsId);
                    await _fetchCartlistData();
                    await updateCart();
                    await loadCart();
                  }}
                  CartDecrease={async () => {
                    await decreaseCartItem(item.cartItemsId);
                    await _fetchCartlistData();
                    await updateCart();
                    await loadCart();
                  }}
                />
              ))}

              <View style={styles.coupon}>
                <TextInput
                  style={styles.textField}
                  onChangeText={_handleCoupon}
                  value={coupon}
                  placeholder={cartSummary.cpcode?cartSummary.cpcode:'Coupon Code'}
                />
                {/* <TouchableOpacity onPress={()=>navigation.navigate('CouponsScreen')} style={styles.viewCoupon}>
                  <Text  style={styles.fontStyle6}>View</Text>
                  <View>{showIcon('eye', colours.primaryWhite, windowWidth*(5/100))}</View>
                </TouchableOpacity> */}
                {cartSummary.couponAmount == 0 ?
                  <TouchableOpacity style={styles.apply} onPress={_applyCoupon}>
                    <Text style={styles.fontStyle6}>Apply</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.remove} onPress={_RemoveCoupon}>
                    <Text style={styles.fontStyle6}>Remove</Text>
                  </TouchableOpacity>
                }
              </View>

            {
              profile.bkCustId && (
                cartSummary&&cartSummary?.bcoinsAppplied > 0 ?
                <View style={styles.couponContainer}>
  
                  <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                    <Image 
                    source={require('../assets/images/Token.png')}
                      style={{
                        width:windowWidth * (5 / 100),
                        height:windowWidth * (5 / 100)
                      }}
                    />
                    <Text style={styles.headerText}>  B-Coins Applied</Text>
                  </View>
                  <TouchableOpacity onPress={()=> removeBCoinFun()} style={{padding:5, backgroundColor:colours.kmPink, borderRadius:5, marginLeft:10}}>
                    <Text style={[styles.headerText,{ color: colours.primaryPink}]}>Remove</Text>
                  </TouchableOpacity>
                </View>
                :
                <View style={styles.couponContainer} >
                  <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                    <Image 
                    source={require('../assets/images/Token.png')}
                      style={{
                        width:windowWidth * (5 / 100),
                        height:windowWidth * (5 / 100)
                      }}
                    />
                    <Text style={styles.headerText}>  B-Coin : {cartSummary?.availableBCoins}</Text>
                  </View>
                  {
                    cartSummary?.availableBCoins>0&&(
                      <TouchableOpacity onPress={()=> applyBCoinFun(cartSummary?.availableBCoins)} style={{padding:5, backgroundColor:colours.kmPink, borderRadius:5, marginLeft:10}}>
                        <Text style={[styles.headerText,{ color: colours.primaryPink}]}>Apply</Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )
            } 
              {
              profile.bkCustId && 
              ( cartSummary.giftCarDamount ?
                <TouchableOpacity style={styles.couponContainer}>
                  <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                    <Text>{showIcon('gift', colours.primaryPink, windowWidth * (5 / 100))}</Text>
                    <Text style={styles.headerText}>  Smart Point</Text>
                  </View>
                  <TouchableOpacity onPress={()=>setGiftCardModal(true)} style={{padding:5, backgroundColor:colours.kmPink, borderRadius:5, marginLeft:10}}>
                    <Text style={[styles.headerText,{ color: colours.primaryPink}]}>Update</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.couponContainer} onPress={()=> setGiftCardModal(true)}>
                  <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                    <Text>{showIcon('gift', colours.primaryPink, windowWidth * (5 / 100))}</Text>
                    <Text style={styles.headerText}>  Smart Point</Text>
                  </View>
                  
                  <Text>
                    {showIcon('rightarrow', colours.primaryPink, windowWidth * (5 / 100))}
                  </Text>
                </TouchableOpacity>)
              }

              <View style={styles.Pricing}>
                <View style={{ paddingRight: 10, width: windowWidth * (90 / 100), }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={styles.fontStyle1}>Subtotal:</Text>
                    <PriceCard
                      UnitPrice={cartSummary.subTotal}
                      FontSize={getFontontSize(14)}
                      Color={colours.kapraMain}
                    />
                  </View>
                  {cartSummary.discountAmount > 0 && (
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={styles.fontStyle1}>Discount:</Text>
                        <PriceCard
                          UnitPrice={cartSummary.discountAmount}
                          FontSize={getFontontSize(14)}
                          Color={colours.kapraMain}
                        />
                      </View>
                    </View>
                  )}
                  {cartSummary.couponAmount > 0 && (
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[styles.fontStyle1, { width: windowWidth * (65 / 100) }]}>Coupon Discount ( {cartSummary.cpName} )</Text>
                        <PriceCard
                          UnitPrice={cartSummary.couponAmount}
                          FontSize={getFontontSize(14)}
                          Color={colours.kapraMain}
                        />
                      </View>
                    </View>
                  )}
                  {cartSummary.giftCarDamount > 0 && (
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[styles.fontStyle1, { width: windowWidth * (65 / 100) }]}>Giftcard Applied</Text>
                        <PriceCard
                          UnitPrice={cartSummary.giftCarDamount}
                          FontSize={getFontontSize(14)}
                          Color={colours.kapraMain}
                        />
                      </View>
                    </View>
                  )}
                  {cartSummary.bcoinsAppplied > 0 && (
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[styles.fontStyle1, { width: windowWidth * (65 / 100) }]}>B-Coin Applied</Text>
                        <PriceCard
                          UnitPrice={cartSummary.bcoinsAppplied}
                          FontSize={getFontontSize(14)}
                          Color={colours.kapraMain}
                        />
                      </View>
                    </View>
                  )}
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                      <Text style={styles.fontStyle1}>Shipping:</Text>
                      {cartSummary.deliveryCharge > 0 ?
                        <PriceCard
                          UnitPrice={cartSummary.deliveryCharge}
                          FontSize={getFontontSize(14)}
                          Color={colours.kapraMain}
                        />
                        :
                        <Text style={[styles.fontStyle1, { color: colours.primaryGreen }]}>FREE</Text>
                      }
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.Pricing, { justifyContent: 'space-between' }]}>
                <Text style={styles.fontStyle2}>Total</Text>
                <PriceCard
                  UnitPrice={cartSummary.grandTotal}
                  FontSize={getFontontSize(16)}
                  Color={colours.kapraMain}
                />
              </View>
              <View style={[styles.Pricing, { justifyContent: 'space-between' }]}>
                <Text style={styles.fontStyle2}>Total B-Tokens :</Text>
                <Text style={styles.fontStyle2}>{cartSummary.totalBTokenValue}</Text>
              </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
              {
                buttonStatus ?
                  <AuthButton
                    BackgroundColor={colours.kapraMain}
                    OnPress={() => {

                      if (profile.bkCustId) {
                        summaryLoading?
                        null
                        :
                        navigation.navigate('Payment', { subTotal: cartSummary.grandTotal })
                      } else {
                        navigation.navigate('Login', { fromCart: true });
                      }
                    }}
                    ButtonText={profile.bkCustId ? summaryLoading? 'Loading..' : 'Proceed to Checkout' : 'Login'}
                    ButtonWidth={91}
                  />
                  :
                  null
              }

            </View>
          </>
        )}





          <View style={styles.centeredView}>
            <Modal 
                animationType="slide" 
                transparent={true} 
                visible={giftCardModal}
                onRequestClose={() => setGiftCardModal(false) }
                animationInTiming={2000}
                animationOutTiming={2000}
            >
              <Pressable style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(16, 22, 145,0.2)'}} onPress={() => setGiftCardModal(false)}>
                <Pressable style={[styles.commonModalStyle,{height: windowHeight*(65/100), marginTop: windowHeight*(35/100),paddingBottom: windowHeight*(2/100) }]}>
                  <View style={{width: windowWidth, height: windowHeight*(7/100), backgroundColor: colours.lightRed, borderTopLeftRadius: 20, borderTopRightRadius:20,paddingHorizontal: windowWidth*(3/100), alignItems:'center', flexDirection:'row', justifyContent:'space-between'  }}>
                    <Text style={[styles.cartHeader,{color: colours.primaryWhite}]} >
                      Available Smart Point
                    </Text>
                    <TouchableOpacity onPress={() => setGiftCardModal(false) }>
                      <Text>
                        {showIcon('close', colours.primaryWhite, windowWidth * (6 / 100))}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {
                      !profile.groceryCustId?
                      <View style={{alignItems:'center'}}>
                        <Text style={[styles.cartHeader,{color:colours.primaryBlack,fontSize: getFontontSize(23), paddingVertical:10}]}>
                        You don't have access.
                        </Text>
                        <Text style={[styles.cartHeader,{color:colours.primaryGrey,fontSize: getFontontSize(13), marginBottom:20}]}>
                        Log in or sign up to proceed
                        </Text>
                        <TouchableOpacity style={{borderWidth:2, borderRadius:5, borderColor: colours.kmPink}} onPress={()=>{setGiftCardModal(false),navigation.navigate('LoginOTPScreen')}}>
                          <Text style={[styles.cartHeader,{color:colours.kmPink,fontSize: getFontontSize(23), paddingHorizontal:20, paddingVertical:10}]}>
                          Continue
                          </Text>
                        </TouchableOpacity>
                      </View>
                      :
                      
                      giftCardData?(
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
                            renderItem={({ item}, i) => (
                              <Pressable style={styles.giftMainContainer} onPress={()=>updateGiftCard(item)}>
                                <ImageBackground 
                                    source={require('../assets/images/Giftcard1.jpg')}  
                                    style={styles.imgCon} 
                                    imageStyle={[styles.imgCon,{borderColor: colours.primaryPink, borderWidth:appliedGiftCards.includes(item.id)?2:0}]} 
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
                                            <Text style={[styles.giftFontStyle1,{color: colours.lightPink}]}>{moment(item.expieryDate).format("DD")}</Text>
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
                        alignItems:'center'
                      }}>
                        <View style={{ height: windowHeight * (20 / 100) }}>
                          <Text>{showIcon('bin1', colours.primaryRed, 130)}</Text>
                        </View>
                        <Text style={styles.cartHeader}>You don't have any Smartpoints to redeem</Text>
                      </View>

                  }
                

                </Pressable>
              </Pressable>
            </Modal>
          </View>








      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.primaryWhite,
    flex: 1,
    alignItems: 'center',
  },
  bottomContainer: {
    bottom: 0,
    //paddingBottom: '3%',
    paddingTop: '2%',
    alignItems: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    justifyContent: 'space-between',
    paddingBottom: '5%',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraMain
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
    color: colours.kapraMain
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(22),
    color: colours.primaryBlack,
    paddingTop: '30%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  coupon: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (91 / 100),
    marginLeft: windowWidth * (1 / 100),
    backgroundColor: colours.lowWhite,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },


  // GIFT CARD


  giftMainContainer: {
    width: windowWidth*(94/100),
    // height: windowWidth*(30/100),
    borderRadius:20,
    marginBottom:10,
    justifyContent:'flex-start',
    flexDirection:'row',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5,
  },
  imgCon: {
    width: windowWidth*(94/100),
    height: windowWidth*(42/100),
    flexDirection:'row',
    resizeMode:'contain',
    borderRadius:10,
  },
  contentCon1: {
      width: windowWidth*(45/100),
      height: windowWidth*(42/100),
      alignItems:'center',
      justifyContent:'center',
      paddingHorizontal: windowWidth*(4/100),
  },
  contentCon2: {
      width: windowWidth*(30/100),
      height: windowWidth*(42/100),
      alignItems:'center',
      justifyContent:'center',
      paddingHorizontal: windowWidth*(4/100),
  },
  contentCon3: {
      width: windowWidth*(20/100),
      height: windowWidth*(42/100),
  },
  dateCon: {
      width: windowWidth*(16/100),
      height: windowWidth*(15/100),
      alignItems:'center',
      justifyContent:'center',
  },
  giftFontStyle1: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getFontontSize(20),
      color: colours.primaryPink,
      textAlign:'center'
  },
  giftFontStyle2: {
      width: windowWidth*(30/100),
      height: windowWidth*(25/100),
      position:'absolute',
      fontFamily: 'Montserrat-SemiBold',
      fontSize: getFontontSize(17),
      color: colours.primaryWhite,
      transform: [{ rotate: '270deg'}],
      paddingBottom:windowWidth*(4/100),
      textAlign:'center'
  },
  giftFontStyle3: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getFontontSize(14),
      color: colours.primaryWhite,
      textAlign:'center'
  },
  giftFontStyle4: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getFontontSize(12),
      color: colours.kapraMain,
  },



  cartHeader: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.kapraMain

  },
  commonModalStyle: {
    width: windowWidth, 
    height: windowHeight*(50/100), 
    marginTop: windowHeight*(50/100), 
    backgroundColor: colours.lightPink, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius:20, 
    elevation:5, 
    alignItems:'center'
  },
  couponModalView: {
    width: windowWidth,
    paddingHorizontal: windowWidth*(3/100),
    marginTop: windowHeight*(2/100),
    paddingBottom: windowHeight*(10/100)
  },
  couponContainer: { 
    width: windowWidth * (91 / 100), 
    marginLeft: windowWidth * (1 / 100),
    marginTop:5, 
    height: windowHeight*(6/100), 
    paddingHorizontal: windowWidth*(3/100), 
    backgroundColor: colours.lowWhite, 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center'
  },
  closeMsgCon: {
    width: windowWidth,
    height: windowHeight*(7/100),
    justifyContent: 'space-between',
    alignItems:'center',
    flexDirection: 'row',
    backgroundColor: colours.lowRed,
    paddingHorizontal: windowWidth*(5/100)
  },
  Pricing: {
    //height: windowHeight * (5 / 100),
    width: windowWidth * (91 / 100),
    marginLeft: windowWidth * (1 / 100),
    backgroundColor: colours.lowWhite,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10

  },
  textField: {
    width: windowWidth * (51 / 100),
    height: windowHeight * (6 / 100),
    paddingLeft: 20,
    color: colours.kapraMain,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    letterSpacing: 4
  },
  apply: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (20 / 100),
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: colours.kapraMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (20 / 100),
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: colours.primaryRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCoupon: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (20 / 100),
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    flexDirection:'row',
    backgroundColor: colours.primaryOrange,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  fontStyle6: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    height: windowHeight * (5 / 100),
    width: windowWidth,
    paddingHorizontal: windowWidth * (5 / 100),
  },
  fontStyle7: {
    fontWeight: 'bold',
    fontSize: getFontontSize(16),
    marginLeft: '5%',
  },
});
