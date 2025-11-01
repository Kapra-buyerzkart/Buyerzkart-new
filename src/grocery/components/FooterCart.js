import React from 'react';
import { View, Text, StyleSheet, Linking, Dimensions , Image, TouchableOpacity, Platform} from 'react-native';
import Toast from 'react-native-simple-toast';

import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import { getFontontSize } from '../globals/GroFunctions';
import { AppContext } from '../../Context/appContext';
import { getImage } from '../globals/GroFunctions';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FooterCart({ navigation, Absolute }) {
  
    const { GroCartList, profile } = React.useContext(AppContext);

    return (
    <>

        {
            GroCartList && GroCartList?.length >0 &&(
            <View style={[styles.mainContainer,{position: Absolute ? 'absolute' : 'relative', top: Absolute ? Platform.OS == 'ios'? windowHeight*(78/100) : windowHeight*(84/100) : null }]}>

                <TouchableOpacity style={styles.iconCon} 
                onPress={() => profile.groceryCustId? navigation.navigate('GroReferralScreen'):Toast.show('Please Login!')}>
                    <View style={styles.iconStyle}>
                    {showIcon('share', colours.kapraBlackLow, windowWidth * (4 / 100))}
                    </View>
                <Text style={styles.fontStyle2}>Refer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.footerCartCon}  onPress={()=>navigation.navigate('GroCartScreen')}>
                <View style={styles.footerCartItemImg}>
                    <Image 
                    source={{uri:getImage(GroCartList[0]?.imageUrl)}}
                    style={styles.footerCartImgStyle}
                    />
                </View>
                {
                    GroCartList?.length >1 &&(
                        <View style={[styles.footerCartItemImg,{left: windowWidth*(5/100), position:'absolute'}]}>
                        <Image 
                            source={{uri:getImage(GroCartList[1]?.imageUrl)}}
                            style={styles.footerCartImgStyle}
                        />
                        </View>
                    )
                }
                {
                    GroCartList?.length >2 &&(
                        <View style={[styles.footerCartItemImg,{left: windowWidth*(8/100), position:'absolute'}]}>
                        <Image 
                            source={{uri:getImage(GroCartList[2]?.imageUrl)}}
                            style={styles.footerCartImgStyle}
                        />
                        </View>
                    )
                }
                <Text/>
                <View>
                    <Text style={[styles.fontStyle1,{color: colours.kapraWhite,fontFamily: 'Lexend-Bold',}]}>  View Cart</Text>
                    <Text style={[styles.fontStyle1,{color: colours.kapraWhite}]}>  {GroCartList?.length} item(s)</Text>

                </View>

                <View style={[styles.footerCartItemImg,{backgroundColor: '#B02800', borderColor: '#B02800'}]}>
                    {showIcon('right3', '#FFF', windowWidth*(5/100))}
                </View>
                </TouchableOpacity>


                <TouchableOpacity style={styles.iconCon}  onPress={() => Linking.openURL('whatsapp://send?text=Hi Kapra Daily..&phone=+919539701110')} >
                    <View style={styles.iconStyle}>
                    {showIcon('whatsapp', colours.kapraBlackLow, windowWidth * (4 / 100))}
                    </View>
                <Text style={styles.fontStyle2}>Connect</Text>
                </TouchableOpacity>
                

            </View>
            )
        }

    </>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        width : windowWidth,
        height: windowHeight*(8/100),
        backgroundColor: colours.kapraWhite,
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems:'center',

        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 }, // Negative height for top shadow
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    footerCartCon: {
        width: windowWidth*(50/100),
        height: windowHeight*(6/100),
        backgroundColor: colours.kapraOrangeLight,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius:windowHeight*(3/100),
        paddingHorizontal: windowWidth*(2/100),

    },
    footerCartItemImg:{
        width: windowWidth*(10/100),
        height: windowWidth*(10/100),
        borderRadius: windowWidth*(6/100),
        backgroundColor: colours.kapraWhite,
        alignItems:'center',
        justifyContent:'center',
        borderWidth: 1,
        borderColor: colours.kapraOrangeDark,
    },
    footerCartImgStyle: {
        width: windowWidth*(7/100),
        height: windowWidth*(7/100),
        borderRadius: windowWidth*(5/100),
        resizeMode:'contain'
    },
    iconCon: {
        height: windowHeight*(6/100),
        width: windowWidth*(12/100),
        alignItems:'center',
        justifyContent:'center',
    },
    iconStyle: {
        width: windowWidth*(6/100),
        height: windowWidth*(6/100),
        alignItems: 'center',
        justifyContent: 'center',
    },


    fontStyle1: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(12),
        color: colours.kapraBlack
    },
    fontStyle2: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(10),
        color: colours.kapraBlackLow
    },

});
