import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import PriceCard from '../components/PriceCard';
import FastImage from 'react-native-fast-image'
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import { I18nManager } from "react-native";
import { getFontontSize } from '../globals/GroFunctions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function WishlistCard({
  Name,
  Price,
  OutofStock,
  ImageUri,
  Cart,
  Delete,
  onCardPress,
  dealTo,
  UnitPrice,
  moveToCart
}) {
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [noDays, setNoDays] = React.useState(0);
  const [Date, SetDate] = React.useState({});

  useEffect(() => {
    let date =
      moment()
        .utcOffset('+05:30')
        .format('YYYY-MM-DD hh:mm:ss');
    // let expirydate = '2020-11-14 20:28:45';
    let expirydate = moment(dealTo)
      .utcOffset('+05:30')
      .format();
    let showDate = moment(dealTo)
      .utcOffset('+05:30')
      .format('Do MMM');

    let diffr =
      moment
        .duration(moment(expirydate)
          .diff(moment(date)));
    var hours = parseInt(diffr.asHours());
    var minutes = parseInt(diffr.minutes());
    var seconds = parseInt(diffr.seconds());
    var d = hours * 60 * 60 + minutes * 60 + seconds;
    SetDate(showDate);
    setNoDays(hours);
    setTotalDuration(d);
  }, [totalDuration]);

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onCardPress}>
      <FastImage
        style={styles.imageStyle}
        source={{
          uri: ImageUri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.contentContainer}>
        <Text
          style={[styles.fontStyle1]}
          numberOfLines={2}
        >
          {Name}
        </Text>
        <Text/>
        <View>
          {UnitPrice ?
            <PriceCard
              SpecialPrice={Price}
              UnitPrice={UnitPrice}
              FontSize={14}
            />
            :
            <PriceCard
              UnitPrice={Price}
              FontSize={14}
            />
          }
        </View>
      </View>
      <View style={styles.btnCon}>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={Delete}>
          <Text>{showIcon('bin1', colours.primaryRed, 16)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={moveToCart}
        >
          <Text>{showIcon('cart', colours.primaryGreen, 18)}</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (90 / 100),
    backgroundColor: colours.kapraWhite,
    paddingBottom:10,
    marginTop: windowHeight*(2/100),
    alignItems: 'center',
    justifyContent:'space-between',
    flexDirection: 'row',
    borderBottomWidth:1,
    borderBottomColor: colours.kapraWhiteLow
  },
  imageStyle: {
    width: windowWidth * (20 / 100),
    height: windowWidth * (20 / 100),
  },
  contentContainer: {
    width: windowWidth * (55 / 100),
    justifyContent:'space-between',
  },
  btnCon: {
    width: windowWidth * (10 / 100),
    justifyContent:'space-between',
  },
  btnStyle: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    justifyContent: 'center',
    alignItems: 'center',
  },




  fontStyle1: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
  },
});
