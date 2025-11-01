import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import PriceCard from '../components/PriceCard';
import { AppContext } from '../Context/appContext';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
export default function DealDayCard({
  Name,
  image,
  Rating,
  SpecialPrice,
  UnitPrice,
  Home,
  OnPress,
  AddToWishlist,
  RemoveFromWishlist,
  IsWishlisted,
  dealTo,
  Variations
}) {
  const [wishlist, setWishlist] = React.useState(IsWishlisted);
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [noDays, setNoDays] = React.useState(0);
  const [Date, SetDate] = React.useState({});
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const timerData = () => {
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
  }
  React.useMemo(() => {
    timerData();
  }, [totalDuration]);

  return (
    <TouchableOpacity
      onPress={OnPress}
      style={[
        styles.container,
        Home
          ? { width: windowWidth * (50 / 100) }
          : { width: windowWidth * (48 / 100) },
      ]}>
      <View style={styles.mainCotainer}>
        <FastImage
          style={styles.imageStyle}
          source={{
            uri: image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />

        {
          dealTo && totalDuration > 0 ?
            <View style={styles.timerContainer}>
              <View style={{ height: windowWidth * (5 / 100), flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
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
            </View>
            :
            null

        }

        <View style={styles.wishContainer}>
          {wishlist ? (
            <>
              <TouchableOpacity
                style={{
                  padding: 5,
                }}
                onPress={() => {
                  RemoveFromWishlist();
                  setWishlist(false);
                }}>
                <Text>{showIcon('heartFill', colours.primaryRed, 20)}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={{
                padding: 5,
              }}
              onPress={() => {
                AddToWishlist();
                setWishlist(true);
              }}>
              <Text>{showIcon('heartFill', colours.primaryGrey, 20)}</Text>
            </TouchableOpacity>
          )}

        </View>
        <Text style={styles.fontStyle1} numberOfLines={2}>
          {Name}
        </Text>
        {Home ? (
          <View style={[styles.rowStyle, { paddingTop: '2%' }]}>
            <View style={[styles.rowStyle]}>
              <PriceCard
                SpecialPrice={SpecialPrice}
                UnitPrice={UnitPrice}
                FontSize={12}
                FromCart
              />
              {SpecialPrice > 0 ? (
                <Text style={styles.fontStyle3}>
                  {(100 - (SpecialPrice * 100) / UnitPrice).toFixed(0)}{Lang.Off}
                </Text>
              ) : (
                <Text style={{ width: windowWidth * (10 / 100) }}></Text>
              )}
            </View>
            {Rating > 0 && (
              <View
                style={{
                  width: windowWidth * (7 / 100),
                  height: windowWidth * (6 / 100),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colours.primaryRed,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                }}>
                <Text
                  style={[
                    styles.fontStyle2,
                    { color: colours.primaryWhite, marginBottom: 0 },
                  ]}>
                  {Rating + ' '}
                </Text>
                <Text>{showIcon('star', colours.primaryWhite, 8)}</Text>
              </View>
            )}

          </View>
        ) : (
          <View
            style={[
              styles.rowStyle,
              { paddingTop: '0%', width: (windowWidth * 35) / 100 },
            ]}>
            {Rating > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>{showIcon('star', '#F2BC06', 11)}</Text>
                <Text style={styles.fontStyle2}> {Rating}</Text>
              </View>
            )}
            {SpecialPrice > 0 ? (
              <Text style={styles.fontStyle3}>
                {(100 - (SpecialPrice * 100) / UnitPrice).toFixed(0)}{Lang.Off}
              </Text>
            ) : (
              <Text></Text>
            )}
            {SpecialPrice > 0 ? (
              <PriceCard
                SpecialPrice={SpecialPrice}
                UnitPrice={UnitPrice}
                FontSize={12}
                Color={colours.kapraLight}
                FromCart
              />
            ) : (
              <PriceCard
                UnitPrice={UnitPrice}
                FontSize={12}
                Color={colours.kapraLight}
                FromCart
              />
            )}
          </View>
        )}
        {
          Variations ?
            <View style={{ width: '90%', marginTop: 5 }}>
              <Text style={styles.fontStyle2}>
                {"Variations Available"}
              </Text>
            </View>
            :
            <View style={{ width: '90%', marginTop: 10 }}>
              <Text></Text>
            </View>
        }
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth * (40 / 100),
    //height: windowWidth * (70 / 100),
    alignItems: 'center',
  },
  mainCotainer: {
    width: windowWidth * (45 / 100),
    height: windowWidth * (67 / 100),
    //marginLeft: '1%',
    marginBottom: '5%',
    borderColor: '#a8a8a8',
    borderWidth: 0.3,
    borderRadius: 5,
    padding: 10,
    elevation: 1,
    backgroundColor: colours.primaryWhite,
  },
  wishContainer: {
    width: windowWidth * (9 / 100),
    height: windowWidth * (9 / 100),
    backgroundColor: colours.primaryWhite,
    position: 'absolute',
    borderRadius: windowWidth * (5 / 100),
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: windowWidth * (35 / 100),
  },
  timerContainer: {
    width: windowWidth * (33 / 100),
    height: windowWidth * (9 / 100),
    backgroundColor: 'rgba(255,255,255,0.95)',
    position: 'absolute',
    borderRadius: windowWidth * (5 / 100),
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: windowWidth * (1 / 100),
  },
  imageStyle: {
    width: windowWidth * (38 / 100),
    height: windowWidth * (36 / 100),
    borderRadius: 5,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 13,
    marginTop: '5%',
    marginLeft: '3%',
    height: 37
  },
  fontStyle2: {
    fontSize: 10,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.kapraLight,
  },
  fontStyle4: {
    fontSize: 13,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.kapraLight,

  },
  fontStyle3: {
    marginLeft: 4,
    width: 50,
    fontSize: 10,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryGrey,
  },
  textStyle2: {
    //fontFamily: 'SF-Pro-Display-Regular',
    //width: windowWidth * (8 / 100),
    fontSize: 12,
    color: colours.primaryGrey,
  },
  textStyle3: {
    //fontFamily: 'SF-Pro-Display-Regular',
    //width: windowWidth * (18 / 100),
    fontSize: 12,
    color: colours.primaryGrey,
  },
  textStyle4: {
    //fontFamily: 'SF-Pro-Display-Regular',
    width: windowWidth * (8 / 100),
    fontSize: 12,
    color: colours.primaryGrey,
    textDecorationLine: 'line-through',
  },
});
