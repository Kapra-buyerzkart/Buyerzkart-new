import React, { useContext, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Platform,
    ImageBackground,
    Pressable,
    Modal,
} from 'react-native';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import PriceCard from './PriceCard';
import WishIcon from './WishIcon';
import { AppContext } from '../../Context/appContext';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import FastImage from 'react-native-fast-image';
import { addtoCart, RemoveCartItemByUrlkey, decreaseCartItemByURLKey } from '../api';
import Toast from 'react-native-simple-toast';
import { BlurView } from "@react-native-community/blur";

import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroProductCard({
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

    const {profile, GroUpdateCart, GroCartData} = useContext(AppContext);
    const [loaderStatus, setLoaderStatus] = React.useState(false);

    const [variationModal, setVariationModal] = React.useState(false);
    const [choosenIndex, setChoosenIndex] = React.useState(0);
    const [VariationData, setVarientsData] = React.useState( null);
    

    useEffect(() => {
        try {
          JSON.parse(Variations);
          setVarientsData(JSON.parse(Variations))
        } catch (e) {
          setVarientsData(null)
        }
    }, []);

    const AddtoCart = async(Url) => {
        try {
            setLoaderStatus(true);
            let res = await addtoCart(Url);
            await GroUpdateCart();
            setLoaderStatus(false);
          } catch (err) {
            setLoaderStatus(false);
            Toast.show(err.Message?err.Message:err?err:"Something wrong!");
          }
    }

    const decreaseCartCount = async(Url) => {
        try {
            setLoaderStatus(true);
            let res = await decreaseCartItemByURLKey( Url);
            await GroUpdateCart();
            // Toast.show("Item count decreased.");
            setLoaderStatus(false);
        } catch (err) {
            setLoaderStatus(false);
            Toast.show(err.Message?err.Message:err?err:"Something wrong!");
        }
    }

    const deleteFromCart = async(Url) => {
        try {
            setLoaderStatus(true);
            let res = await RemoveCartItemByUrlkey( Url);
            await GroUpdateCart();
            // Toast.show("Removed From Cart");
            setLoaderStatus(false);
          } catch (err) {
            setLoaderStatus(false);
            Toast.show(err.Message?err.Message:err?err:"Something wrong!");
          }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={OnPress}>

            {/* Image & Buttons */}
            <ImageBackground
                style={styles.imageContainer}
                imageStyle={styles.imageStyle}
                source={{ uri: getImage(Image) }}
            >
                <View style={styles.imgTopContainer}>
                    <WishIcon 
                        ProductID={ProductID}
                        urlKey={URLKey}
                    />
                    <View>
                        <View style={{ height: windowWidth*(7/100), justifyContent:'center'}}>
                        {
                            loaderStatus?
                                <View style={[styles.addCartCon, {justifyContent:'center'}]}>
                                    <ActivityIndicator size={12} color={colours.kapraOrange}/>
                                </View>
                            :
                            StockAvailability === 'Out Of Stock'?
                            <View style={[styles.addCartCon, {justifyContent:'center'}]}>
                                <Text style={[styles.fontStyle2,{color: colours.primaryRed}]}>SOLD OUT</Text>
                            </View>
                            :
                            GroCartData[ProductID]&&GroCartData[ProductID]>0 ?
                                VariationData?
                                <View style={[styles.addCartCon, {justifyContent:'space-between'}]}>
                                    <TouchableOpacity style={styles.minusButton} onPress={()=>setVariationModal(true)}>
                                        {showIcon('mathminus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                    </TouchableOpacity>
                                    <Text style={[styles.fontStyle2,{color:colours.primaryBlack}]}>{GroCartData[ProductID]}</Text>
                                    <TouchableOpacity style={styles.addCartSecondCon}  onPress={()=>setVariationModal(true)}>
                                        {showIcon('mathplus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={[styles.addCartCon, {justifyContent:'space-between', backgroundColor: GroCartData[ProductID]>0? colours.primaryWhite:colours.kapraMain}]}>
                                    <TouchableOpacity style={styles.minusButton} onPress={()=>GroCartData[ProductID]>1? decreaseCartCount(URLKey) : deleteFromCart(URLKey)}>
                                        {showIcon('mathminus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                    </TouchableOpacity>
                                    <Text style={[styles.fontStyle2,{color:colours.primaryBlack}]}>{GroCartData[ProductID]}</Text>
                                    <TouchableOpacity style={styles.addCartSecondCon}  onPress={()=>AddtoCart(URLKey)}>
                                        {showIcon('mathplus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                    </TouchableOpacity>
                                </View>
                            :   
                                VariationData?
                                <TouchableOpacity style={[styles.plusIconCon,{right:windowWidth*(3/100)}]} onPress={()=>setVariationModal(true)}>  
                                    {showIcon('mathplus', colours.kapraWhite, windowWidth * (4 / 100))}
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={[styles.plusIconCon,{right:windowWidth*(3/100)}]} onPress={()=>AddtoCart(URLKey)}>  
                                    {showIcon('mathplus', colours.kapraWhite, windowWidth * (4 / 100))}
                                </TouchableOpacity>
                        }
                        </View>
                    </View>
                </View>


                {/* B-Token Con  */}
                <View style={{
                    alignItems:'center',
                    justifyContent:'center',
                }}>
                    {
                        BTValue && BTValue>0 ?
                            <View style={styles.imgBottomContainer}>
                                <Text style={styles.redeemFont}>Redeem upto {BTValue} B-Token</Text>
                            </View>
                            :
                            null
                    }
                </View>

            </ImageBackground>

            {/* Name & Content  */}
            <View style={styles.bottomCon}>
                <View style={{ height: windowWidth*(9/100) }}>
                    <Text style={styles.titleFont} numberOfLines={2}>{Name}</Text>
                </View>
                <View style={{ height: windowWidth*(9/100),justifyContent:'center' }}>
                {
                    SpecialPrice > 0&& (((Price-SpecialPrice)/Price)*100).toFixed(0) > 0 &&(
                        <Text style={styles.offerText}>
                            {(((Price-SpecialPrice)/Price)*100).toFixed(0)}% Off
                        </Text>
                    )
                }
                {SpecialPrice > 0 && SpecialPrice !== Price? (
                    <PriceCard
                        SpecialPrice={SpecialPrice}
                        UnitPrice={Price}
                        FontSize={14}
                        Color={colours.primaryBlack}
                        MRP
                    />
                    ) : (
                    <PriceCard
                        UnitPrice={Price}
                        FontSize={18}
                        Color={colours.primaryBlack}
                    />
                )}
                </View>
                <View style={{  flexDirection:'row', alignItems:'center' }}>
                    <View style={{width: windowWidth*(4/100), height: windowWidth*(4/100)}}>
                        {showIcon('timer', colours.primaryGreen, windowWidth*(3.5/100))}
                    </View>
                    <Text style={[styles.offerText,{color: colours.primaryGreen}]} numberOfLines={1}>  20 minutes delivery</Text>
                </View>
            </View>

            {/* Variation Modal  */}
            <Modal 
                animationType='fade'
                transparent={true} 
                visible={variationModal}
                onRequestClose={() => setVariationModal(false) }
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
                        end={{x: 0, y: 1 }}
                        colors={[ colours.kapraOrangeDark, colours.kapraOrange ]}
                        style={styles.variationModalView}
                    >
                        <Text style={[styles.titleFont,{fontSize: getFontontSize(16),color: colours.primaryWhite}]} >Select the Quantity</Text>
                        <Text onPress={() => setVariationModal(false) }>
                            {showIcon('close', colours.primaryWhite, windowWidth * (5 / 100))}
                        </Text>
                    </LinearGradient>

                    <ScrollView 
                        contentContainerStyle={{ paddingBottom: 30}} showsVerticalScrollIndicator={false}
                    >
                    {
                        VariationData&&VariationData[0].AttrValues.map((item,index)=>(
                        <Pressable style={styles.variationView}>
                            <View style={{width: windowWidth*(60/100)}}>
                                <Text style={[styles.titleFont,{color: colours.primaryBlack, marginBottom:10,fontSize: getFontontSize(14),}]} numberOfLines={2}>
                                {item.prName}
                                </Text>
                                <View style={{flexDirection:'row'}}>
                                {
                                    (item.prSpecialPrice && item.prSpecialPrice !=0 && item.prSpecialPrice != item.prPrice)?
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
                                    item.prSpecialPrice && item.prSpecialPrice !=0 && item.prSpecialPrice != item.prPrice?
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{x: 0, y: 1 }}
                                            colors={[ colours.kapraOrangeDark, colours.kapraOrange, ]}
                                            style={styles.offerContainer}
                                        >
                                            <Text style={[styles.offerText,{color: colours.primaryWhite}]}>{(((item.prPrice-item.prSpecialPrice)/item.prPrice)*100).toFixed(0)} % Off</Text>
                                        </LinearGradient>
                                        :
                                        null
                                }
                                </View>
                            </View>
                            <View>
                                {
                                loaderStatus && index === choosenIndex?
                                    <View style={[styles.addCartCon, {justifyContent:'center'}]}>
                                        <ActivityIndicator size={12} color={colours.kapraOrange}/>
                                    </View>
                                :
                                item.prStock !== "In Stock"?
                                <View style={[styles.addCartCon, {justifyContent:'center'}]}>
                                    <Text style={[styles.fontStyle2,{color: colours.primaryRed}]}>SOLD OUT</Text>
                                </View>
                                :
                                GroCartData[item.productId]&&GroCartData[item.productId]>0 ?
                                    <View style={[styles.addCartCon, {justifyContent:'space-between'}]}>
                                        <TouchableOpacity  style={styles.minusButton} onPress={()=>{GroCartData[item.productId]>1? (decreaseCartCount(item.prUrlkey),setChoosenIndex(index)) : (deleteFromCart(item.prUrlkey),setChoosenIndex(index))}}>
                                            {showIcon('mathminus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                        </TouchableOpacity>
                                        <Text style={[styles.fontStyle2,{color:colours.primaryBlack}]}>{GroCartData[item.productId]}</Text>
                                        <TouchableOpacity style={styles.addCartSecondCon}  onPress={()=>{AddtoCart(item.prUrlkey),setChoosenIndex(index)}}>
                                            {showIcon('mathplus', colours.kapraOrange, windowWidth * (3.5 / 100))}
                                        </TouchableOpacity>
                                    </View>
                                :   
                                    <TouchableOpacity style={[styles.addButton]} onPress={()=>{AddtoCart(item.prUrlkey),setChoosenIndex(index)}}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth*(45/100), 
        alignItems:'center', 
        borderRadius:windowWidth*(5/100),
        padding:windowWidth*(1/100), 
    },
    imageContainer: {
        width: windowWidth*(42/100),
        height: windowWidth*(42/100),
        backgroundColor: "#fff",
        borderRadius: windowWidth*(4/100),
        alignItems: "center",
        justifyContent:'space-between',
        
        // iOS Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        
        // Android Shadow
        elevation: 5,


    },
    imageStyle: {
        width: windowWidth*(38/100), 
        height: windowWidth*(38/100), 
        borderRadius:windowWidth*(5/100),
        margin: windowWidth*(2/100),
        resizeMode:'contain',
    },
    imgTopContainer: {
        width: windowWidth*(40/100), 
        height: windowWidth*(12/100), 
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    imgBottomContainer: { 
        width: windowWidth*(42/100), 
        height: windowWidth*(6/100), 
        borderBottomLeftRadius:windowWidth*(3/100),
        borderBottomRightRadius:windowWidth*(3/100),
        backgroundColor: colours.kapraMain,
        alignItems:'center',
        justifyContent: 'center'
    },
    bottomCon: {
        width: windowWidth*(43/100),
        padding: windowWidth*(2/100),
    },
    offerContainer: {
      paddingHorizontal:10,
      borderRadius:5,
      height:windowHeight*(3/100),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft:5
    },
    variationView: {
        width: windowWidth*(94/100), 
        marginHorizontal: windowWidth*(3/100), 
        borderWidth:2, 
        borderRadius:5, 
        borderColor: colours.primaryBlue, 
        marginTop:10, 
        padding: windowWidth*(3/100), 
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    },



    // Add Cart Related 
    addCartCon: {
        width: windowWidth*(20/100),
        height: windowWidth*(8/100), 
        borderWidth:0.5,
        borderRadius:windowWidth*(2/100),
        borderColor: colours.kapraOrange,
        backgroundColor: colours.kapraWhite,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    minusButton: {
        width: windowWidth*(7/100),
        height: windowWidth*(8/100), 
        alignItems: 'center',
        justifyContent: 'center'
    },
    addCartSecondCon: {
        width: windowWidth*(7/100),
        height: windowWidth*(8/100), 
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusIconCon: {
        width: windowWidth*(8/100),
        height: windowWidth*(8/100),
        borderRadius: windowWidth*(4/100),
        backgroundColor: colours.kapraOrangeLight,
        alignItems:'center',
        justifyContent:'center'
    },
    variationModalView: {
        width: windowWidth, 
        height: windowHeight*(7/100), 
        backgroundColor: colours.kapraOrange, 
        borderTopLeftRadius: 20, 
        borderTopRightRadius:20,
        paddingHorizontal: windowWidth*(3/100), 
        alignItems:'center', 
        flexDirection:'row', 
        justifyContent:'space-between'  
    },
    commonModalStyle: {
      width: windowWidth, 
      height: windowHeight*(50/100), 
      backgroundColor: colours.primaryWhite, 
      marginTop: windowHeight*(50/100), 
      borderTopLeftRadius: 20, 
      borderTopRightRadius:20, 
      elevation:5, 
      alignItems:'center'
    },
    blurStyle: {
        width: windowWidth,
        height: windowHeight,
        position:'absolute',
        alignItems:'center', 
        justifyContent:'center' ,
        backgroundColor: null,
        overflow: 'hidden'
    },
    addButton: {
        width: windowWidth * (20 / 100),
        height: windowWidth*(8/100), 
        borderRadius:windowWidth*(2/100),
        marginLeft: windowWidth * (1 / 100),
        alignItems: 'center',
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor: colours.kapraOrange,
        borderRadius: 10,
    },


    // Fonts 
    redeemFont: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(10.5),
        color: colours.primaryWhite,
    },
    titleFont: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(12),
        color: colours.kapraBlack,
    },
    offerText: {
        color: colours.kapraOrange,
        fontFamily: 'Lexend-Medium',
        fontSize: getFontontSize(10),
    },
    fontStyle2: {
        fontFamily: 'Lexend-Medium',
        fontSize: getFontontSize(12),
        color: colours.primaryWhite
    },
    addText: {
      color: colours.primaryWhite,
      fontFamily: 'Lexend-Bold',
      fontSize: getFontontSize(13),
    },
});
