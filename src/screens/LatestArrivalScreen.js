import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getSearchList,
  addToCart,
  removeFromCart,
  RemoveCartItemByUrlkey,
} from '../api';

import Toast from 'react-native-simple-toast';
import LatestArrivalCard from '../components/LatestArrivalCard';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import SearchCardWithAdd from '../components/SearchCardWithAdd';
import { getLatestArrival, addToWishList, removeFromWishList } from '../api';
import { getImage } from '../globals/functions';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const LatestArrivalScreen = ({ navigation }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { profile, updateWishCount } = React.useContext(AppContext);
  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let res = await getLatestArrival();
      setData([]);
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     _fetchHomeData();
  //   }, []),
  // );

  if (data === null) {
    return null;
  } else {
    if (data.length === 0)
      return (
        <>
          <Header
            sideNav
            backEnable
            HeaderText={'Latest Arrival'}
            WishList
            Cart
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colours.white,
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle3}>Latest Arrival Empty</Text>
            {/* <Text style={styles.fontStyle4}>
            It is a Long Established fact that a Reader will be distracted by the
            readable content
          </Text> */}
            {/* <AuthButton
            BackgroundColor={colours.primaryColor}
            OnPress={() => navigation.navigate('Home')}
            ButtonText={'Browse More'}
            ButtonWidth={90}
          /> */}
          </View>
        </>
      );
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'Latest Arrival'}
          WishList
          Cart
        />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
          }
          data={data}
          renderItem={({ item }, i) => (
            <SearchCardWithAdd
              Name={item.prName}
              UnitPrice={item.unitPrice}
              SpecialPrice={item.specialPrice}
              IsCarted={item.IsCarted}
              Rating={item.IsReviewAvgrating}
              ImageUri={getImage(item.imageUrl)}
              IsWishlisted={item.IsWishlisted}
              BTValue={item?.bvValue?item.bvValue:0}
              dealTo={item.dealTo}
              ProductID={item.productId}
              urlKey={item.urlKey}
              Variations={item.variationJson ? item.variationJson : null}
              Stock={item.stockAvailability}
              Quantity={item.CartItemQty}
              onCardPress={() => {
                if (item.urlKey !== null) {
                  navigation.navigate('SingleItem', {
                    UrlKey: item.urlKey,
                  });
                } else {
                  Toast.show('UrlKey Is Null');
                }
              }}
              RemoveFromCart={async () => {
                await RemoveCartItemByUrlkey(item.urlKey);
                Toast.show('Removed From Cart');
              }}
            />
          )}
          keyExtractor={(item) => item.urlKey.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
};

export default LatestArrivalScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.white,
    alignItems: 'center',
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 14,
    color: colours.black,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Light',
    fontSize: 12,
    color: colours.black,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
