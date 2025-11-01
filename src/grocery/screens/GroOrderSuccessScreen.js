import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  View, 
  FlatList,
  ScrollView
} from 'react-native';
import { CommonActions } from '@react-navigation/native';

import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import { initiatePayment, completePayment } from '../api';
import showIcon from '../../globals/icons';
import PriceCard from '../../components/PriceCard';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroOrderSuccessScreen = ({ navigation, route }) => {

    const { orderNo, orderId, PaymentMethod, cartSum } = route.params;

    const _orderComplete = async() => {
        try{
            let res = await completePayment(route?.params?.orderId);
        } catch( err) {
        }
    }

    React.useEffect(() => {
        _orderComplete();
        setTimeout( async function () {
            navigation.dispatch(
                CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'GroHomeScreen' },
                    {
                        name: 'GroSingleOrderScreen',
                        params: { orderId: orderId },
                    },
                ],
                })
            )
        }, 5000)
    }, []);

    return (
        <SafeAreaView style={styles.mainContainer}>
    
            {/* Header Con  */}
            <View style={styles.headerCon}>
                <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
                    {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
                </TouchableOpacity>
                <Text style={styles.headerText}>Order Success</Text>
            </View>


            <ScrollView
                contentContainerStyle={{flex:1, alignItems:'center'}}
            >
                <Image 
                    source={require('../../assets/images/success.png')}
                    style={{
                        width: windowWidth*(70/100),
                        height: windowWidth*(40/100),
                    }}
                />
                <Text />
                <Text style={styles.headerText}>
                    Thank you for your purchase
                </Text>
                <Text />
                <Text style={styles.lightFont}>We’ve received your order, will deliver in 20 mins.</Text>
                <Text style={styles.lightFont}>your order number is #{orderNo}</Text>
                <View style={styles.summaryCon}>
                    <Text style={[styles.headerText,{fontSize: getFontontSize(14)}]}>Order Summary</Text>
                    <View style={styles.priceCon}>
                        <Text style={styles.lightFont}>Subtotal</Text>
                        <PriceCard
                            UnitPrice={cartSum?.subTotal}
                            FontSize={getFontontSize(13)}
                            Color={colours.kapraBlack}
                        />
                    </View>

                    {cartSum?.discountAmount > 0 && (
                        <View style={styles.priceCon}>
                            <Text style={styles.lightFont}>Discount:</Text>
                            <PriceCard
                                UnitPrice={cartSum?.discountAmount}
                                FontSize={getFontontSize(13)}
                                Color={colours.kapraBlack}
                            />
                        </View>
                    )}
                    {cartSum?.couponAmount > 0 && (
                        <View style={styles.priceCon}>
                        <Text style={[styles.lightFont, { width: windowWidth * (65 / 100) }]}>Coupon Discount </Text>
                        <PriceCard
                            UnitPrice={cartSum?.couponAmount}
                            FontSize={getFontontSize(13)}
                            Color={colours.kapraBlack}
                        />
                        </View>
                    )}
                    {cartSum?.bcoinsAppplied > 0 && (
                        <View style={styles.priceCon}>
                        <Text style={[styles.lightFont, { width: windowWidth * (65 / 100) }]}>B-Coin Discount </Text>
                        <PriceCard
                            UnitPrice={cartSum?.bcoinsAppplied}
                            FontSize={getFontontSize(13)}
                            Color={colours.kapraBlack}
                        />
                        </View>
                    )}
                    {cartSum?.giftCarDamount > 0 && (
                        <View style={styles.priceCon}>
                        <Text style={[styles.lightFont, { width: windowWidth * (65 / 100) }]}>Giftcard Applied </Text>
                        <PriceCard
                            UnitPrice={cartSum?.giftCarDamount}
                            FontSize={getFontontSize(13)}
                            Color={colours.kapraBlack}
                        />
                        </View>
                    )}
                    {
                        cartSum?.deliveryCharge >= 0 && (
                        <View style={styles.priceCon}>
                            <Text style={styles.lightFont}>Shipping:</Text>
                            {cartSum?.deliveryCharge > 0 ?
                            <PriceCard
                                UnitPrice={cartSum?.deliveryCharge}
                                FontSize={getFontontSize(13)}
                                Color={colours.kapraBlack}
                            />
                            :
                            <Text style={[styles.lightFont, { color: colours.primaryGreen }]}>FREE</Text>
                            }
                        </View>
                        )
                    }
                    <Text/>

                    <View style={styles.priceCon}>
                        <Text style={[styles.headerText,{fontSize: getFontontSize(14)}]}>Total</Text>
                        <PriceCard
                            UnitPrice={cartSum?.grandTotal}
                            FontSize={getFontontSize(15)}
                            Color={colours.kapraBlack}
                        />
                    </View>
                </View>

            </ScrollView>
            <Text/>
            
            <View style={[styles.priceCon,{width: windowWidth*(90/100)}]}>
                <AuthButton
                    FirstColor={colours.kapraBlackLow}
                    SecondColor={colours.kapraMain}
                    OnPress={() => 
                        navigation.dispatch(
                            CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'GroHomeScreen' },
                                {
                                    name: 'GroSingleOrderScreen',
                                    params: { orderId: orderId },
                                },
                            ],
                            })
                        )
                    }
                    ButtonText={'Track Order'}
                    ButtonWidth={30}
                    ButtonHeight={5}
                    FSize={15}
                />
                <AuthButton
                    FirstColor={colours.kapraOrangeDark}
                    SecondColor={colours.kapraOrange}
                    OnPress={() => 
                        navigation.dispatch(
                            CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'GroHomeScreen' }
                            ],
                            })
                        )
                    }
                    ButtonText={'Continue Shopping'}
                    ButtonWidth={58}
                    ButtonHeight={5}
                    FSize={15}
                />
            </View>
        </SafeAreaView>
    );
};

export default GroOrderSuccessScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colours.kapraWhite,
        alignItems: 'center',
    },
    headerCon: {
        width:windowWidth,
        height: windowHeight*(8/100),
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingHorizontal: windowWidth*(5/100)
    },
    backButtonCon: {
        width: windowWidth*(10/100),
        height: windowWidth*(10/100),
        borderRadius: windowWidth*(10/100),
        alignItems:'center',
        justifyContent:'center',
    },
    summaryCon: {
        width: windowWidth*(90/100),
        marginTop: windowHeight*(5/100),
        padding: windowWidth*(3/100),
        borderWidth:2,
        borderColor: colours.kapraWhiteLow,
        borderRadius:10
    },
    priceCon: {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop: windowHeight*(1.5/100)
    },





    headerText: {
        fontFamily: 'Lexend-SemiBold',
        fontSize: getFontontSize(18),
        color: colours.kapraBlack,
    },
    lightFont: {
        fontFamily: 'Lexend-Light',
        fontSize: getFontontSize(12),
        color: colours.kapraBlackLow,
    },

});
