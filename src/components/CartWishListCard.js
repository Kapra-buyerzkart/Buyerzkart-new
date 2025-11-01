import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import colours from '../globals/colours';
import SimpleToast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
export default function CartWishListCard({ Data, CartButton, Quantity }) {
  const [quanity, setQuantity] = React.useState(0);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <View style={styles.mainContainer}>
      {/* <Image
        source={{ uri: 'https://www.w3schools.com/css/img_forest.jpg' }}
        style={styles.imageContainer}
      /> */}
      <FastImage
        style={styles.imageContainer}
        source={{
          uri: 'https://www.w3schools.com/css/img_forest.jpg',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.detailsContainer}>
        <View style={styles.detailsTop}>
          <Text style={styles.itemHeading} numberOfLines={2}>{Data.itemHeading}</Text>
          <TouchableOpacity
            style={{ alignItems: 'center', paddingLeft: 15 }}
            onPress={() => SimpleToast('Click')}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>X</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemCategory}>{Data.itemCategory}</Text>
        <View style={styles.detailsBottom}>
          <View style={styles.rateContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
              {Data.itemOfferRate}
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 10,
                color: colours.primaryGrey,
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                paddingLeft: '2%',
              }}>
              {Data.itemRealRate}
            </Text>
          </View>
          <View style={styles.multiComponentContainer}>
            <View
              style={[
                styles.quanityContainer,
                Quantity === false ? { display: 'none' } : '',
              ]}>
              <TouchableOpacity
                onPress={
                  quanity > 1
                    ? () => setQuantity(quanity - 1)
                    : () => setQuantity(1)
                }>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{quanity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quanity + 1)}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.cartButton,
                CartButton === false ? { display: 'none' } : '',
              ]}
              onPress={() => alert('Move TO Cart')}>
              <Text style={{ fontWeight: '500', color: '#fff', fontSize: 12 }}>
                {Lang.MoveToCart}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    width: windowWidth,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '3%',
  },
  imageContainer: {
    width: windowWidth * (30 / 100),
    height: windowWidth * (30 / 100),
    borderRadius: 5,
  },
  detailsContainer: {
    backgroundColor: '#e0e0eb',
    width: windowWidth * (65 / 100),
    height: windowWidth * (30 / 100),
    borderRadius: 5,
  },
  detailsTop: {
    width: windowWidth * (60 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    paddingLeft: '8%',
  },
  itemHeading: {
    color: colours.primaryOrange,
    fontWeight: 'bold',
    width: windowWidth * (50 / 100),
    color: '#000',
  },
  itemCategory: {
    fontWeight: 'bold',
    color: colours.primaryGrey,
    paddingLeft: '8%',
    fontSize: 10,
    paddingTop: '1%',
  },
  detailsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * (60 / 100),
    paddingLeft: '8%',
    paddingTop: '3%',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiComponentContainer: {
    flexDirection: 'row',
  },
  quanityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: colours.primaryOrange,
    borderWidth: 2,
    borderRadius: 5,
    width: windowWidth * (25 / 100),
  },
  cartButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#006600',
    borderRadius: 5,
  },
});
