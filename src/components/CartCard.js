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

import showIcon from '../globals/icons';
import colours from '../globals/colours';
import PriceCard from '../components/PriceCard';
import FastImage from 'react-native-fast-image'
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import { AppContext } from '../Context/appContext';
import { I18nManager } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function CartCard({
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
                <View style={{ justifyContent: 'center' }}>
                    <Text
                        style={[
                            styles.fontStyle1, { width: windowWidth * (62 / 100) }
                        ]}
                        numberOfLines={2}>
                        {Name}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: windowWidth * (23 / 100), justifyContent: 'center' }}>
                        {Price === UnitPrice * qty ?
                            <PriceCard
                                UnitPrice={Price}
                                FontSize={windowWidth * (3.5 / 100)}
                                Color={colours.kapraLight}
                                FromCart
                            />
                            :
                            <PriceCard
                                SpecialPrice={Price}
                                UnitPrice={UnitPrice * qty}
                                FontSize={windowWidth * (3.5 / 100)}
                                Color={colours.kapraLight}
                                FromCart
                            />
                        }

                    </View>
                    {
                        indicatorStatus ?
                            <View style={{ width: windowWidth * (30 / 100), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={colours.kapraLight} />
                            </View>
                            :
                            <TouchableOpacity style={{ width: windowWidth * (30 / 100), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
                                    <Text style={styles.fontStyle1}> {showIcon('mathminus', colours.primaryRed, windowWidth * (3 / 100),)} </Text>
                                </TouchableOpacity>

                                <Text style={[styles.fontStyle1, { fontSize: windowWidth * (4 / 100), marginLeft: 5, marginRight: 5 }]}> {qty} </Text>
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
                                    <Text style={[styles.fontStyle1]}> {showIcon('mathplus', colours.primaryRed, windowWidth * (3 / 100),)} </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                    }
                    <View style={{ width: windowWidth * (13 / 100), height: windowHeight * (3 / 100), justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={Delete}>
                            <Text>{showIcon('bin1', colours.primaryRed, windowWidth * (5 / 100))}</Text>
                        </TouchableOpacity>
                    </View>
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
            {IsAvailable ? (
                <>
                    {
                        BackOrder || QOH >= qty ? <Text></Text> : <>
                            <View style={styles.overlay}>
                                <View
                                    style={{
                                        width: windowWidth * (50 / 100),
                                        height: windowWidth * (15 / 100),
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={styles.overlayText}>Quantity Not Available</Text>
                                </View>
                                <View
                                    style={{
                                        width: windowWidth * (20 / 100),
                                        height: windowWidth * (15 / 100),
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                    }}>
                                    <View style={{ width: windowWidth * (35 / 100), height: windowHeight * (7 / 100), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.qtyContainer}
                                            onPress={async () => {
                                                if (qty > 1) {
                                                    await CartDecrease();
                                                } else {
                                                    Delete();
                                                }
                                            }}
                                        >
                                            <Text style={styles.fontStyle1}> - </Text>
                                        </TouchableOpacity>

                                        <Text style={[styles.fontStyle1, { fontSize: 15, marginLeft: 5, marginRight: 5 }]}> {qty} </Text>
                                        <TouchableOpacity style={styles.qtyContainer}
                                            onPress={async () => {
                                                if (maxQty >= qty || maxQty === 0) {
                                                    await CartIncrease();
                                                }
                                            }}
                                        >
                                            <Text style={[styles.fontStyle1]}> + </Text>
                                        </TouchableOpacity>
                                    </View>
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
                        <Text style={styles.overlayText}>Not Available</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        width: windowWidth * (91 / 100),
        height: windowWidth * (27 / 100),
        marginLeft: windowWidth * (1 / 100),
        backgroundColor: colours.lowWhite,
        marginBottom: '3%',
        borderRadius: 5,
        //marginTop: '3%',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 2,
    },
    overlay: {
        position: 'absolute',
        width: windowWidth * (100 / 100),
        height: windowHeight * (10 / 100),
        marginTop: windowHeight * (2.5 / 100),
        backgroundColor: 'rgba(230, 230, 230,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    imageContainer: {
        width: windowWidth * (25 / 100),
        height: windowWidth * (25 / 100),
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: windowWidth * (24 / 100),
        height: windowWidth * (24 / 100),
    },
    detailsContainer: {
        width: windowWidth * (63 / 100),
        height: windowWidth * (27 / 100),
        marginLeft: windowWidth * (2 / 100),
        justifyContent: 'space-around',
    },
    rowStyle: {
        flexDirection: 'row',
        width: windowWidth * (45 / 100),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fontStyle1: {
        fontFamily: 'Proxima Nova Alt Bold',
        fontSize: windowWidth * (3.5 / 100),
        color: colours.primaryBlack
    },
    overlayText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colours.primaryOrange,
        width: windowWidth * (73 / 100),
        textAlign: 'center',
    },
    qtyContainer: {
        width: windowWidth * (6 / 100),
        height: windowWidth * (6 / 100),
        borderWidth: 0.5,
        borderRadius: windowWidth * (3 / 100),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colours.kapraLight,
        paddingTop: Platform.OS === 'ios' ? 5 : null,
    }
});
