import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import FastImage from 'react-native-fast-image'
import { AppContext } from '../Context/appContext';
import { shadow } from 'react-native-paper';
import { getFAIcon } from '../globals/fa-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function SubCategory({
    Name,
    image,
    OnPress,
    Color
}) {
    //const Lang = LanguageData.en;
    const { Language } = React.useContext(AppContext);
    const Lang = Language;

    return (
        <TouchableOpacity
            onPress={OnPress}
            style={styles.container}
        >
            <View style={[styles.imageCotainer, { backgroundColor: Color }]}>
                {
                    image ?
                        <FastImage
                            style={styles.imageStyle}
                            source={{
                                uri: image,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        :
                        <Image source={require('../assets/logo/logo.png')}
                            style={[styles.imageStyle, {
                                width: windowWidth * (22 / 100),
                                height: windowWidth * (20 / 100),
                            }]}
                        />
                }
            </View>
            <View style={styles.bottomCotainer}>
                <Text style={styles.fontStyle1} numberOfLines={2}>
                    {Name}
                </Text>
            </View>

        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (28 / 100),
        alignItems: 'center',
        justifyContent: 'space-around',
        height: windowWidth * (33 / 100),
        borderRadius: 5,
        margin: windowWidth * ( 2/ 100),
        backgroundColor: colours.lightPink,
    },
    imageCotainer: {
        width: windowWidth * (20 / 100),
        height: windowWidth * (20 / 100),
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: colours.white,
        alignItems: 'center',
    },
    bottomCotainer: {
        height: windowWidth * (10 / 100),
        width: windowWidth * (26 / 100),
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: windowWidth * (20 / 100),
        height: windowWidth * (20 / 100),
        borderRadius: 5,
        position: 'absolute',
        padding: 5,
        resizeMode: 'contain',
    },
    fontStyle1: {
        fontFamily: 'Proxima Nova Alt Regular',
        fontSize: windowWidth * (3.5 / 100),
        textAlign: 'center'
    },
});
