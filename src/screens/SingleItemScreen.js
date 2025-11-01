import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  Share,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';
import showIcon from '../globals/icons';
import Toast from 'react-native-simple-toast';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'
import colours from '../globals/colours';
import CONFIG from '../globals/config';
import {
  getSingleItemData,
  addToWishList,
  addToCart,
  removeFromWishList,
  removeAllFromCart,
  productBuyNow,
  removeBuyNow,
  RemoveCartItemByUrlkey,
  getRelatedProducts
} from '../api';
import { getImage, getFontontSize } from '../globals/functions';
import Header from '../components/Header';
import AuthButton from '../components/AuthButton';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import { I18nManager } from "react-native";
import PriceCard from '../components/PriceCard';
import TimerCard from '../components/TimerCard';
import SearchCard from '../components/SearchCard';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import WishIcon from '../components/WishIcon';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import RegisterScreen from './RegisterScreen'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function SingleItemScreen({
  navigation,
  route: {
    params: { UrlKey, DealTo, ItemData },
  },
}) {
  const systemFonts = [...defaultSystemFonts, 'Proxima Nova Alt Semibold', 'Proxima Nova Alt Semibold'];

  const [data, setData] = React.useState(ItemData ? ItemData : null);
  const [specialDetails, setSpecialDetails] = React.useState(null);
  const [imageData, setImageData] = React.useState(null);
  const { showLoader } = React.useContext(LoaderContext);
  const [cartNo, setCartNO] = React.useState(1);
  const [RelatedData, setRelatedData] = React.useState(null);
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [varientsData, setVarientsData] = React.useState(null);
  const [selectedVariation, setSelectedVariation] = React.useState(null);
  const [selectedIndexOfVariation, setSelectedIndexOfVariation] = React.useState(0);
  const [noDays, setNoDays] = React.useState(0);
  const [Date, SetDate] = React.useState({});
  const { profile, updateWishCount, cartData, updateCart, loadCart } = React.useContext(AppContext);
  const regex = /<br|\n|\r\s*\\?>/g;

  const _fetchSingleItem = async () => {
    let res = await getSingleItemData(UrlKey);
    if (res.ProdDetails === null) {
      showLoader(false);
      navigation.goBack();
      return;
    }
    setData(res.ProdDetails);
    setImageData(res.ProdImages);
    setSpecialDetails(res.specDetails)
    setVarientsData(JSON.parse(res.ProdDetails.variationJson));
    if (res.ProdDetails.variationJson && res.ProdDetails.variationJson.length > 1) {
      for (let i = 0; i < JSON.parse(res.ProdDetails.variationJson)[0].AttrValues.length; i++) {
        for (let j = 0; j < JSON.parse(res.ProdDetails.variationJson)[0].AttrValues[i].VariationValues.length; j++) {
          if (res.ProdDetails.urlKey === JSON.parse(res.ProdDetails.variationJson)[0].AttrValues[i].prUrlKey) {
            setSelectedVariation(JSON.parse(res.ProdDetails.variationJson)[0].AttrValues[i].AttrValuename);
            setSelectedIndexOfVariation(i);
          }
        }
      }
    }
    showLoader(false);
    let res1 = await getRelatedProducts(UrlKey);
    setRelatedData(res1.RelatedList);
  };

  const _fetchVarientsItem = async (value) => {
    showLoader(true);
    // await removeBuyNow();
    let res = await getSingleItemData(value);
    if (res.ProdDetails === null) {
      showLoader(false);
      navigation.goBack();
      return;
    }
    setData(res.ProdDetails);
    setImageData(res.ProdImages);
    setSpecialDetails(res.specDetails)
    setVarientsData(JSON.parse(res.ProdDetails.variationJson));
    if (res.ProdDetails.variationJson && res.ProdDetails.variationJson.length > 1) {
      for (let i = 0; i < JSON.parse(res.ProdDetails.variationJson)[0].AttrValues.length; i++) {
        for (let j = 0; j < JSON.parse(res.ProdDetails.variationJson)[0].AttrValues.length; j++) {
          if (res.ProdDetails.urlKey === JSON.parse(res.ProdDetails.variationJson)[0].AttrValues[i].prUrlKey) {
            setSelectedVariation(JSON.parse(res.ProdDetails.variationJson)[0].AttrValues[i].AttrValuename);
            setSelectedIndexOfVariation(i);
          }
        }
      }
    }
    let res1 = await getRelatedProducts(value);
    setRelatedData(res1.RelatedList);
    showLoader(false);
  };

  const splitURLFun = async () => {
    let profile1 = JSON.parse(await AsyncStorage.getItem('profile'));
    let ProductRef = await AsyncStorage.getItem('ProductRef');
    if (!profile1.custId && ProductRef) {
      navigation.navigate('ProductRegisterScreen',{details: ProductRef})
    } else{
      _fetchSingleItem();
    }
  }

  // React.useEffect(() => {
  //   // _fetchSingleItem();
  //   splitURLFun();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      splitURLFun();
    }, []),
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: data.prName,
        message:profile.referralCode? CONFIG.siteUrl + 'product/' + data.urlKey +`?custrefcd=${profile.referralCode}` : CONFIG.siteUrl + 'product/' + data.urlKey,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert(error.message);
    }
  };


  
  if (data === null) return (
    <SafeAreaView style={[styles.mainContainer, { justifyContent: 'space-between' }]}>
      <Header
        backEnable
        HeaderText={'Product Details'}
        navigation={navigation}
        Cart
        Search
      />
      <ScrollView>
        <SkeletonPlaceholder highlightColor={colours.lightPink}>
          <View style={{ width: windowWidth,marginTop: windowWidth * (2.5 / 100), alignItems:'center'}}>
            <View style={{ width: windowWidth*(90/100), height: windowWidth*(50/100), borderRadius:5, marginBottom:10}}/>
            <View style={{ width: windowWidth*(90/100), height: windowWidth*(10/100), borderRadius:5, marginBottom:10}}/>
            <View style={{ width: windowWidth*(90/100), height: windowWidth*(15/100), borderRadius:5, marginBottom:10}}/>
            <View style={{ width: windowWidth*(90/100), height: windowWidth*(50/100), borderRadius:5, marginBottom:10}}/>
            <View style={{ width: windowWidth*(90/100), height: windowWidth*(10/100), borderRadius:5, marginBottom:10}}/>
            <View style={{ width: windowWidth*(90/100), height: windowWidth*(15/100), borderRadius:5, marginBottom:10}}/>
          </View>
        </SkeletonPlaceholder>
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
        <AuthButton
          BackgroundColor={
            colours.primaryOrange
          }
          FirstColor={colours.primaryOrange}
          SecondColor={colours.primaryOrange}
          ButtonText={"Buy Now"}
          ButtonWidth={45}
        />
        <AuthButton
          BackgroundColor={
            colours.kapraMain
          }
          ButtonText={'Add To Cart'}
          ButtonWidth={45}
        />
      </View>
    </SafeAreaView>
  );
  const _renderSingleItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ImageViewScreen', { images: imageData })
        }
        style={{
          alignItems: 'center',
          paddingTop: windowWidth * (4.5 / 100),
        }}>
        <FastImage
          style={{
            width: windowWidth,
            height: windowWidth * (50 / 100),
            resizeMode: 'contain',
          }}
          source={{
            uri: getImage(item.imageUrl),
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
    );
  };

  if (Object.keys(data).length === 0) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        backEnable
        HeaderText={'Product Details'}
        navigation={navigation}
        Cart
        Search
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ width: windowWidth, height: windowWidth * (56 / 100) }}>
          {
            imageData && imageData.length > 0 ?
              <View style={{ height: windowWidth * (56 / 100) }}>
                <Carousel
                  autoplay
                  data={imageData}
                  renderItem={_renderSingleItem}
                  sliderWidth={windowWidth}
                  loop={true}
                  sliderHeight={windowWidth * (56 / 100)}
                  itemWidth={windowWidth}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: windowWidth*(8/100), bottom: 10 }}
                  onPress={() =>
                    navigation.navigate('ImageViewScreen', { images: imageData })
                  }
                >
                  {showIcon('expand', '#0009', 20)}
                </TouchableOpacity>
              </View>
              :
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  padding: 20,
                  height: windowWidth * (50 / 100),
                }}>
                <FastImage
                  style={{
                    width: windowWidth,
                    height: windowWidth * (50 / 100),
                    resizeMode: 'contain',
                  }}
                  source={{
                    uri: getImage(data.imageUrl),
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />

              </TouchableOpacity>
          }
        </View>

        <View style={styles.detailContainer}>
          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>

            <Text style={[styles.fontStyle1, { width: windowWidth * (75 / 100) }]} >
              {data.prName}
            </Text>
            <WishIcon 
              ProductID={data.productId}
              urlKey={UrlKey}
            />
            {/* <TouchableOpacity
              style={{ paddingHorizontal: windowWidth * (2 / 100) }}
              onPress={() => {
                data.IsWishlisted
                  ? removeFromWishList(UrlKey).then(() => {
                    Toast.show('Removed From Wishlist');
                    _fetchSingleItem();
                    updateWishCount();
                  })
                  : // Toast.show('Already In Wishlist')
                  addToWishList(UrlKey).then(() => {
                    _fetchSingleItem();
                    updateWishCount();
                    Toast.show('Added To Wishlist');
                  });
              }}>
              <Text>
                {showIcon(
                  'heartFill',
                  data.IsWishlisted
                    ? colours.primaryRed
                    : "#cfcfcf",
                  24,
                )}
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={[styles.fontStyle2, { color: colours.kapraLow }]}>{data.catName}</Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 20, }}
              onPress={() => onShare()}
            >
              <Text>{showIcon('share', colours.primaryBlack, windowWidth * (5 / 100))}</Text>
            </TouchableOpacity>
          </View>
          <View>
          {
            data?.bvValue && data?.bvValue?( 
              <View style={{
                padding: 5,
                borderRadius:5,
                width: windowWidth*(60/100),
                alignItems:'center',
                marginVertical:5,
                backgroundColor: colours.kapraMain,
                marginLeft: windowWidth*(4/100)
              }}>
                <Text style={[styles.fontStyle8]}>You can redeem upto {data?.bvValue} B-Token</Text>
              </View>
            )
            :
            null
          }
          </View>
          {data.specialPrice ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: '2%',
                  paddingBottom: '1%',
                  alignItems: 'center',
                  marginLeft: '4%'
                }}>
                <PriceCard
                  SpecialPrice={data.specialPrice}
                  UnitPrice={data.unitPrice}
                  FontSize={23}
                  SmallFontSize={12}
                />
                <View style={{ marginLeft: '8%', marginTop: '2%' }}>
                  <View style={styles.offerContainer}>
                    <Text style={styles.offerText}>
                      {(
                        100 -
                        (data.specialPrice * 100) /
                        data.unitPrice
                      ).toFixed(0)}{' '}
                      %
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: '2%',
                  paddingBottom: '1%',
                  alignItems: 'center',
                  marginLeft: '4%'
                }}>
                <PriceCard
                  UnitPrice={data.unitPrice}
                  FontSize={23}
                />
              </View>
            </>
          )}
          {
            data.dealTo ?
              <TimerCard
                DealTo={data.dealTo}
              />
              :
              null
          }
          {
            varientsData && varientsData.length === 1 ?
              varientsData.map((variation, i) => (
                <View style={{ alignItems: 'flex-start', width: windowWidth, padding: 5, backgroundColor: colours.primaryWhite, marginTop: '2%' }}>
                  <Text style={[styles.fontStyle3,{marginLeft:windowWidth*(3/100)}]}>
                    {variation.Attrname}
                  </Text>
                  < FlatList
                    contentContainerStyle={{
                      paddingRight: '10%',
                      paddingTop: '1%',
                      width: '100%',
                    }}
                    showsHorizontalScrollIndicator={false}
                    numColumns={3}
                    data={variation.AttrValues}
                    renderItem={({ item }, i) => (
                      <TouchableOpacity onPress={() => _fetchVarientsItem(item.prUrlkey)} style={[styles.varientsBtn, { backgroundColor: data.urlKey === item.prUrlkey ? colours.kapraMain : colours.primaryWhite }]}>
                        <Text style={[styles.fontStyle3,{color: data.urlKey === item.prUrlkey ? colours.primaryWhite : colours.primaryOrange}]}>
                          {item.AttrValuename}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, i) => i.toString()}
                  />
                </View>
              ))
              :
              varientsData && varientsData.length > 1 ?
                <>
                  <View style={{ alignItems: 'flex-start', width: windowWidth, paddingLeft: '3%', padding: 5, backgroundColor: colours.primaryWhite, marginTop: '2%' }}>
                    <Text style={[styles.fontStyle3]}>
                      {varientsData[0].Attrname}
                    </Text>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      contentContainerStyle={{
                        paddingRight: '10%',
                        paddingTop: '1%',
                        width: '100%',
                      }}
                      data={varientsData[0].AttrValues}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          onPress={() => { setSelectedVariation(item.AttrValuename), setSelectedIndexOfVariation(index) }}
                          style={[styles.varientsBtn, { backgroundColor: selectedVariation === item.AttrValuename ? colours.kapraMain : colours.primaryGrey }]}>
                          <Text style={[styles.fontStyle3, { textAlign: 'center', color: selectedVariation === item.AttrValuename ?colours.primaryWhite :colours.primaryOrange}]}>
                            {item.AttrValuename}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, i) => i.toString()}
                    />

                  </View>
                  <View style={{ alignItems: 'flex-start', width: windowWidth, paddingLeft: '3%', padding: 5, backgroundColor: colours.primaryWhite, marginTop: '2%' }}>
                    <Text style={[styles.fontStyle3]}>
                      {varientsData[1].Attrname}
                    </Text>
                    < FlatList
                      contentContainerStyle={{
                        paddingRight: '10%',
                        paddingTop: '1%',
                        width: '100%',
                      }}
                      showsHorizontalScrollIndicator={false}
                      numColumns={3}
                      data={varientsData[0].AttrValues[selectedIndexOfVariation].VariationValues}
                      renderItem={({ item }, i) => (
                        <TouchableOpacity
                          onPress={() => _fetchVarientsItem(item.prUrlKey)}
                          style={[styles.varientsBtn, { backgroundColor: item.prUrlKey === data.urlKey ? colours.kapraMain : colours.primaryGrey }]}>
                          <Text style={[styles.fontStyle3, { textAlign: 'center', color: colours.primaryWhite }]} numberOfLines={2}>
                            {item.Variationattrvaluename}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, i) => i.toString()}
                    />
                  </View>
                </>
                :
                null

          }
          <View
            style={{
              padding: 10,
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row' }}>
              {data.IsReviewAvgrating != 0 && (
              <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={() =>
                  navigation.navigate('Review', {
                    ProdDetails: data,
                  })
                }
                ButtonText={"Reviews"}
                ButtonWidth={30}
                FSize={getFontontSize(12)}
                ButtonHeight={3.5}
              />
              )}
              {
                data.Reviewstatus != 0 && (
                <AuthButton
                  BackgroundColor={colours.kapraMain}
                  OnPress={() => {
                    if (profile.bkCustId) {
                      navigation.navigate('WriteReview', {
                        ProdDetails: data,
                      });
                    } else {
                      Toast.show('Please Login For Write Review');
                    }
                  }}
                  ButtonText={"Write a review"}
                  ButtonWidth={30}
                  FSize={getFontontSize(12)}
                  ButtonHeight={3.5}
                />
                )
              }
            </View>
          </View>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              paddingRight: I18nManager.isRTL ? 10 : 0,
              marginTop: 5,
              borderColor: colours.kapraLow,
              borderRadius: 5,
              width: windowWidth * (92 / 100),
            }}>
            <Text style={[styles.fontStyle3]}>Short Description</Text>
            <Text
              style={[
                styles.fontStyle2,
              ]}>
              {data.shortDescription}
            </Text>
            {
              data.description ?
                <>
                  <Text style={[styles.fontStyle3, { marginTop: '5%' }]}>Product Details</Text>
                  <View style={{ width: windowWidth * (80 / 100), marginLeft: windowWidth * (5 / 100), fontFamily: 'Proxima Nova Alt Semibold' }}>
                    {/* <HTML source={{ html: data.description.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                      contentWidth={windowWidth * (70 / 100)}
                      containerStyle={{ width: windowWidth * (75 / 100), marginLeft: windowWidth * (2.5 / 100), fontFamily: 'Proxima Nova Alt Semibold' }}
                      style={{ fontFamily: 'Proxima Nova Alt Semibold' }}
                      tagsStyles={webViewStyle}
                    /> */}
                      <RenderHtml 
                        source={{ html: data.description.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                        contentWidth={windowWidth * (60 / 100)}
                        containerStyle={{ width: windowWidth * (60 / 100), marginLeft: windowWidth * (2.5 / 100), fontFamily: 'Proxima Nova Alt Semibold' }}
                        style={{ fontFamily: 'Proxima Nova Alt Semibold' }}
                        tagsStyles={webViewStyle}
                        systemFonts={systemFonts}
                      />
                  </View>
                </>
                :
                null
            }
            {
              specialDetails&&(
              <>
                <Text style={[styles.fontStyle3, { marginTop: '5%' }]}>
                  {"Product Specification"}
                </Text>
                <Text/>
                {specialDetails.map((item,index)=>(
                  <Text style={[styles.fontStyle2, { color: colours.grey }]}>{item.attrName} : {item.attrValue}</Text>
                ))}
              </>
              )
            }
            {/* {specialDetails && (
              specialDetails.map((spec, i) => (
                spec.attrName === "Deal Of The Day?" || spec.attrName === "Featured?" ?
                  null
                  :
                  <>
                    <Text style={[styles.fontStyle3, { marginTop: '5%' }]}>
                      {spec.attrName}
                    </Text>
                    <Text
                      style={[
                        styles.fontStyle2,
                        i === specialDetails.length - 1
                          ? { marginBottom: '5%', }
                          : {},
                      ]}>
                      {spec.attrValue}
                    </Text>
                  </>
              )))} */}
          </View>
        </View>

        <View style={{ borderWidth: 0.4, width: windowWidth * (90 / 100), height: windowHeight * (21 / 100), marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', height: windowHeight * (6 / 100), marginBottom: windowHeight * (1 / 100) }}>
            <Image
              source={require('../assets/logo/genuine-icon.png')}
              style={{
                height: windowWidth * (10 / 100),
                width: windowWidth * (10 / 100),
                resizeMode: 'contain',
                margin: windowHeight * (1 / 100),
              }}
            />
            <View style={{ alignItems: 'flex-start', marginRight: windowHeight * (1 / 100), width: windowWidth * (75 / 100), justifyContent: 'center' }}>
              <Text style={styles.fontStyle3}>
                {"100% Genuine Product"}

              </Text>
              <Text style={[styles.fontStyle7, { textAlign: 'center' }]}>
                {"You can be ease that purchased product is 100% Genuine"}

              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: windowHeight * (6 / 100), marginBottom: windowHeight * (1 / 100) }}>
            <Image
              source={require('../assets/logo/secure-icon.png')}
              style={{
                height: windowWidth * (10 / 100),
                width: windowWidth * (10 / 100),
                resizeMode: 'contain',
                margin: windowHeight * (1 / 100),
              }}
            />
            <View style={{ alignItems: 'flex-start', marginRight: windowHeight * (1 / 100), width: windowWidth * (75 / 100), justifyContent: 'center' }}>
              <Text style={styles.fontStyle3}>
                {"Free 7-day return if eligible, so easy"}
              </Text>
              <Text style={[styles.fontStyle7, { textAlign: 'center' }]}>
                {"You can return products if you are not satisfied.(T&C apply)"}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', height: windowHeight * (6 / 100), marginBottom: windowHeight * (1 / 100) }}>
            <Image
              source={require('../assets/logo/easy-return-icon.png')}
              style={{
                height: windowWidth * (10 / 100),
                width: windowWidth * (10 / 100),
                resizeMode: 'contain',
                margin: windowHeight * (1 / 100),
              }}
            />
            <View style={{ alignItems: 'flex-start', marginRight: windowHeight * (1 / 100), width: windowWidth * (75 / 100), justifyContent: 'center' }}>
              <Text style={styles.fontStyle3}>
                {"Supplier give bills for this product."}
              </Text>
              <Text style={[styles.fontStyle7, { textAlign: 'center' }]}>
                {"Every purchase you will get a valid bill."}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
          <Text style={[styles.fontStyle3, { width: windowWidth * (50 / 100), paddingRight: 10, marginLeft: 0 }]} numberOfLines={2}>Having Trouble? Contact Us to get help</Text>
          <AuthButton
            BackgroundColor={"#f58f00"}
            OnPress={() => navigation.navigate('WriteToUsScreen')}
            ButtonText={"Contact Us"}
            ButtonWidth={35}
          />
        </View> */}
        {RelatedData && RelatedData.length !== 0 && (
          <>
            <View style={{ width: windowWidth, alignItems: 'flex-start', backgroundColor: colours.primaryWhite, marginVertical:10 }}>
                <Text style={styles.fontStyle1}>Related Products</Text>
              </View>
            {/* <View style={{ flexDirection: 'row', backgroundColor: colours.primaryWhite }}> */}
              <FlatList
                
                showsHorizontalScrollIndicator={false}
                // horizontal={true}
                data={RelatedData}
                renderItem={({ item }, i) => (
                  <SearchCard
                    Name={item.prName}
                    UnitPrice={item.unitPrice}
                    SpecialPrice={item.specialPrice}
                    IsCarted={item.IsCarted}
                    Rating={item.IsReviewAvgrating}
                    ImageUri={getImage(item.imageUrl)}
                    IsWishlisted={item.IsWishlisted}
                    dealTo={item.dealTo}
                    ProductID={item.productId}
                    urlKey={item.urlKey}
                    Variations={item.variationJson ? item.variationJson : null}
                    Stock={item.stockAvailability}
                    Quantity={item.CartItemQty}
                    onCardPress={() => {
                      if (item.urlKey !== null) {
                        navigation.dispatch(
                          StackActions.replace('SingleItemScreen', {
                            UrlKey: item.urlKey,
                            DealTo: item.dealTo,
                            ItemData: item
                          })
                        );
                      } else {
                        Toast.show('Url Key is null');
                      }
                    }}
                    RemoveFromCart={async () => {
                      await RemoveCartItemByUrlkey(item.urlKey);
                      Toast.show('Removed From Cart');
                    }}
                  />
                )}
                keyExtractor={(item, i) => i.toString()}
              />
            {/* </View> */}
          </>
        )}
      </ScrollView>

      {
        profile.bkCustId ?
          <View style={styles.bottomButtonContainer}>
            <AuthButton
              disabled={
                data.stockAvailability.toLowerCase() === 'out of stock'
              }
              FColor={data.stockAvailability.toLowerCase() === 'out of stock'? colours.primaryGrey : colours.primaryWhite}
              BackgroundColor={data.stockAvailability.toLowerCase() === 'out of stock' ? colours.primaryGrey : colours.primaryOrange}
              FirstColor={colours.primaryOrange}
              SecondColor={colours.primaryOrange}
              ButtonText={"Buy Now"}
              ButtonWidth={45}
              OnPress={
                async () => {

                  if (data.minOrderQty > 1) {
                    Alert.alert(
                      'Cart',
                      "This item have minimum order quantity : " + data.minOrderQty,
                      [
                        {
                          text: 'Cancel',
                          onPress: () => null,
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: async () => {
                            await productBuyNow(UrlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                            navigation.navigate('Cart', { buyNow: true })
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  } else {
                    await productBuyNow(UrlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                    navigation.navigate('Cart', { buyNow: true })
                  }
                }
              }
            />

            <AuthButton
              LeftR
              disabled={
                data.stockAvailability.toLowerCase() === 'out of stock'
              }
              FColor={data.stockAvailability.toLowerCase() === 'out of stock'? colours.primaryGrey : colours.primaryWhite}
              BackgroundColor={
                data.stockAvailability.toLowerCase() === 'out of stock'
                  ? colours.primaryGrey
                  : cartData["p"+data.productId] ? colours.kapraMain : colours.kapraMain
              }
              ButtonText={
                data.stockAvailability.toLowerCase() === 'out of stock'
                  ? 'Out Of Stock'
                  : cartData["p"+data.productId]
                    ? 'Go To Cart'
                    : 'Add To Cart'
              }
              ButtonWidth={45}
              OnPress={
                cartData["p"+data.productId]
                  ? () => navigation.navigate('Cart')
                  :
                  data.minOrderQty > 1 ?
                    () => {

                      Alert.alert(
                        'Cart',
                        "This item have minimum order quantity : " + data.minOrderQty,
                        [
                          {
                            text: 'Cancel',
                            onPress: () => null,
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: async () => {
                              try {
                                await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                                Toast.show('Added To Cart');
                                await updateCart();
                                await loadCart();
                              } catch (error) {
                                if (error.status == 401) {
                                  Alert.alert(
                                    'Cart',
                                    error.Message,
                                    [
                                      {
                                        text: 'Cancel',
                                        onPress: () => null,
                                        style: 'cancel',
                                      },
                                      {
                                        text: 'OK',
                                        onPress: async () => {
                                          await removeAllFromCart();
                                          await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                                          Toast.show('Added To Cart');
                                          await updateCart();
                                          await loadCart();
                                        },
                                      },
                                    ],
                                    { cancelable: false },
                                  );
                                } else Toast.show(error);
                              }
                            },
                          },
                        ],
                        { cancelable: false },
                      )
                    }
                    :
                    async () => {
                      try {
                        await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                        Toast.show('Added To Cart');
                        await updateCart();
                        await loadCart();
                      } catch (error) {
                        if (error.status == 401) {
                          Alert.alert(
                            'Cart',
                            error.Message,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => null,
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: async () => {
                                  await removeAllFromCart();
                                  await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                                  Toast.show('Added To Cart');
                                  await updateCart();
                                  await loadCart();
                                },
                              },
                            ],
                            { cancelable: false },
                          );
                        } else Toast.show(error);
                      }
                    }


              }
            />
          </View>
          :
          <View style={styles.bottomButtonContainer}>
            <AuthButton
              FirstColor={colours.primaryOrange}
              SecondColor={colours.primaryOrange}
              BackgroundColor={colours.primaryOrange}
              ButtonText={"Buy Now"}
              ButtonWidth={45}
              OnPress={
                async () => {
                  Toast.show("Please Login");
                }}
            />
            <AuthButton
              LeftR
              disabled={
                data.stockAvailability.toLowerCase() === 'out of stock'
              }
              FColor={data.stockAvailability.toLowerCase() === 'out of stock'? colours.primaryGrey : colours.primaryWhite}
              BackgroundColor={
                data.stockAvailability.toLowerCase() === 'out of stock'
                  ? colours.primaryGrey
                  : cartData["p"+data.productId] ? colours.kapraMain : colours.kapraMain
              }
              ButtonText={
                data.stockAvailability.toLowerCase() === 'out of stock'
                  ? 'Out Of Stock'
                  : cartData["p"+data.productId]
                    ? 'Go To Cart'
                    : 'Add To Cart'
              }
              ButtonWidth={45}
              OnPress={
                cartData["p"+data.productId]
                  ? () => navigation.navigate('Cart')
                  :
                  data.minOrderQty > 1 ?
                    () => {

                      Alert.alert(
                        'Cart',
                        "This item have minimum order quantity : " + data.minOrderQty,
                        [
                          {
                            text: 'Cancel',
                            onPress: () => null,
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: async () => {
                              try {
                                await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                                Toast.show('Added To Cart');
                                await updateCart();
                                await loadCart();
                              } catch (error) {
                                if (error.status == 401) {
                                  Alert.alert(
                                    'Cart',
                                    error.Message,
                                    [
                                      {
                                        text: 'Cancel',
                                        onPress: () => null,
                                        style: 'cancel',
                                      },
                                      {
                                        text: 'OK',
                                        onPress: async () => {
                                          await removeAllFromCart();
                                          await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                                          Toast.show('AddedToCart');
                                          await updateCart();
                                          await loadCart();
                                        },
                                      },
                                    ],
                                    { cancelable: false },
                                  );
                                } else Toast.show(error);
                              }
                            },
                          },
                        ],
                        { cancelable: false },
                      )
                    }
                    :
                    async () => {
                      try {
                        await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                        Toast.show('Added To Cart');
                        await updateCart();
                        await loadCart();
                      } catch (error) {
                        if (error.status == 401) {
                          Alert.alert(
                            'Cart',
                            error.Message,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => null,
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: async () => {
                                  await removeAllFromCart();
                                  await addToCart(data.urlKey, data.minOrderQty > 1 ? data.minOrderQty : cartNo);
                                  Toast.show('Added To Cart');
                                  await updateCart();
                                  await loadCart();
                                },
                              },
                            ],
                            { cancelable: false },
                          );
                        } else Toast.show(error);
                      }
                    }


              }
            />
          </View>
      }
    </SafeAreaView >
  );
}
const webViewStyle = StyleSheet.create({
  html: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  p: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  tr: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  a: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  table: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  tbody: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  tr: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  ul: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
})

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
  },
  scroll: {
    alignItems: 'center',
  },
  detailContainer: {
    paddingRight: I18nManager.isRTL ? 5 : 0,
    paddingTop: '5%',

    width: windowWidth * (92 / 100),
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 10,
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(20),
    marginLeft: '5%',
    color: colours.primaryBlack
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
    marginLeft: '5%',
    marginRight: '5%',
    color: colours.primaryGrey,
  },
  fontStyle3: {
    fontWeight: 'bold',
    fontSize: getFontontSize(14),
    marginLeft: '5%',
    color: colours.primaryBlack
  },

  fontStyle7: {
    fontSize: getFontontSize(12),
    marginLeft: '5%',
    color: colours.primaryBlack
  },
  fontStyle8: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
    color: colours.primaryWhite,
  },
  bottomButtonContainer: {
    marginTop: 10,
    width: windowWidth,
    height: windowHeight * (8 / 100),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  wishListButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: windowWidth * (10 / 100),
    color: 'white',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: colours.primaryWhite,
  },
  offerContainer: {
    backgroundColor: colours.kapraMain,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  offerText: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(15),
    color: colours.primaryWhite,
  },
  cartAddingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * (30 / 100),
    height: windowWidth * (10 / 100),
    borderWidth: 0.5,
    borderRadius: 5,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '1%',
    marginTop: '10%',
    marginBottom: '5%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlack,
    fontSize: getFontontSize(22),
    height: windowWidth * (10 / 100),
    textAlignVertical: 'center',
  },
  fontStyle5: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlack,
    fontSize: getFontontSize(22),
    height: windowWidth * (10 / 100),
    textAlignVertical: 'center',
  },
  fontStyle6: {
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlack,
    fontSize: getFontontSize(22),
    height: windowWidth * (10 / 100),
    textAlignVertical: 'center',
  },
  varientsBtn: {
    // height: windowWidth * (10 / 100),
    borderWidth: 0.5,
    borderColor: colours.primaryOrange,
    marginLeft: windowWidth * (3 / 100),
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: windowWidth * (5 / 100),
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
  timerContainer: {
    height: windowWidth * (5 / 100),
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    marginBottom: 5
  },
});
