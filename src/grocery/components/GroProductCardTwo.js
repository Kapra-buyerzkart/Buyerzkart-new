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

export default function GroProductCardTwo({
    onPress,
    item
}) {




    return (
        <TouchableOpacity onPress={onPress} style={styles.productCard}>
            <View style={styles.productCardViewTwo}>
                <FastImage
                    style={styles.productCardImage}
                    source={{
                        uri: getImage(item.featuredImage),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>

            <View style={{
                // alignSelf: "center",
                // backgroundColor: 'red',
                flex: 1,
                justifyContent: 'space-between'
            }}>
                <View style={{
                    // flex: 1,
                    justifyContent: 'center'
                }}>
                    <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.productNameText}>{item.ProductName.toUpperCase()}</Text>
                </View>
                <Text style={styles.categoryText}>{item.catName}</Text>
            </View>
            <View style={styles.addButton}>
                <Text style={styles.addText}>ADD</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productCard: {
        width: wp('27%'),
        // height: hp('26%'),
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: wp('1.9%'),
        // marginRight: wp('3%'),
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
        fontFamily: 'Outfit-Medium',
        fontSize: wp("2.75%"),
        color: "#000000",
        textAlign: "center",
        marginTop: hp("0.5%"),
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
    // addButton: {
    //     width: windowWidth * (20 / 100),
    //     height: windowWidth * (8 / 100),
    //     borderRadius: windowWidth * (2 / 100),
    //     marginLeft: windowWidth * (1 / 100),
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     backgroundColor: colours.kapraOrange,
    //     borderRadius: 10,
    // },
    // addText: {
    //     color: colours.primaryWhite,
    //     fontFamily: 'Lexend-Bold',
    //     fontSize: getFontontSize(13),
    // },
    categoryText: {
        fontFamily: 'Outfit-Light',
        fontSize: wp("2.5%"),
        color: "#000000",
        textAlign: "center",
        marginTop: hp("0.5%"),
    },
    addButton: {
        backgroundColor: colours.kapraOrange,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: wp('0.5%'),
        borderRadius: 7,
        paddingHorizontal: wp('5%'),
        marginTop: hp("0.9%"),
    },
    addText: {
        color: colours.kapraWhite,
        fontFamily: 'Outfit-Bold',
        fontSize: wp("2.8%"),
    }
})