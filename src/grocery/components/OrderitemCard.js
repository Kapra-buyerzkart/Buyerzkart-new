import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import colours from '../../globals/colours';
import PriceCard from '../components/PriceCard';
import { AppContext } from '../../Context/appContext';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import FastImage from 'react-native-fast-image';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function OrderitemCard({
    Name,
    Image,
    Price,
    SpecialPrice,
    OnPress,
    QTY,
    ProductWeight,
    ReturnStatus,
    Reviewstatus,
    OrderStatus,
    RequestReturn,
    WriteReviewPress
}) {

    const {profile} = useContext(AppContext);
    // React.useMemo(() => {
        
    // }, []);

    return (
        <TouchableOpacity
            onPress={OnPress}
            style={styles.container}
        >
            <View style={styles.menuContainer}>
                <FastImage
                    style={styles.menuIconStyle}
                    source={{
                        uri: getImage(Image),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuTitleText,{ width: windowWidth*(50/100)}]} numberOfLines={2}>
                        {`${Name} (${parseInt(QTY)})`}
                    </Text>
                    <Text style={[styles.menuTitleText,{ width: windowWidth*(45/100)}]} numberOfLines={2}>
                        {ProductWeight}
                    </Text>
                </View>
                <View style={styles.arrowContainer}>
                    {
                        SpecialPrice && Price > SpecialPrice?
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={[styles.fontStyle4, { fontSize: getFontontSize(14), color: colours.primaryGrey }]}>₹ {parseFloat(SpecialPrice).toFixed(2)}</Text>
                            <Text style={[styles.fontStyle4, { fontSize: getFontontSize(12), textDecorationLine: 'line-through', textDecorationStyle: 'solid', color:colours.primaryRed}]}>₹ {parseFloat(Price).toFixed(2)}</Text>
                        </View>
                        :
                        <PriceCard
                            SpecialPrice={SpecialPrice}
                            UnitPrice={Price}
                            FontSize={13}
                            Color={colours.primaryGrey}
                            Vertical
                        />

                    }
                    
                </View>
            </View>
            {
                (OrderStatus === 'Order Delivered' && Reviewstatus != 0) || ReturnStatus !=0 ?(
                    <View style={styles.reviewReturnCon}>
                        {
                            ReturnStatus !=0 ?
                            <TouchableOpacity style={styles.inBtnCon} onPress={RequestReturn}>
                                <Text style={[styles.fontStyle2,{color: colours.lightRed}]}>RETURN</Text>
                            </TouchableOpacity>
                            :
                            null

                        }
                        {
                            OrderStatus === 'Order Delivered' && Reviewstatus != 0?
                            <TouchableOpacity style={[styles.inBtnCon,{borderColor: colours.kapraOrangeLight}]} onPress={WriteReviewPress}>
                                <Text style={[styles.fontStyle2,{color: colours.kapraOrangeLight}]}>REVIEW PRODUCT</Text>
                            </TouchableOpacity>
                            :
                            null
                        }
                    </View>
                )
                :
                null
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (94 / 100),
        // height:windowWidth*(17/100), 
        backgroundColor:colours.primaryWhite,
        // flexDirection:'row',
        alignItems: 'center',
        marginHorizontal:1,
        paddingLeft:5,
        marginBottom:10,
        borderRadius:5,
        paddingBottom:5,
        borderBottomWidth:2,
        borderColor:colours.kapraWhiteLow
        
    },
    reviewReturnCon: {
        width: windowWidth * (90 / 100),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical:10
    },
    inBtnCon: {
        borderWidth:1,
        borderRadius:2,
        padding:5,
        borderColor: colours.lightRed,
        marginLeft:5
    },
    menuIconStyle: {
        width:windowWidth*(15/100), 
        height:windowWidth*(15/100), 
        backgroundColor:colours.primaryWhite, 
        borderRadius:5, 
        alignItems:'center', 
        justifyContent:'center'
    },
    menuIconContainer: {
        width:windowWidth*(17/100), 
        height:windowWidth*(17/100), 
        alignItems:'center', 
        justifyContent:'center',
    },
    menuContainer: {
        width:windowWidth*(92/100), 
        alignItems:'center', 
        flexDirection:'row',
        justifyContent:'space-between',
    },
    menuTextContainer: { 
        width: windowWidth*(55/100), 
        height:windowWidth*(15/100), 
        justifyContent:'center',
    },
    menuTextTopContainer: { 
        width: windowWidth*(72/100), 
        height:windowWidth*(8/100), 
        flexDirection:'row',
        justifyContent:'space-between', 
        alignItems:'center'
    },
    arrowContainer: { 
        width: windowWidth*(20/100), 
        height:windowWidth*(15/100), 
        alignItems:'center', 
        justifyContent:'center'
    },
    
    fontStyle2: {
        fontFamily: 'Lexend-SemiBold',
        fontSize: getFontontSize(13),
        color:colours.kapraMain
    },
    fontStyle4: {
        fontFamily: 'Lexend-Medium',
        fontSize: getFontontSize(9),
        color: colours.kapraMain
    },
    menuTitleText: {
        fontFamily: 'Lexend-Medium',
        fontSize: getFontontSize(12),
        color:colours.primaryBlack
    },
});
