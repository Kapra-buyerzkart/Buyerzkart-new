import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { getImage } from '../globals/functions';
import Toast from 'react-native-simple-toast';
import DealDayCard from '../components/DealDayCard';
import { offerCategoryData, addToWishList, removeFromWishList, } from '../api';
import { AppContext } from '../Context/appContext';
import { useNavigation } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function CategoryOfferCard({ UrlTitle, Name, OnPress, BGcolor, }) {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    const { updateWishCount } = React.useContext(AppContext);
    const navigation = useNavigation();
    const [categotyProductData, setCategotyProductData] = React.useState([]);
    const dealCategory = async (value) => {
        try {
            let res3 = await offerCategoryData(value);
            setCategotyProductData(res3);
        } catch (err) {
            Toast.show(err);
        }
    };
    React.useEffect(() => {
        dealCategory(UrlTitle);
    }, []);
    return (
        categotyProductData.length !== 0 && (
            <TouchableOpacity onPress={OnPress} >
                <View style={{ width: windowWidth, alignItems: 'center', backgroundColor: BGcolor }}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.fontStyle1}>{'Top Deals On '} {Name}</Text>
                        {/* <TouchableOpacity
                                        style={styles.viewAllButton}
                                        onPress={() => navigation.navigate('DealOfTheDayScreen')}>
                                        <Text style={styles.ViewAllText}>View all</Text>
                                    </TouchableOpacity> */}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: BGcolor }}>
                    <FlatList
                        contentContainerStyle={{
                            alignItems: 'center',
                            paddingRight: '10%',
                            paddingTop: '1%',
                        }}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={categotyProductData}
                        renderItem={({ item }, i) => (
                            <DealDayCard
                                Home
                                Name={item.prName}
                                image={getImage(item.imageUrl)}
                                Rating={item.IsReviewAvgrating}
                                SpecialPrice={item.specialPrice}
                                UnitPrice={item.unitPrice}
                                IsWishlisted={item.IsWishlisted}
                                dealTo={item.dealTo}
                                AddToWishlist={async () => {
                                    await addToWishList(item.urlKey);
                                    updateWishCount();
                                    Toast.show(Lang.AddedToWishlist);
                                }}
                                RemoveFromWishlist={async () => {
                                    await removeFromWishList(item.urlKey);
                                    updateWishCount();
                                    Toast.show(Lang.RemovedFromWishlist);
                                }}
                                OnPress={() => {
                                    if (item.urlKey !== null) {
                                        navigation.navigate('SingleItem', {
                                            UrlKey: item.urlKey,
                                        });
                                    } else {
                                        Toast.show(Lang.UrlKeyIsNull);
                                    }
                                }}
                            />
                        )}
                        keyExtractor={(item, i) => i.toString()}
                    />
                </View>
            </TouchableOpacity >
        )
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#fff',
        width: windowWidth * (30 / 100),
        height: windowWidth * (30 / 100),
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    iconContainer: {
        width: windowWidth * (28 / 100),
        height: windowWidth * (28 / 100),
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        margin: 10,
        elevation: 1,
    },
    categoryImage: {
        width: windowWidth * (28 / 100),
        height: windowWidth * (28 / 100),
        resizeMode: 'cover',
        borderRadius: 5,
    },
    textStyle: {
        fontFamily: 'Proxima Nova Alt Regular',
        fontSize: 11,
        textAlign: 'center',
        paddingTop: '5%',
    },
    headingContainer: {
        flexDirection: 'row',
        width: windowWidth * (90 / 100),
        height: windowHeight * (4 / 100),
        justifyContent: 'space-between',
        marginTop: '5%',
        marginBottom: '3%',
    },
    fontStyle1: {
        fontFamily: 'Proxima Nova Alt Semibold',
        fontSize: 18,
    },
});