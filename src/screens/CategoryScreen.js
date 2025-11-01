


import React, {useContext, useEffect, createRef} from 'react';
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
  ActivityIndicator,
  Platform, 
  TouchableHighlight,
  Pressable,
  ImageBackground
} from 'react-native';
import { shopByCategory, getSearchList, getSearchFilterData } from '../api';

// import Modal from "react-native-modal";

import Header from '../components/Header';
import colours from '../globals/colours';
import FastImage from 'react-native-fast-image';
import showIcon from '../globals/icons';
import { LoaderContext } from '../Context/loaderContext';
import { getImage, getFontontSize } from '../globals/functions';
import {AppContext} from '../Context/appContext';
import HomeOneByThreeCard from '../components/HomeOneByThreeCard';
import HomeOneByTwoCard from '../components/HomeOneByTwoCard';
import Toast from 'react-native-simple-toast';
import Ripple from 'react-native-material-ripple';
import { StackActions } from '@react-navigation/native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Badge } from 'react-native-elements';
import ImageLoad from 'react-native-image-placeholder';
import * as Animatable from 'react-native-animatable';
import DelayInput from "react-native-debounce-input";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShopByCategoryScreen = ({ navigation, route }) => {
  const arr1 = [1,2,3]
  const arr = [1,2]

  const searchInputRef = createRef();
  const { profile, cartData } = React.useContext(AppContext);
  let filterValue = route?.params?.filterValue ? route?.params?.filterValue : null;
  let maxPrice = route?.params?.maxPrice ? route?.params?.maxPrice : '1000000';
  const Categories = route?.params?.Categories? route?.params?.Categories:null;
  const [data, setData] = React.useState( route?.params?.categoryData ? route?.params?.categoryData : null);
  const [productData, setProductData] = React.useState(null);
  const [filterData, setFilterData] = React.useState({});
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [ categoryModalVisible, setCategoryModalVisible ] = React.useState(false);
  const [keyword, setkeyword] = React.useState('');
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [Loading, setLoading] = React.useState(false);
  const [selectedCatUrlKey,setSelectedCatUrlKey] = React.useState(data.children.length>0?data.children[0].catUrlKey:data.catUrlKey);
  const [dummy, setDummy] = React.useState(true);

  const [filter, setFilter] = React.useState({
    minPrice: '0',
    maxPrice: maxPrice,
    sortField:"prName",
    sortOrder:'relevance',
    filter: {
      category: data.children&&data.children.length>0?data.children[0].catUrlKey:data.catUrlKey,
    },
    filtervalues: filterValue,
    status:false
  });


  const fetchProduct = async(catUrlKey) => {
    // showLoader(true);
    setLoading(true);
    setProductData(null);
    try{
      let res = await getSearchList({
        pagesize: 20,
      currentpage: 1,
      filter: {
        category: catUrlKey,
      },
      filtervalues: filter.filtervalues,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      searchstring: keyword,
      sortorder: {field: filter.sortField, direction: filter.sortOrder}
      });
      setTotalCount(res.List.length!==0?parseInt(res.List[0].rc):0);
      setPageCount(1);
      setProductData(res.List);

      let res1 = await getSearchFilterData({
        pagesize: 20,
        currentpage: 1,
        filter: {
          category: catUrlKey,
        },
        filtervalues: '',
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        searchstring: '',
        sortorder: {field: filter.sortField, direction: filter.sortOrder}
      });
      setFilterData({
        categoryList: res1.categoryList,
        attributes: res1.attributes,
        minPrice: res1.minPrize,
        maxPrice: res1.maxPrize!==0?res1.maxPrize:500000,
        sortField:filter.sortField,
        sortOrder:filter.sortOrder,
      });
      setLoading(false);
      setDummy(!dummy);
      showLoader(false);
    } catch (err) {
      showLoader(false);
    }
  }

  const _fetchLoadMoreData = async (catUrlKey) => {
    setLoading(true);
    let res = await getSearchList({
      pagesize: 20,
      currentpage: pageCount + 1,
      filter: {
        category: catUrlKey,
      },
      filtervalues: filter.filtervalues,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      searchstring: keyword,
      sortorder: {field: filter.sortField, direction: filter.sortOrder}
    });
    setProductData([...productData, ...res.List]);
    setPageCount(pageCount + 1);
    setLoading(false);
  };


  React.useEffect(() => {
    fetchProduct(selectedCatUrlKey);
  }, [filter]);

  React.useEffect(() => {
    fetchProduct(selectedCatUrlKey);
  }, [keyword]);


  const renderFooter = () => {
    return (
      <View style={{width: windowWidth*(70/100), alignItems:'center'}}>
        {Loading ? (
          <ActivityIndicator
            color="red"
            style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  if(data == null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={data.catName}
        backEnable
        Search
        Cart
      />
      {
        data.children.length>0?
          <View style={{flexDirection:'row'}}>
            <FlatList
              contentContainerStyle={{
                alignItems: 'center',
                paddingTop: '1%',
                // width: windowWidth*(25/100),
                paddingBottom: windowHeight*(40/100),
                // height:windowHeight,
              }}
              showsVerticalScrollIndicator={false}
              data={data.children}
              renderItem={({ item,index }) => (
                
                <Ripple
                  rippleColor={colours.primaryWhite}
                  rippleOpacity={0.9}
                  rippleDuration={500} 
                  style={[styles.leftMenuStyle,]} 
                  onPress={()=>{setSelectedCatUrlKey(item.catUrlKey),setSelectedIndex(index),fetchProduct(item.catUrlKey), setkeyword('')}}
                >
                  {
                    index === selectedIndex?
                    <Animatable.View animation="zoomIn" iterationCount={1} direction="alternate">
                      <View style={[styles.imageContainer,{backgroundColor: index === selectedIndex? colours.lightOrange:colours.primaryWhite}]}>
                        {
                          item.imageUrl?
                          <ImageLoad
                            style={styles.imageStyle}
                            loadingStyle={{ size: 'small', color: colours.kapraMain }}
                            source={{ uri: getImage(item.imageUrl) }}
                            placeholderStyle={[index === selectedIndex?styles.imageStyle1:styles.imageStyle,]}
                            placeholderSource={require('../assets/logo/logo.png')}
                            borderRadius={windowWidth * (15 / 100)}
                          />
                          :
                          <FastImage
                            style={styles.imageStyle}
                            source={require('../assets/logo/logo.png')}
                            resizeMode={FastImage.resizeMode.contain}
                          />

                        }
                        <Text style={[styles.fontStyle1,{color:colours.kapraMain}]}>{item.catName}</Text>
                      </View>

                    </Animatable.View>
                    :
                    <>
                      <View style={[styles.imageContainer,{backgroundColor: index === selectedIndex? colours.kapraMain:colours.primaryWhite}]}>
                        {
                          item.imageUrl?
                          <ImageLoad
                            style={styles.imageStyle}
                            loadingStyle={{ size: 'small', color: colours.kapraMain }}
                            source={{ uri: getImage(item.imageUrl) }}
                            placeholderStyle={[index === selectedIndex?styles.imageStyle1:styles.imageStyle,]}
                            placeholderSource={require('../assets/logo/logo.png')}
                            borderRadius={windowWidth * (15 / 100)}
                          />
                          :
                          <FastImage
                            style={styles.imageStyle}
                            source={require('../assets/logo/logo.png')}
                            resizeMode={FastImage.resizeMode.contain}
                          />

                        }
                        <Text style={[styles.fontStyle1,{color:colours.kapraLight}]}>{item.catName}</Text>
                      </View>

                    </>
                  }
                </Ripple>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    height: windowHeight*(90/100),
                    justifyContent: 'center',
                    paddingHorizontal:10
                  }}
                >
                  <Text style={styles.fontStyle1}>
                    No Sub Category Available
                  </Text>
                </View>
              }
              keyExtractor={(item, i) => i.toString()}
            />

            <ImageBackground
              style={{ width: windowWidth*(75/100), height: windowHeight}}
              imageStyle={styles.bannerImageStyle}
              resizeMode='contain'
              source={{
                  uri: getImage(data.children[selectedIndex].bannerImgUrl),
              }}
            >
              <View style={{
                width: windowWidth*(75/100),
                height: windowHeight*(7/100),
                backgroundColor: colours.kapraLow,
                alignItems:'center',
                justifyContent:'center'
              }}>
                <View style={{
                  width: windowWidth*(72/100),
                  height: windowHeight*(5.5/100),
                  backgroundColor:  colours.primaryWhite,
                  borderRadius:15,
                  flexDirection:'row',
                  alignItems:'center',
                  
                }}>
                  <View style={{height: windowHeight*(5.5/100),paddingHorizontal: windowWidth*(3/100)}}>
                  {showIcon('search', colours.kapraLight, windowWidth*(5/100))}
                  </View>
                  <DelayInput
                    value={keyword}
                    minLength={2}
                    ref={searchInputRef}
                    onChangeText={(text) => setkeyword(text)}
                    delayTimeout={800}
                    style={styles.inputText}
                    placeholder={totalCount && totalCount>0?`Search ${totalCount}+ products `:'Search products'}
                    placeholderTextColor={colours.kapraLight}
                  />

                </View>
              </View>
              {
                    productData?(

                      <FlatList
                      contentContainerStyle={{
                        alignItems: 'flex-start',
                        justifyContent:'space-between',
                        width:windowWidth*(75/100),
                        paddingLeft: windowWidth*(2.5/100),
                        paddingBottom: windowHeight*(70/100),
                        backgroundColor: colours.kapraLow,
                      }}
                      showsVerticalScrollIndicator={false}
                      data={productData}
                      numColumns={2}
                      renderItem={({ item }, i) => (
                        <HomeOneByThreeCard
                          Name={item.prName}
                          Image={item.imageUrl}
                          Price={item.unitPrice}
                          BTValue={item?.bvValue?item.bvValue:0}
                          SpecialPrice={item.specialPrice}
                          ProductWeight={item.prWeight}
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
                      onEndReached={
                        productData.length != totalCount ? () => data.children&&data.children.length>0&&(_fetchLoadMoreData(data.children[selectedIndex].catUrlKey)) : null
                      }
                      onEndReachedThreshold={0.3}
                      ListEmptyComponent={
                        <View style={{marginTop: windowHeight*(30/100), width:windowWidth*(75/100), alignItems:'center'}}>
                            <View>{showIcon('bin1', colours.primaryRed, windowWidth*(20/100))}</View>
                            <Text style={styles.fontStyle3}>Oh no! Nothing to show.</Text>
                        </View>
                      }
                      ListFooterComponent={totalCount !== productData.length ? () => renderFooter() : null}
                      keyExtractor={(item, i) => i.toString()}
                    />
                    )
                    :
                      <View style={{borderTopLeftRadius:windowWidth * (5 / 100),borderTopRightRadius:windowWidth * (5 / 100),}}>
                      {arr1.map(b=>{
                        return(
                          <View style={{width: windowWidth, paddingHorizontal: windowWidth*(3/100), flexDirection:'row', }}>
                            {arr.map(a=>{
                            return(
                              <View style={styles.skeltonContainer}>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonImageStyle} />
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonContentStyle}/>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonContentStyle}/>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonContentStyle}/>
                                </SkeletonPlaceholder>
                              </View>
                            )})}
                          </View>
                        )
                      })}
                      </View>
                  }
            </ImageBackground>







          </View>
        :
        <View>
          {
              data.children[selectedIndex]&&(
                <FastImage
                  style={styles.bannerImageStyle}
                  source={{
                      uri: getImage(data.children[selectedIndex].bannerImgUrl),
                      priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )
          }
            <View style={{width: windowWidth,  alignItems: 'center', marginTop: data.children[selectedIndex]&&data.children[selectedIndex].bannerImgUrl? -15 : 0, borderRadius:10, backgroundColor: colours.primaryWhite, paddingBottom:windowHeight*(10/100)}}>
                  {
                    productData?(

                      <FlatList
                      contentContainerStyle={{
                        alignItems: 'center', 
                        justifyContent:'space-between',
                        // width:windowWidth*(94/100),
                        paddingTop: '4%',
                        paddingBottom: windowHeight*(15/100)
                      }}
                      showsVerticalScrollIndicator={false}
                      data={productData}
                      numColumns={2}
                      renderItem={({ item }, i) => (
                        <HomeOneByTwoCard
                          Name={item.prName}
                          Image={item.imageUrl}
                          Price={item.unitPrice}
                          BTValue={item?.bvValue?item.bvValue:0}
                          SpecialPrice={item.specialPrice}
                          ProductWeight={item.prWeight}
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
                      onEndReached={
                        productData.length !== totalCount ? () => data.children&&data.children.length>0&&(_fetchLoadMoreData(data.children[selectedIndex].catUrlKey)) : null
                      }
                      onEndReachedThreshold={0.3}
                      ListEmptyComponent={
                        <View style={{marginTop: windowHeight*(30/100), alignItems: 'center', width:windowWidth*(94/100),}}>
                            <View>{showIcon('bin1', colours.primaryRed, windowWidth*(20/100))}</View>
                            <Text style={styles.fontStyle3}>Oh no! Nothing to show.</Text>
                        </View>
                      }
                      ListFooterComponent={totalCount !== productData.length ? () => renderFooter() : null}
                      keyExtractor={(item, i) => i.toString()}
                    />
                    )
                    :
                      <>
                      {arr1.map(b=>{
                        return(
                          <View style={{width: windowWidth, paddingHorizontal: windowWidth*(3/100), flexDirection:'row', justifyContent:'center'}}>
                            {arr.map(a=>{
                            return(
                              <View style={[styles.skeltonContainer,{width:windowWidth*(40/100)}]}>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonImageStyle} />
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonContentStyle}/>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonContentStyle}/>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder highlightColor={colours.kapraLow}>
                                  <View style={styles.skeltonContentStyle}/>
                                </SkeletonPlaceholder>
                              </View>
                            )})}
                          </View>
                        )
                      })}
                      </>
                  }
                </View>
            </View>
          }
        
            <View style={styles.filterContainer}>
              <Pressable
                  style={styles.filterIconContainer}
                  onPress={() => { !Loading&&(
                    navigation.navigate('FilterScreen', {
                    onGoback: setFilter,
                    filterData,
                    data,
                  }))
                  
                    
              }}>
                <View style={styles.filter}>
                  {showIcon('filters', colours.kapraMain, windowWidth*(4/100))}
                </View>
                {
                  filter.status&&(
                    <Badge value={filterData.length} containerStyle={{ position: 'absolute', top: windowWidth*(4/100), right: windowWidth*(8/100), color:colours.primaryColor}} badgeStyle={{backgroundColor:colours.primaryRed, borderColor: colours.primaryRed}} />
                  )
                }
              </Pressable>
            </View>
            
    </SafeAreaView>
  );
};

export default ShopByCategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems:'center'
  },
  searchContainer: {
    height: windowHeight*(10/100),
    width:windowWidth,
    paddingHorizontal: windowWidth*(3/100),
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  optionsContainer: {
    height: windowHeight*(8/100),
    width:windowWidth*(94/100),
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  optionsStyle: {
    height: windowHeight*(6/100),
    width:windowWidth*(30/100),
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: colours.primaryColor,
    borderRadius:10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 4.68,
    shadowColor:colours.primaryBlack,
    elevation: 4,
  },
  optionText: {
    fontFamily:'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(11),
    color: colours.primaryWhite
  },
  searchBox: {
    height: windowHeight*(5.5/100),
    width: windowWidth*(80/100),
    backgroundColor: colours.lightWhite,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  fontSearch: {
    fontFamily:'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(11),
    textAlign: 'center',
    color: colours.primaryGrey
  },
  fontStyle2: {
    fontFamily:'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(16),
    color: colours.primaryWhite
  },
  ScrollViewStyle: {
    width: windowWidth*(25/100), 
    height:windowHeight*(81/100),
    borderRightWidth:0.5, 
    borderRightColor: colours.primaryColor,
    borderTopWidth:0.5,
    borderTopColor: colours.primaryWhite,
  },
  leftMenuStyle: {
    width: windowWidth*(25/100), 
    height:windowHeight*(15/100),
    alignItems:'center', 
    borderBottomColor: colours.secondaryColor, 
  },
  checkboxView: {
    flexDirection:'row', 
    justifyContent:'flex-start', 
    alignItems:'center',
    width: windowWidth*(60/100)
  },
  fontStyle1: { 
      width: windowWidth * (20 / 100),
      color: colours.primaryBlack, 
      fontSize: getFontontSize(14),
      fontFamily:'Proxima Nova Alt Semibold',
      textAlign:'center'
  },
  fontStyle3: { 
      color: colours.primaryBlack, 
      fontSize: getFontontSize(18),
      fontFamily:'Proxima Nova Alt Bold',
  },
  imageContainer: {
    width: windowWidth * (23 / 100),
    height: windowWidth * (30 / 100),
    marginBottom:5,
    alignItems:'center',
    justifyContent:'space-evenly',
    borderRadius:15,

  },
  imageStyle: {
      width: windowWidth * (15 / 100),
      height: windowWidth * (15 / 100),
      borderRadius: windowWidth * (15 / 100),
      backgroundColor: colours.kapraLow
  },
  imageStyle1: {
      width: windowWidth * (15 / 100),
      height: windowWidth * (15 / 100),
      borderRadius: windowWidth * (15 / 100),
  },
  bannerImageStyle: {
    width: windowWidth * (75 / 100),
    height: windowWidth * (40 / 100),
    borderRadius:5,
    resizeMode:'contain'
    // borderWidth:2,
    // borderColor:colours.kmLightGrey
  },
  categoryButtonContainer: {
    width: windowWidth, 
    height: windowHeight*(7/100), 
    alignItems:'center', 
    justifyContent:'center',
    position:'absolute',
  },
  categoryButton: {
    width: windowWidth*(50/100), 
    height: windowHeight*(6/100), 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor: colours.kapraLow, 
    borderRadius: windowHeight*(6/100), 
    flexDirection:'row'
  },
  inputText: {
    color: colours.kapraMain,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
  },
  filterContainer: {
    width: windowWidth, 
    height: windowWidth*(10/100), 
    alignItems:'flex-end', 
    marginTop: windowHeight*(25/100), 
    position:'absolute',
  },
  filterIconContainer: {
    width: windowWidth*(12/100), 
    height: windowWidth*(10/100), 
    backgroundColor:colours.lightOrange, 
    borderTopLeftRadius: 5, 
    borderBottomLeftRadius:5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5
  },
  centeredView: {
    backgroundColor: colours.primaryWhite,
    backgroundColor: '#0009',
    flex: 1,
    alignItems: 'center',
    justifyContent:'flex-end'
  },
  modalView: {
    width: windowWidth*(80/100), 
    height: windowHeight*(60/100), 
    backgroundColor: colours.primaryWhite, 
    marginTop: windowHeight*(20/100), 
    borderRadius:20, 
    // alignItems:'center', 
    paddingVertical: windowWidth*(5/100),
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
  },
  bottomCartContainer: {
    width: windowWidth,
    height: windowHeight*(6/100),
    position: 'absolute',
    marginTop: Platform.OS === 'ios'? windowHeight*(86/100) : windowHeight*(92/100),
    alignItems: 'center'
  },
  bottomCartInnerContainer: {
    width: windowWidth*(94/100),
    height: windowHeight*(6/100),
    backgroundColor: colours.kapraMain,
    borderRadius:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:15,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5
  },
  skeltonContainer: {
    width: windowWidth * (32 / 100),
    height: windowWidth * (50 / 100),
    backgroundColor:colours.primaryWhite,
    alignItems: 'center',
    marginRight: windowWidth * (5 / 100),
    marginBottom:10,
    marginTop: windowWidth*(5/100),
    borderRadius:10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5
    // borderColor: colours.primaryGrey
  },
  skeltonContentStyle: { 
    width: windowWidth * (30 / 100), 
    height: windowWidth*(7/100), 
    marginTop: windowWidth*(1/100), 
    justifyContent:'center',
    borderRadius:5
  },
  skeltonImageStyle: {
      width: windowWidth * (20 / 100),
      height: windowWidth * (20 / 100),
      marginTop: windowWidth *(2.5/100),
      borderRadius:5,
  },
});



// const resolveF__kingCode = (DATA) => {
//   let parent = DATA.filter((cat) => cat.code.split('#').length === 2);
//   let children = resolveF__kingCode2(DATA);
//   let arr = [];
//   parent.map((parCat) => {
//     parCat.children = [];
//     children.map((chCat) => {
//       if (chCat.code.split('#')[1] == parCat.catId) parCat.children.push(chCat);
//     });
//     arr.push(parCat);
//   });
//   return arr;
// };

// const resolveF__kingCode2 = (DATA) => {
//   let parent = DATA.filter((cat) => cat.code.split('#').length === 3);
//   let children = DATA.filter((cat) => cat.code.split('#').length === 4);
//   let arr1 = [];
//   parent.map((parCat) => {
//     parCat.grchildern = [];
//     children.map((chCat) => {
//       if (chCat.code.split('#')[2] == parCat.catId) parCat.grchildern.push(chCat);
//     });
//     arr1.push(parCat);
//   });
//   return arr1;
// };