
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  Modal,
  Platform,
  Linking,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import { Badge } from 'react-native-elements';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ImageColors from "react-native-image-colors";
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import { BlurView } from "@react-native-community/blur";

import { AppContext } from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import colours from '../../globals/colours'
import { getFontontSize, getImage } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';
import PincodeChange from '../components/PincodeChange';
import CategoryGrid from '../components/CategoryGrid';
import GroProductCard from '../components/GroProductCard';
import DeviceInfo from 'react-native-device-info';
import AuthButton from '../components/AuthButton';
import FooterCart from '../components/FooterCart';

import {
  getHomeData,
  getCategoryArchive,
  getLatestArrival,
  getRecommendedProducts,
  getTopDealProducts,
  getRecentProducts,
  getAllBrandOffer,
  updateCheck,
  getPolicies,
  getHomeCategoryList,
  getBCoin,
  getOrderListWithPagination,
  postReOrder,
} from '../api';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroHomeScreen = ({ navigation }) => {
  const { profile, GroWishCount, editPincode, GroCartList, GroUpdateCart } = React.useContext(AppContext);
  const { showLoader, loading } = React.useContext(LoaderContext);

  const [data, setData] = React.useState(null);
  const [bCoin, setBCoin] = React.useState(null);
  const [categoryData, setCategoryData] = React.useState(null);
  const [featuredData, setFeaturedData] = React.useState(null);
  const [latestArrivalData, setLatestArrivalData] = React.useState(null);
  const [popularData, setPopularData] = React.useState(null);
  const [recommendedProducts, setRecommendedProducts] = React.useState(null);
  const [recentData, setRecentData] = React.useState(null);
  const [brandOffersData, setBrandOffersData] = React.useState(null);
  const [topdealProducts, setTopdealProducts] = React.useState(null);
  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [appUpdateData, setAppUpdateData] = React.useState(null);
  const [storeCloseModalVisible, setStoreCloseModalVisible] = React.useState(false);
  const [storeCloseMsg, setStoreCloseMsg] = React.useState('');
  const [storeCloseImg, setStoreCloseImg] = React.useState('');
  const [noStoreMsg, setNoStoteMsg] = React.useState('');
  const [dummy, setDummy] = React.useState(false);
  const [headerShow, setHeaderShow] = React.useState(true);

  const [orderHistory, setOrderHistory] = React.useState(null)


  const _fetchHomeData = async () => {
    setData(null);
    setLatestArrivalData(null)
    let res = await getPolicies();
    // console.log("res.dat", res)
    if (res && res?.find(obj => obj?.stName == 'isStoreOpenInArea').stValue !== '1') {
      // console.log("111")
      setStoreCloseModalVisible(true);
      setStoreCloseMsg(res.find(obj => obj.stName == 'newStoreCloseMsg').stValue)
      // const newStoreCloseMsg = res.find(obj => obj.stName == 'newStoreCloseMsg');
      // setStoreCloseMsg(newStoreCloseMsg?.stValue || '');
      setDummy(!dummy)
      // return
    }
    if (res) {
      // console.log("222")
      setNoStoteMsg(res.find(obj => obj.stName == 'deliveryUnavailableMsg').stValue)
      // const newStoreCloseImg = res.find(obj => obj.stName === 'newStoreCloseImage');
      // setStoreCloseImg(newStoreCloseImg?.stValue || '');
      setStoreCloseImg(res.find(obj => obj.stName == 'newStoreCloseImage').stValue)
      setDummy(!dummy)
    }
    if (res && res?.find(obj => obj?.stName == 'leadgeneration').stValue == '0') {
      // console.log("333")
      let iop = await AsyncStorage.getItem('isOpenedBefore');
      if (iop === 'true') {
        await latestArrivalDatas();
        fetchHomeBannersData();
        categoryListData();
        featuredProductsData();
        popularProductData();
        recommendedProductsData();
        recentProductsData();
        brandOffers();
        getTopDeals();
        _fetchOrderData()
        fetchBCoinData()
        setTimeout(AppUpdateCheck, 6000);
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'GroLeadGenScreen',
            }
          ],
        })
      }
    } else {
      // console.log("44444")
      await latestArrivalDatas();
      fetchHomeBannersData();
      categoryListData();
      featuredProductsData();
      popularProductData();
      recommendedProductsData();
      recentProductsData();
      brandOffers();
      getTopDeals();

      setTimeout(AppUpdateCheck, 6000);
    }

  };

  const AppUpdateCheck = async () => {
    try {
      let res3 = await updateCheck(DeviceInfo.getVersion(), Platform.OS === 'ios' ? 'ios' : "android", "Customer");
      setAppUpdateData(res3);
      if (res3.versionCode != DeviceInfo.getVersion()) {
        setUpdateModalVisible(true);
      }
    } catch (err) {
    }
  }

  const fetchBCoinData = async () => {
    try {
      let res = await getBCoin()
      setBCoin(res.btokenDetails)
    } catch (err) {
    }
  }

  const fetchHomeBannersData = async () => {
    try {
      let res = await getHomeData();
      setData(res);
    } catch (err) {
    }
  }

  const categoryListData = async () => {
    try {
      // let res1 = await shopByCategory();
      // setCategoryData(resolveF__kingCode(res1));
      let res1 = await getHomeCategoryList()
      setCategoryData(res1)
    } catch (err) {
    }
  }

  const popularProductData = async () => {
    try {
      let res3 = await getCategoryArchive('PopularProduct');
      setPopularData(res3);
    } catch (err) {
    }
  }

  const featuredProductsData = async () => {
    try {
      let res5 = await getCategoryArchive('FeaturedProduct');
      setFeaturedData(res5);
    } catch (err) {
    }
  }

  const latestArrivalDatas = async () => {
    try {
      let res7 = await getLatestArrival();
      setLatestArrivalData(res7);
      if (res7 && res7?.length == 0) {
        setStoreCloseModalVisible(false);
      }
    } catch (err) {
    }
  }

  const recommendedProductsData = async () => {
    try {
      let res1 = await getRecommendedProducts();
      setRecommendedProducts(res1);
    } catch (err) {
    }
  }

  const getTopDeals = async () => {
    try {
      let res1 = await getTopDealProducts();
      setTopdealProducts(res1);
    } catch (err) {
    }
  }

  const recentProductsData = async () => {
    try {
      let res1 = await getRecentProducts();
      setRecentData(res1);
    } catch (err) {
    }
  }

  const brandOffers = async () => {
    try {
      let res2 = await getAllBrandOffer();
      setBrandOffersData(JSON.parse(res2[0].brandProduct));
    } catch (err) {
    }
  }

  // const offerCategoryData = async () => {
  //   try {
  //     let arr = {};
  //     let res1 = await offerZoneData();
  //     setOfferCategory(res1.TopCategories);
  //     res1 && res1.TopCategories && res1.TopCategories.slice(0,10).map( async(item,index)=>{
  //       let res2 = await getCategoryOffer(item.catUrlKey);
  //       let key = item.catUrlKey;
  //       let value = res2;
  //       arr[key] = value;
  //       if(index === 9){
  //         setOfferData(arr)
  //       }
  //     })
  //   } catch (err) {
  //   }
  // }


  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  let onpress = (item) => {
    if (item.mob_type === 'Category') {
      navigation.navigate('GroSearchScreen', {
        catUrlKey: item.mob_urlKey,
      });
    } else if (item.mob_type === 'Product') {
      navigation.navigate('GroSingleItemScreen', {
        UrlKey: item.mob_urlKey,
      });
    } else if (item.mob_type === 'Brand') {
      navigation.navigate('GroSearchScreen', {
        filterValue: item.mob_urlKey
      });
    }
  };

  const _fetchOrderData = async () => {
    let res = await getOrderListWithPagination(1, 10);

    // setOrderHistory(res)
    setOrderHistory(res.filter((item) => item?.status == 'Order Delivered'))
  }

  const ReOrder = async (orderId) => {
    Alert.alert(
      'REORDER',
      'Are you sure want to reorder this?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
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
              showLoader(false);

            }
          },
        },
      ],
      { cancelable: false },
    )
  }

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY < windowHeight * (7 / 100)) {
      setHeaderShow(true)
      setDummy(!dummy)
    } else if (scrollY > windowHeight * (7 / 100)) {
      setHeaderShow(false)
      setDummy(!dummy)
    }
  };

  const _renderMainBanner = ({ item, index }) => {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[item?.Link && item?.Link.startsWith("#") ? item?.Link : colours.kapraOrange, colours.kapraWhite]}
        style={profile.isPrime === true ? (
          { width: windowWidth, height: windowHeight * (54 / 100), justifyContent: 'flex-end', alignItems: 'center' }
        ) : (
          { width: windowWidth, height: windowHeight * (51 / 100), justifyContent: 'flex-end', alignItems: 'center' }
        )}
      >
        <TouchableOpacity
          onPress={() => onpress(item)}
        >
          <FastImage
            style={[styles.bannerImage]}
            source={{
              uri: getImage(item?.imageUrl),
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>

      </LinearGradient>
    );
  };

  const _renderMainBanner1 = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onpress(item)}
      >
        <FastImage
          style={[styles.bannerImage]}
          source={{
            uri: getImage(item?.imageUrl),
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
    );
  };

  if (latestArrivalData && latestArrivalData?.length == 0) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[colours.kapraOrangeLight, colours.kapraWhite]}
          style={{ width: windowWidth, alignItems: 'center' }}
        >
          {/* Switch Con  */}
          <View style={styles.appSwitchCon}>
            <AuthButton
              FirstColor={colours.kapraOrangeDark}
              SecondColor={colours.kapraOrange}
              OnPress={() => null}
              ButtonText={'K GROCERY'}
              ButtonWidth={44}
              ButtonHeight={5}
              Font2
            />
            <AuthButton
              FirstColor={colours.kapraWhite}
              SecondColor={colours.kapraWhite}
              FColor={colours.kapraOrange}
              OnPress={async () => {
                await AsyncStorage.setItem('currentApp', 'BUYERZ'),
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'BuyerzHomeScreen' }],
                  })
              }
              }
              ButtonText={'K SHOPE'}
              ButtonWidth={44}
              ButtonHeight={5}
              Font2
            />
          </View>

          {/* Location Con  */}
          <View style={profile.isPrime === true ? [styles.headerSwitchContainer, { marginVertical: windowWidth * (3 / 100) }] : styles.headerSwitchContainer}>
            <PincodeChange fun={_fetchHomeData} Width={profile.isPrime === true ? 66 : 70} />
            <TouchableOpacity style={styles.searchConBtn}
              onPress={() => profile.groceryCustId ? navigation.navigate('GroReferralScreen') : Toast.show('Please Login!')}>
              {showIcon('share', colours.primaryWhite, windowWidth * (6 / 100))}
            </TouchableOpacity>
            {profile.isPrime !== true ? (<TouchableOpacity style={styles.searchConBtn} onPress={() => navigation.navigate('GroWishListScreen')}>
              {showIcon('heart', colours.primaryWhite, windowWidth * (6 / 100))}

              {GroWishCount > 0 && (
                <Badge value={GroWishCount} status="error" containerStyle={{ position: 'absolute', top: 5, right: 0 }} />
              )}
            </TouchableOpacity>
            ) : (<Image
              source={require('../../assets/images/primebadge.png')}
              style={{
                height: windowWidth * (16 / 100),
                width: windowWidth * (16 / 100),
                // resizeMode: 'contain',
              }} />
            )}

          </View>

          {/* Search Con  */}
          <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('GroSearchModalScreen')}>
            <View>{showIcon('search', colours.kapraBlackLow, windowWidth * (5 / 100))}</View>
            <Text style={styles.searchFont}>
              {'  '}Search products
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <Image
          source={{ uri: getImage(storeCloseImg) }}
          style={{
            width: windowWidth * (80 / 100),
            height: windowWidth * (80 / 100),
            marginTop: windowWidth * (20 / 100),
          }}
        />
        <Text style={[styles.fontStyle2, { textAlign: 'center', color: colours.primaryBlue }]}>{noStoreMsg}</Text>
        {
          appUpdateData && (
            <Modal
              animationType="slide"
              visible={updateModalVisible}
              transparent={true}
            >
              <View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)' }}>
                <View style={styles.updateModalView1}>
                  <Image
                    source={require('../../assets/logo/logo.png')}
                    style={{
                      height: windowWidth * (20 / 100),
                      width: windowWidth * (80 / 100),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text style={styles.headerText}>New version {appUpdateData.versionCode} available. Please update</Text>
                  <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-around' }}>
                    {
                      appUpdateData && appUpdateData.isCompulsory == false && (
                        <AuthButton
                          BackgroundColor={colours.primaryRed}
                          OnPress={() => { setUpdateModalVisible(false) }}
                          ButtonText={'Cancel'}
                          ButtonWidth={40}
                        />
                      )
                    }
                    <AuthButton
                      BackgroundColor={colours.primaryColor}
                      OnPress={() => { appUpdateData.app_url != "" ? Linking.openURL(appUpdateData.redirectUrl) : null, setUpdateModalVisible(false) }}
                      ButtonText={'Update'}
                      ButtonWidth={40}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )
        }
      </SafeAreaView>
    )
  }

  if (data == null) return (
    <SafeAreaView style={styles.mainContainer}>

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[colours.kapraOrangeLight, colours.kapraWhite]}
        style={{ width: windowWidth, alignItems: 'center' }}
      >
        {/* Switch Con  */}
        <View style={styles.appSwitchCon}>
          <AuthButton
            FirstColor={colours.kapraOrangeDark}
            SecondColor={colours.kapraOrange}
            OnPress={() => null}
            ButtonText={'K GROCERY'}
            ButtonWidth={44}
            ButtonHeight={5}
            Font2
          />
          <AuthButton
            FirstColor={colours.kapraWhite}
            SecondColor={colours.kapraWhite}
            FColor={colours.kapraOrange}
            OnPress={async () => {
              await AsyncStorage.setItem('currentApp', 'BUYERZ'),
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'BuyerzHomeScreen' }],
                })
            }
            }
            ButtonText={'K SHOPE'}
            ButtonWidth={44}
            ButtonHeight={5}
            Font2
          />
        </View>

        {/* Location Con  */}
        <View style={profile.isPrime === true ? [styles.headerSwitchContainer, { marginVertical: windowWidth * (3 / 100) }] : styles.headerSwitchContainer}>
          <PincodeChange fun={_fetchHomeData} Width={profile.isPrime === true ? 66 : 70} />
          <TouchableOpacity style={styles.searchConBtn}
            onPress={() => profile.groceryCustId ? navigation.navigate('GroReferralScreen') : Toast.show('Please Login!')}>
            {showIcon('share', colours.primaryWhite, windowWidth * (6 / 100))}
          </TouchableOpacity>
          {profile.isPrime !== true ? (<TouchableOpacity style={styles.searchConBtn} onPress={() => navigation.navigate('GroWishListScreen')}>
            {showIcon('heart', colours.primaryWhite, windowWidth * (6 / 100))}

            {GroWishCount > 0 && (
              <Badge value={GroWishCount} status="error" containerStyle={{ position: 'absolute', top: 5, right: 0 }} />
            )}
          </TouchableOpacity>
          ) : (<Image
            source={require('../../assets/images/primebadge.png')}
            style={{
              height: windowWidth * (16 / 100),
              width: windowWidth * (16 / 100),
              // resizeMode: 'contain',
            }} />
          )}

        </View>

        {/* Search Con  */}
        <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('GroSearchModalScreen')}>
          <View>{showIcon('search', colours.kapraBlackLow, windowWidth * (5 / 100))}</View>
          <Text style={styles.searchFont}>
            {'  '}Search products
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <SkeletonPlaceholder highlightColor={colours.lowBlue}>
        <View style={styles.bannerImage} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.lowBlue}>
        <View style={styles.carouselImageSK} />
        <Text />
        <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-between', marginLeft: windowWidth * (1 / 100), marginTop: windowHeight * (5 / 100) }}>
          <View>
            <View style={{ width: windowWidth * (25 / 100), height: windowWidth * (25 / 100), borderRadius: 5, marginBottom: 10 }} />
          </View>
          <View>
            <View style={{ width: windowWidth * (25 / 100), height: windowWidth * (25 / 100), borderRadius: 5, marginBottom: 10 }} />
          </View>
          <View>
            <View style={{ width: windowWidth * (25 / 100), height: windowWidth * (25 / 100), borderRadius: 5, marginBottom: 10 }} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-between', marginLeft: windowWidth * (2.5 / 100), marginTop: windowHeight * (5 / 100) }}>
          <View>
            <View style={{ width: windowWidth * (25 / 100), height: windowWidth * (25 / 100), borderRadius: 5 }} />
          </View>
          <View>
            <View style={{ width: windowWidth * (25 / 100), height: windowWidth * (25 / 100), borderRadius: 5 }} />
          </View>
          <View>
            <View style={{ width: windowWidth * (25 / 100), height: windowWidth * (25 / 100), borderRadius: 5 }} />
          </View>
        </View>
        <View style={styles.carouselImageSK} />
      </SkeletonPlaceholder>

      {
        appUpdateData && (
          <Modal
            animationType="slide"
            visible={updateModalVisible}
            transparent={true}
          >
            <View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)' }}>
              <View style={styles.updateModalView1}>
                <Image
                  source={require('../../assets/logo/logo.png')}
                  style={{
                    height: windowWidth * (20 / 100),
                    width: windowWidth * (80 / 100),
                    resizeMode: 'contain',
                  }}
                />
                <Text style={styles.headerText}>New version {appUpdateData.versionCode} available. Please update</Text>
                <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-around' }}>
                  {
                    appUpdateData && appUpdateData.isCompulsory == false && (
                      <AuthButton
                        BackgroundColor={colours.primaryRed}
                        OnPress={() => { setUpdateModalVisible(false) }}
                        ButtonText={'Cancel'}
                        ButtonWidth={40}
                      />
                    )
                  }
                  <AuthButton
                    BackgroundColor={colours.primaryColor}
                    OnPress={() => { appUpdateData.app_url != "" ? Linking.openURL(appUpdateData.redirectUrl) : null, setUpdateModalVisible(false) }}
                    ButtonText={'Update'}
                    ButtonWidth={40}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )
      }
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Switch Con  */}
      {
        headerShow ?
          null
          :
          <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('GroSearchModalScreen')}>
            <View>{showIcon('search', colours.kapraBlackLow, windowWidth * (5 / 100))}</View>
            <Text style={styles.searchFont}>
              {'  '}Search products
            </Text>
          </TouchableOpacity>
      }

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
        }
        contentContainerStyle={{ alignItems: 'center', width: windowWidth }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >


        {/* Image Slider  */}
        <View style={[styles.CarouselCon, { height: windowHeight * (51 / 100) }]}>
          {/* {console.log("data", data)} */}
          <Carousel
            autoplay
            data={data.MobileMainBanners}
            renderItem={_renderMainBanner}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            loop={true}
            layout={'stack'}
            enableSnap={true}
            scrollViewProps={{ decelerationRate: 'normal' }}
            autoplayInterval={4000}
            enableMomentum={true}
          />
          {/* {console.log('profile', profile)} */}
          <View style={{ position: 'absolute', width: windowWidth, alignItems: 'center' }}>

            {/* Switch  */}
            <View style={[styles.appSwitchCon, { backgroundColor: 'transparent', height: windowHeight * (6 / 100) }]}>
              <AuthButton
                FirstColor={colours.kapraOrangeDark}
                SecondColor={colours.kapraOrange}
                OnPress={() => null}
                ButtonText={'K GROCERY'}
                ButtonWidth={44}
                ButtonHeight={5}
                Font2
              />
              <AuthButton
                FirstColor={colours.kapraWhite}
                SecondColor={colours.kapraWhite}
                FColor={colours.kapraOrange}
                OnPress={async () => {
                  await AsyncStorage.setItem('currentApp', 'BUYERZ'),
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'BuyerzHomeScreen' }],
                    })
                }
                }
                ButtonText={'K SHOPE'}
                ButtonWidth={44}
                ButtonHeight={5}
                Font2
              />
            </View>
            {/* Location Con  */}
            <View style={profile.isPrime === true ? [styles.headerSwitchContainer, { marginVertical: windowWidth * (3 / 100) }] : styles.headerSwitchContainer}>
              <PincodeChange fun={_fetchHomeData} Width={profile.isPrime === true ? 66 : 70} />
              <TouchableOpacity style={styles.searchConBtn}
                onPress={() => profile.groceryCustId ? navigation.navigate('GroReferralScreen') : Toast.show('Please Login!')}>
                {showIcon('share', colours.primaryWhite, windowWidth * (6 / 100))}
              </TouchableOpacity>
              {profile.isPrime !== true ? (<TouchableOpacity style={styles.searchConBtn} onPress={() => navigation.navigate('GroWishListScreen')}>
                {showIcon('heart', colours.primaryWhite, windowWidth * (6 / 100))}

                {GroWishCount > 0 && (
                  <Badge value={GroWishCount} status="error" containerStyle={{ position: 'absolute', top: 5, right: 0 }} />
                )}
              </TouchableOpacity>
              ) : (<Image
                source={require('../../assets/images/primebadge.png')}
                style={{
                  height: windowWidth * (16 / 100),
                  width: windowWidth * (16 / 100),
                  // resizeMode: 'contain',
                }} />
              )}
            </View>

            {/* Search Con  */}
            <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('GroSearchModalScreen')}>
              <View>{showIcon('search', colours.kapraBlackLow, windowWidth * (5 / 100))}</View>
              <Text style={styles.searchFont}>
                {'  '}Search products
              </Text>
            </TouchableOpacity>

            {/* 20 Min Banner  */}
            <View style={styles.deliveryBannerCon}>
              <View>
                <Text style={[styles.fontStyle1, { color: colours.kapraWhite }]}>Fast <Text style={[styles.fontStyle1, { color: colours.kapraOrangeLight }]}>Delivery</Text> within</Text>
                <Text style={[styles.catNameFont, { color: colours.kapraOrangeLight, fontSize: getFontontSize(18) }]}>20 Minutes</Text>
              </View>
              <Text style={[styles.fontStyle1, { color: colours.kapraWhite }]}>Life Made Easier For You</Text>
            </View>

          </View>
        </View>

        {/* B coin dicount text  */}
        {
          bCoin && bCoin[0]?.BCoinBalance > 0 && (
            <View style={styles.bCoinDiscountCon}>
              <View style={{ width: windowWidth * (60 / 100) }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.iconCon}>{showIcon('timer', colours.kapraOrange, windowWidth * (3 / 100))}</View>
                  <Text style={[styles.searchFont, { color: colours.kapraOrange, fontSize: getFontontSize(12) }]}>Enjoy discount on your next order</Text>
                </View>
                <Text />
                <Text style={styles.fontStyle1}>You have {bCoin[0]?.BCoinBalance} B-Coins in your Wallet,</Text>
                <Text style={styles.fontStyle2}>Use them at Checkout.</Text>
              </View>
              <View style={styles.bCoinDiscountConImg}>
                <Image
                  source={require('../../assets/images/coin.png')}
                  style={styles.coinImg}
                />
              </View>
            </View>
          )
        }

        {/* ReOrder Con  */}
        {
          orderHistory && orderHistory.length > 0 && (
            <>
              <View style={styles.headerNameCon}>
                <Text style={[styles.fontStyle1, { fontSize: getFontontSize(16) }]}>Buy It Again</Text>
              </View>

              <View style={{ alignItems: 'flex-start', width: windowWidth }}>
                <FlatList
                  data={orderHistory}
                  horizontal
                  renderItem={({ item, index }) => (
                    <View style={styles.orderCon}>
                      <View style={styles.orderCon1}>
                        <View style={{
                          width: windowWidth * (25 / 100),
                          flexDirection: 'row'
                        }}>
                          <View style={styles.orderItemImg}>
                            <Image
                              style={styles.orderImg}
                              source={{ uri: getImage(JSON.parse(item?.orderedProductImgUrls)[0]?.imageUrl) }}
                            />
                          </View>
                          {
                            JSON.parse(item?.orderedProductImgUrls)?.length > 1 && (
                              <View style={[styles.orderItemImg, { left: windowWidth * (3 / 100), position: 'absolute' }]}>
                                <Image
                                  style={styles.orderImg}
                                  source={{ uri: getImage(JSON.parse(item?.orderedProductImgUrls)[1]?.imageUrl) }}
                                />
                              </View>
                            )
                          }
                          {
                            JSON.parse(item?.orderedProductImgUrls)?.length > 2 && (
                              <View style={[styles.orderItemImg, { left: windowWidth * (6 / 100), position: 'absolute' }]}>
                                <Image
                                  style={styles.orderImg}
                                  source={{ uri: getImage(JSON.parse(item?.orderedProductImgUrls)[2]?.imageUrl) }}
                                />
                              </View>
                            )
                          }
                          {
                            JSON.parse(item?.orderedProductImgUrls)?.length > 3 && (
                              <View style={[styles.orderItemImg, { left: windowWidth * (9 / 100), position: 'absolute' }]}>
                                <Text style={styles.fontStyle4}>+{(JSON.parse(item?.orderedProductImgUrls)?.length) - 3} item(s)</Text>
                              </View>
                            )
                          }
                        </View>
                        {/*  */}
                        {/* <View style={[styles.orderItemImg,{left: -windowWidth*(16/100)}]}>
                          </View>*/}
                        <View style={{ width: windowWidth * (16 / 100) }}>
                          <Text style={styles.orderFont1}>Order ID</Text>
                          <Text numberOfLines={1} style={[styles.orderFont2, { width: windowWidth * (16 / 100) }]}>#{item.orderNumber}</Text>
                          <Text style={styles.orderFont1}>Date</Text>
                          <Text style={styles.orderFont2}>{moment(item.orderDate).utcOffset('+05:30').format('DD MMM YYYY')}</Text>
                        </View>
                      </View>
                      <View style={styles.orderCon2}>
                        <Text style={styles.orderFont1}>Delivered</Text>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => ReOrder(item.orderId)}>
                          <Text style={[styles.orderFont1, { color: colours.kapraWhite }]}>Reorder</Text>
                        </TouchableOpacity>

                      </View>

                    </View>
                  )}
                  ItemSeparatorComponent={<View style={{ width: 10 }} />}
                  keyExtractor={(item, i) => i.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: windowWidth * (5 / 100) }}

                />
              </View>
            </>
          )
        }

        {/* Categories  */}
        {
          categoryData && categoryData.length > 0 &&
          categoryData.map((item) => (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              {/* <TouchableOpacity style={styles.headerNameCon} onPress={()=>navigation.navigate('GroSearchScreen',{catUrlKey:item?.catUrlKey})}>
                  <Text style={styles.catNameFont}>{item.mainCatName}</Text>
                  <Text style={styles.seeAllFont}>See All</Text>
                </TouchableOpacity> */}
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={JSON.parse(item?.SubCategories_JSON)}
                numColumns={4}
                columnWrapperStyle={{ justifyContent: 'flex-start' }}
                renderItem={({ item, index }) => (
                  <CategoryGrid
                    title={item.subCatName}
                    image={item.subCatImage}
                    index={index}
                    Nav={() => {
                      // console.log("I : ", item)
                      navigation.navigate('GroSearchScreen', { catUrlKey: item?.subCatUrlKey })
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ))
        }

        {/* Top Deals  */}
        {
          topdealProducts && topdealProducts.length > 0 && (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/deals.png')}
                style={[styles.headerNameCon, { resizeMode: 'contain' }]}
              />
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={topdealProducts.slice(0, 8)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Latest Product */}
        {
          latestArrivalData && latestArrivalData.length > 0 && (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Latest Product</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={latestArrivalData.slice(0, 4)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                ListFooterComponent={
                  <TouchableOpacity style={styles.viewAllFooterCon} onPress={() => navigation.navigate('GroCategoryArchiveScreen', { type: 'Latest Arrival' })}>
                    <View style={styles.ViewAllItemImg}>
                      <Image
                        source={{ uri: getImage(latestArrivalData[0]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <View style={[styles.ViewAllItemImg, { left: -windowWidth * (4 / 100) }]}>
                      <Image
                        source={{ uri: getImage(latestArrivalData[1]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <View style={[styles.ViewAllItemImg, { left: -windowWidth * (8 / 100) }]}>
                      <Image
                        source={{ uri: getImage(latestArrivalData[3]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <Text style={[styles.fontStyle1, { left: -windowWidth * (6 / 100) }]}>See All Products</Text>

                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Banner 1  */}
        <View style={styles.CarouselCon}>
          <Carousel
            autoplay
            data={data.OfferZone12}
            renderItem={_renderMainBanner1}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            loop={true}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
          />
        </View>

        {/* Featured Product  */}
        {
          featuredData && featuredData.length > 0 && (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Featured Product</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={featuredData.slice(0, 4)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                ListFooterComponent={
                  <TouchableOpacity style={styles.viewAllFooterCon} onPress={() => navigation.navigate('GroCategoryArchiveScreen', { type: 'Featured Product' })}>
                    <View style={styles.ViewAllItemImg}>
                      <Image
                        source={{ uri: getImage(featuredData[0]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <View style={[styles.ViewAllItemImg, { left: -windowWidth * (4 / 100) }]}>
                      <Image
                        source={{ uri: getImage(featuredData[1]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <View style={[styles.ViewAllItemImg, { left: -windowWidth * (8 / 100) }]}>
                      <Image
                        source={{ uri: getImage(featuredData[3]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <Text style={[styles.fontStyle1, { left: -windowWidth * (6 / 100) }]}>See All Products</Text>

                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Banner 2  */}
        <View style={styles.CarouselCon}>
          <Carousel
            autoplay
            data={data.MobilePromoFull}
            renderItem={_renderMainBanner1}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            loop={true}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
          />
        </View>

        {/* Popular Product  */}
        {
          popularData && popularData.length > 0 && (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Popular Products</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={popularData.slice(0, 4)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                ListFooterComponent={
                  <TouchableOpacity style={styles.viewAllFooterCon} onPress={() => navigation.navigate('GroCategoryArchiveScreen', { type: 'Popular Product' })}>
                    <View style={styles.ViewAllItemImg}>
                      <Image
                        source={{ uri: getImage(popularData[0]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <View style={[styles.ViewAllItemImg, { left: -windowWidth * (4 / 100) }]}>
                      <Image
                        source={{ uri: getImage(popularData[1]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <View style={[styles.ViewAllItemImg, { left: -windowWidth * (8 / 100) }]}>
                      <Image
                        source={{ uri: getImage(popularData[3]?.imageUrl) }}
                        style={styles.viewAllImgStyle}
                      />
                    </View>
                    <Text style={[styles.fontStyle1, { left: -windowWidth * (6 / 100) }]}>See All Products</Text>

                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Banner 3 */}
        <View style={styles.CarouselCon}>
          <Carousel
            autoplay
            data={data.NewArrivals}
            renderItem={_renderMainBanner1}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            loop={true}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
          />
        </View>


        {/* Recommended Products  */}
        {
          recommendedProducts && recommendedProducts.length > 0 && (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Recommended Products</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={recommendedProducts.slice(0, 6)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Banner 4 */}
        <View style={styles.CarouselCon}>
          <Carousel
            autoplay
            data={data.MustTryProducts}
            renderItem={_renderMainBanner1}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            loop={true}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
          />
        </View>

        {/* Recently Viewed Products  */}
        {
          recentData && recentData.length > 0 && (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Recently Viewed Products</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={recentData.slice(0, 6)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )
        }

        {/* Banner 5 */}
        <View style={styles.CarouselCon}>
          <Carousel
            autoplay
            data={data.SpecialOffers}
            renderItem={_renderMainBanner1}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            loop={true}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
          />
        </View>


        {/* Hot Deals on brands */}
        {
          brandOffersData && brandOffersData.slice(0, 15).map((items, i) => (
            <View style={{ width: windowWidth, alignItems: 'center' }}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Hot Deals On {items?.brandName}</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{ width: 10 }} />}
                data={items?.product?.slice(0, 4)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson ? item.variationJson : null}
                    GotoCart={() => navigation.navigate("GroCartScreen")}
                    URLKey={item.urlKey}
                    StockAvailability={item.stockAvailability}
                    ProductID={item.productId}
                    BGColor={colours.lowWhite}
                    NoBlur
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
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ))
        }

        {/* Feedback */}
        <TouchableOpacity onPress={() => navigation.navigate('GroWriteToUsScreen')}>
          <FastImage
            style={{ width: windowWidth, height: windowWidth * (45 / 100), marginTop: 15 }}
            source={require('../../assets/images/SugPro.png')}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>

      </ScrollView>

      {/* Cart Con  */}
      <FooterCart navigation={navigation} />

      {/* App Update  */}
      {
        appUpdateData && (
          // <Modal
          //   animationType="slide"
          //   visible={updateModalVisible}
          //   transparent={true}
          // >
          //   <BlurView
          //     style={styles.blurStyle}
          //     blurType="light"
          //     blurAmount={1}
          //     overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
          //     reducedTransparencyFallbackColor='black'
          //   />
          //   <View style={styles.updateModalView1}>
          //     <Image
          //       source={require('../../assets/logo/logo.png')}
          //       style={{
          //         height: windowWidth * (20 / 100),
          //         width: windowWidth * (80 / 100),
          //         resizeMode: 'contain',
          //       }}
          //     />
          //     <Text style={[styles.fontStyle2, { color: colours.primaryBlack }]}>New version {appUpdateData.versionCode} available. Please update</Text>
          //     <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-around' }}>
          //       {
          //         appUpdateData && appUpdateData.isCompulsory == false && (
          //           <AuthButton
          //             FirstColor={colours.kapraRed}
          //             SecondColor={colours.kapraRedLow}
          //             OnPress={() => { setUpdateModalVisible(false) }}
          //             ButtonText={'Cancel'}
          //             ButtonWidth={40}
          //             ButtonHeight={5}
          //           />
          //         )
          //       }
          //       <AuthButton
          //         FirstColor={colours.kapraOrangeDark}
          //         SecondColor={colours.kapraOrange}
          //         OnPress={() => { appUpdateData.app_url != "" ? Linking.openURL(appUpdateData.redirectUrl) : null, setUpdateModalVisible(false) }}
          //         ButtonText={'Update'}
          //         ButtonHeight={5}
          //         ButtonWidth={appUpdateData && appUpdateData.isCompulsory == false ? 40 : 90}
          //       />
          //     </View>
          //   </View>
          // </Modal>
          <Modal
            animationType="slide"
            visible={updateModalVisible}
            transparent={true}
          >
            <BlurView
              style={styles.blurStyle}
              blurType="light"
              blurAmount={1}
              overlayColor={Platform.OS === 'ios' ? undefined : 'transparent'}
              reducedTransparencyFallbackColor="black"
            />

            {/* ✅ Bottom-aligned modal container */}
            <View style={[styles.updateModalView1, { overflow: 'visible', zIndex: 1000, elevation: 5, bottom: 0 }]}>
              <Image
                source={require('../../assets/logo/logo.png')}
                style={{
                  height: windowWidth * 0.2,
                  width: windowWidth * 0.8,
                  resizeMode: 'contain',
                }}
              />

              <Text
                style={[
                  styles.fontStyle2,
                  { color: colours.primaryBlack, textAlign: 'center', paddingHorizontal: 20 },
                ]}
              >
                New version {appUpdateData.versionCode} available. Please update
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidth * 0.9,
                  justifyContent: 'space-around',
                  overflow: 'visible', // ✅ prevents button clipping
                  marginBottom: windowHeight * 0.03, // ✅ ensures visibility
                }}
              >
                {appUpdateData && appUpdateData.isCompulsory === false && (
                  <AuthButton
                    FirstColor={colours.kapraRed}
                    SecondColor={colours.kapraRedLow}
                    OnPress={() => setUpdateModalVisible(false)}
                    ButtonText="Cancel"
                    ButtonWidth={40}
                    ButtonHeight={5}
                  />
                )}

                <AuthButton
                  FirstColor={colours.kapraOrangeDark}
                  SecondColor={colours.kapraOrange}
                  OnPress={() => {
                    if (appUpdateData.app_url !== '') Linking.openURL(appUpdateData.redirectUrl);
                    setUpdateModalVisible(false);
                  }}
                  ButtonText="Update"
                  ButtonHeight={5}
                  ButtonWidth={
                    appUpdateData && appUpdateData.isCompulsory === false ? 40 : 90
                  }
                />
              </View>
            </View>
          </Modal>

        )
      }

      {/* Store Close  */}
      <Modal
        animationType="slide"
        visible={storeCloseModalVisible}
        transparent={true}
      >
        <View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)' }}>
          <View style={[styles.updateModalView1, { height: windowHeight * 0.75, marginTop: windowHeight * 0.25, flex: 1, alignItems: 'center', justifyContent: "space-evenly" }]}>
            <Image
              source={{ uri: getImage(storeCloseImg) }}
              style={{
                height: windowWidth * (80 / 100),
                width: windowWidth * (80 / 100),
                resizeMode: 'contain',
              }}
            />
            <Text style={[styles.fontStyle3, { textAlign: "center" }]} numberOfLines={4}>{storeCloseMsg}</Text>
            <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-around' }}>
              <AuthButton
                FirstColor={colours.kapraOrangeDark}
                SecondColor={colours.kapraOrange}
                OnPress={() => { setStoreCloseModalVisible(false) }}
                ButtonText={'Close'}
                ButtonWidth={90}
                ButtonHeight={5}
              />
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

export default GroHomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.kapraWhite
  },
  appSwitchCon: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth * (5 / 100),
  },
  CarouselCon: {
    height: windowWidth * (55 / 100),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  bannerImage: {
    width: windowWidth,
    height: windowWidth * (50 / 100),
    marginVertical: windowWidth * (5 / 100),
  },
  bCoinDiscountCon: {
    width: windowWidth * (90 / 100),
    padding: windowWidth * (2.5 / 100),
    flexDirection: 'row',
    backgroundColor: colours.kapraOrangeLow,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  bCoinDiscountConImg: {
    width: windowWidth * (20 / 100),
    height: windowWidth * (20 / 100),
    borderRadius: windowWidth * (10 / 100),
    backgroundColor: colours.kapraRedLow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconCon: {
    width: windowWidth * (5 / 100),
    height: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  coinImg: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
  },
  viewAllFooterCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (4 / 100),
    backgroundColor: colours.kapraWhiteLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  ViewAllItemImg: {
    width: windowWidth * (7 / 100),
    height: windowWidth * (7 / 100),
    borderRadius: windowWidth * (4 / 100),
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
  },
  viewAllImgStyle: {
    width: windowWidth * (5 / 100),
    height: windowWidth * (5 / 100),
    borderRadius: windowWidth * (5 / 100),
    resizeMode: 'contain'
  },
  footerCartCon: {
    width: windowWidth * (50 / 100),
    height: windowHeight * (6 / 100),
    backgroundColor: colours.kapraOrangeLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: windowHeight * (3 / 100),
    paddingHorizontal: windowWidth * (2 / 100)
  },
  footerCartItemImg: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (6 / 100),
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
  },
  footerCartImgStyle: {
    width: windowWidth * (7 / 100),
    height: windowWidth * (7 / 100),
    borderRadius: windowWidth * (5 / 100),
    resizeMode: 'contain'
  },
  deliveryBannerCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: windowHeight * (1 / 100),
  },
  // blurStyle: {
  //   width: windowWidth,
  //   height: windowHeight,
  //   position: 'absolute',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: null,
  //   overflow: 'hidden'
  // },
  blurStyle: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // ✅ avoid null value
    overflow: 'visible', // ✅ fixes blur overlay hiding elements
  },

  // Order 
  orderCon: {
    width: windowWidth * (50 / 100),
    height: windowHeight * (15 / 100),
    borderRadius: 5,
    borderColor: colours.kapraWhiteLow,
    backgroundColor: colours.kapraGreenLow,
    borderWidth: 1
  },
  orderCon1: {
    width: windowWidth * (50 / 100),
    height: windowHeight * (9 / 100),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: windowWidth * (1 / 100),
    borderColor: colours.kapraWhiteLow,
    borderBottomWidth: 1
  },
  orderCon2: {
    width: windowWidth * (50 / 100),
    height: windowHeight * (6 / 100),
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: windowWidth * (2 / 100),
  },
  orderItemImg: {
    width: windowWidth * (12 / 100),
    height: windowWidth * (12 / 100),
    borderRadius: windowWidth * (12 / 100),
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
  },
  orderImg: {
    width: windowWidth * (11 / 100),
    height: windowWidth * (11 / 100),
    borderRadius: windowWidth * (10 / 100),
    backgroundColor: colours.kapraWhite,
  },
  orderFont1: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    color: colours.kapraBlack,
  },
  orderFont2: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(10),
    color: colours.kapraBlackLow,
  },
  buttonStyle: {
    width: windowWidth * (20 / 100),
    height: windowHeight * (3.5 / 100),
    backgroundColor: colours.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  headerNameCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (8 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },



  // Fonts Styles
  searchFont: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraBlackLight
  },
  fontStyle1: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    color: colours.kapraBlack
  },
  fontStyle2: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(12),
    color: colours.kapraBlackLow
  },
  catNameFont: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(14),
    color: colours.kapraBlack

  },
  seeAllFont: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(13),
    color: colours.kapraOrange
  },




  headerSwitchContainer: {
    width: windowWidth,
    height: windowHeight * (5 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth * (5 / 100),
    // marginVertical: windowWidth * (3 / 100)
  },
  headerSwitch: {
    width: windowWidth * (43 / 100),
    height: windowHeight * (5 / 100),
    backgroundColor: colours.lowBlue,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerSwitchImage: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (25 / 100),
    resizeMode: 'contain',
  },
  searchContainer: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    marginVertical: windowHeight * (1 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowWidth * (3 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
  },
  searchConBtn: {
    width: windowWidth * (10 / 100),
    height: windowHeight * (5 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationContainer: {
    height: windowHeight * (4 / 100),
    paddingVertical: 0,
    width: windowWidth * (30 / 100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotStyle: {
    width: 20,
    height: 7,
    borderRadius: 5,
    marginHorizontal: -5,
    backgroundColor: colours.kapraMain,
  },
  updateModalView1: {
    height: windowHeight * (35 / 100),
    marginTop: windowHeight * (65 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderWidth: 2,
    borderColor: colours.lowWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: colours.primaryBlue,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  locationCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colours.lowBlue,
    marginTop: 10,
    borderRadius: 5
  },
  fontStyle3: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlack
  },
  fontStyle4: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(8),
    color: colours.kapraBlack,
    textAlign: 'center'
  },
});




const resolveF__kingCode = (DATA) => {
  let parent = DATA.filter((cat) => cat.code && cat.code.split('#').length === 2);
  let children = resolveF__kingCode2(DATA);
  let arr = [];
  parent.map((parCat) => {
    parCat.children = [];
    children.map((chCat) => {
      if (chCat.code.split('#')[1] == parCat.catId) parCat.children.push(chCat);
    });
    arr.push(parCat);
  });
  return arr;
};

const resolveF__kingCode2 = (DATA) => {
  let parent = DATA.filter((cat) => cat.code && cat.code.split('#').length === 3);
  let children = DATA.filter((cat) => cat.code && cat.code.split('#').length === 4);
  let arr1 = [];
  parent.map((parCat) => {
    parCat.grchildern = [];
    children.map((chCat) => {
      if (chCat.code.split('#')[2] == parCat.catId) parCat.grchildern.push(chCat);
    });
    arr1.push(parCat);
  });
  return arr1;
};