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
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import PriceCard from '../components/PriceCard';
import WishIcon from './WishIcon';
import { AppContext } from '../Context/appContext';
import { getImage, getFontontSize } from '../globals/functions';
import FastImage from 'react-native-fast-image';
import { addtoCart, RemoveCartItemByUrlkey, decreaseCartItemByURLKey } from '../api';
import Toast from 'react-native-simple-toast';

import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomeOneByTwoCard({
    OnPress,
    Name,
    Image,
    Price,
    SpecialPrice,
    GotoCart,
    URLKey,
    ProductID,
    ProductWeight,
    StockAvailability,
    CartReload,
    Variations,
    BTValue
}) {

    const {profile, cartData, updateCart, loadCart} = useContext(AppContext);
    const [loaderStatus, setLoaderStatus] = React.useState(false);
    const [addStatus, setAddStatus] = React.useState(false);
    const [subStatus, setSubStatus] = React.useState(false);
    const [dummy, setDummy] = React.useState(true)
    const [VariationData, setVarientsData] = React.useState( null);
    
    const [variationModal, setVariationModal] = React.useState(false);
    const [choosenIndex, setChoosenIndex] = React.useState(0);

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
            setAddStatus(true);
            setLoaderStatus(true);
            let res = await addtoCart(Url);
            // Toast.show("ADDED TO CART")
            setLoaderStatus(false);
            setDummy(!dummy);
            await updateCart();
            await loadCart();
            CartReload?await CartReload():null
            setAddStatus(false)
            setDummy(!dummy);
          } catch (err) {
            setLoaderStatus(false);
            setAddStatus(false)
            setDummy(!dummy);
            Toast.show(err.Message?err.Message:"Something wrong!");
          }
    }

    const decreaseCartCount = async(Url) => {
        try {
            setSubStatus(true)
            setLoaderStatus(true);
            let res = await decreaseCartItemByURLKey( Url);
            // Toast.show("Item count decreased.");
            setLoaderStatus(false);
            await updateCart();
            await loadCart();
            CartReload?await CartReload():null
            setSubStatus(false)
        } catch (err) {
            setLoaderStatus(false);
            setSubStatus(false)
            Toast.show(err.Message?err.Message:"Something wrong!");
        }
    }

    const deleteFromCart = async(Url) => {
        try {
            setSubStatus(true)
            setLoaderStatus(true);
            let res = await RemoveCartItemByUrlkey( Url);
            await updateCart();
            await loadCart();
            CartReload?await CartReload():null
            // Toast.show("Removed From Cart");
            setLoaderStatus(false);
            setSubStatus(false)
          } catch (err) {
            setLoaderStatus(false);
            setSubStatus(false)
            Toast.show(err.Message?err.Message:"Something wrong!");
          }
    }

    return (
        <View style={{width: windowWidth*(50/100), backgroundColor: colours.primaryWhite, borderWidth:0.5, borderColor: colours.kapraLow}}>
            
        <Pressable
            onPress={OnPress}
            style={styles.container}
        >
            <View style={styles.upperView}>
                <FastImage
                    style={styles.imageStyle}
                    source={{
                        uri: getImage(Image),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.wishContainer}>
                    <View style={{backgroundColor: colours.primaryWhite, borderRadius: windowWidth*(10/100)}}>
                        <WishIcon 
                            ProductID={ProductID}
                            urlKey={URLKey}
                        />
                    </View>
                    {
                        StockAvailability !== 'Out of Stock'&& (((Price-SpecialPrice)/Price)*100).toFixed(0) > 0 &&(
                            <View style={{height: windowWidth*(20/100),justifyContent:'center'}}>
                                {
                                    SpecialPrice > 0 && SpecialPrice != Price &&(
                                        <ImageBackground 
                                            source={require('../assets/images/offerContainer.png')}
                                            style={styles.offerImage}
                                            tintColor= {colours.kapraMain}
                                            
                                        >
                                            <Text style={styles.offerText}>
                                                {(((Price-SpecialPrice)/Price)*100).toFixed(0)}% Off
                                            </Text>
                                        </ImageBackground>
                                    )
                                }
                                
                            </View>
                        )
                    }
                </View>
            </View>
            <View style={styles.lowerView}>
                <View style={{ height: windowWidth*(9/100), justifyContent:'center'}}>
                    <Text style={styles.fontStyle1} numberOfLines={2}>{Name}</Text>
                </View>

                <View style={{
                    width: windowWidth*(45/100),
                }}>
                    {
                        BTValue && BTValue>0 ?
                            (<Text style={styles.fontStyle4}>Redeem upto <Text style={[styles.fontStyle4,{fontFamily: 'Montserrat-Bold'}]}>{BTValue}</Text> B-Token</Text>)
                            :
                            null
                    }  
                </View>
                {SpecialPrice > 0 ? (
                    <PriceCard
                        SpecialPrice={SpecialPrice}
                        UnitPrice={Price}
                        FontSize={getFontontSize(13)}
                        Color={colours.primaryBlack}
                        Vertical
                    />
                    ) : (
                    <PriceCard
                        UnitPrice={Price}
                        FontSize={getFontontSize(13)}
                        Color={colours.primaryBlack}
                        Vertical
                    />
                )}
                
                
                
            </View>
        </Pressable>

        {
            StockAvailability === 'Out of Stock'&&(
                <View style={styles.outOfStockContainer}>
                    <View>
                        <Text style={[styles.fontStyle2,{backgroundColor: colours.primaryPink, padding:5, borderRadius:5, fontSize:getFontontSize(16)}]}>
                            {StockAvailability}
                        </Text>
                    </View>

                </View>
            )
        }


        <View style={styles.centeredView}>
            <Modal 
                animationType="slide" 
                transparent={true} 
                visible={variationModal}
                onRequestClose={() => setVariationModal(false) }
                animationInTiming={2000}
                animationOutTiming={2000}
            >
            <Pressable style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(58, 0, 109,0.3)'}} onPress={() => setVariationModal(false)}>
              <Pressable style={styles.commonModalStyle}>
                <View style={styles.variationModalView}>
                  <Text style={[styles.fontStyle1,{fontSize: getFontontSize(16),color: colours.primaryWhite}]} >
                  Select the Quantity.
                  </Text>
                  <TouchableOpacity onPress={() => setVariationModal(false) }>
                    <Text>
                      {showIcon('close', colours.kmPink, windowWidth * (7 / 100))}
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView>
                {
                VariationData&&VariationData[0].AttrValues.map((item,index)=>(
                    <Pressable style={styles.variationView}>
                      <View style={{width: windowWidth*(60/100)}}>
                        <Text style={[styles.addText,{color: colours.primaryBlack, marginBottom:10,fontSize: getFontontSize(14),}]} numberOfLines={2}>
                          {item.prName}
                          
                        </Text>
                        <View style={{flexDirection:'row'}}>
                        {
                          item.prSpecialPrice && item.prSpecialPrice !=0 && item.prSpecialPrice != item.prPrice?
                          <PriceCard
                            SpecialPrice={item.prSpecialPrice}
                            UnitPrice={item.prPrice}
                            FontSize={getFontontSize(15)}
                            SmallFontSize={getFontontSize(2)}
                          />
                          :
                          <PriceCard
                            UnitPrice={item.prPrice}
                            FontSize={getFontontSize(15)}
                            SmallFontSize={getFontontSize(2)}
                          />
                        }
                        {
                          item.prSpecialPrice && item.prSpecialPrice !=0 && item.prSpecialPrice != item.prPrice?
                            <LinearGradient
                              start={{ x: 0, y: 0 }}
                              end={{x: 0, y: 1 }}
                              colors={[ colours.kmDarkOurple, colours.kmPurple, colours.kmPurple, ]}
                              style={styles.offerContainer}
                            >
                              <Text style={styles.offerText}>
                              {(((item.prPrice-item.prSpecialPrice)/item.prPrice)*100).toFixed(0)} % Off
                              </Text>
                            </LinearGradient>
                            :
                            null
                        }
                        </View>
                        
                      </View>
                      <View>
                        {
                          loaderStatus && index === choosenIndex?
                              <View style={styles.addButton}>
                                  <ActivityIndicator size={12} color={colours.primaryWhite}/>
                              </View>
                          :
                          item.prStock !== "In Stock"?
                          <TouchableOpacity style={[styles.addButton,{backgroundColor: colours.primaryGrey, width: windowWidth*(25/100)}]}>
                              <Text style={styles.addText}>
                                Out of Stock
                              </Text>
                          </TouchableOpacity>
                          :
                          cartData[item.productId]&&cartData[item.productId].PQuantity>0 ?
                              <View style={[styles.addButton, {justifyContent:'space-between', backgroundColor: cartData[item.productId].PQuantity>0? colours.kmPink:colours.primaryGreen}]}>
                                  <TouchableOpacity style={styles.minusButton} onPress={()=>{cartData[item.productId].PQuantity>1? (decreaseCartCount(item.prUrlkey),setChoosenIndex(index)) : (deleteFromCart(item.prUrlkey),setChoosenIndex(index))}}>
                                      {showIcon('mathminus', colours.primaryWhite, windowWidth * (2.5 / 100))}
                                  </TouchableOpacity>
                                  {
                                    addStatus == true?
                                    <Text style={[styles.addText]}>{cartData[item.productId].PQuantity+1}</Text>
                                    :
                                    subStatus == true?
                                    <Text style={[styles.addText]}>{cartData[item.productId].PQuantity-1}</Text>
                                    :
                                    <Text style={[styles.addText]}>{cartData[item.productId].PQuantity}</Text>
                                  }


                                  {/* <Text style={[styles.addText]}>{ addStatus? cartData[item.productId].PQuantity+1 : subStatus?cartData[item.productId].PQuantity-1 : cartData[item.productId].PQuantity }</Text> */}
                                  <TouchableOpacity style={styles.plusButton}  onPress={()=>{AddtoCart(item.prUrlkey),setChoosenIndex(index)}}>
                                      {showIcon('mathplus', colours.primaryWhite, windowWidth * (2.5 / 100))}
                                  </TouchableOpacity>
                              </View>
                          :   
                              <TouchableOpacity style={styles.addButton} onPress={()=>{AddtoCart(item.prUrlkey),setChoosenIndex(index)}}>
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
            </Pressable>
            </Modal>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (49 / 100),
        height: windowWidth * (50 / 100),
        backgroundColor:colours.primaryWhite,
        alignItems: 'center',
        marginBottom:10,
        marginTop: windowWidth*(5/100),
    },
    commonModalStyle: {
      width: windowWidth, 
      height: windowHeight*(50/100), 
      backgroundColor: colours.kapraLow, 
      marginTop: windowHeight*(50/100), 
      borderTopLeftRadius: 20, 
      borderTopRightRadius:20, 
      elevation:5, 
      alignItems:'center'
    },
    addText: {
      color: colours.primaryWhite,
      fontFamily:'Proxima Nova Alt Bold',
      fontSize: getFontontSize(16),
    },
    qtyView: { 
        height: windowWidth*(7/100), 
        width: windowWidth*(28/100), 
        justifyContent:'space-between', 
        flexDirection:'row', 
        alignItems:'center'
    },
    offerImage: {
        height: windowWidth * (10 / 100),
        width:windowWidth * (10 / 100),
        resizeMode: 'contain',
        alignItems:'center',
        padding: 5,
        justifyContent:'center',
        tintColor: colours.kapraMain
    },
    offerContainer: {
      paddingHorizontal:10,
      borderRadius:5,
      height:windowHeight*(3/100),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft:5
    },
    offerText: {
      color: colours.primaryWhite,
      fontFamily:'Proxima Nova Alt Bold',
      fontSize: getFontontSize(12),
    },
    outOfStockContainer: {
        width: windowWidth * (32 / 100),
        height: windowWidth * (50 / 100),
        marginTop: windowWidth*(5/100),
        backgroundColor:'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent:'center',
        position:'absolute',
        borderRadius:10,
    },
    imageStyle: {
        width: windowWidth * (20 / 100),
        height: windowWidth * (20 / 100),
        marginTop: windowWidth *(2.5/100),
        borderRadius:5,
    },
    variationView: {
        width: windowWidth*(94/100), 
        marginHorizontal: windowWidth*(3/100), 
        borderWidth:2, 
        borderRadius:5, 
        borderColor: colours.kmPurple, 
        marginTop:10, 
        padding: windowWidth*(3/100), 
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    },
    variationModalView: {
        width: windowWidth, 
        height: windowHeight*(7/100), 
        backgroundColor: colours.kmDarkOurple, 
        borderTopLeftRadius: 20, 
        borderTopRightRadius:20,
        paddingHorizontal: windowWidth*(3/100), 
        alignItems:'center', 
        flexDirection:'row', 
        justifyContent:'space-between'  
    },
    upperView:{
        width: windowWidth * (30 / 100),
        height: windowWidth * (25 / 100),
        alignItems: 'center',
        // justifyContent:'center',
        // borderWidth:0.25,
    },
    lowerView: {
        width: windowWidth * (45 / 100),
        height: windowWidth * (25 / 100),
        justifyContent: 'space-around',
        paddingBottom:5,
    },
    addIconContainer: {
        height: windowHeight*(3.5/100),
        width:windowHeight*(3.5/100),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: colours.primaryWhite,
        borderRadius:5,
        shadowColor: colours.primaryGrey,
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation:5
    },
    addButton: {
        width: windowWidth * (16 / 100),
        height: windowHeight*(3.5/100),
        marginLeft: windowWidth * (1 / 100),
        alignItems: 'center',
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor: colours.primaryPink,
        borderRadius: 5,
        shadowColor: colours.primaryGrey,
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation:5
    },
    wishContainer: {
        position:'absolute', 
        width: windowWidth*(37/100), 
        height: windowWidth*(15/100), 
        paddingLeft: windowWidth*(4/100),
        marginTop: -(windowWidth*(5/100)),
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems:'flex-end', 
    },
    minusButton: {
        height: windowWidth*(5/100), 
        width:windowWidth*(5/100), 
        backgroundColor: colours.kmPink, 
        borderTopLeftRadius:5, 
        borderBottomLeftRadius:5, 
        alignItems:'center', 
        justifyContent:'center'
    },
    plusButton: {
        backgroundColor: colours.kmPink, 
        height: windowWidth*(5/100), 
        width:windowWidth*(5/100), 
        borderTopRightRadius:5, 
        borderBottomRightRadius:5, 
        alignItems:'center', 
        justifyContent:'center'
    },
    fontStyle1: {
        fontFamily:'Proxima Nova Alt Semibold',
        fontSize: getFontontSize(13),
        color: colours.primaryBlack,
        // lineHeight:15,
    },
    fontStyle2: {
        fontFamily:'Proxima Nova Alt Bold',
        fontSize: getFontontSize(12),
        color: colours.primaryWhite
    },
    fontStyle3: {
        fontFamily:'Proxima Nova Alt Bold',
        fontSize: getFontontSize(12),
        color: colours.primaryBlack,
        width: windowWidth*(12/100),
    },
    fontStyle4: {
        fontFamily:'Proxima Nova Alt Semibold',
        fontSize: getFontontSize(12),
        color: colours.primaryWhite,
        backgroundColor: colours.kapraMain,
        borderRadius:5,
        textAlign:'center'
    },
    offerText: {
        fontFamily:'Proxima Nova Alt Bold',
        fontSize: getFontontSize(10),
        color: colours.primaryWhite,
        textAlign: 'center'
    }
});
