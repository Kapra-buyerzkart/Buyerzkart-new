import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { AppContext } from '../Context/appContext';
import PriceCard from '../components/PriceCard';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
export default function VendorCard({
  Title,
  Rating,
  SpeacialPrice,
  UnitPrice,
  OnPress,
  img,
}) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={OnPress}>
      <FastImage
        style={styles.imageStyle}
        source={{
          uri: img,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.detailContainer}>
        <Text style={styles.fontStyle1} numberOfLines={2}>
          {Title}
        </Text>
        <View style={styles.rowStyle}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {Rating > 0 && (
              <>
                <Text>{showIcon('star', '#F2BC06', 11)}</Text>
                <Text style={styles.fontStyle2}> 3.4</Text>
              </>
            )}
          </View>
          {SpeacialPrice > 0 ? (
            <>
              <Text style={styles.fontStyle3}>
                {(100 - (SpeacialPrice * 100) / UnitPrice).toFixed(0)}% OFF
              </Text>
              <PriceCard
                SpecialPrice={SpeacialPrice}
                UnitPrice={UnitPrice}
                FontSize={15}
                Color={colours.primaryColor}
              />
              {/* <Text
                style={[
                  styles.fontStyle4,
                  { fontSize: 15, paddingBottom: '3%' },
                ]}>
                Rs.{SpeacialPrice}
              </Text> */}
            </>
          ) : (
            <Text
              style={[styles.fontStyle4, { fontSize: 15, paddingBottom: '3%' }]}>
              Rs.{UnitPrice}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (85 / 100),
    height: windowWidth * (30 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageStyle: {
    width: windowWidth * (20 / 100),
    height: windowWidth * (25 / 100),
    borderRadius: 5,
  },
  detailContainer: {
    width: windowWidth * (60 / 100),
    height: windowWidth * (25 / 100),
    justifyContent: 'center',
  },
  rowStyle: {
    width: windowWidth * (45 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 16,
    marginTop: '5%',
    height: windowWidth * (14 / 100),
  },
  fontStyle2: {
    fontSize: 10,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlue,
  },
  fontStyle3: {
    marginLeft: 4,
    width: 50,
    fontSize: 10,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.authText,
  },
  fontStyle4: {
    fontSize: 13,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlue,
  },
});
