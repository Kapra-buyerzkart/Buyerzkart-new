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
  Image,
  Pressable,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';
import Toast from 'react-native-simple-toast';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import CONFIG from '../globals/config';
import {
  getSingleItemData,
  RemoveCartItemByUrlkey,
  addtoCart, 
  decreaseCartItemByURLKey,
  getRelatedProducts
} from '../api';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import Header from '../components/Header';
import AuthButton from '../components/AuthButton';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import PriceCard from '../components/PriceCard';
import GroProductCard from '../components/GroProductCard';
import WishIcon from '../components/WishIcon';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroSingleItemScreen({
  navigation,
  route: {
    params: { UrlKey, DealTo, ItemData },
  },
}) {
  const systemFonts = [...defaultSystemFonts, 'Montserrat-Medium', 'Montserrat-Semibold'];

  const [data, setData] = React.useState(ItemData ? ItemData : null);
  const [specialDetails, setSpecialDetails] = React.useState(null);
  const [imageData, setImageData] = React.useState(null);
  const { showLoader } = React.useContext(LoaderContext);
  const [RelatedData, setRelatedData] = React.useState(null);
  const [varientsData, setVarientsData] = React.useState(null);
  const [loaderStatus, setLoaderStatus] = React.useState(false);
  const [choosenIndex, setChoosenIndex] = React.useState(0);

  const { profile, GroUpdateCart, GroCartData } = React.useContext(AppContext);
  const regex = /<br|\n|\r\s*\\?>/g;
  
  const _fetchSingleItem = async () => {
    let res = await getSingleItemData(UrlKey);
    if (res?.ProdDetails === null) {
      showLoader(false);
      navigation.goBack();
      return;
    }
    setData(res.ProdDetails);
    setImageData(res.ProdImages);
    setSpecialDetails(res.specDetails)
    showLoader(false);
    await variationJSONCheck(res.ProdDetails.variationJson);
    let res1 = await getRelatedProducts(UrlKey);
    setRelatedData(res1.RelatedList);
  };

  const splitURLFun = async () => {
    let profile1 = JSON.parse(await AsyncStorage.getItem('profile'));
    let ProductRef = await AsyncStorage.getItem('ProductRef');
    if (!profile1.custId && ProductRef) {
      navigation.navigate('GroProductRegisterScreen',{details: ProductRef})
    } else{
      _fetchSingleItem();
    }
  }

  const variationJSONCheck = async(Variations) => {
    try {
      JSON.parse(Variations);
      setVarientsData(JSON.parse(Variations))
    } catch (e) {
      setVarientsData(null)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      splitURLFun();
    }, []),
  );

  const AddtoCart = async(urlKey) => {
      
    try {
        setLoaderStatus(true);
        let res = await addtoCart( urlKey);
        await GroUpdateCart();
        // await updateCart(toggleCheckBox?productId:null);
        setLoaderStatus(false);
      } catch (err) {
        setLoaderStatus(false);
        if (typeof err == 'string') {
            Toast.show(err);
        } else {
          Toast.show(err?.Message?err?.Message:"Something wrong!");
        }
      }
  }

  const decreaseCartCount = async(urlKey) => {
      try {
          setLoaderStatus(true);
          let res = await decreaseCartItemByURLKey( urlKey);
          await GroUpdateCart();
          setLoaderStatus(false);
      } catch (err) {
          setLoaderStatus(false);
          if (typeof err == 'string') {
              Toast.show(err);
          } else {
            Toast.show(err?.Message?err?.Message:"Something wrong!");
          }
      }
  }

  const deleteFromCart = async(urlKey) => {
      try {
          setLoaderStatus(true);
          let res = await RemoveCartItemByUrlkey(urlKey );
          await GroUpdateCart();
          setLoaderStatus(false);
        } catch (err) {
          setLoaderStatus(false);
          if (typeof err == 'string') {
              Toast.show(err);
          } else {
            Toast.show(err?.Message?err?.Message:"Something wrong!");
          }
        }
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: data.prName,
        message:profile.referralCode? CONFIG.siteUrl + 'grocery/product/' + data.urlKey +`?custrefcd=${profile.referralCode}` : CONFIG.siteUrl + 'grocery/product/' + data.urlKey,
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

  const _renderSingleItem = ({ item, index }) => {
    if (item.imgType === "Image") {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('GroImageViewScreen', { images: imageData })}>
          <FastImage
            style={styles.sliderImgStyle}
            source={{
              uri: getImage(item.imageUrl),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      );
    } else{
      return(
        <TouchableOpacity
          style={styles.sliderImgStyle}
          onPress={() =>
            navigation.navigate('GroImageViewScreen', { images: imageData })
          }
        >
          <Image
            source={require('../../assets/logo/play.png')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      )

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
    </SafeAreaView>
  );
  
  if (Object.keys(data).length === 0) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Details</Text>
      </View>


      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image Con  */}
        {
          imageData && imageData.length > 0 ?
            <TouchableOpacity style={styles.imageSliderCon} onPress={() =>
              navigation.navigate('GroImageViewScreen', { images: imageData })
            }>
              <Carousel
                autoplay
                data={imageData}
                renderItem={_renderSingleItem}
                sliderWidth={windowWidth*(90/100)}
                loop={true}
                sliderHeight={windowWidth * (70 / 100)}
                itemWidth={windowWidth*(90/100)}
              />
              <View style={styles.wishCon}>
                <WishIcon 
                  ProductID={data.productId}
                  urlKey={UrlKey}
                />
              </View>
            </TouchableOpacity >
            :
            <FastImage
              style={styles.sliderImgStyle}
              source={{
                uri: getImage(data.imageUrl),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
        }
        {
          imageData && imageData.length > 0 &&(
            <View style={styles.smallImageCon}>
              <FlatList
                horizontal
                data={imageData}
                renderItem={({ item, index }) => (
                  <FastImage
                    style={styles.smallImage}
                    source={{
                      uri: getImage(item.imageUrl),
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
                ListFooterComponent={
                  <TouchableOpacity 
                    style={[styles.smallImage,{backgroundColor: colours.kapraOrangeLight}]}onPress={() =>
                      navigation.navigate('GroImageViewScreen', { images: imageData })
                    }
                  >
                    {showIcon('expand', colours.kapraWhite, windowWidth*(5/100))}
                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Name  */}
        <>
          <Text style={[styles.titleFont, { width: windowWidth * (90 / 100), paddingTop:15 }]} >{data.prName}</Text>
          <Text style={[styles.fontStyle2, {  width: windowWidth * (90 / 100),color: colours.kapraOrange }]}>{data.catName}</Text>

          <View style={styles.cmnWidthCon}>
          {
            data?.bvValue&&data?.bvValue>0 ?(
              <View style={styles.redeemCon}>
                <Text style={styles.redeemFont}>Redeem upto {data?.bvValue} B-Token</Text>
              </View>
            )
            :
            null
          }
          </View>
        </>

        {/* Price Con  */}
        <View style={[styles.cmnWidthCon,{flexDirection:'row'}]}>
          { data?.specialPrice && data.specialPrice !== 0 ? 
              <View style={styles.offerContainer}>
                <Text style={styles.offerText}>
                  -{(
                    100 -
                    (data.specialPrice * 100) /
                    data.unitPrice
                  ).toFixed(0)}%
                </Text>
              </View>
            :
            null
          }
          <PriceCard
            SpecialPrice={data.specialPrice?data.specialPrice:null}
            UnitPrice={data.unitPrice}
            FontSize={25}
            SmallFontSize={20}
            
          />
        </View>

        {/* Variation  */}
        {
          varientsData&&(
            <View style={styles.variationCon}>
              <Text style={[styles.variationTitle]}>Please select a variant.</Text>
              <Text/>
              {
                varientsData&&varientsData[0].AttrValues.map((item,index)=>(
                  <TouchableOpacity 
                    style={styles.variationCard}
                    onPress={() => {
                      if (item.prUrlkey !== null && item.prUrlkey !== UrlKey ) {
                        navigation.dispatch(
                          StackActions.replace('GroSingleItemScreen', {
                            UrlKey: item.prUrlkey,
                            ItemData: item
                          })
                        );
                      }
                    }}
                  >
                    <View style={{width: windowWidth*(50/100)}}>
                      <Text style={[styles.addText,{color: colours.primaryBlack, marginBottom:10,fontSize: getFontontSize(14),}]}>
                          {item.prName}
                      </Text>
                      <View style={{flexDirection:'row'}}>
                      {
                        item.prSpecialPrice && item.prSpecialPrice !=0 && item.prSpecialPrice != item.prPrice?
                        <View style={styles.offerContainer}>
                          <Text style={[styles.offerText,{fontSize: getFontontSize(12)}]}>
                            {(((parseFloat(item.prPrice)-parseFloat(item.prSpecialPrice))/parseFloat(item.prPrice))*100).toFixed(0)} % Off
                            </Text>
                          </View>
                          :
                          null
                      }
                      {
                        item.prSpecialPrice && item.prSpecialPrice !=0 && item.prSpecialPrice != item.prPrice?
                        <PriceCard
                          SpecialPrice={item.prSpecialPrice}
                          UnitPrice={item.prPrice}
                          FontSize={15}
                          SmallFontSize={12}
                        />
                        :
                        <PriceCard
                          UnitPrice={item.prPrice}
                          FontSize={15}
                          SmallFontSize={12}
                        />
                      }
                      </View>
                    </View>
                    <View>
                      {
                        loaderStatus && index === choosenIndex?
                          <View style={styles.addButton}>
                              <ActivityIndicator size={12} color={colours.kapraWhite}/>
                          </View>
                        :
                          item.prStock !== "In Stock"?
                          <View style={[styles.addButton,{backgroundColor: colours.kapraMain}]}>
                            <Text style={[styles.addText,{fontSize:getFontontSize(12)}]}>
                            SOLD OUT
                            </Text>
                          </View>
                          :
                          GroCartData[item.productId] && GroCartData[item.productId]>0 ?
                              <View style={[styles.addButton, {justifyContent:'space-between', backgroundColor: GroCartData[item.productId]>0? colours.kapraMain:colours.kapraMain}]}>
                                  <TouchableOpacity style={styles.minusButton} onPress={()=>{GroCartData[item.productId]>1? (decreaseCartCount(item.prUrlkey),setChoosenIndex(index)) : (deleteFromCart(item.prUrlkey),setChoosenIndex(index))}}>
                                      {showIcon('mathminus', colours.primaryWhite, windowWidth * (2.5 / 100))}
                                  </TouchableOpacity>
                                  <Text style={[styles.addText]}>{GroCartData[item.productId]}</Text>
                                  <TouchableOpacity style={styles.plusButton}  onPress={()=>{AddtoCart(item.prUrlkey),setChoosenIndex(index)}}>
                                      {showIcon('mathplus', colours.primaryWhite, windowWidth * (2.5 / 100))}
                                  </TouchableOpacity>
                              </View>
                          :   
                              <TouchableOpacity style={styles.addButton} onPress={()=>{AddtoCart(item.prUrlkey),setChoosenIndex(index)}}>
                                  <Text style={styles.addText}>
                                    Add
                                  </Text>
                              </TouchableOpacity>
                        }
                    </View>
                  </TouchableOpacity>
                  ))
                }
            </View>

          )
        }

        {/* Reviews  */}
        <View style={[styles.cmnWidthCon,{flexDirection:'row'}]}>
          <View style={{ flexDirection: 'row' }}>
            {data.IsReviewAvgrating != 0 && (
            <AuthButton
              FirstColor={colours.kapraOrangeDark}
              SecondColor={colours.kapraOrange}
              OnPress={() =>
                navigation.navigate('GroReviewScreen', {
                  ProdDetails: data,
                })
              }
              ButtonText={"Reviews"}
              ButtonWidth={30}
              FSize={getFontontSize(12)}
              ButtonHeight={3.5}
            />
            )}
            <Text>  </Text>
            {
              data.Reviewstatus != 0 && (
              <AuthButton
              FirstColor={colours.kapraMain}
              SecondColor={colours.kapraLight}
                OnPress={() => {
                  if (profile.bkCustId) {
                    navigation.navigate('GroWriteReviewScreen', {
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

        {/* Description  */} 
        <View style={[styles.cmnWidthCon,]}>
          <Text style={[styles.fontStyle3]}>Short Description</Text>
          <Text
            style={[styles.fontStyle2]}>
            {data.shortDescription}
          </Text>
          {
            data.description ?
              <>
                <Text style={[styles.fontStyle3, { marginTop: '5%' }]}>Product Details</Text>
                <View style={{ width: windowWidth * (80 / 100), marginLeft: windowWidth * (5 / 100), fontFamily: 'Proxima Nova Alt Semibold' }}>
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
            <View style={{marginBottom:10}}>
              <Text style={[styles.fontStyle3, { marginTop: 10 }]}>
                {"Product Specification"}
              </Text>
              <Text/>
              {specialDetails.map((item,index)=>(
                <Text style={[styles.fontStyle2, { color: colours.grey }]}>{item.attrName} : {item.attrValue}</Text>
              ))}
            </View>
            )
          }
        </View>

        {/* Related Products  */}
        {RelatedData && RelatedData.length !== 0 && (
          <>
              <View style={[styles.cmnWidthCon,]}>
                <Text style={styles.fontStyle3}>Related Products</Text>
                <Text/>
              </View>
              <FlatList
                contentContainerStyle={{width: windowWidth*(90/100),justifyContent:'space-between'}}
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between"}}
                data={RelatedData}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    BTValue={item.bvValue}
                    Variations={item.variationJson?item.variationJson:null}
                    GotoCart={()=>navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    OnPress={() => {
                      if (item.urlKey !== null) {
                        navigation.dispatch(
                          StackActions.replace('GroSingleItemScreen', {
                            UrlKey: item.urlKey,
                            ItemData: item
                          })
                        );
                      } else {
                        Toast.show('Url Key is null');
                      }
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            {/* </View> */}
          </>
        )}


      </ScrollView>

      {/* Add To Cart  */}
        {
        !varientsData&&(
          <View style={styles.priceCardCon}>
          {
            loaderStatus?
              <AuthButton
                FirstColor={colours.kapraOrangeDark}
                SecondColor={colours.kapraOrange}
                ButtonText={<ActivityIndicator size={12} color={colours.primaryWhite}/>}
                ButtonWidth={90}
                ButtonHeight={4}
              />
              :
              data.stockAvailability == 'Out Of Stock'?
              <AuthButton
                FirstColor={colours.kapraBlackLow}
                SecondColor={colours.kapraWhiteLow}
                ButtonText={'SOLD OUT'}
                ButtonWidth={90}
                ButtonHeight={5}
              />
            :
            GroCartData[data.productId]&&GroCartData[data.productId]>0 ?
            <View style={styles.cartUpdateMainCon}>
              <View style={styles.cartUpdateCon}>
                  <TouchableOpacity style={[styles.minusButton,{height: windowHeight*(4/100), backgroundColor: colours.kapraOrangeLight}]} onPress={()=>GroCartData[data.productId]>1? decreaseCartCount(UrlKey) : deleteFromCart(UrlKey)}>
                      {showIcon('mathminus', colours.primaryWhite, windowWidth * (2.5 / 100))}
                  </TouchableOpacity>
                  <Text style={[styles.addText, {color: colours.kapraOrangeLight}]}>{GroCartData[data.productId]}</Text>
                  <TouchableOpacity style={[styles.plusButton,{height: windowHeight*(4/100), backgroundColor: colours.kapraOrangeLight}]} onPress={()=>AddtoCart(UrlKey)}>
                      {showIcon('mathplus', colours.primaryWhite, windowWidth * (4 / 100))}
                  </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={()=>navigation.navigate('GroCartScreen')} style={styles.viewCartCon}>
                <Text style={[styles.addText]}>View Cart</Text>
              </TouchableOpacity>
            </View>
            :   
            <AuthButton
              FirstColor={colours.kapraOrangeDark}
              SecondColor={colours.kapraOrange}
              OnPress={()=>AddtoCart(UrlKey)}
              ButtonText={"Add To Cart"}
              ButtonWidth={90}
              ButtonHeight={5}
            />
          }
          </View>
        )
      }
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingHorizontal: windowWidth*(5/100)
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    alignItems:'center',
    justifyContent:'center',
  },
  sliderImgStyle: {
    width: windowWidth*(90/100),
    height: windowWidth * (80 / 100),
    borderRadius:10,
    resizeMode: 'contain',
  },
  imageSliderCon: {
    width: windowWidth*(90/100),
    height: windowWidth*(80/100),
    borderRadius: 10,
    alignItems:'flex-end',
    justifyContent:'flex-start',
    backgroundColor: colours.kapraWhiteLow
  },
  wishCon: {
    position:'absolute',
    top:windowWidth*(3/100),
    right:windowWidth*(3/100),
  },
  smallImageCon: {
    width: windowWidth*(90/100),
    height: windowWidth*(18/100),
    backgroundColor: colours.kapraWhiteLow,
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10
  },
  smallImage: {
    width: windowWidth*(15/100),
    height: windowWidth*(15/100),
    borderRadius: 10,
    alignItems:'center',
    justifyContent:'center',
    marginLeft:5
  },
  cmnWidthCon: {
    width: windowWidth * (90 / 100),
    marginVertical:10
  },
  redeemCon: {
    padding:5,
    borderRadius:5,
    backgroundColor: colours.kapraMain,
    width: windowWidth*(40/100),
    alignItems:'center'
  },
  offerContainer: {
    backgroundColor: colours.kapraWhite,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal: 10,
  },
  variationCard: {
    width: windowWidth*(85/100), 
    borderWidth:2, 
    borderRadius:5, 
    borderColor: colours.kapraWhite, 
    marginBottom:10, 
    padding: windowWidth*(3/100), 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between'
  },
  variationCon: {
    width: windowWidth * (90 / 100),
    backgroundColor: colours.kapraWhiteLow,
    borderRadius: 10,
    padding: windowWidth * (2.5 / 100),
  }, 
  priceCardCon: {
    width: windowWidth,
    height: windowHeight*(7/100),
    alignItems: 'center',
    justifyContent:'center'
  },
  addButton: {
    width: windowWidth * (25 / 100),
    height: windowWidth*(8/100),
    marginLeft: windowWidth * (1 / 100),
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'center',
    backgroundColor: colours.kapraMain,
    borderRadius: 5,
    paddingVertical:2
  },
  viewCartCon: {
    width: windowWidth*(54/100),
    height: windowHeight*(4/100),
    backgroundColor: colours.kapraOrangeLight,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center'
  },
  cartUpdateMainCon:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width: windowWidth*(90/100),
    height: windowHeight*(6/100),
  },
  cartUpdateCon: {
    width: windowWidth*(34/100),
    height: windowHeight*(4/100),
    alignItems:"center",
    justifyContent:'space-between',
    flexDirection:'row',
  },
  scroll: {
    alignItems: 'center',
  },
  minusButton: {
      height: windowWidth*(5/100), 
      width:windowWidth*(10/100), 
      backgroundColor: colours.kapraMain, 
      borderTopLeftRadius:5, 
      borderBottomLeftRadius:5, 
      alignItems:'center', 
      justifyContent:'center'
  },
  plusButton: {
      height: windowWidth*(5/100), 
      width:windowWidth*(10/100), 
      backgroundColor: colours.kapraMain, 
      borderTopRightRadius:5, 
      borderBottomRightRadius:5, 
      alignItems:'center', 
      justifyContent:'center'
  },



  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  titleFont: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack
  },
  fontStyle2: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    color: colours.kapraBlackLow,
  },
  redeemFont: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(11),
    color: colours.primaryWhite,
  },
  offerText: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(20),
    color: colours.kapraOrangeLight,
  },
  variationTitle :  {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(16),
    color: colours.kapraBlack,
  },
  fontStyle3: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack
  },
  addText: {
    color: colours.primaryWhite,
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(16),
  },
});

const webViewStyle = StyleSheet.create({
  html: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  p: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  tr: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  a: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  table: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  tbody: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  tr: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
  ul: {
    color: colours.primaryGrey,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    lineHeight: windowWidth * (5 / 100),
  },
})
