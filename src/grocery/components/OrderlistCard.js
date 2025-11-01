import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';

import colours from '../../globals/colours';
import moment from 'moment';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import FastImage from 'react-native-fast-image';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function OrderlistCard({
    Amount,
    OnPress,
    Data,
    ReOrder
}) {
    
    return (
        <View style={styles.container}>
            {/* Order Num & Date  */}
            <View style={styles.orderNumCon}>
                <Image
                    source={require('../../assets/images/OrdersList1.png')}
                    style={styles.ordImg}
                />
                <View>
                    <Text style={styles.headerText}>#{Data.orderNumber}</Text>
                    <Text style={styles.timeText}>Placed on {moment(Data.orderDate).utcOffset('+05:30').format('DD MMM, YYYY')} at {moment(Data.orderDate).utcOffset('+05:30').format('hh:mm a').toUpperCase()}</Text>
                </View>
            </View>

            {/* Order Item & Price Con  */}
            <View style={styles.orderItemCon}>
                
                <View style={{
                    width: windowWidth*(25/100),
                    flexDirection: 'row'
                }}>
                    <View style={styles.orderItemImg}>
                    <Image 
                        style={styles.orderImg}
                        source={{uri: getImage(JSON.parse(Data?.orderedProductImgUrls)[0]?.imageUrl)}}
                    />
                    </View>
                    {
                    JSON.parse(Data?.orderedProductImgUrls)?.length > 1 &&(
                        <View style={[styles.orderItemImg,{left: windowWidth*(6/100), position:'absolute'}]}>
                        <Image 
                            style={styles.orderImg}
                            source={{uri: getImage(JSON.parse(Data?.orderedProductImgUrls)[1]?.imageUrl)}}
                        />
                        </View>
                    )
                    }
                    {
                    JSON.parse(Data?.orderedProductImgUrls)?.length > 2 &&(
                        <View style={[styles.orderItemImg,{left: windowWidth*(12/100), position:'absolute'}]}>
                        <FastImage 
                            style={styles.orderImg}
                            source={{uri: getImage(JSON.parse(Data?.orderedProductImgUrls)[2]?.imageUrl)}}
                        />
                        </View>
                    )
                    }
                    {
                    JSON.parse(Data?.orderedProductImgUrls)?.length > 3 &&(
                        <View style={[styles.orderItemImg,{left: windowWidth*(18/100), position:'absolute'}]}>
                        <Text style={styles.fontStyle4}>+{(JSON.parse(Data?.orderedProductImgUrls)?.length)-3}</Text>
                        </View>
                    )
                    } 
                </View>
                <Text style={styles.headerText}>₹ {Amount}</Text>
            </View>

            {/* Buttons Con  */}
            <View style={styles.buttonCon}>
                <TouchableOpacity style={[styles.buttonStyle,{backgroundColor: colours.kapraOrangeLight}]} onPress={OnPress}>
                    <Text style={[styles.fontStyle2,{color: colours.kapraWhite}]}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={ReOrder}>
                    <Text style={styles.fontStyle2}>Reorder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth*(90/100),
        padding: windowWidth*(2/100),
        backgroundColor:colours.primaryWhite,
        marginTop:10,
    },
    orderNumCon: {
        width: windowWidth*(84/100),
        flexDirection:'row',
        alignItems:'center',
    },
    ordImg: {
        width: windowWidth*(6/100),
        height: windowWidth*(6/100),
        marginRight: windowWidth*(3/100),
        resizeMode:'contain'
    },
    
    orderItemCon: {
        width: windowWidth*(84/100),
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        borderBottomWidth:2,
        borderColor: colours.kapraWhiteLow,
    },
    orderItemImg: {
        width: windowWidth*(12/100),
        height: windowWidth*(12/100),
        borderRadius: windowWidth*(6/100),
        backgroundColor: colours.kapraWhite,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10,
        borderWidth: 2,
        borderColor: colours.kapraWhiteLow,
    },
    orderImg: {
        width: windowWidth*(8/100),
        height: windowWidth*(8/100),
        borderRadius: windowWidth*(4/100),
        backgroundColor: colours.kapraWhite,
    },
    buttonCon: {
        flexDirection:'row',
        justifyContent: 'space-between',
        width: windowWidth*(84/100)
    },
    buttonStyle: {
        width:windowWidth*(40/100),
        height:windowWidth*(9/100),
        borderBottomWidth:1,
        alignItems:'center',
        justifyContent:'center',
        borderColor: colours.kapraWhiteLow,
        borderRadius:5,
        marginTop:10,
        borderWidth:1
    },


    // Font Styles
    headerText: {
        fontFamily: 'Lexend-SemiBold',
        fontSize: getFontontSize(15),
        color: colours.kapraBlack,
    },
    timeText: {
        fontFamily: 'Lexend-Light',
        fontSize: getFontontSize(12),
        color: colours.kapraBlackLow,
    },
    fontStyle1: {
        fontFamily: 'Lexend-SemiBold',
        fontSize: getFontontSize(12),
        color: colours.kapraBlackLow,
    },
    fontStyle2: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(15),
        color: colours.kapraBlack
    },
    fontStyle4: {
        fontFamily: 'Lexend-Light',
        fontSize: getFontontSize(9),
        color: colours.kapraBlackLow,
        textAlign:'center'
    }

});
