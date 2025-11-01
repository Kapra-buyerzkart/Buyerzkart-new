import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Dimensions
} from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import DealDayCard from '../components/DealDayCard';
import { getImage } from '../globals/functions';
import { LoaderContext } from '../Context/loaderContext';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import {
  getDealOfTheDay,
  addToWishList,
  addToCart,
  removeFromWishList,
} from '../api';
const windowHeight = Dimensions.get('window').height;

const DealOfTheDayScreen = ({ navigation, route }) => {
  let showSideNav = route?.params?.showSideNav ? true : false;
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { updateWishCount } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let res = await getDealOfTheDay();
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

  if (data === null) {
    return null;
  } else {
    if (data.length === 0)
      return (
        <SafeAreaView style={styles.mainContainer}>
          <Header
            navigation={navigation}
            HeaderText={'Deal Of The Day'}
            backEnable
            WishList
            Cart
          />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
            }
            style={{
              flex: 1,
              backgroundColor: colours.white,

            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colours.white,
                height: windowHeight * (80 / 100)
              }}>
              <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
              <Text style={styles.fontStyle3}>Deal Of The Day Empty</Text>
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
          </ScrollView>
        </SafeAreaView>
      );
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          navigation={navigation}
          HeaderText={'Deal Of The Day'}
          backEnable
          WishList
          Cart
        />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
          }
          data={data}
          renderItem={({ item }, i) => (
            <DealDayCard
              Name={item.prName}
              image={getImage(item.imageUrl)}
              Rating={item.IsReviewAvgrating}
              SpecialPrice={item.specialPrice}
              UnitPrice={item.unitPrice}
              IsWishlisted={item.IsWishlisted}
              dealTo={item.dealTo}
              Variations={item.variationJson ? item.variationJson : null}
              AddToWishlist={async () => {
                await addToWishList(item.urlKey);
                updateWishCount();
                Toast.show('Added To Wishlist');
              }}
              RemoveFromWishlist={async () => {
                await removeFromWishList(item.urlKey);
                updateWishCount();
                Toast.show('RemovedFromWishlist');
              }}
              OnPress={() => {
                if (item.urlKey !== null) {
                  navigation.navigate('SingleItem', {
                    UrlKey: item.urlKey,
                    DealTo: item.dealTo
                  });
                } else {
                  Toast.show('UrlKey Is Null');
                }
              }}
            />
          )}
          keyExtractor={(item) => item.urlKey.toString()}
          numColumns={2}
          contentContainerStyle={{
            marginTop: '5%',
            paddingBottom: '10%',
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
};

export default DealOfTheDayScreen;

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
