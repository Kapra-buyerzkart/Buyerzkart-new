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
  ActivityIndicator
} from 'react-native';
import CONFIG from '../globals/config';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { getImage } from '../globals/functions';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import SearchCardWithAdd from '../components/SearchCardWithAdd';
import {
  getSearchList,
  addToWishList,
  addToCart,
  removeFromCart,
  removeFromWishList,
  RemoveCartItemByUrlkey,
  getSearchFilterData
} from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import PincodeChange from '../components/PincodeChange';
import DelayInput from "react-native-debounce-input";
import FastImage from 'react-native-fast-image'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
export default function SearchScreen({ navigation, route }) {
  let cat = route?.params?.CatName ? route?.params?.CatName : null;
  let catUrlKey = route?.params?.catUrlKey ? route?.params?.catUrlKey : null;
  const bannerImgUrl = route?.params?.bannerImgUrl ? route?.params?.bannerImgUrl : null;
  let filterValue = route?.params?.filterValue ? route?.params?.filterValue : null;
  let maxPrice = route?.params?.maxPrice ? route?.params?.maxPrice : '1000000';
  route?.params?.catUrlKey;
  let backenable = route?.params?.backEnable;
  const searchInputRef = createRef();
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const isFocused = useIsFocused();
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
  const { profile, updateWishCount } = React.useContext(AppContext);

  const _fetchHomeData = async (loader = true) => {
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
      setTotalCount(res.List.length !== 0 ? res.List[0].rc : 0);
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

  React.useEffect(() => {
    _fetchHomeData(false);
  }, [keyword]);

  // React.useEffect(() => {
  //   if (isFocused) _fetchHomeData(true);
  // }, [filter]);

  React.useEffect(() => {
    _fetchHomeData(true);
  }, [filter]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     _fetchHomeData(true);
  //   }, []),
  // );

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
            color="red"
            style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  if (data === null || data.length==0) {
    return(
      <SafeAreaView style={styles.mainContainer}>
        <Header
          navigation={navigation}
          HeaderText={'Search'}
          backEnable
          WishList
          Cart
        />

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
            {/* {
              keyword !== '' ?
                <TouchableOpacity
                  //style={styles.filterContainer}
                  onPress={_clearFilter}>
                  <Text>
                    {showIcon('close', colours.mainRed, windowWidth * (4 / 100))}
                  </Text>
                </TouchableOpacity>
                :
                null
            } */}
          </View>
          <TouchableOpacity
            style={styles.filterContainer}
            onPress={filterData.length !== 0 ? () => {
              navigation.navigate('FilterScreen', {
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
        {
          filter.status ?
            <View style={styles.clearContainer}>
              <TouchableOpacity onPress={_clearFilter}>
                <Text style={styles.clearText}>{'Clear'}</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.clearContainer} />

        }
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
          <Text
            style={{
              fontFamily: 'Proxima Nova Alt Bold',
              marginTop: '4%',
              color: colours.primaryBlack
            }}>
            {'No Products Available'}
          </Text>
        </View>
      </SafeAreaView>
    )
  } else
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          navigation={navigation}
          HeaderText={cat ? cat : 'Search'}
          backEnable
          WishList
          Cart
        />
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
            {/* {
              keyword !== '' ?
                <TouchableOpacity
                  //style={styles.filterContainer}
                  onPress={_clearFilter}>
                  <Text>
                    {showIcon('close', colours.mainRed, windowWidth * (4 / 100))}
                  </Text>
                </TouchableOpacity>
                :
                null
            } */}
          </View>
          <TouchableOpacity
            style={styles.filterContainer}
            onPress={filterData.length !== 0 ? () => {
              navigation.navigate('FilterScreen', {
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
        {
          filter.status ?
            <View style={styles.clearContainer}>
              <TouchableOpacity onPress={_clearFilter}>
                <Text style={styles.clearText}>{'Clear'}</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.clearContainer} />

        }

        <FlatList
          data={data}
          ListHeaderComponent={() => (
            totalCount && totalCount>0?(
              <View>
                <Text style={[styles.inputText, {paddingVertical: '5%'}]}>
                 Found {totalCount}+ items in {keyword !=''?keyword:'search'} 
                </Text>
              </View>
            )
            :
            <Text/>
          )}
          //data={data.sort((a, b) => a.prName.localeCompare(b.prName))}
          renderItem={({ item, index }) => (
            index % 4 === 0 ?
              <>
                {/* <Text>Hi{index}</Text> */}
                <SearchCardWithAdd
                  Name={item.prName}
                  UnitPrice={item.unitPrice}
                  SpecialPrice={item.specialPrice}
                  IsCarted={item.IsCarted}
                  Rating={item.IsReviewAvgrating}
                  ImageUri={getImage(item.imageUrl)}
                  IsWishlisted={item.IsWishlisted}
                  dealTo={item.dealTo}
                  BTValue={item?.bvValue?item.bvValue:0}
                  ProductID={item.productId}
                  urlKey={item.urlKey}
                  Variations={item.variationJson ? item.variationJson : null}
                  Stock={item.stockAvailability}
                  Quantity={item.CartItemQty}
                  onCardPress={() => {
                    if (item.urlKey !== null) {
                      navigation.navigate('SingleItemScreen', {
                        UrlKey: item.urlKey,
                        ItemData: item
                      });
                    } else {
                      Toast.show('Url Key Is Null');
                    }
                  }}
                  RemoveFromCart={async () => {
                    await RemoveCartItemByUrlkey(item.urlKey);
                    Toast.show('Removed From Cart');
                  }}
                />
              </>
              :
              <SearchCardWithAdd
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
                    navigation.navigate('SingleItemScreen', {
                      UrlKey: item.urlKey,
                      ItemData: item
                    });
                  } else {
                    Toast.show('Url Key Is Null');
                  }
                }}
                RemoveFromCart={async () => {
                  await RemoveCartItemByUrlkey(item.urlKey);
                  Toast.show('Removed From Cart');
                }}
              />
          )}
          keyExtractor={(item, i) => i.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
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
                  fontFamily: 'Proxima Nova Alt Bold',
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
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  inputText: {
    color: colours.kapraMain,
    paddingVertical: 2,
    width: '80%',
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: colours.kapraLow,
    //borderWidth: 0.5,
    borderColor: '#707070',
    width: windowWidth * (70 / 100),
    borderRadius: 5,
    marginTop: '3%',
    fontWeight: 'bold',
    fontSize: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: windowHeight * (6 / 100),
    paddingLeft: 10,
  },
  iconStyle: {
    paddingLeft: '5%',
  },
  filterContainer: {
    width: windowWidth * (15 / 100),
    height: windowHeight * (6 / 100),
    marginLeft: windowWidth * (5 / 100),
    marginTop: '3%',
    backgroundColor: colours.kapraLow,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filter: {
    color: colours.primaryOrange,
    fontFamily: 'Proxima Nova Alt Bold',
  },
  clearContainer: {
    width: '90%',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginRight: -10,
  },
  clearText: {
    padding: 8,
    color: colours.kapraMain,
    fontFamily: 'Proxima Nova Alt Bold',
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