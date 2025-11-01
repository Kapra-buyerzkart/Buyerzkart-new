import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions, Image, Text } from 'react-native';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Splash({ navigation }) {
    const { loadCart } = React.useContext(AppContext);
    const [isOpenedBefore, setIOP] = React.useState(null);
    React.useEffect(() => {
        const asynceffect = async () => {
            let iop = await AsyncStorage.getItem('isOpenedBefore');
            setIOP(iop === null ? false : iop);
            setTimeout( async function () {
                iop === 'true' ? 
                    // navigation.reset({
                    //     index: 0,
                    //     routes: [{ name: 'DrawerNavigator' }],
                    // }) 
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'GroceryHome',
                            }
                        ],
                    })
                : 
                (    
                    // await AsyncStorage.setItem('isOpenedBefore', 'true'),
                    // navigation.navigate('Register')
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'GroceryHome',
                            }
                        ],
                    })
                )
            }, 3000)
        }
        asynceffect();
    }, []);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Animatable.View animation="zoomIn" iterationCount={1} direction="alternate" >
                <Image
                    source={require('../assets/logo/logo.png')}
                    style={{
                        height: windowHeight,
                        width: windowWidth*(80/100),
                        resizeMode: 'contain',
                    }}
                />
            </Animatable.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colours.primaryWhite
    },
    fontStyle4: {
        fontFamily: 'Proxima Nova Alt Regular',
        color: colours.kapraMain,
        fontSize: 34,
        fontWeight: 'bold',
    },
});
