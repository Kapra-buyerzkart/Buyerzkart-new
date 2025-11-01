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

import Header from '../components/Header';
import colours from '../../globals/colours';
import {AppContext} from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import AuthButton from '../components/AuthButton';
import { CommonActions } from '@react-navigation/native';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';

import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';
import LottieView from 'lottie-react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroOrderUnsuccessScreen = ({ navigation, route }) => {
    const { profile, updateCart } = React.useContext(AppContext);
    const { showLoader, loading } = React.useContext(LoaderContext); 

    const { data, cartSum } = route.params;    
    
    const [ modalVisible, setModalVisible ] = React.useState(false);
    const [ orderData, setOrderData ] = React.useState(null);
    

    const razorPayUpdate = async(res) => {
        var options = {
            description: `Payment of ${res?.orderNumber}`,
            currency: 'INR',
            key: res?.rpUserName,
            name: 'Kapra Daily',
            order_id: res?.rpToken,
            prefill: {
                email: res?.custEmail,
                contact: res?.custPhone,
                name: res?.custName
            },
            theme: {color: colours.kapraMain},
            notes : {
                transactionMode:"Grocery"
            }
        }
        RazorpayCheckout.open(options).then(async(data) => {
        navigation.dispatch(
            CommonActions.reset({
            index: 1,
            routes: [
                { name: 'GroHomeScreen' },
                {
                    name: 'GroOrderSuccessScreen',
                    params: { orderNo: res?.orderNumber, orderId: res?.orderId, },
                },
            ],
            })
          )
        }).catch((error) => {
        navigation.navigate('GroOrderUnsuccessScreen', {
            data:res, cartSum: cartSummary
        });
        });
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
    
            {/* Header Con  */}
            <View style={styles.headerCon}>
                <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
                    {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
                </TouchableOpacity>
                <Text style={styles.headerText}>Order Unsuccess</Text>
            </View>


            <ScrollView
                contentContainerStyle={{flex:1, alignItems:'center', justifyContent:'center'}}
            >
                <Image
                    source={require('../../assets/images/Failed.png')}
                    style={{
                        height: windowWidth*(40/100),
                        width: windowWidth*(40/100),
                        resizeMode: 'contain',
                    }}
                />
                <Text />





                <Text style={styles.headerText}>
                    Payment Failed!
                </Text>
                <Text />
                <Text style={styles.lightFont}>
                    Please retry payment for complete order.
                </Text>
                <Text />
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.headerText}>
                    Your Order Number :{" "} 
                    </Text>
                    <TouchableOpacity onPress={() =>
                    navigation.dispatch(
                        CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'GroHomeScreen' },
                            {
                                name: 'GroSingleOrderScreen',
                                params: { orderId: data?.orderId },
                            },
                        ],
                        })
                    )
                }>
                    <Text  style={styles.orderDetailsText}>{data?.orderNumber}</Text>
                </TouchableOpacity>
                </View>
                
            </ScrollView>
            <Text/>

            <View style={[styles.priceCon,{width: windowWidth*(90/100)}]}>
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
                <AuthButton
                    FirstColor={colours.kapraMain}
                    SecondColor={colours.kapraLight}
                    OnPress={() => 
                        razorPayUpdate(data)
                    }
                    ButtonText={'Retry'}
                    ButtonWidth={30}
                    ButtonHeight={5}
                    FSize={15}
                />
            </View>
        </SafeAreaView>
    );
};

export default GroOrderUnsuccessScreen;

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


    orderNoText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(18),
        color:colours.kapraMain
    },
    orderDetailsText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(18),
        color:colours.kapraMain,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    normalText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(12),
        color:colours.primaryGrey
    },
    HeadingText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(18),
        color:colours.primaryGrey
    },
    modalView: {
      marginTop:windowHeight*(30/100), 
      paddingTop: windowHeight*(3/100), 
      paddingLeft: windowWidth*(10/100),
      height:windowHeight*(70/100), 
      backgroundColor:colours.lightRed,
      borderTopLeftRadius:30,
      borderTopRightRadius:30
    },
});
