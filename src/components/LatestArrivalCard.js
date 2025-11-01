import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getImage } from '../globals/functions';
import FastImage from 'react-native-fast-image'

import showIcon from '../globals/icons';
import colours from '../globals/colours';
import Toast from 'react-native-simple-toast';
import { removeAllFromCart } from '../api';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import PriceCard from '../components/PriceCard';
import { AppContext } from '../Context/appContext';
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
export default function LatestArrivalCard({
    Name,
    Image,
    Price,
    SpecialPrice,
    ProductWeight,
    VariationData,
    GotoCart,
    URLKey,
    StockAvailability,
    ProductID,
    OnPress,
}) {
    return (
        
        <TouchableOpacity onPress={OnPress}>
            <LinearGradient style={styles.mainContainer} useAngle={true} angle={45} angleCenter={{ x: 0.5, y: 0.5}} colors={[colours.kapraLow, colours.kapraLight, colours.kapraMain]} >
                <FastImage
                    style={styles.imageStyle}
                    source={{
                        uri: getImage(Image),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={styles.detailsContainer}>
                    <Text style={[styles.fontStyle1,{textAlign:'right', marginBottom:5}]} numberOfLines={2}>{Name}</Text>
                    {SpecialPrice > 0 ? (
                        <PriceCard
                            SpecialPrice={SpecialPrice}
                            UnitPrice={Price}
                            FontSize={getFontontSize(15)}
                            Color={colours.primaryWhite}
                            Vertical
                            UPColor={colours.lightRed}
                        />
                        ) : (
                        <PriceCard
                            UnitPrice={Price}
                            FontSize={getFontontSize(15)}
                            Color={colours.primaryWhite}
                            Vertical
                        />
                    )}
                    <View style={styles.seeMoreContainer}>
                      <Text style={[styles.fontStyle1,{fontSize:getFontontSize(14)}]}>View Details </Text>
                      <View>{showIcon('rightarrow', colours.primaryWhite, windowWidth * (4 / 100))}</View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth * (90 / 100),
        height: windowWidth * (35 / 100),
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'space-between',
        padding: windowWidth*(2/100),
        borderRadius: 10,
        marginRight:10,
    },
    imageStyle: {
        width: windowWidth * (30 / 100),
        height: windowWidth * (30 / 100),
        borderRadius: 10,
    },
    detailsContainer: {
        width: windowWidth * (50 / 100),
        height: windowWidth * (30 / 100),
        alignItems:'flex-end',
    },
    seeMoreContainer: {
        height: windowWidth * (8 / 100),
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center',
        backgroundColor:'rgba(255,255,255,0.5)',
        paddingHorizontal: 15, 
        borderRadius: windowWidth*(10/100),
        marginTop:5
    },
    fontStyle1: {
      fontFamily: 'Proxima Nova Alt Bold',
      fontSize: getFontontSize(18),
      color: colours.primaryWhite
    },
    fontStyle2: {
      fontFamily: 'Proxima Nova Alt Semibold',
      fontSize: getFontontSize(16),
      color: colours.primaryWhite
    },
});
