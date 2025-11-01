import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  OnPress,
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { AppContext } from '../Context/appContext';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
export default function TopSellersCard({
  Name,
  ImageUri,
  IsWishlisted,
  OnPress,
  Place,
  Pincode
}) {
  const [wishlist, setSellerlist] = React.useState(IsWishlisted);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={OnPress}>
      <FastImage
        style={styles.imageStyle}
        source={{
          uri: ImageUri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.contentContainer}>
        <View style={styles.rowStyle}>
          <Text style={styles.fontStyle1} numberOfLines={1}>
            {Name}
          </Text>
        </View>
        <Text style={styles.fontStyle5} numberOfLines={1}>
          {Place}
        </Text>
        <Text style={styles.fontStyle5} numberOfLines={1}>
          {Pincode}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (25 / 100),
    backgroundColor: '#fff',
    marginTop: '6%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowStyle: {
    flexDirection: 'row',
    width: windowWidth * (45 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 20,
  },
  fontStyle5: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 13,
  },
  imageStyle: {
    width: windowWidth * (20 / 100),
    height: windowWidth * (20 / 100),
    borderRadius: 5,
    margin: '3%',

  },
});