

import React, {useContext} from 'react';
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
  Platform,
  ActivityIndicator
} from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-simple-toast';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import { 
  shopByCategory,
  getSearchList,
  getSearchFilterData
} from '../api';
import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { LoaderContext } from '../../Context/loaderContext';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import {AppContext} from '../../Context/appContext';
import CategoryGrid1 from '../components/CategoryGrid1';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import GroProductCard1 from '../components/GroProductCard1';
import FooterCart from '../components/FooterCart';
import AuthButton from '../components/AuthButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroShopByCategoryScreen = ({ navigation, route }) => {

  const { showLoader, loading } = React.useContext(LoaderContext);

  const [data, setData] = React.useState(null);
  const [selectedCat, setSelectedCat] = React.useState(null)
  const [selectedMain, setSelectedMain] = React.useState(null);
  const [selectedSub, setSelectedSub] = React.useState(null);
  const [productData, setProductData] = React.useState(null);
  const [Loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [dummy, setDummy] = React.useState(true);
  const [keyword, setkeyword] = React.useState('');
  const [filterData, setFilterData] = React.useState({});
  const [filter, setFilter] = React.useState({
    minPrice: '0',
    maxPrice: '100000',
    sortField:"prName",
    sortOrder:'relevance',
    filter: {
      category: null,
    },
    filtervalues: null,
    status:false
  });
  

  const _fetchHomeData = async () => {
    setData(null);
    try {
      // showLoader(true);
      let res = await shopByCategory();
      if(res){
        setData(resolveF__kingCode(res));
        setSelectedMain(resolveF__kingCode(res)[0])
        setSelectedCat(resolveF__kingCode(res)[0])
      }else{
        setData([]);
      }
      showLoader(false);
    } catch (err) {
      setData([]);
    }
  };

  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     _fetchHomeData();
  //   }, []),
  // );


  const fetchProduct = async(catUrlKey) => {
    setLoading(true);
    setProductData(null);
    try{
      let res = await getSearchList({
        pagesize: 20,
        currentpage: 1,
        filter: {
          category: catUrlKey,
        },
        filtervalues: filter?.filtervalues,
        minPrice: filter?.minPrice,
        maxPrice: filter?.maxPrice,
        searchstring: keyword,
        sortorder: {field: filter?.sortField, direction: filter?.sortOrder}
      });
      setTotalCount(res?.List?.length!==0 ?parseInt(res.List[0].rc):0);
      setPageCount(1);
      setProductData(res?.List);

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
    } catch (err) {
      setLoading(false);
    }
  }


  const _fetchLoadMoreData = async (catUrlKey) => {
    let res = await getSearchList({
      currentpage: pageCount + 1,
      pagesize: 20,
      filter: {
        category: catUrlKey,
      },
      filtervalues: filter?.filtervalues,
      minPrice: filter?.minPrice,
      maxPrice: filter?.maxPrice,
      searchstring: keyword,
      sortorder: {field: filter?.sortField, direction: filter?.sortOrder}
    });
    setProductData([...productData, ...res.List]);
    setPageCount(pageCount + 1);
  };

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View>
        <ActivityIndicator
          color={colours.kapraOrange}
          style={{ margin: 15 }} />
      </View>
    );
  };
  

  React.useEffect(() => {
    fetchProduct(selectedCat?.catUrlKey);
  }, [keyword, filter, selectedCat]);



  if(data == null) return(
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Categories</Text>
      </View>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{width: windowWidth*(90/100), height: windowHeight*(5/100), marginTop:5, borderRadius:5}}/>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{width: windowWidth*(90/100), height: windowHeight*(3/100), marginTop:5, borderRadius:5}}/>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
        <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
          <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
        </View>
      </SkeletonPlaceholder>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerMainCon}>
        <View style={styles.leftBackBtn}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
        </View>
        <View style={styles.headerRightCon}>
          <Text style={styles.headerText}>{selectedMain?.catName ? `${selectedMain?.catName} ` :'Categories'}</Text>
          <TouchableOpacity 
            style={styles.filterBtnCon}
            onPress={() => { !Loading&&(
                navigation.navigate('GroFilterScreen', {
                onGoback: setFilter,
                filterData,
                data,
              }))
            }}
          >
            <View style={styles.backButtonCon}>
              {showIcon('filters', colours.kapraBlackLow, windowWidth*(4/100))}
            </View>
            <Text style={[styles.headerText,{fontSize: getFontontSize(13)}]}>Filters</Text>
            <View style={styles.backButtonCon}>
              {showIcon('downArrow', colours.kapraBlackLow, windowWidth*(4/100))}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Con  */}
      <View style={styles.contentCon}>
        {/* Left Container  */}
        <View style={styles.leftMainCon}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: windowHeight*(30/100)}}
            renderItem={({ item, index }) => (
              <View style={styles.leftCon}>
                <CategoryGrid1 
                  title={item.catName}
                  image={item.imageUrl}
                  index={index}
                  Nav={()=>{setSelectedMain(item), setSelectedCat(item),setSelectedSub(null), setDummy(!dummy)}}
                />
                {
                  item?.catId == selectedMain?.catId ?
                    <Animatable.View animation="zoomIn" iterationCount={1} direction="alternate"  style={[styles.leftIndicator,{ backgroundColor: colours.kapraOrange}]}  />
                    :
                    <Animatable.View animation="zoomOut" iterationCount={1} direction="alternate"  style={[styles.leftIndicator,{ backgroundColor: colours.kapraOrange}]}  />
                }
                {/* <View/> */}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {/* Right Container  */}
        <View style={styles.rightMainCon}>

          {/* Sub Category & Banner Images  */}
          {
            selectedMain?.children && selectedMain?.children.length > 0 ?
            <View style={styles.rightSubCatCon}>
              <FlatList
                data={selectedMain?.children}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={styles.rightSubCat} onPress={() => {
                    setSelectedSub(item), setSelectedCat(item), setDummy(!dummy)}} >
                      {
                        item?.imageUrl?
                        <Image 
                          source={{uri : getImage(item?.imageUrl)}}
                          style={styles.rightSubCatImg}
                        />
                        :
                        <Image 
                          source={require('../../assets/logo/Kapra.png')}
                          style={styles.rightSubCatImg}
                        />
                      }
                    <Text style={styles.rightSubCatTitle} numberOfLines={1}>{item?.catName}</Text>
                      {
                        item?.catId == selectedSub?.catId ?
                          <Animatable.View animation="bounceInLeft" iterationCount={1} direction="alternate"  style={[styles.rightSubCatIndicator,{ backgroundColor: colours.kapraLight}]}  />
                          :
                          <Animatable.View animation="bounceOutRight" iterationCount={1} direction="alternate"  style={[styles.rightSubCatIndicator,{ backgroundColor: '#FAF4F4'}]}  />
                      }
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            :
            <Image 
              source={{uri : getImage(selectedMain?.bannerImgUrl)}}
              style={styles.rightBnrImg}
            />
          }
          {
            Loading?
            // Place Holder Skelton
            <View>
              <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
                <View style={{flexDirection:'row', width: windowWidth*(60/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                </View>
              </SkeletonPlaceholder>
              <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
                <View style={{flexDirection:'row', width: windowWidth*(60/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                </View>
              </SkeletonPlaceholder>
              <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
                <View style={{flexDirection:'row', width: windowWidth*(60/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                </View>
              </SkeletonPlaceholder>
              <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
                <View style={{flexDirection:'row', width: windowWidth*(60/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                </View>
              </SkeletonPlaceholder>
              <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
                <View style={{flexDirection:'row', width: windowWidth*(60/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                  <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                </View>
              </SkeletonPlaceholder>
            </View>
            :
            productData?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={productData}
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between"}}
                contentContainerStyle={{width: windowWidth*(70/100),justifyContent:'space-between', paddingBottom: windowHeight*(25/100)}}
                renderItem={({ item }, i) => (
                  <GroProductCard1
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
                  productData.length !== totalCount ? () => _fetchLoadMoreData(selectedCat?.catUrlKey) : null
                }
                ListEmptyComponent={
                  <View style={{
                    width: windowWidth*(70/100),
                    height: windowHeight*(50/100),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    
                    <Image
                     style={{
                      width: windowWidth*(30/100),
                      height: windowWidth*(30/100),
                     }}
                     source={require('../../assets/images/yogaO.png')}
                    />
                    <Text style={styles.rightSubCatTitle}>Nothing Found ! </Text>
                    <AuthButton
                      OnPress={() => navigation.navigate('GroSearchScreen', { Keyword: '' })}
                      ButtonText={"Browse More"}
                      ButtonWidth={60}
                      ButtonHeight={4}
                      FirstColor={colours.kapraOrange}
                      SecondColor={colours.kapraOrangeDark}
                    />

                  </View>
                }
                onEndReachedThreshold={0.3}
                ListFooterComponent={totalCount !== productData.length ? () => renderFooter() : null}
                keyExtractor={(item, i) => i.toString()}
              />
            :
              <View style={styles.emptyImgCon}>
                <Image 
                  source={require('../../assets/images/Cycle.png')}
                  style={styles.emptyImg}
                />
                <Text style={styles.fontStyle1}>No Products Found !</Text>
              </View>
          }
        </View>
      </View>

      {/* Cart Con  */}
      <FooterCart navigation={navigation} Absolute/>
      
    </SafeAreaView>
  );
};

export default GroShopByCategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
    alignItems:'center'
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
  contentCon: {
    flexDirection:'row',
    justifyContent: 'space-between'
  },

  // Header Con 

  headerMainCon: {
    width: windowWidth,
    height: windowHeight*(10/100),
    flexDirection:'row',
  },
  leftBackBtn: {
    width: windowWidth*(25/100),
    height: windowHeight*(10/100),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#FAF4F4'
  },
  headerRightCon: {
    width: windowWidth*(75/100),
    paddingLeft: windowWidth*(5/100),
    height: windowHeight*(10/100),
    alignItems:'flex-start',
    justifyContent:'space-around',
  },

  // Left 
  leftMainCon: {
    width: windowWidth*(25/100),
    backgroundColor: '#FAF4F4'
  },
  leftCon: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  leftIndicator: {
    width: windowWidth*(1.5/100),
    height: windowWidth * (24 / 100),
    borderTopLeftRadius: windowWidth*(3/100),
    borderBottomLeftRadius:  windowWidth*(3/100),
  },
  filterBtnCon: {
    width: windowWidth*(40/100),
    height: windowHeight*(5/100),
    borderWidth:2,
    borderRadius: 10,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    borderColor: colours.kapraWhiteLow,
  },
  emptyImgCon: {
    width: windowWidth*(70/100),
    height: windowHeight*(60/100),
    alignItems:'center',
    justifyContent:'center'
  },
  emptyImg: {
    width: windowWidth*(40/100),
    height: windowWidth*(40/100),
  },

  // Right 
  rightMainCon: {
    width: windowWidth*(75/100),
    backgroundColor: colours?.kapraWhite,
    alignItems:'center',
  },
  rightBnrImg: {
    width: windowWidth*(70/100),
    height: windowWidth*(30/100),
    resizeMode:'contain',
    borderRadius: 10
  },
  rightSubCatCon: {
    width: windowWidth*(75/100),
    height: windowWidth*(25/100),
    backgroundColor: '#FAF4F4',
  },
  rightSubCat: {
    width: windowWidth*(20/100),
    height: windowWidth*(25/100),
    paddingTop:  windowWidth*(1/100),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightSubCatImg: {
    width: windowWidth*(15/100),
    height: windowWidth*(15/100),
    borderRadius: windowWidth*(15/100),
    borderWidth:1,
    borderColor: colours.kapraWhite

  },
  rightSubCatTitle: {
    fontSize: getFontontSize(10),
    fontFamily: 'Lexend-Regular',
    color: colours.kapraBlack
  },
  rightSubCatIndicator: {
    width: windowWidth*(20/100),
    height: windowWidth*(1.5/100),
    borderRadius: windowWidth*(1/100),
  },





  // Font Styles 
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle1: {
    fontSize: getFontontSize(20),
    fontFamily: 'Lexend-SemiBold',
  },
});



const resolveF__kingCode = (DATA) => {
  let parent = DATA.filter((cat) =>  cat.code && cat.code.split('#').length === 2);
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
  let parent = DATA.filter((cat) =>  cat.code && cat.code.split('#').length === 3);
  let children = DATA.filter((cat) =>  cat.code && cat.code.split('#').length === 4);
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