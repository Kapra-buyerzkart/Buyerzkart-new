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
  Image
} from 'react-native';
import { shopByCategory, getSearchData } from '../api';

import Header from '../components/Header';
import colours from '../globals/colours';
import { LoaderContext } from '../Context/loaderContext';
import { getImage, getFontontSize } from '../globals/functions';
import {AppContext} from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import SubCategory from '../components/SubCategoryCard'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import * as Animatable from 'react-native-animatable';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShopByCategoryScreen = ({ navigation, route }) => {
  const arr = [1,2,3,4,5,6,7]
  const { profile } = React.useContext(AppContext);
  const [data, setData] = React.useState(null);
  const [productData, setProductData] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { showLoader, loading } = React.useContext(LoaderContext);

  const _fetchHomeData = async () => {
    setData(null);
    try {
      // showLoader(true);
      let res = await shopByCategory();
      setData(resolveF__kingCode(res));
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show;
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



  if(data == null) return(
    <SafeAreaView style={[styles.mainContainer,]}>
    <Header navigation={navigation} backEnable Search Cart />
        <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
          <View style={{width: windowWidth*(90/100), height: windowHeight*(5/100), marginTop:5, borderRadius:5}}/>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
          <View style={{width: windowWidth*(90/100), height: windowHeight*(3/100), marginTop:5, borderRadius:5}}/>
        </SkeletonPlaceholder>
        {arr.map(a=>{
          return(
            <SkeletonPlaceholder highlightColor={colours.kmLowPink}>
              <View style={{flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-between', height: windowWidth*(30/100),marginTop: windowWidth * (2.5 / 100),}}>
                <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
                <View style={{ width: windowWidth*(27.5/100), height: windowWidth*(27.5/100), borderRadius:5}}/>
              </View>
            </SkeletonPlaceholder>
          )
        })}
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation}  backEnable Search Cart />
      <View style={{width: windowWidth*(90/100), height: windowHeight*(10/100),  justifyContent:'space-evenly'}}>
        <Text style={styles.fontStyle1}>
          All Categories
        </Text>
        <Text style={styles.fontStyle2}>
        Curated with the best range of products
        </Text>
      </View>

      <Animatable.View animation="slideInDown" iterationCount={ data && data.length < 16? 0 : 3} direction="alternate">
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
        }
        data={data}
        contentContainerStyle={{width: windowWidth, alignItems:'center', backgroundColor: colours.primaryWhite,paddingBottom: windowHeight*(20/100)}}
        renderItem={({ item, index }, i) => (
          <SubCategory
            Name={item.catName}
            Child={item.grchildern}
            image={item.imageUrl ? getImage(item.imageUrl) : null}
            OnPress={()=>navigation.navigate('CategoryScreen',{categoryData:item, Categories: data})}
          />
        )}
        keyExtractor={(item, i) => i.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
      </Animatable.View>
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
  fontStyle1: {
    fontSize: getFontontSize(25),
    fontFamily:'Proxima Nova Alt Bold'
  },
  fontStyle2: {
    fontSize: getFontontSize(13),
    fontFamily:'Proxima Nova Alt Semibold',
    color: colours.primaryGrey
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