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
import LottieView from 'lottie-react-native';
import { initiatePayment, completePayment } from '../api';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OrderSuccessScreen = ({ navigation, route }) => {
    const { profile, updateCart } = React.useContext(AppContext);
    const { showLoader, loading } = React.useContext(LoaderContext); 

    const { orderNo, orderId, PaymentMethod } = route.params;
    const [ modalVisible, setModalVisible ] = React.useState(false);
    const [ orderData, setOrderData ] = React.useState(null);

    const _orderComplete = async() => {
        try{
            let res = await completePayment(route?.params?.orderId);
        } catch( err) {
        }
    }

    React.useEffect(() => {
        _orderComplete();
    }, []);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header
                navigation={navigation}
                backEnable
                HeaderText="Order Success"
            />
            <ScrollView
                contentContainerStyle={{flex:1, justifyContent:'center', alignItems:'center'}}
            >
              
                <LottieView 
                    source={require('../assets/Lottie/OrderSuccessful.json')} 
                    style={{
                        height: windowWidth * (70 / 100),
                        width: windowWidth * (70 / 100),
                    }} 
                    autoPlay
                    loop={false}
                    />
                <Text />
                <Text style={styles.HeadingText}>
                    Order Placed Successfully
                </Text>
                <Text />
                <Text style={styles.normalText}>
                    Please check your SMS, Email
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
                                params: { orderId: orderId },
                            },
                        ],
                        })
                    )
                }>
                    <Text  style={styles.orderDetailsText}>{orderNo}</Text>
                </TouchableOpacity>
                </View>
                
            </ScrollView>
            <Text/>

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

export default OrderSuccessScreen;

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
        fontSize: getFontontSize(10),
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
