import React from 'react';
import { FlatList, Text, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView, View } from 'react-native';
import Header from '../components/Header';
import {
  getCategoryArchive,
} from '../api';
import { LoaderContext } from '../Context/loaderContext';
import HomeOneByTwoCard from '../components/HomeOneByTwoCard';
import { getImage } from '../globals/functions';
import showIcon from '../globals/icons';
import colours from '../globals/colours';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CategoryArchiveScreen({ navigation, route }) {
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { updateWishCount } = React.useContext(AppContext);
  const { type } = route.params;
  const _fetchHomeData = async () => {
    
    try {
      showLoader(true);
      let res = await getCategoryArchive(type.split(" ").join(""));
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  if (data === null) return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colours.primaryWhite,
        alignItems: 'center',
      }}>
      <Header
        backEnable
        navigation={navigation}
        HeaderText={type}
        Cart
        WishList
      />
    </SafeAreaView>
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colours.primaryWhite,
        alignItems: 'center',
      }}>
      <Header
        backEnable
        navigation={navigation}
        HeaderText={type}
        Cart
        WishList
      />

      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
        }
        data={data}
        contentContainerStyle={{width:windowWidth}}
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
        keyExtractor={(item, i) => i.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
