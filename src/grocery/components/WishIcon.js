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
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../../Context/appContext';
import {
    addToWishList,
    removeFromWishList,
} from '../api';

const windowWidth = Dimensions.get('window').width;
export default function WishIcon({
    ProductID,
    urlKey
}) {
    const { Language, UpdateGroWishCount, GroWishListData, GroUpdateWishList } = React.useContext(AppContext);
    const Lang = Language;
    const [wishStatus, setWishStatus] = React.useState(false);
    const AddToWishlist = async () => {
        setWishStatus(true);
        await addToWishList(urlKey);
        await GroUpdateWishList();
        UpdateGroWishCount();
        setWishStatus(false);
        Toast.show('Added To Wishlist');
    }
    const RemoveFromWishlist = async () => {
        setWishStatus(true);
        await removeFromWishList(urlKey);
        await GroUpdateWishList();
        UpdateGroWishCount();
        setWishStatus(false);
        Toast.show('Removed From Wishlist');
    }
    return (
        <View style={styles.wishContainer}>
            {
                wishStatus ?
                    <ActivityIndicator size="small" color={GroWishListData["p" + ProductID] != null || GroWishListData["p" + ProductID] == true ? colours.primaryGrey : colours.primaryRed} />
                    :
                    GroWishListData["p" + ProductID] != null || GroWishListData["p" + ProductID] == true ? (
                        <TouchableOpacity onPress={() => {RemoveFromWishlist();}}>
                            {showIcon('heartFill', colours.primaryRed, windowWidth * (5 / 100))}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => {AddToWishlist();}}>
                            {showIcon('heart', colours.primaryGrey, windowWidth * (5 / 100))}
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
    },

});