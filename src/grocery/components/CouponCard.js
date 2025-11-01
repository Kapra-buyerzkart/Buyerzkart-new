import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    OnPress,
    Pressable,
} from 'react-native';
import colours from '../../globals/colours';
import { AppContext } from '../../Context/appContext';
import { getFontontSize } from '../globals/GroFunctions';
import CheckBox from '@react-native-community/checkbox';

const windowWidth = Dimensions.get('window').width;
export default function CouponCard({
    Data,
    OnPress,
    CartSum
}) {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    return (
        <Pressable style={styles.mainContainer}>
            <Image
              source={require('../../assets/images/coupon.png')}
              style={{
                height: windowWidth*(30/100),
                width: windowWidth*(10/100),
                resizeMode: 'contain',
                tintColor:CartSum>Data.cpMinOrderAmount?colours.primaryGreen:colours.primaryGrey
              }}
            />
          <View style={styles.codeContainer}>
            <Text style={styles.fontStyle2}>
                {Data.cpCode.toUpperCase()}
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.upperContainer}>
                <Text style={styles.fontStyle3}>
                {Data.cpCode.toUpperCase()}
                </Text>
                {/* <CheckBox
                    // value={isSelected}
                    style={styles.checkbox}
                    disabled={false}
                    tintColors={{ true: colours.lightBlue, false:colours.primaryBlue}}
                    onCheckColor={colours.primaryGreen}
                    onTintColor={colours.primaryGreen}
                /> */}
                <TouchableOpacity style={{padding:10, borderRadius:5, marginLeft:10}} onPress={()=>CartSum>=Data.cpMinOrderAmount?OnPress():null}>
                    <Text style={[styles.fontStyle3,{ color: CartSum>=Data.cpMinOrderAmount?colours.primaryGreen:colours.primaryGrey}]}>APPLY</Text>
                </TouchableOpacity>
            </View>
            {Data.cpMode === "PERCENTAGE" ?
                <View style={styles.lowerContainer}>
                    <Text style={[styles.fontStyle4,{fontFamily: 'Montserrat-SemiBold',fontSize: getFontontSize(15),}]}>
                    Get {Data.cpAmount}% OFF up to ₹{Data.cpCap}
                    </Text>
                    <Text style={styles.fontStyle4}>
                    Valid on total value of items worth ₹{Data.cpMinOrderAmount} or more
                    </Text>
                </View>
            :
                <View style={styles.lowerContainer}>
                    <Text style={[styles.fontStyle4,{fontFamily: 'Montserrat-SemiBold',fontSize: getFontontSize(15),}]}>
                    Get Flat ₹{Data.cpAmount} OFF
                    </Text>
                    <Text style={styles.fontStyle4}>
                    Valid on total value of items worth ₹{Data.cpMinOrderAmount} or more
                    </Text>
                </View>
            }
          </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth*(94/100),
        height: windowWidth*(30/100),
        borderRadius:20,
        marginBottom:10,
        justifyContent:'flex-start',
        flexDirection:'row',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation:5,
    },
    checkbox: {
      alignSelf: 'center',
      borderColor: colours.primaryGrey,
    },
    contentContainer: {
        height: windowWidth*(30/100),
        width: windowWidth*(84/100),
        alignItems:'center',
        borderTopRightRadius:20,
        borderBottomRightRadius:20,
        backgroundColor: colours.primaryWhite
    },
    upperContainer: {
        height: windowWidth*(15/100),
        width: windowWidth*(80/100),
        borderTopRightRadius:20,
        backgroundColor: colours.primaryWhite,
        paddingEnd: windowWidth*(3/100),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:0.5
    },
    lowerContainer: {
        height: windowWidth*(15/100),
        width: windowWidth*(80/100),
        borderBottomRightRadius:20,
        backgroundColor: colours.primaryWhite,
        justifyContent:'center'
    },
    codeContainer: {
        width: windowWidth*(10/100),
        height: windowWidth*(30/100),
        alignItems:'flex-start',
        justifyContent:'center',
        position:'absolute',
        borderRightWidth:2,
        borderColor: colours.lightGrey
    },
    fontStyle2: {
        width: windowWidth*(30/100),
        height: windowWidth*(25/100),
        position:'absolute',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(17),
        color: colours.primaryWhite,
        transform: [{ rotate: '270deg'}],
        paddingBottom:windowWidth*(4/100),
        textAlign:'center'
    },
    fontStyle3: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(18),
        color: colours.primaryBlack,
    },
    fontStyle4: {
        fontFamily: 'Montserrat-Medium',
        fontSize: getFontontSize(13),
        color: colours.primaryGrey,
    },

});