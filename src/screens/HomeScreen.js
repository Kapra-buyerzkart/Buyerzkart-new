/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  Linking,
  Share,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Header from '../components/Header';
import colours from '../globals/colours';
import { getImage, getFontontSize } from '../globals/functions';
import showIcon from '../globals/icons';
import ProductCard from '../components/ProductCard';
import {
  getHomeData, getBrandList, shopByCategory, getCategoryArchive, getLatestArrival, getRecentProducts, getRecommendedProducts, updateCheck, offerZoneData, getCategoryOffer, postReferral, getPolicies} from '../api';
import { AppContext } from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import PincodeChange from '../components/PincodeChange';
import FastImage from 'react-native-fast-image'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import LinearGradient from 'react-native-linear-gradient';
import AuthButton from '../components/AuthButton';
import DeviceInfo from 'react-native-device-info';
import LoginTextInput from '../components/LoginTextInput';
import BrandCard from '../components/BrandCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {

  const [ carouselIndex, setCarouselIndex ] = React.useState(0);
  const [ carouselIndex1, setCarouselIndex1 ] = React.useState(0);
  const [ carouselIndex2, setCarouselIndex2 ] = React.useState(0);

  const [ shareModal, setShareModal ] = React.useState(false);
  const { profile } = React.useContext(AppContext);

  const [data, setData] = React.useState(null);
  const [offerData, setOfferData] = React.useState(null);
  const [offerCategory, setOfferCategory] = React.useState(null);
  const [categoryData, setCategoryData] = React.useState(null);
  const [dealData, setDealData] = React.useState(null);
  const [popularData, setPopularData] = React.useState(null);
  const [recentData, setRecentData] = React.useState(null);
  const [featuredData, setFeaturedData] = React.useState(null);
  const [brandsData, setBrandsData] = React.useState(null);
  const [latestArrivalData, setLatestArrivalData] = React.useState(null);
  const [recommendedProducts, setRecommendedProducts] = React.useState(null);
  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [appUpdateData, setAppUpdateData] = React.useState(null);
  const [policy, setPolicy] = React.useState([]);
  const [dummy, setDummy] = React.useState(true);

  const [phone, setPhone] = React.useState('');
  const [PhoneError, setPhoneError] = React.useState(false);
  const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Share & Earn',
        message: `${policy&&policy.length>0&&policy.find((item)=>item.stName == 'referMsg')?policy.find((item)=>item.stName == 'referMsg').stValue:''}
        
        https://kapradaily.com/refer/regrefer?custrefcd=${profile.referralCode}`
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
      setShareModal(false)
    } catch (error) {
      // Alert(error.message);
        setShareModal(false)
    }
  };


  let onpress = (item) => {
    if (item.mob_type === 'Category') {
      navigation.navigate('SearchScreen', {
        catUrlKey: item.mob_urlKey,
      });
    } else if (item.mob_type === 'Product') {
      navigation.navigate('SingleItemScreen', {
        UrlKey: item.mob_urlKey,
      });
    } else if (item.mob_type === 'Brand') {
      navigation.navigate('SearchScreen', {
        filterValue: item.mob_urlKey
      });
    }
  };

  const _fetchHomeData = async () => {
    fetchHomeBannersData();
    featuredProductsData();
    popularProductData();
    latestArrivalDatas();
    brandListData();
    categoryListData();
    recentProductsData();
    recommendedProductsData();
    // offerCategoryData();

    // dealofthedayData();
    // _offerZoneData();
    
    setTimeout(AppUpdateCheck, 10000);
  };

  const AppUpdateCheck = async() => {
    try{
      let res3 = await updateCheck(DeviceInfo.getVersion(),Platform.OS === 'ios'? 'ios' : "android", "Customer");
      setAppUpdateData(res3);
      if(res3.versionCode != DeviceInfo.getVersion()){
        setUpdateModalVisible(true);
      }
    } catch(err){
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
      let res7 = await getLatestArrival('LatestArrival');
      setLatestArrivalData(res7);
    } catch (err) {
    }
  }

  const brandListData = async () => {
    try {
      let res6 = await getBrandList();
      setBrandsData(res6);
    } catch (err) {
    }
  }
 
  const categoryListData = async () => {
    try {
      let res1 = await shopByCategory();
      setCategoryData(resolveF__kingCode(res1));
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
 
  const recommendedProductsData = async () => {
    try {
      let res1 = await getRecommendedProducts();
      setRecommendedProducts(res1);
    } catch (err) {
    }
  }
  
  const offerCategoryData = async () => {
    try {
      let arr = {};
      let res1 = await offerZoneData();
      setOfferCategory(res1.TopCategories);
      res1 && res1.TopCategories && res1.TopCategories.slice(0,10).map( async(item,index)=>{
        let res2 = await getCategoryOffer(item.catUrlKey);
        let key = item.catUrlKey;
        let value = res2;
        arr[key] = value;
        if(index === 9){
          setOfferData(arr)
        }
      })
    } catch (err) {
    }
  }
 
  const fetchHomeBannersData = async () => {
    try {
      // showLoader(true);
      let res = await getHomeData();
      setData(res);
      setDummy(!dummy)
      // showLoader(false);
    } catch (err) {
      // showLoader(false);
    }
  }

  const addReferral = async() => {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(!phone.match(phoneno)){
    setPhoneError(true)
    } else{
    try {
        let res = await postReferral({
          referredNumber: phone,
          referralId: profile.bkCustId
        });
        Toast.show('New Referral Added Successfully')
        setPhone('');
        onShare();
    } catch(err){
        Toast.show(err)
        setPhone('');
        setShareModal(false)
    }
    }
  }


  React.useEffect(() => {
    _fetchHomeData();
    const effect = async () => {
      let res = await getPolicies();
      setPolicy(res);
    };
    effect();
  }, []);

  const _renderMainBanner = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onpress(item)}
      >
        <FastImage
            style={styles.bannerImage}
            source={{
                uri: getImage(item.imageUrl),
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
        />
      </TouchableOpacity>
    );
  };

  const _renderLatestBanner = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onpress(item)}
      >
        <FastImage
            style={styles.latestBannerImage}
            source={{
                uri: getImage(item.imageUrl),
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
        />
      </TouchableOpacity>
    );
  };

  const _renderMustTryBanner = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onpress(item)}
      >
        <FastImage
            style={styles.mustTryBannerImage}
            source={{
                uri: getImage(item.imageUrl),
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
        />
      </TouchableOpacity>
    );
  };


  if (data === null || categoryData === null) return (
    <SafeAreaView style={styles.mainContainer}>    
      <View style={styles.headerSwitchContainer}>
        <View style={[styles.headerSwitch,{backgroundColor:colours.primaryGreen}]}>
          {/* <Image
            source={require('../assets/logo/logo.png')}
            style={styles.headerSwitchImage}
          /> */}
          <Text style={styles.headerFont}>K SHOPE</Text>
        </View>
        <TouchableOpacity 
          style={[styles.headerSwitch,{backgroundColor:colours.kapraLight}]} 
          onPress={async()=>{
            await AsyncStorage.setItem('currentApp', 'GROCERY'),
            navigation.reset({
              index: 0,
              routes: [{ name: 'GroceryHome' }],
            })
          }
        }>
          <Text style={styles.headerFont}>K GROCERY</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.sideNavCon}
        >
          <View style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
          }}>
            {showIcon('sidemenu', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBox} onPress={()=>navigation.navigate("SearchModalScreen")}>
          <View
            style={{
              height: windowHeight*(5.5/100),
              width: windowWidth*(10/100),
              marginLeft: windowWidth*(5/100),
            }}>
            {showIcon('search', colours.lowBlue, windowWidth * (5 / 100))}
          </View>
          <Text style={styles.fontSearch}>Search products</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.searchContainer}>
        <PincodeChange fun={_fetchHomeData} />
        <TouchableOpacity 
          onPress={() => profile.bkCustId? navigation.navigate('ReferralScreen'):Toast.show('Please Login!')}
          style={[styles.sideNavCon,{alignItems:'flex-end'}]}
        >
          <View style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
          }}>
            {showIcon('share', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('WishList')}
          style={[styles.sideNavCon,{alignItems:'flex-end'}]}
        >
          <View style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
          }}>
            {showIcon('heart', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
      </View>
      <SkeletonPlaceholder highlightColor={colours.lowBlue}>
        <View style={styles.carouselImageSK}/>
        <Text/>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent: 'space-between', marginLeft: windowWidth*(1/100), marginTop: windowHeight*(5/100)}}>
          <View>
            <View style={{width: windowWidth*(25/100), height: windowWidth*(25/100), borderRadius: windowWidth*(25/100), marginBottom: 10}} />
          </View>
          <View>
            <View style={{width: windowWidth*(25/100), height: windowWidth*(25/100), borderRadius: windowWidth*(25/100), marginBottom: 10}} />
          </View>
          <View>
            <View style={{width: windowWidth*(25/100), height: windowWidth*(25/100), borderRadius: windowWidth*(25/100), marginBottom: 10}} />
          </View>
        </View>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent: 'space-between', marginLeft: windowWidth*(2.5/100), marginTop: windowHeight*(5/100)}}>
          <View>
            <View style={{width: windowWidth*(25/100), height: windowWidth*(25/100), borderRadius: windowWidth*(25/100)}} />
          </View>
          <View>
            <View style={{width: windowWidth*(25/100), height: windowWidth*(25/100), borderRadius: windowWidth*(25/100)}} />
          </View>
          <View>
            <View style={{width: windowWidth*(25/100), height: windowWidth*(25/100), borderRadius: windowWidth*(25/100)}} />
          </View>
        </View>
        <View style={styles.carouselImageSK}/>
      </SkeletonPlaceholder>

    </SafeAreaView>
  );
  return (
    <SafeAreaView style={styles.mainContainer}>

      <View style={styles.headerSwitchContainer}>
        <View style={[styles.headerSwitch,{backgroundColor:colours.primaryGreen}]}>
          {/* <Image
            source={require('../assets/logo/logo.png')}
            style={styles.headerSwitchImage}
          /> */}
          <Text style={styles.headerFont}>K SHOPE</Text>
        </View>
        <TouchableOpacity 
          style={[styles.headerSwitch,{backgroundColor:colours.kapraLight}]} 
          onPress={async()=>{
            await AsyncStorage.setItem('currentApp', 'GROCERY'),
            navigation.reset({
              index: 0,
              routes: [{ name: 'GroceryHome' }],
            })
          }
        }>
          <Text style={styles.headerFont}>K GROCERY</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.sideNavCon}
        >
          <View style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
          }}>
            {showIcon('sidemenu', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBox} onPress={()=>navigation.navigate("SearchModalScreen")}>
          <View
            style={{
              height: windowHeight*(5.5/100),
              width: windowWidth*(10/100),
              marginLeft: windowWidth*(5/100),
            }}>
            {showIcon('search', colours.lowBlue, windowWidth * (5 / 100))}
          </View>
          <Text style={styles.fontSearch}>Search products</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.searchContainer}>
        <PincodeChange fun={_fetchHomeData} />
        <TouchableOpacity 
          onPress={() => profile.bkCustId? navigation.navigate('ReferralScreen'):Toast.show('Please Login!')}
          style={[styles.sideNavCon,{alignItems:'flex-end'}]}
        >
          <View style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
          }}>
            {showIcon('share', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('WishList')}
          style={[styles.sideNavCon,{alignItems:'flex-end'}]}
        >
          <View style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
          }}>
            {showIcon('heart', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
      </View>

      {Object.keys(data).length === 0 ? null : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
          }
          contentContainerStyle={{alignItems:'center'}}
        >
          <Carousel
            autoplay
            data={data.MobileMainBanners}
            // data={data.Promo31}
            renderItem={_renderMainBanner}
            sliderWidth={windowWidth}
            itemWidth={windowWidth*(85/100)}
            loop={true}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
            onSnapToItem={(index) => setCarouselIndex(index)}
          />
          {
            data && data.MobileMainBanners && data.MobileMainBanners.length > 1 &&(
              <Pagination
                dotsLength={data.MobileMainBanners.length}
                activeDotIndex={carouselIndex}
                containerStyle={{
                  height: windowHeight*(6/100),
                  paddingVertical:0,
                  width: windowWidth*(30/100),
                  justifyContent:'center',
                  alignItems:'center',
                }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: -10,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
              />
            )
          }

          {
            categoryData && categoryData.length > 0 && (
              <View style={styles.categoryContainer}>
                <View style={[styles.categoryHeaderContainer,{borderBottomWidth:2, borderBottomColor: colours.lowWhite, paddingBottom:5}]}>
                  <TouchableOpacity style={styles.shareButton} onPress={()=>  profile.bkCustId? setShareModal(true): Toast.show('Please Login!')}>
                    <View>{showIcon('share', colours.primaryWhite, windowWidth * (4 / 100))}</View>
                    <Text style={[styles.fontStyle1,{width: windowWidth*(20/100),  paddingLeft:2}]} numberOfLines={1}>Refer a friend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton} onPress={()=>  profile.bkCustId? navigation.navigate('BCoinScreen'): Toast.show('Please Login!')}>
                    <View>{showIcon('wallet', colours.primaryWhite, windowWidth * (4 / 100))}</View>
                    <Text style={styles.fontStyle1}>  Wallet </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton} onPress={()=> onShare()}>
                    <View>{showIcon('whatsapp', colours.primaryWhite, windowWidth * (4 / 100))}</View>
                    <Text style={styles.fontStyle1}>  Share </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  contentContainerStyle={{width: windowWidth*(84/100),}}
                  columnWrapperStyle={{justifyContent: "space-between"}}
                  showsHorizontalScrollIndicator={false}
                  data={categoryData.slice(0,12)}
                  numColumns={4}
                  renderItem={({ item }, i) => (
                    <TouchableOpacity style={styles.categoryItemContainer} onPress={()=>navigation.navigate('CategoryScreen',{categoryData:item, Categories: categoryData})}>
                      <View style={styles.categoryImageContainer}>
                        <FastImage
                          style={{width: windowWidth*(18/100), height: windowWidth*(18/100), borderRadius: windowWidth*(2/100)}}
                          source={{
                            uri: getImage(item.imageUrl),
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                      <View style={styles.categoryNameContainer}>
                        <Text style={[styles.headerText,{fontSize: getFontontSize(13), color: colours.primaryBlue, textAlign:'center'}]} numberOfLines={2}>{item.catName}</Text>
                      </View>

                    </TouchableOpacity>
                    )}
                  keyExtractor={(item, i) => i.toString()}
                />
              </View>
            )
          }

          {
            popularData&&popularData.length>0&&(
              <>
                <View style={styles.headerView}>
                  <Text style={styles.headerText}>Popular Products</Text>
                  <TouchableOpacity style={styles.seeMoreContainer} onPress={()=> navigation.navigate('CategoryArchive',{type:'Popular Product'})}>
                    <Text style={[styles.fontStyle1,{color: colours.primaryGrey}]}>See More </Text>
                    <View>{showIcon('rightarrow', colours.primaryGrey, windowWidth * (4 / 100))}</View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  contentContainerStyle={styles.flatlistContainer}
                  showsHorizontalScrollIndicator={false}
                  data={popularData.slice(0,10)}
                  horizontal
                  renderItem={({ item }, i) => (
                    <ProductCard
                      Name={item.prName}
                      Image={item.imageUrl}
                      Price={item.unitPrice}
                      SpecialPrice={item.specialPrice}
                      ProductWeight={item.prWeight}
                      BTValue={item?.bvValue?item.bvValue:0}
                      Variations={item.variationJson?item.variationJson:null}
                      GotoCart={()=>navigation.navigate("CartScreen")}
                      URLKey={item.urlKey}
                      StockAvailability={item.stockAvailability}
                      ProductID={item.productId}
                      BGColor={colours.lowWhite}
                      OnPress={() => {
                        if (item.urlKey !== null) {
                          navigation.navigate('SingleItemScreen', {
                            UrlKey: item.urlKey,
                            ItemData: item
                          });
                        } else {
                          Toast.show("Url Key Is Null");
                        }
                      }}
                    />
                    )}
                  keyExtractor={(item, i) => i.toString()}
                />
              </>
            )
          }

          {
            data && data.NewArrivals && data.NewArrivals.length >0&&(
              <View style={{backgroundColor: colours.lowGrey, height: (windowHeight*(14/100)+windowWidth*(40/100)), alignItems:'center', borderRadius: 40}}>
                <View style={styles.headerView}>
                  <Text style={styles.headerText}>New Arrivals</Text>
                  <TouchableOpacity style={styles.seeMoreContainer} onPress={()=> navigation.navigate('CategoryArchive',{type:'Latest Arrival'})}>
                    <Text style={[styles.fontStyle1,{color: colours.primaryGrey}]}>See More </Text>
                    <View>{showIcon('rightarrow', colours.primaryGrey, windowWidth * (4 / 100))}</View>
                  </TouchableOpacity>
                </View>

                <Carousel
                  autoplay
                  data={data.NewArrivals}
                  // data={data.Promo31}
                  renderItem={_renderLatestBanner}
                  sliderWidth={windowWidth}
                  itemWidth={windowWidth*(85/100)}
                  loop={true}
                  enableSnap={true}
                  enableMomentum={true}
                  decelerationRate={0.9}
                  onSnapToItem={(index) => setCarouselIndex1(index)}
                />
                {
                  data && data.NewArrivals && data.NewArrivals.length > 1 &&(
                    <Pagination
                      dotsLength={data.NewArrivals.length}
                      activeDotIndex={carouselIndex1}
                      containerStyle={{
                        height: windowHeight*(6/100),
                        paddingVertical:0,
                        width: windowWidth,
                        justifyContent:'center',
                        alignItems:'center',
                      }}
                      dotElement={
                        <View style={{
                          width: 18,
                          height: 10,
                          borderRadius: 7,
                          // marginHorizontal: -10,
                          backgroundColor: 'rgba(0, 0, 0, 0.8)'
                          
                        }}></View>
                      }
                      dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        // marginHorizontal: -10,
                        backgroundColor: 'rgba(0, 0, 0, 0.92)'
                      }}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.6}
                      tappableDots={true}
                    />
                  )
                }
              </View>
            )
          }

          {
            featuredData&&featuredData.length>0&&(
              <>
                <View style={styles.headerView}>
                  <Text style={styles.headerText}>Featured Products</Text>
                  <TouchableOpacity style={styles.seeMoreContainer} onPress={()=> navigation.navigate('CategoryArchive',{type:'Featured Product'})}>
                    <Text style={[styles.fontStyle1,{color: colours.primaryGrey}]}>See More </Text>
                    <View>{showIcon('rightarrow', colours.primaryGrey, windowWidth * (4 / 100))}</View>
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{x: 1, y: 0 }}
                  colors={[ colours.primaryGreen, colours.lowGreen, colours.primaryWhite ]}
                  style={{height:windowWidth * (60 / 100)}}
                >
                  <FlatList
                    contentContainerStyle={[styles.flatlistContainer]}
                    showsHorizontalScrollIndicator={false}
                    data={featuredData.slice(0,10)}
                    horizontal
                    renderItem={({ item }, i) => (
                      <ProductCard
                        Name={item.prName}
                        Image={item.imageUrl}
                        Price={item.unitPrice}
                        SpecialPrice={item.specialPrice}
                        ProductWeight={item.prWeight}
                        BTValue={item?.bvValue?item.bvValue:0}
                        Variations={item.variationJson?item.variationJson:null}
                        GotoCart={()=>navigation.navigate("CartScreen")}
                        URLKey={item.urlKey}
                        StockAvailability={item.stockAvailability}
                        ProductID={item.productId}
                        OnPress={() => {
                          if (item.urlKey !== null) {
                            navigation.navigate('SingleItemScreen', {
                              UrlKey: item.urlKey,
                              ItemData: item
                            });
                          } else {
                            Toast.show("Url Key Is Null");
                          }
                        }}
                      />
                      )}
                    keyExtractor={(item, i) => i.toString()}
                  />
                </LinearGradient>
              </>
            )
          }


          {
            data && data.MustTryProducts && data.MustTryProducts.length >0&&(
              <View style={{ height: (windowHeight*(14/100)+windowWidth*(40/100)), alignItems:'center'}}>
                <View style={styles.headerView}>
                  <Text style={styles.headerText}>Must Try Products</Text>
                  {/* <TouchableOpacity style={styles.seeMoreContainer} onPress={()=> navigation.navigate('CategoryArchive',{type:'Latest Arrival'})}>
                    <Text style={[styles.fontStyle1,{color: colours.primaryBlack}]}>See More </Text>
                    <View>{showIcon('rightarrow', colours.primaryBlack, windowWidth * (4 / 100))}</View>
                  </TouchableOpacity> */}
                </View>

                <Carousel
                  autoplay
                  data={data.MustTryProducts}
                  // data={data.Promo31}
                  renderItem={_renderMustTryBanner}
                  sliderWidth={windowWidth}
                  itemWidth={windowWidth}
                  loop={true}
                  enableSnap={true}
                  enableMomentum={true}
                  decelerationRate={0.9}
                  onSnapToItem={(index) => setCarouselIndex2(index)}
                />
                {
                  data && data.MustTryProducts && data.MustTryProducts.length > 1 &&(
                    <Pagination
                      dotsLength={data.MustTryProducts.length}
                      activeDotIndex={carouselIndex2}
                      containerStyle={{
                        height: windowHeight*(6/100),
                        paddingVertical:0,
                        width: windowWidth,
                        justifyContent:'center',
                        alignItems:'center',
                      }}
                      dotElement={
                        <View style={{
                          width: 18,
                          height: 10,
                          borderRadius: 7,
                          // marginHorizontal: -10,
                          backgroundColor: 'rgba(0, 0, 0, 0.8)'
                          
                        }}></View>
                      }
                      dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        // marginHorizontal: -10,
                        backgroundColor: 'rgba(0, 0, 0, 0.92)'
                      }}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.6}
                      tappableDots={true}
                    />
                  )
                }
              </View>
            )
          }

          {
            data && data.DealProducts && data.DealProducts.length > 2 &&(
              <>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Top Deals For You</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => onpress(data.DealProducts[0])}
                  >
                    <FastImage
                        style={[styles.bannerImage,{width:windowWidth*(90/100),marginVertical: windowWidth*(1/100),}]}
                        source={{
                            uri: getImage(data.DealProducts[0].imageUrl),
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                  </TouchableOpacity>
                  <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between'}}>
                    <TouchableOpacity
                      onPress={() => onpress(data.DealProducts[1])}
                    >
                      <FastImage
                          style={[styles.bannerImage,{width:windowWidth*(44/100),marginVertical: windowWidth*(1/100),}]}
                          source={{
                              uri: getImage(data.DealProducts[1].imageUrl),
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onpress(data.DealProducts[2])}
                    >
                      <FastImage
                          style={[styles.bannerImage,{width:windowWidth*(44/100),marginVertical: windowWidth*(1/100),}]}
                          source={{
                              uri: getImage(data.DealProducts[2].imageUrl),
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                      />
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </>
            )
          }

          {
            recentData&&recentData.length>0&&(
              <>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Recently Viewed Products</Text>
                </View>
                <FlatList
                  contentContainerStyle={styles.flatlistContainer}
                  showsHorizontalScrollIndicator={false}
                  data={recentData}
                  horizontal
                  renderItem={({ item }, i) => (
                    <ProductCard
                      Name={item.prName}
                      Image={item.imageUrl}
                      Price={item.unitPrice}
                      SpecialPrice={item.specialPrice}
                      ProductWeight={item.prWeight}
                      BTValue={item?.bvValue?item.bvValue:0}
                      Variations={item.variationJson?item.variationJson:null}
                      GotoCart={()=>navigation.navigate("CartScreen")}
                      URLKey={item.urlKey}
                      StockAvailability={item.stockAvailability}
                      ProductID={item.productId}
                      BGColor={colours.lowWhite}
                      OnPress={() => {
                        if (item.urlKey !== null) {
                          navigation.navigate('SingleItemScreen', {
                            UrlKey: item.urlKey,
                            ItemData: item
                          });
                        } else {
                          Toast.show("Url Key Is Null");
                        }
                      }}
                    />
                    )}
                  keyExtractor={(item, i) => i.toString()}
                />
              </>
            )
          }

          {
            data && data.SpecialOffers && data.SpecialOffers.length > 2 &&(
              <>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Special Offers For You</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => onpress(data.SpecialOffers[0])}
                  >
                    <FastImage
                        style={[styles.bannerImage,{width:windowWidth*(90/100),marginVertical: windowWidth*(1/100),}]}
                        source={{
                            uri: getImage(data.SpecialOffers[0].imageUrl),
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                  </TouchableOpacity>
                  <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between'}}>
                    <TouchableOpacity
                      onPress={() => onpress(data.SpecialOffers[1])}
                    >
                      <FastImage
                          style={[styles.bannerImage,{width:windowWidth*(44/100),marginVertical: windowWidth*(1/100),}]}
                          source={{
                              uri: getImage(data.SpecialOffers[1].imageUrl),
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onpress(data.SpecialOffers[2])}
                    >
                      <FastImage
                          style={[styles.bannerImage,{width:windowWidth*(44/100),marginVertical: windowWidth*(1/100),}]}
                          source={{
                              uri: getImage(data.SpecialOffers[2].imageUrl),
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                      />
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </>
            )
          }

          {
            recommendedProducts&&recommendedProducts.length>0&&(
              <>
                <View style={styles.headerView}>
                  <Text style={styles.headerText}>You May Like This</Text>
                </View>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{x: 1, y: 0 }}
                  colors={[ colours.lightOrange, colours.lowOrange, colours.primaryWhite ]}
                  style={{height:windowWidth * (60 / 100)}}
                >
                  <FlatList
                    contentContainerStyle={[styles.flatlistContainer,]}
                    showsHorizontalScrollIndicator={false}
                    data={recommendedProducts.slice(0,10)}
                    horizontal
                    renderItem={({ item }, i) => (
                      <ProductCard
                        Name={item.prName}
                        Image={item.imageUrl}
                        Price={item.unitPrice}
                        SpecialPrice={item.specialPrice}
                        ProductWeight={item.prWeight}
                        BTValue={item?.bvValue?item.bvValue:0}
                        Variations={item.variationJson?item.variationJson:null}
                        GotoCart={()=>navigation.navigate("CartScreen")}
                        URLKey={item.urlKey}
                        StockAvailability={item.stockAvailability}
                        ProductID={item.productId}
                        OnPress={() => {
                          if (item.urlKey !== null) {
                            navigation.navigate('SingleItemScreen', {
                              UrlKey: item.urlKey,
                              ItemData: item
                            });
                          } else {
                            Toast.show("Url Key Is Null");
                          }
                        }}
                      />
                      )}
                    keyExtractor={(item, i) => i.toString()}
                  />
                </LinearGradient>
              </>
            )
          }

          {
            brandsData&&brandsData.length>0&&(
              <FlatList
                // contentContainerStyle={styles.flatlistContainer}
                showsHorizontalScrollIndicator={false}
                data={brandsData}
                horizontal
                renderItem={({ item }, i) => (
                  <BrandCard
                    title={item.brandName}
                    image={item.imageUrl}
                    Nav={() => {
                      if (item.attrValueId) {
                        navigation.navigate('SearchScreen', {
                          filterValue: item.attrValueId,
                          CatName: item.brandName,
                        });
                      } else Toast.show('Something Went Wrong');
                    }}
                  />
                  )}
                keyExtractor={(item, i) => i.toString()}
              />
            )
          }

          <TouchableOpacity onPress={()=>navigation.navigate('WriteToUsScreen')}>
            <FastImage
              style={{ width: windowWidth, height: windowWidth*(45/100), marginTop:15}}
              source={require('../assets/images/SugPro.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </ScrollView>
      )}


      <Modal
        animationType="slide"
        visible={shareModal}
        transparent={true}
      >
      <KeyboardAvoidingView
        behavior="position"
        enabled
      >
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)', marginBottom:windowHeight*(2/100)}}>
          <View style={styles.updateModalView}>
            <Image
                source={require('../assets/logo/logo.png')}
                style={{
                    height: windowWidth * (15 / 100),
                    width: windowWidth * (80 / 100),
                    resizeMode: 'contain',
                }}
            />
            <Text style={styles.fontStyle2}>Refer a friend</Text>
              <Text style={[styles.fontStyle1,{color:colours.primaryBlack}]}>{policy&&policy.length>0&&policy.find((item)=>item.stName == 'referCardMsg')?policy.find((item)=>item.stName == 'referCardMsg').stValue:''}</Text>
              
              {/* <LoginTextInput
                OnChangeText={(text) => {
                  setPhone(text),
                  setPhoneError(false)
                }}
                Width={90}
                Placeholder={"Phone Number"}
                value={phone}
                Error={PhoneError}
                ErrorText={PhoneErrorMessage}
                PhoneCode
                Length={10}
                KeyboardType={'numeric'}
                Height={windowWidth * (14 / 100)}
              /> */}
              <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                  <AuthButton
                      FirstColor={colours.primaryRed}
                      SecondColor={colours.lightRed}
                      OnPress={() => { setShareModal(false) }}
                      ButtonText={'Cancel'}
                      ButtonWidth={40}
                  />
                  <AuthButton
                      BackgroundColor={colours.primaryColor}
                      OnPress={() => onShare()}
                      // OnPress={() => addReferral()}
                      ButtonText={'Refer Now'}
                      ButtonWidth={40}
                  />
              </View>
          </View> 
        </View>
        </KeyboardAvoidingView>
      </Modal>
      {
        appUpdateData&&(
          <Modal
            animationType="slide"
            visible={updateModalVisible}
            transparent={true}
          >
            <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)'}}>
              <View style={styles.updateModalView1}>
                <Image
                    source={require('../assets/logo/logo.png')}
                    style={{
                        height: windowWidth * (20 / 100),
                        width: windowWidth * (80 / 100),
                        resizeMode: 'contain',
                    }}
                />
                <Text style={styles.headerText}>New version {appUpdateData.versionCode} available. Please update</Text>
                <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                    {
                        appUpdateData&&appUpdateData.isCompulsory == false&&(
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
                        OnPress={() => { appUpdateData.app_url != ""? Linking.openURL(appUpdateData.redirectUrl):null,setUpdateModalVisible(false) }}
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
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraLow,
    alignItems: 'center',
  },
  headerSwitchContainer: {
    width: windowWidth,
    height: windowHeight*(7/100),
    backgroundColor:colours.kapraMain,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: windowWidth*(5/100)
  },
  headerSwitch: {
    width: windowWidth*(43/100),
    height: windowHeight*(5/100),
    backgroundColor: colours.kapraMain,
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerSwitchImage: {
    height: windowHeight * (5 / 100),
    width: windowWidth * (40 / 100),
    resizeMode: 'contain',
    backgroundColor: colours.primaryWhite,
    borderRadius:5
  },
  headerFont: {
    fontFamily: 'Montserrat-BoldItalic',
    fontSize: getFontontSize(18),
    color: colours.primaryWhite
  },
  updateModalView1: {
    height: windowHeight * (35 / 100),
    marginTop: windowHeight * (65 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
    justifyContent:'space-between'
  },
  categoryContainer: {
    width: windowWidth*(90/100), 
    // backgroundColor: '#839cc9', 
    backgroundColor: colours.primaryWhite, 
    padding: windowWidth*(3/100), 
    borderRadius: 10
  },
  categoryHeaderContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    height: windowHeight*(7/100), 
    alignItems:'center'
  },
  categoryItemContainer: {
    width: windowWidth*(18/100), 
    height:windowWidth*(25/100),
    marginTop: windowWidth*(5/100), 
    borderRadius:5, 
    justifyContent:'space-between',
  },
  categoryImageContainer: {
    width: windowWidth*(18/100), 
    height: windowWidth*(18/100), 
    borderRadius: windowWidth*(2/100), 
    backgroundColor: colours.kapraLow, 
    alignItems:'center', 
    justifyContent:'center'
  },
  categoryNameContainer: {
    width: windowWidth*(17/100), 
    height: windowWidth*(7/100), 
    alignItems:'center', 
    justifyContent:'center'
  },
  bannerImage: {
    width: windowWidth*(85/100),
    height: windowWidth * (40 / 100),
    borderRadius:10,
    marginVertical: windowWidth*(5/100),
    marginHorizontal:0
  },
  latestBannerImage: {
    width: windowWidth*(85/100),
    height: windowWidth * (40 / 100),
    borderRadius:10,
  },
  mustTryBannerImage: {
    width: windowWidth*(90/100),
    height: windowWidth * (40 / 100),
    borderRadius:10,
    marginHorizontal:windowWidth*(5/100),
  },
  seeMoreContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center'
  },
  shareButton: {
    flexDirection:'row', 
    justifyContent:'space-evenly', 
    alignItems:'center',
    width: windowWidth*(27/100),
    backgroundColor: colours.kapraLight,
    borderRadius: 15,
    height: windowHeight*(4/100)
  },
  headerText: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlack
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(20),
    textAlign: 'center',
  },
  headerView: {
    width:windowWidth,
    paddingHorizontal: windowWidth*(5/100),
    height: windowHeight*(8/100), 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems: 'center',
  },
  carouselImageSK: {
    width: windowWidth*(90/100),
    marginLeft: windowWidth*(2.5/100),
    height: windowWidth * (45.5 / 100),
    borderRadius:10,
    marginVertical: 10
  },
  flatlistContainer: {
    alignItems: 'stretch',
    justifyContent:'space-between',
    paddingLeft: windowWidth*(5/100),
    marginBottom: windowHeight*(1/100)
  },
  searchContainer: {
    height: windowHeight*(6/100),
    width:windowWidth,
    paddingHorizontal: windowWidth*(5/100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.kapraMain,
  },
  sideNavCon: {
    width: windowWidth*(15/100),
    height: windowHeight*(6/100),
    alignItems:'flex-start',
    justifyContent:'center',
  },
  searchBox: {
    height: windowHeight*(5/100),
    width: windowWidth*(75/100),
    backgroundColor: colours.kapraLight,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5
  },
  fontSearch: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    textAlign: 'center',
    color: colours.lowBlue
  },
  updateModalView: {
      height: windowHeight * (50 / 100),
      marginTop: windowHeight * (50 / 100),
      paddingTop: windowHeight * (5 / 100),
      paddingBottom: windowHeight * (2 / 100),
      paddingHorizontal: windowWidth*(5/100),
      backgroundColor: colours.lowBlue,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      elevation: 10,
      alignItems: "center",
      justifyContent:'space-between'
  },
});


const resolveF__kingCode = (DATA) => {
  let parent = DATA.filter((cat) => cat.code.split('#').length === 2);
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
  let parent = DATA.filter((cat) => cat.code.split('#').length === 3);
  let children = DATA.filter((cat) => cat.code.split('#').length === 4);
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