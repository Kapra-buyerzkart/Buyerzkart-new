


import React, {useContext, createRef} from 'react';
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
import DelayInput from "react-native-debounce-input";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import LinearGradient from 'react-native-linear-gradient';

import { shopByCategory, getSearchList, getSearchFilterData } from '../api';
import colours from '../../globals/colours';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import {AppContext} from '../../Context/appContext';
import {LoaderContext} from '../../Context/loaderContext';
import Header from '../components/Header';
import showIcon from '../../globals/icons';
import CategoryGrid from '../components/CategoryGrid';
import GroProductCard from '../components/GroProductCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroCategoryScreen = ({ navigation, route }) => {
  const arr1 = [1,2,]
  const arr = [1,2]

  const searchInputRef = createRef();
  const { profile, cartData } = React.useContext(AppContext);
  let filterValue = route?.params?.filterValue ? route?.params?.filterValue : null;
  let maxPrice = route?.params?.maxPrice ? route?.params?.maxPrice : '1000000';
  const Categories = route?.params?.Categories? route?.params?.Categories:null;
  const [data, setData] = React.useState( route?.params?.categoryData ? route?.params?.categoryData : null);
  const [productData, setProductData] = React.useState(null);
  const [filterData, setFilterData] = React.useState({});
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [ categoryModalVisible, setCategoryModalVisible ] = React.useState(false);
  const [keyword, setkeyword] = React.useState('');
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [Loading, setLoading] = React.useState(false);
  const [selectedCatUrlKey,setSelectedCatUrlKey] = React.useState(data.catUrlKey);
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
  }, [keyword, filter]);


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
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <View style={{height: windowHeight*(5.5/100),paddingHorizontal: windowWidth*(3/100)}}>
          {showIcon('search', colours.kapraMain, windowWidth*(5/100))}
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
          style={{height: windowHeight*(5.5/100),}} 
          onPress={() => { !Loading&&(
              navigation.navigate('GroFilterScreen', {
              onGoback: setFilter,
              filterData,
              data,
            }))
          }}
        >
        {showIcon('filters', colours.kapraMain, windowWidth*(5/100))}
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{alignItems:'center'}}>
      {
        data.children.length>0?
        <FlatList
          horizontal
          contentContainerStyle={{
            paddingLeft: windowWidth*(5/100),
            // height: windowWidth * (34 / 100),
            marginVertical: windowWidth*(4/100)
          }}
          ListHeaderComponent={
            <View style={[styles.categoryGridOutCon,{
              borderColor: selectedIndex == null?colours.lowGreen:colours.primaryWhite,
              shadowColor: selectedIndex == null?colours.primaryBlack: colours.primaryWhite,
              elevation: selectedIndex == null?5:0,
              marginRight:10
            }]}>
              <CategoryGrid 
                title={`${data.catName} all items`}
                image={data.imageUrl}
                index={null}
                Nav={()=>{setSelectedCatUrlKey(data.catUrlKey),setSelectedIndex(null),fetchProduct(data.catUrlKey), setkeyword('')}}
              />
            </View>
          }
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={<View style={{width: windowWidth*(2/100)}}></View>}
          data={data.children}
          renderItem={({ item,index }) => (
            <View style={[styles.categoryGridOutCon,{
              borderColor: index === selectedIndex?colours.lowGreen:colours.primaryWhite,
              shadowColor:index === selectedIndex?colours.primaryBlack: colours.primaryWhite,
              elevation: index === selectedIndex?5:0,
            }]}>
              <CategoryGrid 
                title={item.catName}
                image={item.imageUrl}
                index={index}
                Nav={()=>{setSelectedCatUrlKey(item.catUrlKey),setSelectedIndex(index),fetchProduct(item.catUrlKey), setkeyword('')}}
              />
            </View>
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
        :
        <></>
      }



      {
        productData?
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{x: 0, y: 1 }}
            colors={[colours.kapraLow, colours.primaryWhite, colours.primaryWhite, colours.primaryWhite, colours.primaryWhite, colours.primaryWhite ]}
            style={{ width: windowWidth, alignItems:'center', paddingTop:10}}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={productData}
              numColumns={2}
              columnWrapperStyle={{justifyContent: "space-between"}}
              contentContainerStyle={{width: windowWidth*(90/100),justifyContent:'space-between'}}
              renderItem={({ item }, i) => (
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
              onEndReached={
                productData.length != totalCount ? () => data.children&&data.children.length>0&&(_fetchLoadMoreData(data?.children[selectedIndex]?.catUrlKey?data.children[selectedIndex].catUrlKey:data.catUrlKey?data.catUrlKey:'')) : null
              }
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                <View style={{ height: windowHeight*(40/100), width:windowWidth*(90/100), alignItems:'center'}}>
                    <View style={{width:windowWidth*(30/100), height:windowWidth*(30/100)}}>{showIcon('bin1', colours.primaryRed, windowWidth*(20/100))}</View>
                    <Text style={styles.fontStyle3}>Oh no! Nothing to show</Text>
                </View>
              }
              ListFooterComponent={totalCount !== productData.length ? () => renderFooter() : null}
              keyExtractor={(item, i) => i.toString()}
            />
          </LinearGradient>
        :
          <View>
            {arr1.map(b=>{
              return(
                <View style={{width: windowWidth, paddingHorizontal: windowWidth*(5/100), flexDirection:'row', justifyContent:'space-between' }}>
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
      </ScrollView>



    </SafeAreaView>
  );
};

export default GroCategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems:'center'
  },
  searchContainer: {
    width: windowWidth*(90/100),
    height: windowHeight*(7/100),
    backgroundColor: colours.primaryWhite,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection: 'row'
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
    backgroundColor: colours.kapraMain,
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
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(11),
    color: colours.primaryWhite
  },
  searchBox: {
    width: windowWidth*(80/100),
    height: windowHeight*(5.5/100),
    backgroundColor:  colours.lowWhite,
    borderWidth:0.5,
    borderColor: colours.lightWhite,
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center',
  },
  fontSearch: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(11),
    textAlign: 'center',
    color: colours.primaryGrey
  },
  fontStyle2: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryWhite
  },
  ScrollViewStyle: {
    width: windowWidth*(25/100), 
    height:windowHeight*(81/100),
    borderRightWidth:0.5, 
    borderRightColor: colours.kapraMain,
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
      fontFamily: 'Montserrat-SemiBold',
      textAlign:'center'
  },
  fontStyle3: { 
      color: colours.primaryBlack, 
      fontSize: getFontontSize(18),
      fontFamily: 'Montserrat-Bold',
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
    backgroundColor: colours.kapraLight, 
    borderRadius: windowHeight*(6/100), 
    flexDirection:'row'
  },
  categoryGridOutCon: {
    backgroundColor: colours.primaryWhite,
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginVertical: windowWidth * (2 / 100),
    borderWidth:0.6,
    shadowOpacity: 0.26,
    shadowRadius: 3.68,
  },
  inputText: {
    color: colours.kapraMain,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(14),
    width: windowWidth*(60/100),
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
    fontFamily: 'Montserrat-SemiBold',
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
    width: windowWidth * (43 / 100),
    height: windowWidth * (50 / 100),
    backgroundColor:colours.primaryWhite,
    alignItems: 'center',
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