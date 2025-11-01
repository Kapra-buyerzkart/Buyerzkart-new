import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    OnPress,
    ActivityIndicator
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import {
    addToWishList,
    removeFromWishList,
} from '../api';

const windowWidth = Dimensions.get('window').width;
export default function WishIcon({
    ProductID,
    urlKey
}) {
    const { Language, updateWishCount, wishListData, loadWishList, updateWishList } = React.useContext(AppContext);
    const Lang = Language;
    const [wishStatus, setWishStatus] = React.useState(false);
    const AddToWishlist = async () => {
        setWishStatus(true);
        await addToWishList(urlKey);
        await updateWishList();
        await loadWishList();
        updateWishCount();
        setWishStatus(false);
        Toast.show('Added To Wishlist');
    }
    const RemoveFromWishlist = async () => {
        setWishStatus(true);
        await removeFromWishList(urlKey);
        await updateWishList();
        await loadWishList();
        updateWishCount();
        setWishStatus(false);
        Toast.show('Removed From Wishlist');
    }
    return (
        <View style={styles.wishContainer}>
            {
                wishStatus ?
                    <ActivityIndicator size="small" color={wishListData["p" + ProductID] != null || wishListData["p" + ProductID] == true ? colours.primaryGrey : colours.primaryRed} />
                    :
                    wishListData["p" + ProductID] != null || wishListData["p" + ProductID] == true ? (
                        <>
                            <TouchableOpacity
                                style={{
                                    padding: 5,
                                }}
                                onPress={() => {
                                    RemoveFromWishlist();
                                }}>
                                <Text>{showIcon('heartFill', colours.primaryRed, windowWidth * (5 / 100))}</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={{
                                padding: 5,
                            }}
                            onPress={() => {
                                AddToWishlist();
                            }}>
                            <Text>{showIcon('heart', colours.primaryGrey, windowWidth * (5 / 100))}</Text>
                        </TouchableOpacity>
                    )
            }
        </View>
    );
}

const styles = StyleSheet.create({

    wishContainer: {
        width: windowWidth * (8 / 100),
        height: windowWidth * (8 / 100),
        borderRadius: windowWidth * (4 / 100),
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: windowWidth * (2 / 100),
        // marginLeft: windowWidth * (35 / 100),
        // backgroundColor: colours.white,
        // position: 'absolute',
        // elevation: 5,
    },

});