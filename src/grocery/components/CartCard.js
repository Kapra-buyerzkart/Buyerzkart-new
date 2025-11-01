import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import PriceCard from '../components/PriceCard';
import FastImage from 'react-native-fast-image'
import { AppContext } from '../../Context/appContext';
import { getFontontSize } from '../globals/GroFunctions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function CartCard({
    cartItemsId,
    cartItemsIds,
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
    QOH,
    BackOrder,
    IsAvailable
}) {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    const [indicatorStatus, setIndicatorStatus] = React.useState(false);
    const [available, setAvailable] = useState(null)

    useEffect(() => {
        if (cartItemsIds.includes(cartItemsId)) {
            setAvailable(false)
        } else {
            setAvailable(true)
        }
    }, [])

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={onCardPress}>

            {/* Product Image  */}
            <View style={styles.imageContainer}>
                <FastImage
                    style={styles.imageStyle}
                    source={{
                        uri: ImageUri,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={styles.detailsContainer}>

                {/* Name  */}
                <View style={{ justifyContent: 'center' }}>
                    <Text
                        style={[
                            styles.fontStyle1, { width: windowWidth * (72 / 100) }
                        ]}
                        numberOfLines={2}>
                        {Name}
                    </Text>
                </View>

                {/* Price & Update  */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: windowWidth * (23 / 100), justifyContent: 'center' }}>
                        {Price === UnitPrice * qty ?
                            <PriceCard
                                UnitPrice={Price}
                                FontSize={windowWidth * (3.5 / 100)}
                                Color={colours.kapraMain}
                            />
                            :
                            <PriceCard
                                SpecialPrice={Price}
                                UnitPrice={UnitPrice * qty}
                                FontSize={windowWidth * (3.5 / 100)}
                                Color={colours.kapraMain}
                            />
                        }

                    </View>
                    {
                        indicatorStatus ?
                            <View style={{ width: windowWidth * (30 / 100), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={colours.kapraMain} />
                            </View>
                            :
                            <TouchableOpacity style={styles.updateCon}>
                                <TouchableOpacity style={styles.qtyContainer}
                                    onPress={async () => {
                                        if (qty > 1) {
                                            try {
                                                setIndicatorStatus(true);
                                                await CartDecrease();
                                                setIndicatorStatus(false);
                                            } catch (error) {
                                                setIndicatorStatus(false);
                                            }

                                        } else {
                                            Delete();
                                        }
                                    }}
                                >
                                    {showIcon('mathminus', colours.kapraWhite, windowWidth * (3 / 100),)}
                                </TouchableOpacity>

                                <Text style={[styles.fontStyle1, { fontSize: getFontontSize(14), width: windowWidth * (9 / 100), textAlignVertical: 'center', textAlign: 'center', backgroundColor: colours.kapraWhite, paddingVertical: windowWidth * (1 / 100) }]}>{qty}</Text>
                                <TouchableOpacity style={styles.qtyContainer}
                                    onPress={async () => {
                                        if (maxQty === 0 || maxQty === null || maxQty >= qty) {
                                            try {
                                                setIndicatorStatus(true);
                                                await CartIncrease();
                                                setIndicatorStatus(false);
                                            } catch (error) {
                                                setIndicatorStatus(false);
                                            }
                                        }
                                    }}
                                >
                                    {showIcon('mathplus', colours.kapraWhite, windowWidth * (3 / 100),)}
                                </TouchableOpacity>
                            </TouchableOpacity>
                    }
                </View>
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
                                justifyContent: 'center',
                            }}>
                            <TouchableOpacity onPress={Delete}>
                                <Text>{showIcon('bin', colours.primaryRed, windowWidth * (5 / 100))}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            ) : (
                <Text></Text>
            )}
            {IsAvailable && available ? (
                <>
                    {
                        //    ( ( maxQty >= qty  && maxQty !=0)) ? 
                        !((maxQty && maxQty < qty && maxQty != 0) || QOH < qty || BackOrder) ?
                            <Text></Text> : <>
                                <View style={styles.overlay}>
                                    <View
                                        style={{
                                            width: windowWidth * (50 / 100),
                                            height: windowWidth * (15 / 100),
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                        }}>
                                        <Text style={[styles.overlayText, { width: windowWidth * (50 / 100), }]}>Quantity Not Available</Text>
                                    </View>
                                    <View style={styles.updateCon}>
                                        <TouchableOpacity style={styles.qtyContainer}
                                            onPress={async () => {
                                                if (qty > 1) {
                                                    await CartDecrease();
                                                } else {
                                                    Delete();
                                                }
                                            }}
                                        >
                                            {showIcon('mathminus', colours.kapraWhite, windowWidth * (3 / 100),)}
                                        </TouchableOpacity>

                                        <Text style={[styles.fontStyle1, { fontSize: windowWidth * (4 / 100), width: windowWidth * (9 / 100), textAlignVertical: 'center', textAlign: 'center', backgroundColor: colours.kapraWhite, height: windowWidth * (6 / 100) }]}>{qty}</Text>
                                        <TouchableOpacity style={styles.qtyContainer}
                                            onPress={async () => {
                                                if (maxQty >= qty || maxQty === 0) {
                                                    await CartIncrease();
                                                }
                                            }}
                                        >
                                            {showIcon('mathplus', colours.kapraWhite, windowWidth * (3 / 100),)}
                                        </TouchableOpacity>
                                    </View>

                                    <View
                                        style={{
                                            width: windowWidth * (8 / 100),
                                            height: windowWidth * (15 / 100),
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                        }}>
                                        <TouchableOpacity onPress={Delete}>
                                            <Text>{showIcon('bin', colours.primaryRed, 18)}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                    }
                </>
            ) : (
                <>
                    <View style={styles.overlay}>
                        <Text style={styles.overlayText}>Not available in your postal area</Text>
                        <View
                            style={{
                                width: windowWidth * (8 / 100),
                                height: windowWidth * (15 / 100),
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}>
                            <TouchableOpacity onPress={Delete}>
                                <Text>{showIcon('bin', colours.primaryRed, 18)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>)}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth * (91 / 100),
        height: windowWidth * (19 / 100),
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderBottomWidth: 2,
        borderColor: colours.kapraWhiteLow,
    },
    overlay: {
        position: 'absolute',
        width: windowWidth * (91 / 100),
        height: windowWidth * (17 / 100),
        borderRadius: 5,
        backgroundColor: 'rgba(230, 230, 230,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    imageContainer: {
        width: windowWidth * (15 / 100),
        height: windowWidth * (15 / 100),
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: windowWidth * (14 / 100),
        height: windowWidth * (14 / 100),
        borderRadius: 5
    },
    detailsContainer: {
        width: windowWidth * (73 / 100),
        height: windowWidth * (17 / 100),
        marginLeft: windowWidth * (2 / 100),
        justifyContent: 'space-around',
    },
    rowStyle: {
        flexDirection: 'row',
        width: windowWidth * (45 / 100),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qtyContainer: {
        width: windowWidth * (8 / 100),
        height: windowWidth * (7 / 100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateCon: {
        borderRadius: 5,
        backgroundColor: colours.kapraOrangeLight,
        height: windowWidth * (7 / 100),
        width: windowWidth * (25 / 100),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },




    fontStyle1: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(12),
        color: colours.primaryBlack
    },
    overlayText: {
        fontFamily: 'Lexend-Regular',
        fontSize: 16,
        color: colours.primaryOrange,
        width: windowWidth * (73 / 100),
        textAlign: 'center',
    },
});
