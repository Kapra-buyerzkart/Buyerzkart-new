import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import showIcon from '../globals/icons';
import colours from '../globals/colours';
import PriceCard from '../components/PriceCard';
import FastImage from 'react-native-fast-image'
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import { AppContext } from '../Context/appContext';
import { I18nManager } from "react-native";
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
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
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.imageStyle}
          source={{
            uri: ImageUri,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text
          style={[
            styles.fontStyle1,
            { width: windowWidth * (50 / 100), paddingTop: Cart ? '15%' : '1%' },
          ]}
          numberOfLines={2}>
          {Name}
        </Text>
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
        {
          dealTo && totalDuration > 0 ?
            <View style={{ height: windowWidth * (5 / 100), flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start' }}>
              {
                noDays > 24 ?
                  <>
                    <Text style={styles.textStyle2}>{"Ends on: "}</Text>
                    <Text style={styles.textStyle3}>{Date}</Text>
                  </>

                  :
                  <>
                    <Text style={styles.textStyle2}>{"Ends in: "}</Text>
                    <CountDown
                      until={totalDuration}
                      size={10}
                      //onFinish={() => alert('Finished')}
                      digitStyle={{ width: 15, }}
                      digitTxtStyle={{ color: colours.primaryRed }}
                      timeToShow={['H', 'M', 'S']}
                      separatorStyle={{ color: colours.primaryRed, width: 2 }}
                      timeLabels={{ m: null, s: null }}
                      showSeparator
                    />
                  </>
              }
            </View>
            :
            null
        }
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            width: windowWidth * (12 / 100),
            height: windowWidth * (10 / 100),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={moveToCart}
        >
          <Text>{showIcon('cart', colours.primaryGreen, 18)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: windowWidth * (12 / 100),
            height: windowWidth * (10 / 100),
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={Delete}>
          <Text>{showIcon('bin1', colours.primaryRed, 16)}</Text>
        </TouchableOpacity>

      </View>
      {OutofStock.toLowerCase() === 'out of stock' ? (
        <>
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Out Of Stock</Text>
            <View
              style={{
                width: windowWidth * (8 / 100),
                height: windowWidth * (15 / 100),
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity onPress={Delete}>
                <Text>{showIcon('bin', colours.primaryRed, 18)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <Text></Text>
      )}

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (25 / 100),
    backgroundColor: '#fff',
    marginTop: '4%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: windowWidth * (2 / 100),
  },
  imageContainer: {
    width: windowWidth * (21 / 100),
    height: windowWidth * (21 / 100),
    backgroundColor: '#fff',
    //marginLeft: windowWidth * (2.5 / 100),
  },
  imageStyle: {
    width: windowWidth * (21 / 100),
    height: windowWidth * (21 / 100),
  },
  detailsContainer: {
    width: windowWidth * (51 / 100),
    height: windowWidth * (21 / 100),
    justifyContent: 'space-evenly',
    marginLeft: windowWidth * (2 / 100),
  },
  buttonContainer: {
    width: windowWidth * (12 / 100),
    height: windowWidth * (21 / 100),
  },
  rowStyle: {
    flexDirection: 'row',
    width: windowWidth * (45 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt SemiBold',
    fontSize: getFontontSize(12),
    color: colours.primaryGrey,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
  },
  fontStyle5: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
  },
  overlay: {
    position: 'absolute',
    width: windowWidth * (90 / 100),
    height: windowWidth * (25 / 100),
    backgroundColor: 'rgba(230, 230, 230, .9)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  overlayText: {
    fontWeight: 'bold',
    fontSize: getFontontSize(18),
    color: colours.primaryOrange,
    width: windowWidth * (73 / 100),
    textAlign: 'center',
  },

  cartContainer: {
    flexDirection: 'row',
    width: windowWidth * (22 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: I18nManager.isRTL ? 15 : 15,
  },
  textStyle2: {
    fontFamily: 'Proxima Nova Alt Regular',
    width: windowWidth * (14 / 100),
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
  },
  textStyle3: {
    fontFamily: 'Proxima Nova Alt Regular',
    width: windowWidth * (18 / 100),
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
  },
  textStyle4: {
    fontFamily: 'Proxima Nova Alt Regular',
    width: windowWidth * (8 / 100),
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
    textDecorationLine: 'line-through',
  },
});
