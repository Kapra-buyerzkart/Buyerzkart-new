import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
export default function TopProductCard({ ItemDetails }) {
  const [cart, setCart] = React.useState(false);
  const [wishList, setWishList] = React.useState(false);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <View>
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={() => setCart(!cart)}>
          <ImageBackground
            imageStyle={{ borderRadius: 5 }}
            source={{ uri: ItemDetails.itemImage }}
            style={styles.image}>
            <View style={styles.wishListContainer}>
              <View></View>
              <TouchableOpacity
                onPress={() => {
                  alert('wishList'), setWishList(!wishList);
                }}>
                <Image
                  source={require('../icons/like.png')}
                  style={styles.iconStyle}
                  tintColor={wishList === true ? 'red' : 'white'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.detailsContainer}>
              <Text numberOfLines={1} style={styles.itemName}>
                {ItemDetails.itemName}
              </Text>
              <Text numberOfLines={1} style={styles.itemPrice}>
                {ItemDetails.itemPrice}
              </Text>
            </View>
            <View
              style={[
                styles.cartContainer,
                cart === true ? { position: 'absolute' } : { display: 'none' },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  alert('cart'), setCart(false);
                }}>
                <Text style={{ color: '#fff' }}>{Lang.AddToCart.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    margin: '0%',
  },
  image: {
    width: windowWidth * (35 / 100),
    height: windowWidth * (45 / 100),
  },
  wishListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '5%',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  cartContainer: {
    backgroundColor: 'rgba(0, 51, 102, .8)',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth * (35 / 100),
    height: windowWidth * (45 / 100),
    borderRadius: 5,
  },
  detailsContainer: {
    marginLeft: 10,
    marginTop: windowWidth * (45 / 100) * (55 / 100),
    width: windowWidth * (30 / 100),
    height: 80,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#ffa31a',
  },
});
