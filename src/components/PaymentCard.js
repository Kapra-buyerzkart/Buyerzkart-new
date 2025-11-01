import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { getFontontSize } from '../globals/functions';
import colours from '../globals/colours';
import PriceCard from '../components/PriceCard';
import FastImage from 'react-native-fast-image'
import { AppContext } from '../Context/appContext';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function PaymentCard({
    Name,
    Size,
    Price,
    OutofStock,
    ImageUri,
    CartIncrease,
    CartDecrease,
    Delete,
    onCardPress,
    qty = 1,
    maxQty,
    UnitPrice,
    MoveToWishlist
}) {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    const [indicatorStatus, setIndicatorStatus] = React.useState(false);

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
                <View style={{ alignItems: 'center', height: windowHeight * (6 / 100), flexDirection: 'row' }}>
                    <Text
                        style={[
                            styles.fontStyle1, { width: windowWidth * (65 / 100) }
                        ]}
                        numberOfLines={2}>
                        {Name}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: windowWidth * (23 / 100), height: windowHeight * (3 / 100), justifyContent: 'center' }}>
                        {Price === UnitPrice * qty ?
                            <PriceCard
                                UnitPrice={Price}
                                FontSize={getFontontSize(12)}
                                Color={colours.primaryGrey}
                                FromCart
                            />
                            :
                            <>
                                <PriceCard
                                    SpecialPrice={Price}
                                    UnitPrice={UnitPrice * qty}
                                    FontSize={getFontontSize(14)}
                                    Color={colours.primaryGrey}
                                    FromCart
                                />
                            </>
                        }
                    </View>
                    <Text style={styles.fontStyle1}>Quantity : {qty}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth * (94 / 100),
        height: windowHeight * (8 / 100),
        backgroundColor: colours.mozaLightWhite,
        //marginTop: '3%',
        marginBottom: '3%',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 2,
        flexDirection: 'row',
        padding: windowHeight * (0.5 / 100),
        paddingHorizontal: windowWidth * (5 / 100),
    },
    overlay: {
        position: 'absolute',
        width: windowWidth * (100 / 100),
        height: windowHeight * (8 / 100),
        marginTop: windowHeight * (2.5 / 100),
        backgroundColor: 'rgba(230, 230, 230,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    imageContainer: {
        width: windowHeight * (7 / 100),
        height: windowHeight * (7 / 100),
    },
    imageStyle: {
        width: windowHeight * (7 / 100),
        height: windowHeight * (7 / 100),
    },
    detailsContainer: {
        width: windowWidth * (85 / 100),
        marginLeft: windowWidth * (5 / 100),
    },
    rowStyle: {
        flexDirection: 'row',
        width: windowWidth * (45 / 100),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fontStyle1: {
        fontFamily: 'Proxima Nova Alt Semibold',
        fontSize: getFontontSize(14),
        color: colours.primaryGrey
    },
    overlayText: {
        fontWeight: 'bold',
        fontSize: getFontontSize(16),
        color: colours.primaryOrange,
        width: windowWidth * (73 / 100),
        textAlign: 'center',
    },
});
