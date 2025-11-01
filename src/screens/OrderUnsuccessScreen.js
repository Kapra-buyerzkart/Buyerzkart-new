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
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import {AppContext} from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import AuthButton from '../components/AuthButton';
import { CommonActions } from '@react-navigation/native';
import { getImage, getFontontSize } from '../globals/functions';

import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';
import LottieView from 'lottie-react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OrderUnsuccessScreen = ({ navigation, route }) => {
    const { profile, updateCart } = React.useContext(AppContext);
    const { showLoader, loading } = React.useContext(LoaderContext); 

    const { data } = route.params;
    const [ modalVisible, setModalVisible ] = React.useState(false);
    const [ orderData, setOrderData ] = React.useState(null);
    

    const razorPayUpdate = async(res) => {
        var options = {
            description: `Payment of ${res.orderNumber}`,
            currency: 'INR',
            key: res.rpUserName,
            name: 'Kapra Daily',
            order_id: res.rpToken,
            prefill: {
                email: res.custEmail,
                contact: res.custPhone,
                name: res.custName
            },
            theme: {color: colours.kapraMain},
            notes : {
                transactionMode:"Buyerzkart"
            }
        }
        RazorpayCheckout.open(options).then(async(data) => {
        navigation.dispatch(
            CommonActions.reset({
            index: 1,
            routes: [
                { name: 'DrawerNavigator' },
                {
                    name: 'OrderSuccessScreen',
                    params: { orderNo: res.orderNumber, orderId: res.orderId, },
                },
            ],
            })
          )
        }).catch((error) => {
        navigation.navigate('OrderUnsuccessScreen', {
            data:res
        });
        });
    }

  

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header
                navigation={navigation}
                HeaderText="Order UnSuccess"
                backEnable
            />
            <ScrollView
                contentContainerStyle={{flex:1, justifyContent:'center', alignItems:'center'}}
            >
                
                <Image
                    source={require('../assets/images/Failed.png')}
                    style={{
                    height: windowWidth*(50/100),
                    width: windowWidth*(50/100),
                    resizeMode: 'contain',
                    }}
                />
                {/* <LottieView 
                    source={require('../assets/Lottie/OrderFailed.json')} 
                    style={{
                        height: windowWidth * (70 / 100),
                        width: windowWidth * (70 / 100),
                    }} 
                    autoPlay
                /> */}
                <Text />
                <Text style={styles.HeadingText}>
                    Payment Failed!
                </Text>
                <Text />
                <Text style={styles.normalText}>
                    Please retry payment for complete order.
                </Text>
                <Text />
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.HeadingText}>
                    Your Order Number :{" "} 
                    </Text>
                    <TouchableOpacity onPress={() =>
                    navigation.dispatch(
                        CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'DrawerNavigator' },
                            {
                                name: 'SingleOrder',
                                params: { orderId: data.orderId },
                            },
                        ],
                        })
                    )
                }>
                    <Text  style={styles.orderDetailsText}>{data.orderNumber}</Text>
                </TouchableOpacity>
                </View>
                
            </ScrollView>
            <Text/>
            <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={() => 
                    razorPayUpdate(data)
                }
                ButtonText={'Retry Payment'}
                ButtonWidth={90}
            />
            <AuthButton
                BackgroundColor={colours.kapraMain}
                OnPress={() => 
                    navigation.dispatch(
                        CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'DrawerNavigator' },
                        ],
                        })
                    )
                }
                ButtonText={'CONTINUE SHOPPING'}
                ButtonWidth={90}
            />
        </SafeAreaView>
    );
};

export default OrderUnsuccessScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colours.primaryWhite,
        alignItems:'center'
    },
    orderNoText: {
        fontFamily: 'Proxima Nova Alt Bold',
        fontSize: getFontontSize(18),
        color:colours.kapraMain
    },
    orderDetailsText: {
        fontFamily: 'Proxima Nova Alt Bold',
        fontSize: getFontontSize(18),
        color:colours.kapraMain,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    normalText: {
        fontFamily: 'Proxima Nova Alt Bold',
        fontSize: getFontontSize(12),
        color:colours.primaryGrey
    },
    HeadingText: {
        fontFamily: 'Proxima Nova Alt Bold',
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
