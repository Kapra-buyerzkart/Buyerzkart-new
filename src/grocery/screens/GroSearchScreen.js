import React, { useState, createRef } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import DelayInput from "react-native-debounce-input";
import FastImage from 'react-native-fast-image'
import moment from 'moment';

import Header from '../components/Header';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import GroProductCard from '../components/GroProductCard';
import {
  getSearchList,
  getSearchFilterData,
  getOrderList,
  postReOrder,
  getOrderListWithPagination,
  getRecommendedProducts
} from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import { getFontontSize, getImage } from '../globals/GroFunctions';
import FooterCart from '../components/FooterCart';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function GroSearchScreen({ navigation, route }) {


  let cat = route?.params?.CatName ? route?.params?.CatName : null;
  let catUrlKey = route?.params?.catUrlKey ? route?.params?.catUrlKey : null;
  const bannerImgUrl = route?.params?.bannerImgUrl ? route?.params?.bannerImgUrl : null;
  let filterValue = route?.params?.filterValue ? route?.params?.filterValue : null;
  let maxPrice = route?.params?.maxPrice ? route?.params?.maxPrice : '1000000';
  
  const { GroUpdateCart } = React.useContext(AppContext);
  const searchInputRef = createRef();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [keyword, setkeyword] = React.useState(route?.params?.Keyword ? route?.params?.Keyword : '');
  const [filter, setFilter] = React.useState({
    minPrice: '0',
    maxPrice: maxPrice,
    filter: {
      category: catUrlKey,
    },
    filtervalues: filterValue,
    status: false,
    sortField:"prName",
    sortOrder:'relevance',
  });
  const [filterData, setFilterData] = React.useState([]);
  const [categoryData, SetCategoryData] = React.useState();
  const { showLoader } = React.useContext(LoaderContext);

  const [ orderHistory, setOrderHistory ] = React.useState(null)
  const [recommendedProducts, setRecommendedProducts] = React.useState(null);

  const _fetchSearchData = async (loader = true) => {
    try{
      showLoader(true);
      let res = await getSearchList({
        currentpage: 1,
        pagesize: 20,
        sortorder: {field: filter.sortField, direction: filter.sortOrder},
        searchstring: keyword,
        ...filter,
      });
      showLoader(false);
      setTotalCount(res?.List?.length > 0 ? res?.List[0]?.rc : 0);
      setData([]);
      setData(res.List);
      setPageCount(pageCount + 1);
      let res1 = await getSearchFilterData({
        currentpage: 1,
        pagesize: 20,
        sortorder: {field: filter.sortField, direction: filter.sortOrder},
        searchstring: keyword,
        ...filter,
      });
      setFilterData({
        categoryList: res1.categoryList,
        attributes: res1.attributes,
        minPrice: res1.minPrize,
        maxPrice: res1.maxPrize,
      });
      SetCategoryData(resolveF__kingCode(res1.categoryList));
    } catch (err){
      showLoader(false);
    }
  };

  const _fetchLoadMoreData = async (loader = true) => {
    setLoading(true);
    let res = await getSearchList({
      currentpage: pageCount + 1,
      pagesize: 20,
      sortorder: {field: filter.sortField, direction: filter.sortOrder},
      searchstring: keyword,
      ...filter,
    });
    setData([...data, ...res.List]);
    setPageCount(pageCount + 1);
    setLoading(false);
  };

  const _fetchOrderData = async() => {
    let res = await getOrderListWithPagination(1,10);
    // setOrderHistory(res)
    setOrderHistory(res.filter((item) => item?.status == 'Order Delivered'))
    
  }

  const recommendedProductsData = async () => {
    try {
      let res1 = await getRecommendedProducts();
      setRecommendedProducts(res1);
    } catch (err) {
    }
  }
  
  React.useEffect(() => {
    _fetchOrderData(true);
    recommendedProductsData()
  }, []);

  React.useEffect(() => {
    _fetchSearchData(true);
  }, [filter, keyword]);

  const _clearFilter = () => {
    showLoader(true);
    setkeyword('');
    setFilter({
      minPrice: '0',
      maxPrice: '1000000',
      filter: {
        category: catUrlKey,
      },
      filtervalues: '',
    });
    showLoader(false);
  };

  const _priceFilter = (price) => {
    showLoader(true);
    setFilter({
      minPrice: '0',
      maxPrice: price,
      filter: {
        category: catUrlKey,
      },
      filtervalues: '',
      status: true
    });
    showLoader(false);
  };

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View>
        {loading ? (
          <ActivityIndicator
            color={colours.kapraMain}
            style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const ReOrder = async(orderId) => {
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
            try{
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
        
            } catch(err){
            }
          },
        },
      ],
      { cancelable: false },
    )
  }


  if (data === null || data.length==0) {
    return(
      <SafeAreaView style={styles.mainContainer}>
  
        {/* Header Con  */}
        <View style={styles.headerCon}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
          <Text style={styles.headerText}>Search</Text>
        </View>


        {/* Search Input Con  */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              {showIcon('search', colours.kapraMain, 16)}
            </View>
            <DelayInput
              value={keyword}
              minLength={2}
              ref={searchInputRef}
              onChangeText={(text) => setkeyword(text)}
              delayTimeout={800}
              style={styles.inputText}
              placeholder={totalCount && totalCount>0?`Search ${totalCount}+ products `:'Search products'}
              placeholderTextColor={colours.kapraMain}
            />
          </View>
          <TouchableOpacity
            style={styles.filterContainer}
            onPress={filterData.length !== 0 ? () => {
              navigation.navigate('GroFilterScreen', {
                onGoback: setFilter,
                filterData,
                categoryData
              });
            }
              :
              null}>
            {showIcon('filters', colours.kapraMain, windowWidth * (5 / 100))}
          </TouchableOpacity>
        </View>
        
        <ScrollView>
        {
          orderHistory && orderHistory.length>0 &&(
            
            <FlatList
              data={orderHistory}
              numColumns={2}
              columnWrapperStyle={{justifyContent: "space-between"}}
              ListHeaderComponent={() => (
                  <Text style={[styles.inputText, {color: colours.kapraBlack, paddingVertical: '5%'}]}>Previously Purchased</Text>
              )}
              renderItem={({ item, index }) => (
                <View style={styles.orderCon}>
                  <View style={styles.orderCon1}>

                    <View style={{
                      width: windowWidth*(25/100),
                      flexDirection: 'row'
                    }}>
                      <View style={styles.orderItemImg}>
                        <Image 
                          style={styles.orderImg}
                          source={{uri: getImage(JSON.parse(item?.orderedProductImgUrls)[0]?.imageUrl)}}
                        />
                      </View>
                      {
                        JSON.parse(item?.orderedProductImgUrls)?.length > 1 &&(
                          <View style={[styles.orderItemImg,{left: windowWidth*(3/100), position:'absolute'}]}>
                            <Image 
                              style={styles.orderImg}
                              source={{uri: getImage(JSON.parse(item?.orderedProductImgUrls)[1]?.imageUrl)}}
                            />
                          </View>
                        )
                      }
                      {
                        JSON.parse(item?.orderedProductImgUrls)?.length > 2 &&(
                          <View style={[styles.orderItemImg,{left: windowWidth*(6/100), position:'absolute'}]}>
                            <Image 
                              style={styles.orderImg}
                              source={{uri: getImage(JSON.parse(item?.orderedProductImgUrls)[2]?.imageUrl)}}
                            />
                          </View>
                        )
                      }
                      {
                        JSON.parse(item?.orderedProductImgUrls)?.length > 3 &&(
                          <View style={[styles.orderItemImg,{left: windowWidth*(9/100), position:'absolute'}]}>
                            <Text style={styles.fontStyle4}>+{(JSON.parse(item?.orderedProductImgUrls)?.length)-3} item(s)</Text>
                          </View>
                        )
                      } 
                    </View>
                      {/*  */}
                      {/* <View style={[styles.orderItemImg,{left: -windowWidth*(16/100)}]}>
                      </View>*/}
                      <View style={{ width: windowWidth*(16/100) }}>
                        <Text style={styles.orderFont1}>Order ID</Text>
                        <Text numberOfLines={1} style={[styles.orderFont2,{width: windowWidth*(16/100)}]}>#{item.orderNumber}</Text>
                        <Text style={styles.orderFont1}>Date</Text>
                        <Text style={styles.orderFont2}>{moment(item.orderDate).utcOffset('+05:30').format('DD MMM YYYY')}</Text>
                      </View>
                  </View>
                  <View style={styles.orderCon2}>
                    <Text style={styles.orderFont1}>Delivered</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>ReOrder(item.orderId)}>
                        <Text style={[styles.orderFont1,{color: colours.kapraWhite}]}>Reorder</Text>
                    </TouchableOpacity>

                  </View>

                </View>
              )}
              keyExtractor={(item, i) => i.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, width: windowWidth*(90/100) }}
              
            />
          )
        }


        {/* Recommended Products  */}
        {
          recommendedProducts && recommendedProducts.length > 0 && (
            <View style={{ width: windowWidth*(90/100), alignItems:'center'}}>
              <View style={styles.headerNameCon}>
                <Text style={styles.fontStyle3}>Trending Near You</Text>
              </View>
              <FlatList
                ItemSeparatorComponent={<View style={{width:10}}/>}
                data={recommendedProducts}
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between"}}
                renderItem={({ item, index }) => (
                  <GroProductCard
                    Name={item.prName}
                    Image={item.imageUrl}
                    Price={item.unitPrice}
                    BTValue={item.bvValue}
                    SpecialPrice={item.specialPrice}
                    ProductWeight={item.prWeight}
                    Variations={item.variationJson?item.variationJson:null}
                    GotoCart={()=>navigation.navigate("GroCartScreen")}
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

        </ScrollView>

        {/* Cart Con  */}
        <FooterCart navigation={navigation} />
      </SafeAreaView>
    )
  } 
  
  else
    return (
      <SafeAreaView style={styles.mainContainer}>
  
        {/* Header Con  */}
        <View style={styles.headerCon}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
          <Text style={styles.headerText}>Search</Text>
        </View>

        {/* Banner Image  */}
        <>
        {
          bannerImgUrl ?
            <FastImage
              style={{
                width: windowWidth,
                height: windowWidth * (30 / 100),
                resizeMode: 'contain',
              }}
              source={{
                uri: getImage(bannerImgUrl),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            :
            null
        }
        </>

        {/* Search Input Con  */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              {showIcon('search', colours.kapraMain, 16)}
            </View>
            <DelayInput
              value={keyword}
              minLength={2}
              ref={searchInputRef}
              onChangeText={(text) => setkeyword(text)}
              delayTimeout={800}
              style={styles.inputText}
              placeholder={totalCount && totalCount>0?`Search ${totalCount}+ products `:'Search products'}
              placeholderTextColor={colours.kapraBrownDark}
            />
          </View>

          <TouchableOpacity
            style={styles.filterContainer}
            onPress={filterData.length !== 0 ? () => {
              navigation.navigate('GroFilterScreen', {
                onGoback: setFilter,
                filterData,
                categoryData
              });
            }
              :
              null}>
            {showIcon('filters', colours.kapraBrownDark, windowWidth * (5 / 100))}
          </TouchableOpacity>
        </View>


        {
          filter.status &&
            <View style={styles.clearContainer}>
              <TouchableOpacity onPress={_clearFilter}>
                <Text style={styles.clearText}>{'Clear'}</Text>
              </TouchableOpacity>
            </View>
        }
        <FlatList
          data={data}
          numColumns={2}
          columnWrapperStyle={{justifyContent: "space-between"}}
          ListHeaderComponent={() => (
            totalCount && totalCount>0?(
              <View>
                <Text style={[styles.inputText, {color: colours.kapraBlack, paddingVertical: '5%'}]}>
                 Found {totalCount}+ items in {keyword !=''?keyword:'search'} 
                </Text>
              </View>
            )
            :
            <Text/>
          )}
          renderItem={({ item, index }) => (
            <GroProductCard
              Name={item.prName}
              Image={item.imageUrl}
              Price={item.unitPrice}
              SpecialPrice={item.specialPrice}
              ProductWeight={item.prWeight}
              Variations={item.variationJson?item.variationJson:null}
              GotoCart={()=>navigation.navigate("GroCartScreen")}
              URLKey={item.urlKey}
              BTValue={item.bvValue}
              StockAvailability={item.stockAvailability}
              ProductID={item.productId}
              BGColor={colours.lowWhite}
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
          keyExtractor={(item, i) => i.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, width: windowWidth*(90/100) }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  marginTop: '4%',
                  color: colours.primaryBlack
                }}>
                {'No Products Available'}
              </Text>
            </View>
          }
          onEndReached={
            data.length !== totalCount ? () => _fetchLoadMoreData() : null
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={totalCount !== data.length ? () => renderFooter() : null}
        />
        {/* Cart Con  */}
        <FooterCart navigation={navigation} />
      </SafeAreaView>
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
    backgroundColor: colours.kapraWhite,
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
  inputContainer: {
    backgroundColor: colours.kapraWhiteLow,
    width: windowWidth * (70 / 100),
    height: windowHeight * (5 / 100),
    borderRadius: windowHeight * (5 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconStyle: {
    height: windowHeight * (5 / 100),
    width: windowHeight * (5 / 100),
    alignItems:'center',
    justifyContent:'center',
  },
  filterContainer: {
    width: windowWidth * (15 / 100),
    height: windowHeight * (5 / 100),
    borderRadius: windowHeight * (5 / 100),
    marginLeft: windowWidth * (5 / 100),
    backgroundColor: colours.kapraWhiteLow,
    borderRadius: windowHeight * (5 / 100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearContainer: {
    width: windowWidth*(90/100),
    alignItems: 'flex-end',
    marginVertical: 10,
  },

  orderCon: {
    width: windowWidth * (44 / 100),
    height: windowHeight * (15 / 100),
    borderRadius:5,
    borderColor: colours.kapraWhiteLow,
    backgroundColor: colours.kapraGreenLow,
    borderWidth:1
  },
  orderCon1: {
    width: windowWidth * (44 / 100),
    height: windowHeight * (9 / 100),
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    padding: windowWidth * (1 / 100),
    borderColor: colours.kapraWhiteLow,
    borderBottomWidth:1
  },
  orderCon2: {
    width: windowWidth * (44 / 100),
    height: windowHeight * (6 / 100),
    borderRadius:5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding: windowWidth * (2 / 100),
  },
  orderItemImg: {
    width: windowWidth*(12/100),
    height: windowWidth*(12/100),
    borderRadius: windowWidth*(12/100),
    backgroundColor: colours.kapraWhite,
    alignItems:'center',
    justifyContent:'center',
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
  },
  orderImg: {
    width: windowWidth*(11/100),
    height: windowWidth*(11/100),
    borderRadius: windowWidth*(10/100),
    backgroundColor: colours.kapraWhite,
  },
  orderFont1:{
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
    width:windowWidth*(20/100),
    height: windowHeight * (3.5 / 100),
    backgroundColor: colours.primaryGreen,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
  },
  headerNameCon: {
    width: windowWidth*(90/100),
    height: windowHeight*(8/100),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },





  // Fonts 
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  inputText: {
    color: colours.kapraBrownDark,
    paddingVertical: 2,
    width: '80%',
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
  },
  clearText: {
    padding: 8,
    color: colours.kapraRed,
    fontFamily: 'Lexend-Bold',
  },
  fontStyle3: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(15),
    color: colours.kapraBlack
  },
  fontStyle4: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(8),
    color: colours.kapraBlack,
    textAlign:'center'
  },



  filter: {
    color: colours.primaryOrange,
    fontFamily: 'Montserrat-Bold',
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