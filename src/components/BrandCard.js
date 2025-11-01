import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { getImage } from '../globals/functions';
import { getFAIcon } from '../globals/fa-icons';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
export default function BrandCard({ title, image, Nav }) {
    return (
        <TouchableOpacity onPress={Nav} style={styles.mainContainer}>
            {
                image ?
                    // <Image
                    //     style={styles.categoryImage}
                    //     source={{
                    //         uri: getImage(image),
                    //     }}
                    // />
                    <FastImage
                        style={styles.categoryImage}
                        source={{
                            uri: getImage(image),
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    :
                    getFAIcon('fas fa-apple-alt')
            }
            {/* <Text>{title}</Text> */}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    mainContainer: {
        width: windowWidth * (28 / 100),
        height: windowWidth * (28 / 100),
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.18,
        // shadowRadius: 1.0,
        // margin: 10,
        // elevation: 1,
    },
    categoryImage: {
        width: windowWidth * (25 / 100),
        height: windowWidth * (25 / 100),
        resizeMode: 'contain',
        borderRadius: 5,
    },
    textStyle: {
        //fontFamily: 'SF-Pro-Display-Regular',
        fontSize: 11,
        textAlign: 'center',
        paddingTop: '5%',
    },
});