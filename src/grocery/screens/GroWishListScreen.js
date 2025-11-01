import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  View,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-simple-toast';

import WishlistCard from '../components/WishlistCard';
import { getImage } from '../globals/GroFunctions';
import { getGroWishList, moveAllFromWishListToCart, removeAllFromWishList, removeFromWishList, addtoCart, } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import AuthButton from '../components/AuthButton';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../Context/appContext';
import { getFontontSize } from '../globals/GroFunctions';
import FooterCart from '../components/FooterCart';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height

export default function GroWishListScreen({ navigation, route }) {
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { UpdateGroWishCount, GroUpdateCart, GroUpdateWishList,  } = React.useContext(AppContext);


  const _fetchWishlistData = async () => {
    try {
      showLoader(true);
      let res = await getGroWishList();
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

  const _removeAll = async () => {
    Alert.alert(
      'REMOVE',
      'Are You  Sure Want To Remove All Item From Wishlist',
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
              let res = await removeAllFromWishList();
              await UpdateGroWishCount(), 
              await GroUpdateCart(), 
              await GroUpdateWishList(),
              _fetchWishlistData()
              showLoader(false);
            }
            catch (err) {
              showLoader(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  }

  const _moveAllToCart = async => {
    Alert.alert(
      'CART',
      'Are You  Sure Want To Move All Item From Wishlist To Cart',
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
              let res = await moveAllFromWishListToCart();
              await UpdateGroWishCount(), 
              await GroUpdateCart(), 
              await GroUpdateWishList(),
              _fetchWishlistData()
              showLoader(false);
            }
            catch (err) {
              showLoader(false);
            }
          },
        },
      ],
      { cancelable: false },
    );

  }

  if (data === null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Wishlist</Text>
      </View>
      <View style={[styles.headerCon,{justifyContent:'space-between'}]}>
        <Text style={styles.headerText2}>Wishlist</Text>
        <Text style={styles.fontStyle4} onPress={()=> _removeAll()}>Remove All</Text>
      </View>

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
              navigation.navigate('GroSingleItemScreen', { UrlKey: item.urlKey })
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
                        await GroUpdateCart();
                        await GroUpdateWishList();
                        UpdateGroWishCount();
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
                await addtoCart(item.urlKey);
                await removeFromWishList(item.urlKey);
                Toast.show('Added To Cart');
                showLoader(false);
                await _fetchWishlistData();
                await GroUpdateCart();
                await GroUpdateWishList();
                await UpdateGroWishCount();
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

        ListFooterComponent={
          <View style={styles.deliveryMsgCon}>
            <View>
              {showIcon('timer', colours.primaryGreen, windowWidth*(6/100))}
            </View>
            <View style={{paddingLeft:10}}>
              <Text style={styles.headerText2}>20 minutes delivery</Text>
              <Text style={styles.fontStyle2}>Kapra Daily</Text>
            </View>
          </View>

        }
        
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle3}>{'Wishlist Empty'}</Text>
            <Text style={styles.fontStyle3}>
              There is nothing to show in your Wishlist
            </Text>
            <AuthButton
              FirstColor={colours.kapraOrange}
              SecondColor={colours.kapraOrangeDark}
              OnPress={() =>
                navigation.navigate('GroSearchModalScreen')
              }
              ButtonText={'Browse More'}
              ButtonWidth={90}
            />
          </View>
        }
      />

      
      {
        data&&data.length>1 && (
          <AuthButton
            FirstColor={colours.kapraOrange}
            SecondColor={colours.kapraOrangeDark}
            OnPress={() =>_moveAllToCart()}
            ButtonText={'Add all items to cart'}
            ButtonWidth={90}
          />
        )
      }

      {/* Cart Con  */}
      <FooterCart navigation={navigation} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.primaryWhite,
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  deliveryMsgCon: {
    width: windowWidth,
    height: windowHeight*(8/100),
    backgroundColor: colours.kapraWhiteLow,
    marginTop: windowHeight*(2/100),
    paddingHorizontal: windowWidth*(5/100),
    flexDirection: 'row',
    alignItems:'center'
  },





  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  headerText2: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle2: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(12),
    color: colours.kapraBlackLow,
  },
  fontStyle3: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraRed,
  },
  fontStyle4: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraRed,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
