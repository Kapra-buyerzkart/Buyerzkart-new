/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Modal,
    TextInput,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CONFIG from '../globals/config';
import SearchScreen from './SearchScreen';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import DealDayCard from '../components/DealDayCard';
import CategoryGrid from '../components/CategoryGrid';
import BrandCard from '../components/BrandCard';
import ProductCard from '../components/ProductCard';
import { offerZoneData, offerZoneDealData, offerCategoryData, changePincode, getDealOfTheDay, getCategoryArchive } from '../api';
import { getImage } from '../globals/functions';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import PincodeChange from '../components/PincodeChange';
import CategoryOfferCard from '../components/CategoryOfferCard';
import {
    addToWishList,
    removeFromWishList,
} from '../api';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OfferZoneScreen = ({ navigation }) => {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    const { updateWishCount } = React.useContext(AppContext);
    const [data, setData] = React.useState(null);
    const [dealOfData, setDealOfData] = React.useState(null);
    const [categotyProductData, setCategotyProductData] = React.useState([]);
    const { showLoader, loading } = React.useContext(LoaderContext);
    var Bcolor = ['#ff92a2', '#a4ff92', '#fffa92', '#ffcd92', '#92c4ff', '#ffaaaa', '#41ffbf', '#ff92a2', '#a4ff92', '#fffa92', '#ffcd92', '#92c4ff', '#ffaaaa', '#41ffbf', '#ff92a2', '#a4ff92', '#fffa92', '#ffcd92', '#92c4ff', '#ffaaaa'];


    const _offerZoneData = async () => {
        try {
            showLoader(true);
            let res = await offerZoneData();
            let res1 = await offerZoneDealData();
            setDealOfData(res1);
            setData(res);
            showLoader(false);
        } catch (err) {
            showLoader(false);
            Toast.show(err);
        }
    };
    let onpress = (item) => {
        if (item.mob_type === 'Category') {
            navigation.navigate('SearchScreen', {
                CatName: item.mob_urlKey,
            });
        } else if (item.mob_type === 'Product') {
            navigation.navigate('SingleItem', {
                UrlKey: item.mob_urlKey,
            });
        }
    };

    React.useEffect(() => {
        _offerZoneData();
    }, []);
    const _renderMainBanner = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => onpress(item)}>
                <FastImage
                    style={{
                        width: windowWidth,
                        height: windowWidth * (50 / 100),
                        resizeMode: 'cover',
                    }}
                    source={{
                        uri: getImage(item.imageUrl),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </TouchableOpacity>
        );
    };

    if (data === null) return null;
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header navigation={navigation} HeaderText={'Saver Zone'} backEnable WishList Cart />
            {Object.keys(data).length === 0 ? null : (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={_offerZoneData} />
                    }>
                    <Carousel
                        autoplay
                        data={data.MobileMainBanners}
                        renderItem={_renderMainBanner}
                        sliderWidth={windowWidth}
                        sliderHeight={500}
                        itemWidth={windowWidth}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, width: windowWidth }}>
                        <TouchableOpacity style={{ width: '45%', borderRadius: 5 }}
                            onPress={() =>
                                navigation.navigate('SearchScreen', {
                                    maxPrice: 50,
                                })
                            }>
                            <Image source={{ uri: CONFIG.image_base_url + 'assets/images/uploads/productimages/shop-under50.png' }}
                                style={{ width: '100%', height: 80, borderRadius: 5 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '45%', borderRadius: 5 }}
                            onPress={() =>
                                navigation.navigate('SearchScreen', {
                                    maxPrice: 100,
                                })
                            }>
                            <Image source={{ uri: CONFIG.image_base_url + 'assets/images/uploads/productimages/shop-under100.png' }}
                                style={{ width: '100%', height: 80, borderRadius: 5 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 }}>
                        <TouchableOpacity style={{ width: '45%', borderRadius: 5 }}
                            onPress={() =>
                                navigation.navigate('SearchScreen', {
                                    maxPrice: 250,
                                })
                            }>
                            <Image source={{ uri: CONFIG.image_base_url + 'assets/images/uploads/productimages/shop-under250.png' }}
                                style={{ width: '100%', height: 80, borderRadius: 5 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '45%', borderRadius: 5 }}
                            onPress={() =>
                                navigation.navigate('SearchScreen', {
                                    maxPrice: 500,
                                })
                            }>
                            <Image source={{ uri: CONFIG.image_base_url + 'assets/images/uploads/productimages/shop-under500.png' }}
                                style={{ width: '100%', height: 80, borderRadius: 5 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {dealOfData.dealToday.length !== 0 && (
                        <>
                            <View style={{ width: windowWidth, alignItems: 'center', backgroundColor: '#ffae63' }}>
                                <View style={styles.headingContainer}>
                                    <Text style={styles.fontStyle1}>Deal Of The Day</Text>
                                    {/* <TouchableOpacity
                                        style={styles.viewAllButton}
                                        onPress={() => navigation.navigate('DealOfTheDayScreen')}>
                                        <Text style={styles.ViewAllText}>View all</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', backgroundColor: '#ffae63', width: windowWidth }}>
                                <FlatList
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                        paddingRight: '10%',
                                        paddingTop: '1%',
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    data={dealOfData.dealToday}
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
                                            Variations={item.variationJson ? item.variationJson : null}
                                            AddToWishlist={async () => {
                                                await addToWishList(item.urlKey);
                                                updateWishCount();
                                                Toast.show('Added To Wishlist');
                                            }}
                                            RemoveFromWishlist={async () => {
                                                await removeFromWishList(item.urlKey);
                                                updateWishCount();
                                                Toast.show('Removed From Wishlist');
                                            }}
                                            OnPress={() => {
                                                if (item.urlKey !== null) {
                                                    navigation.navigate('SingleItem', {
                                                        UrlKey: item.urlKey,
                                                    });
                                                } else {
                                                    Toast.show('UrlKey Is Null');
                                                }
                                            }}
                                        />
                                    )}
                                    keyExtractor={(item, i) => i.toString()}
                                />
                            </View>
                        </>

                    )}
                    {dealOfData.dealWeek.length !== 0 && (
                        <>
                            <View style={{ width: windowWidth, alignItems: 'center', backgroundColor: '#fff563' }}>
                                <View style={styles.headingContainer}>
                                    <Text style={styles.fontStyle1}>{' Deal of the Week'}</Text>
                                    {/* <TouchableOpacity
                                        style={styles.viewAllButton}
                                        onPress={() => navigation.navigate('DealOfTheDayScreen')}>
                                        <Text style={styles.ViewAllText}>View all</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', backgroundColor: '#fff563', width: windowWidth }}>
                                <FlatList
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                        paddingRight: '10%',
                                        paddingTop: '1%',
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    data={dealOfData.dealWeek}
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
                                            Variations={item.variationJson ? item.variationJson : null}
                                            AddToWishlist={async () => {
                                                await addToWishList(item.urlKey);
                                                updateWishCount();
                                                Toast.show('Added To Wishlist');
                                            }}
                                            RemoveFromWishlist={async () => {
                                                await removeFromWishList(item.urlKey);
                                                updateWishCount();
                                                Toast.show('Removed From Wishlist');
                                            }}
                                            OnPress={() => {
                                                if (item.urlKey !== null) {
                                                    navigation.navigate('SingleItem', {
                                                        UrlKey: item.urlKey,
                                                    });
                                                } else {
                                                    Toast.show('UrlKey Is Null');
                                                }
                                            }}
                                        />
                                    )}
                                    keyExtractor={(item, i) => i.toString()}
                                />
                            </View>
                        </>

                    )}
                    {dealOfData.dealMonth.length !== 0 && (
                        <>
                            <View style={{ width: windowWidth, alignItems: 'center', backgroundColor: '#63ffed' }}>
                                <View style={styles.headingContainer}>
                                    <Text style={styles.fontStyle1}>{' Deal of the Month'}</Text>
                                    {/* <TouchableOpacity
                                        style={styles.viewAllButton}
                                        onPress={() => navigation.navigate('DealOfTheDayScreen')}>
                                        <Text style={styles.ViewAllText}>View all</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: '#63ffed'
                            }}>
                                <FlatList
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                        paddingRight: '10%',
                                        paddingTop: '1%'
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    data={dealOfData.dealMonth}
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
                                            Variations={item.variationJson ? item.variationJson : null}
                                            AddToWishlist={async () => {
                                                await addToWishList(item.urlKey);
                                                updateWishCount();
                                                Toast.show('Added To Wishlist');
                                            }}
                                            RemoveFromWishlist={async () => {
                                                await removeFromWishList(item.urlKey);
                                                updateWishCount();
                                                Toast.show('Removed From Wishlist');
                                            }}
                                            OnPress={() => {
                                                if (item.urlKey !== null) {
                                                    navigation.navigate('SingleItem', {
                                                        UrlKey: item.urlKey,
                                                    });
                                                } else {
                                                    Toast.show('UrlKey Is Null');
                                                }
                                            }}
                                        />
                                    )}
                                    keyExtractor={(item, i) => i.toString()}
                                />
                            </View>
                        </>
                    )}


                    {data.TopCategories.length !== 0 && (
                        data.TopCategories.map((item, i) => (
                            <CategoryOfferCard
                                UrlTitle={data.TopCategories[i].catUrlKey}
                                Name={data.TopCategories[i].catName}
                                BGcolor={Bcolor[i]}
                            />
                        ))

                    )}

                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default OfferZoneScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colours.white,
        alignItems: 'center',
    },
    fontStyle1: {
        fontFamily: 'Proxima Nova Alt Semibold',
        fontSize: 18,
    },

    promoBannerImage: {
        width: windowWidth * (92 / 100),
        height: windowWidth * (40 / 100),
        resizeMode: 'cover',
    },
    productContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: '3%',
    },
    headingContainer: {
        flexDirection: 'row',
        width: windowWidth * (90 / 100),
        height: 22,
        justifyContent: 'space-between',
        marginTop: '5%',
        marginBottom: '3%',
    },
    inputContainer: {
        borderRadius: 5,
        backgroundColor: colours.whiteBackground,
        width: '94%',
        margin: '3%',
        fontWeight: 'bold',
        fontSize: 18,
        flexDirection: 'row',
        alignItems: 'center',
        height: windowHeight * (7 / 100)
    },
    viewAllButton: {
        backgroundColor: colours.kapraMain,
        paddingHorizontal: 4,
        height: windowWidth * (6 / 100),
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        borderRadius: 5,
    },
    iconStyle: {
        paddingLeft: '5%',
    },
    ViewAllText: {
        color: colours.white,
        fontSize: 10,
        fontFamily: 'Proxima Nova Alt Regular',
    },
});
