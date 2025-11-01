import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  View,
  Dimensions,
  Alert
} from 'react-native';

import Header from '../components/Header';
import WishlistCard from '../components/WishlistCard';
import { getImage } from '../globals/functions';
import { getWishList, removeFromWishList, addToCart, } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../Context/appContext';
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
export default function WishListScreen({ navigation, route }) {
  let showSideNav = route?.params?.showSideNav ? true : false;
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { updateWishCount, loadCart, updateCart, updateWishList, loadWishList } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const _fetchWishlistData = async () => {
    try {
      showLoader(true);
      let res = await getWishList();
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchWishlistData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _fetchWishlistData();
    }, []),
  );

  if (data === null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'Wishlist'}
        backEnable
        Search
        Cart

      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchWishlistData} />
        }
        data={data}
        renderItem={({ item }, i) => (
          <WishlistCard
            Name={item.prName}
            SoldBy={item.businessName}
            Price={item.specialPrice}
            UnitPrice={item.unitPrice}
            OutofStock={item.stockAvailability}
            ImageUri={getImage(item.imageUrl)}
            dealTo={item.dealTo}
            onCardPress={() =>
              navigation.navigate('SingleItemScreen', { UrlKey: item.urlKey })
            }
            Delete={async () => {
              Alert.alert(
                'REMOVE',
                'Are You  Sure Want To Remove From Wishlist',
                [
                  {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    style:'destructive',
                    onPress: async() => {
                      try {
                        showLoader(true);
                        await removeFromWishList(item.urlKey);
                        Toast.show('Removed from wishlist');
                        showLoader(false);
                        await _fetchWishlistData();
                        await updateCart();
                        await loadCart();
                        await updateWishList();
                        await loadWishList();
                        updateWishCount();
                      } catch (error) {
                        Toast.show(error);
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
              
            }}
            moveToCart={async () => {
              try {
                showLoader(true);
                await addToCart(item.urlKey);
                await removeFromWishList(item.urlKey);
                Toast.show('Added To Cart');
                showLoader(false);
                await _fetchWishlistData();
                await updateCart();
                await loadCart();
                await updateWishList();
                await loadWishList();
                await updateWishCount();
              } catch (error) {
                Toast.show(error);
              }
            }
            }
          />
        )}
        keyExtractor={(item) => item.wishlistId.toString()}
        // ItemSeparatorComponent={() => <View style={{height: 10}} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          width: windowWidth,
          alignItems: 'center',
          paddingBottom: 20,
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle3}>{'Wishlist Empty'}</Text>
            <Text style={styles.fontStyle4}>
              There is nothing to show in your Wishlist
            </Text>
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() =>
                navigation.navigate('SearchScreen', { backEnable: true })
              }
              ButtonText={'Browse More'}
              ButtonWidth={90}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.primaryWhite,
    flex: 1,
    alignItems: 'center',
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
