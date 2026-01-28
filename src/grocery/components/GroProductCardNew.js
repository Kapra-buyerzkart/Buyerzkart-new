import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator, Modal, Platform, Pressable, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native';
import { getFontontSize, getImage } from '../globals/GroFunctions';
import FastImage from 'react-native-fast-image';
import colours from '../../globals/colours';
import { AppContext } from '../../Context/appContext';
import showIcon from '../../globals/icons';
import Toast from 'react-native-simple-toast';
import { addtoCart, RemoveCartItemByUrlkey, decreaseCartItemByURLKey } from '../api';
import WishIcon from './WishIcon';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import PriceCard from '../../components/PriceCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroProductCardNew({
    OnPress,
    Name,
    Image,
    Price,
    SpecialPrice,
    URLKey,
    ProductID,
    StockAvailability,
    Variations,
    BGColor,
    ProductWeight,
    NoBlur,
    BTValue
}) {
    const [liked, setLiked] = useState(false);
    const navigation = useNavigation()
    const { profile, GroUpdateCart, GroCartData } = useContext(AppContext);
    const [loaderStatus, setLoaderStatus] = React.useState(false);

    const [variationModal, setVariationModal] = React.useState(false);
    const [choosenIndex, setChoosenIndex] = React.useState(0);
    const [VariationData, setVarientsData] = React.useState(null);

    useEffect(() => {
        try {
            JSON.parse(Variations);
            setVarientsData(JSON.parse(Variations))
        } catch (e) {
            setVarientsData(null)
        }
    }, []);

    const AddtoCart = async (Url) => {
        try {
            setLoaderStatus(true);
            let res = await addtoCart(Url);
            await GroUpdateCart();
            setLoaderStatus(false);
        } catch (err) {
            setLoaderStatus(false);
            Toast.show(err.Message ? err.Message : err ? err : "Something wrong!");
        }
    }

    const decreaseCartCount = async (Url) => {
        try {
            setLoaderStatus(true);
            let res = await decreaseCartItemByURLKey(Url);
            await GroUpdateCart();
            // Toast.show("Item count decreased.");
            setLoaderStatus(false);
        } catch (err) {
            setLoaderStatus(false);
            Toast.show(err.Message ? err.Message : err ? err : "Something wrong!");
        }
    }

    const deleteFromCart = async (Url) => {
        try {
            setLoaderStatus(true);
            let res = await RemoveCartItemByUrlkey(Url);
            await GroUpdateCart();
            // Toast.show("Removed From Cart");
            setLoaderStatus(false);
        } catch (err) {
            setLoaderStatus(false);
            Toast.show(err.Message ? err.Message : err ? err : "Something wrong!");
        }
    }

    return (
        <TouchableOpacity onPress={OnPress} style={styles.productCard}>
            <View style={styles.productCardViewOne}>
                {/* <EvilIcons name={"heart"} size={wp("7%")} /> */}
                {/* <TouchableOpacity onPress={() => setLiked(!liked)}>
                    <FontAwesome
                        name={liked ? 'heart' : 'heart-o'}
                        size={wp('5%')}
                        color={liked ? '#FF0048' : '#979797'}
                    />
                </TouchableOpacity> */}
                <WishIcon
                    ProductID={ProductID}
                    urlKey={URLKey}
                />
                {
                    BTValue && BTValue > 0
                        && StockAvailability !== 'Out Of Stock'
                        && !(GroCartData[ProductID] && GroCartData[ProductID] > 0) && !loaderStatus
                        ? <Text style={styles.btokenText}>Upto {BTValue}B Token</Text>
                        : null
                }
                {/* <View style={styles.plusIconView}>
                    <Entypo name={"plus"} color={"#FFFFFF"} size={wp("3.8%")} />
                </View> */}
                <View style={{
                    alignItems: 'center',
                }}>
                    <View style={{ height: windowWidth * (7 / 100), justifyContent: 'center' }}>
                        {
                            loaderStatus ?
                                <View style={[styles.addCartCon, { justifyContent: 'center' }]}>
                                    <ActivityIndicator size={12} color={colours.kapraOrange} />
                                </View>
                                :
                                StockAvailability === 'Out Of Stock' ?
                                    <View style={[styles.addCartCon, { justifyContent: 'center' }]}>
                                        <Text style={[styles.fontStyle2, { color: colours.primaryRed }]}>SOLD OUT</Text>
                                    </View>
                                    :
                                    GroCartData[ProductID] && GroCartData[ProductID] > 0 ?
                                        VariationData ?
                                            <View style={[styles.addCartCon, { justifyContent: 'space-between' }]}>
                                                <TouchableOpacity style={styles.minusButton} onPress={() => setVariationModal(true)}>
                                                    {showIcon('mathminus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                                </TouchableOpacity>
                                                <Text style={[styles.fontStyle2, { color: colours.primaryBlack }]}>{GroCartData[ProductID]}</Text>
                                                <TouchableOpacity style={styles.addCartSecondCon} onPress={() => setVariationModal(true)}>
                                                    {showIcon('mathplus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View style={[styles.addCartCon, { justifyContent: 'space-between', backgroundColor: GroCartData[ProductID] > 0 ? colours.primaryWhite : colours.kapraMain }]}>
                                                <TouchableOpacity style={styles.minusButton} onPress={() => GroCartData[ProductID] > 1 ? decreaseCartCount(URLKey) : deleteFromCart(URLKey)}>
                                                    {showIcon('mathminus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                                </TouchableOpacity>
                                                <Text style={[styles.fontStyle2, { color: colours.primaryBlack }]}>{GroCartData[ProductID]}</Text>
                                                <TouchableOpacity style={styles.addCartSecondCon} onPress={() => AddtoCart(URLKey)}>
                                                    {showIcon('mathplus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                                </TouchableOpacity>
                                            </View>
                                        :
                                        VariationData ?
                                            <TouchableOpacity style={[styles.plusIconCon]} onPress={() => setVariationModal(true)}>
                                                {showIcon('mathplus', colours.kapraWhite, windowWidth * (4 / 100))}
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity style={[styles.plusIconCon]} onPress={() => AddtoCart(URLKey)}>
                                                {showIcon('mathplus', colours.kapraWhite, windowWidth * (4 / 100))}
                                            </TouchableOpacity>
                        }
                    </View>
                </View>

            </View>
            <View style={styles.productCardViewTwo}>
                <FastImage
                    style={styles.productCardImage}
                    source={{ uri: getImage(Image), priority: FastImage.priority.normal, }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>

            <View style={styles.productCardViewThree}>
                {/* <View>
                    {
                        SpecialPrice > 0 && (((Price - SpecialPrice) / Price) * 100).toFixed(0) > 0 && (
                            <Text style={styles.offerText}>
                                {(((Price - SpecialPrice) / Price) * 100).toFixed(0)}% Off
                            </Text>
                        )
                    }
                </View> */}

                <View>
                    {/* <View style={styles.productCardViewFour}>
                        <Text style={styles.mrpText}>MRP </Text>
                        <Text style={[styles.mrpText, {
                            textDecorationLine: "line-through",
                            textDecorationColor: "#777777"
                        }]}>₹394</Text>

                    </View>
                    <View style={styles.priceView}>
                        <Text style={styles.priceText}>₹324</Text>
                    </View> */}
                    {SpecialPrice && SpecialPrice !== Price && SpecialPrice !== 0 ? (
                        <>
                            <View style={styles.productCardViewFour}>
                                <Text style={styles.mrpText}>MRP </Text>
                                <Text style={[styles.mrpText, {
                                    textDecorationLine: "line-through",
                                    textDecorationColor: "#777777"
                                }]}>₹{SpecialPrice}</Text>

                            </View>
                            <View style={styles.priceView}>
                                <Text style={styles.priceText}>₹{Price}</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={[styles.productCardViewFour, {
                                opacity: 0
                            }]}>
                                <Text style={styles.mrpText}>MRP </Text>
                                <Text style={[styles.mrpText, {
                                    textDecorationLine: "line-through",
                                    textDecorationColor: "#777777"
                                }]}>₹394</Text>

                            </View>
                            <View style={styles.priceView}>
                                <Text style={styles.priceText}>₹{Price}</Text>
                            </View>
                        </>
                    )}
                </View>
                <View>
                    {
                        SpecialPrice > 0 && (((Price - SpecialPrice) / Price) * 100).toFixed(0) > 0 && (
                            <Text style={styles.offerText}>
                                {(((Price - SpecialPrice) / Price) * 100).toFixed(0)}% Off
                            </Text>
                        )
                    }
                </View>
            </View>
            <View style={{
                // alignSelf: "center",
                // backgroundColor: 'red',
                flex: 1,
                justifyContent: 'center'
            }}>
                <Text style={styles.productNameText}>{Name}</Text>
            </View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={variationModal}
                onRequestClose={() => setVariationModal(false)}
                animationInTiming={2000}
                animationOutTiming={2000}
            >
                <BlurView
                    style={styles.blurStyle}
                    blurType="light"
                    blurAmount={1}
                    overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
                    reducedTransparencyFallbackColor='black'
                />
                <Pressable style={styles.commonModalStyle}>

                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colours.kapraOrangeDark, colours.kapraOrange]}
                        style={styles.variationModalView}
                    >
                        <Text style={[styles.titleFont, { fontSize: getFontontSize(16), color: colours.primaryWhite }]} >Select the Quantity</Text>
                        <Text onPress={() => setVariationModal(false)}>
                            {showIcon('close', colours.primaryWhite, windowWidth * (5 / 100))}
                        </Text>
                    </LinearGradient>

                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}
                    >
                        {
                            VariationData && VariationData[0].AttrValues.map((item, index) => (
                                <Pressable style={styles.variationView}>
                                    <View style={{ width: windowWidth * (60 / 100) }}>
                                        <Text style={[styles.titleFont, { color: colours.primaryBlack, marginBottom: 10, fontSize: getFontontSize(14), }]} numberOfLines={2}>
                                            {item.prName}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                                (item.prSpecialPrice && item.prSpecialPrice != 0 && item.prSpecialPrice != item.prPrice) ?
                                                    <PriceCard
                                                        SpecialPrice={parseFloat(item.prSpecialPrice)}
                                                        UnitPrice={parseFloat(item.prPrice)}
                                                        FontSize={15}
                                                    />
                                                    :
                                                    <PriceCard
                                                        UnitPrice={parseFloat(item.prPrice)}
                                                        FontSize={15}
                                                    />
                                            }
                                            {
                                                item.prSpecialPrice && item.prSpecialPrice != 0 && item.prSpecialPrice != item.prPrice ?
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 0, y: 1 }}
                                                        colors={[colours.kapraOrangeDark, colours.kapraOrange,]}
                                                        style={styles.offerContainer}
                                                    >
                                                        <Text style={[styles.offerText, { color: colours.primaryWhite }]}>{(((item.prPrice - item.prSpecialPrice) / item.prPrice) * 100).toFixed(0)} % Off</Text>
                                                    </LinearGradient>
                                                    :
                                                    null
                                            }
                                        </View>
                                    </View>
                                    <View>
                                        {
                                            loaderStatus && index === choosenIndex ?
                                                <View style={[styles.addCartCon, { justifyContent: 'center' }]}>
                                                    <ActivityIndicator size={12} color={colours.kapraOrange} />
                                                </View>
                                                :
                                                item.prStock !== "In Stock" ?
                                                    <View style={[styles.addCartCon, { justifyContent: 'center' }]}>
                                                        <Text style={[styles.fontStyle2, { color: colours.primaryRed }]}>SOLD OUT</Text>
                                                    </View>
                                                    :
                                                    GroCartData[item.productId] && GroCartData[item.productId] > 0 ?
                                                        <View style={[styles.addCartCon, { justifyContent: 'space-between' }]}>
                                                            <TouchableOpacity style={styles.minusButton} onPress={() => { GroCartData[item.productId] > 1 ? (decreaseCartCount(item.prUrlkey), setChoosenIndex(index)) : (deleteFromCart(item.prUrlkey), setChoosenIndex(index)) }}>
                                                                {showIcon('mathminus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                                            </TouchableOpacity>
                                                            <Text style={[styles.fontStyle2, { color: colours.primaryBlack }]}>{GroCartData[item.productId]}</Text>
                                                            <TouchableOpacity style={styles.addCartSecondCon} onPress={() => { AddtoCart(item.prUrlkey), setChoosenIndex(index) }}>
                                                                {showIcon('mathplus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                                            </TouchableOpacity>
                                                        </View>
                                                        :
                                                        <TouchableOpacity style={[styles.addButton]} onPress={() => { AddtoCart(item.prUrlkey), setChoosenIndex(index) }}>
                                                            <Text style={styles.addText}>
                                                                Add
                                                            </Text>
                                                        </TouchableOpacity>
                                        }
                                    </View>
                                </Pressable>
                            ))
                        }
                    </ScrollView>
                </Pressable>
            </Modal>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productCard: {
        width: wp('36%'),
        // height: hp('26%'),
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: wp('1.9%'),
        marginRight: wp('3%'),
        shadowColor: '#000000',
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        elevation: 3,
        // marginTop: hp("1.5%"),
        // alignItems:'center'
        // width: wp('34%'),
        // height: hp('23%'),
        // backgroundColor: '#FFFFFF',
        // borderRadius: 20,
        // padding: wp('3%'),
        // marginRight: wp('4%'),
        // shadowColor: '#000',
        // shadowOpacity: 0.10,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
        // elevation: 3,
    },
    productCardViewOne: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "yellow",
    },
    btokenText: {
        fontFamily: 'Outfit-Regular',
        fontSize: wp("2.3%"),
        color: "#5E3568"
    },
    plusIconView: {
        backgroundColor: "#F04B1B",
        padding: wp("1%"),
        borderRadius: 100
    },
    productCardViewTwo: {
        // backgroundColor:"blue",
        alignItems: "center"
    },
    productCardImage: {
        width: wp("24.65%"),
        height: wp("23.25%")
    },
    productCardViewThree: {
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor: "yellow",
        alignItems: "center"
    },
    offerText: {
        color: "#F04B1B",
        fontSize: wp("3%"),
        fontFamily: 'Outfit-SemiBold'
    },
    productCardViewFour: {
        flexDirection: "row",
        alignItems: "center"
    },
    mrpText: {
        fontFamily: 'Poppins-Light',
        fontSize: wp("2.5%"),
        color: "#777777"
    },
    priceView: {
        // flexDirection: "row",
        alignItems: "center",
        borderColor: "#0CA201",
        borderWidth: 1,
        borderRadius: 8,
        padding: wp("0.5%")
    },
    priceText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp("3.7%"),
        color: "#0CA201"
    },
    productNameText: {
        // fontFamily: "Outfit-Light",
        fontFamily: 'Outfit-Light',
        fontSize: wp("3.25%"),
        color: "#000000",
        textAlign: "center",
        marginTop: hp("0.5%")
    },
    addCartCon: {
        width: windowWidth * (20 / 100),
        height: windowWidth * (8 / 100),
        borderWidth: 0.5,
        borderRadius: windowWidth * (2 / 100),
        borderColor: colours.kapraOrange,
        backgroundColor: colours.kapraWhite,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    minusButton: {
        width: windowWidth * (7 / 100),
        height: windowWidth * (8 / 100),
        alignItems: 'center',
        justifyContent: 'center'
    },
    addCartSecondCon: {
        width: windowWidth * (7 / 100),
        height: windowWidth * (8 / 100),
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusIconCon: {
        width: windowWidth * (8 / 100),
        height: windowWidth * (8 / 100),
        borderRadius: windowWidth * (4 / 100),
        backgroundColor: colours.kapraOrangeLight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fontStyle2: {
        fontFamily: 'Lexend-Medium',
        fontSize: getFontontSize(12),
        color: colours.primaryWhite
    },
    blurStyle: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: null,
        overflow: 'hidden'
    },
    commonModalStyle: {
        width: windowWidth,
        height: windowHeight * (50 / 100),
        backgroundColor: colours.primaryWhite,
        marginTop: windowHeight * (50 / 100),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
        alignItems: 'center'
    },
    variationModalView: {
        width: windowWidth,
        height: windowHeight * (7 / 100),
        backgroundColor: colours.kapraOrange,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: windowWidth * (3 / 100),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleFont: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(12),
        color: colours.kapraBlack,
    },
    variationView: {
        width: windowWidth * (94 / 100),
        marginHorizontal: windowWidth * (3 / 100),
        borderWidth: 2,
        borderRadius: 5,
        borderColor: colours.primaryBlue,
        marginTop: 10,
        padding: windowWidth * (3 / 100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    offerContainer: {
        paddingHorizontal: 10,
        borderRadius: 5,
        height: windowHeight * (3 / 100),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    addButton: {
        width: windowWidth * (20 / 100),
        height: windowWidth * (8 / 100),
        borderRadius: windowWidth * (2 / 100),
        marginLeft: windowWidth * (1 / 100),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colours.kapraOrange,
        borderRadius: 10,
    },
    addText: {
        color: colours.primaryWhite,
        fontFamily: 'Lexend-Bold',
        fontSize: getFontontSize(13),
    },
})