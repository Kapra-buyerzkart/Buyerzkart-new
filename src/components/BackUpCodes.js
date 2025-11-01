

//ShopByCategoryOld

import React, { cloneElement } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    RefreshControl,
    Image
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { AppContext } from '../Context/appContext';
import { getImage } from '../globals/functions';
import Header from '../components/Header';
import { getFAIcon } from '../globals/fa-icons';
import colours from '../globals/colours';
import AuthButton from '../components/AuthButton';
import { LoaderContext } from '../Context/loaderContext';
import { shopByCategory } from '../api';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;

const ShopByCategoryScreen = ({ navigation }) => {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    const [data, setData] = React.useState(null);
    const { showLoader, loading } = React.useContext(LoaderContext);
    const [selected, setSelected] = React.useState('');
    const { profile } = React.useContext(AppContext);

    const _fetchHomeData = async () => {
        try {
            showLoader(true);
            let res = await shopByCategory();
            setData(resolveF__kingCode(res));
            showLoader(false);
        } catch (err) {
            showLoader(false);
            Toast.show;
        }
    };

    React.useEffect(() => {
        _fetchHomeData();
    }, []);

    if (data === null) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    backEnable
                    navigation={navigation}
                    HeaderText={Lang.ShopByCategory}
                    WishList
                    Cart
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
                    }
                    contentContainerStyle={{
                        alignItems: 'center',
                    }}
                    style={{
                        marginTop: 25,
                    }}>
                    {data.map((cat) => (
                        <>
                            <View
                                style={[
                                    styles.parentContainer,
                                    selected !== cat.catName
                                        ? {
                                            borderBottomColor: colours.authText,
                                            borderBottomWidth: 0.6,
                                        }
                                        : {},
                                ]}>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('SearchScreen', {
                                            CatName: cat.catName,
                                        })
                                    }
                                    style={{
                                        width: '20%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    {/* {getFAIcon(cat.image)} */}
                                    {
                                        cat.imageUrl ?
                                            <Image
                                                style={styles.categoryImage}
                                                source={{
                                                    uri: getImage(cat.imageUrl),
                                                }}
                                            />
                                            :
                                            null
                                        //getFAIcon('fas fa-apple-alt')
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('SearchScreen', {
                                            CatName: cat.catName,
                                            catUrlKey: cat.catUrlKey,
                                        })
                                    }
                                    style={{
                                        width: '60%',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={styles.parentName}>{cat.catName}</Text>
                                </TouchableOpacity>

                                <View
                                    style={{
                                        width: '20%',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                    }}>
                                    {cat.children.length !== 0 && (
                                        <TouchableOpacity
                                            onPress={
                                                selected !== cat.catName
                                                    ? () => setSelected(cat.catName)
                                                    : () => setSelected('')
                                            }
                                            style={{}}>
                                            {selected !== cat.catName
                                                ? getFAIcon('plus-square')
                                                : getFAIcon('minus-square')}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <Collapsible collapsed={selected !== cat.catName}>
                                <View
                                    style={[
                                        styles.childContainer,
                                        selected === cat.catName
                                            ? {
                                                borderBottomColor: colours.authText,
                                                borderBottomWidth: 0.6,
                                            }
                                            : {},
                                    ]}>
                                    {cat.children.map((child) => (
                                        <TouchableOpacity
                                            style={styles.childBtn}
                                            onPress={() =>
                                                navigation.navigate('SearchScreen', {
                                                    CatName: child.catName,
                                                    catUrlKey: child.catUrlKey,
                                                })
                                            }>
                                            {getFAIcon(child.image)}
                                            <Text style={styles.childName} numberOfLines={1}>
                                                {child.catName}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Collapsible>
                        </>
                    ))}
                </ScrollView>
                <AuthButton
                    BackgroundColor={colours.primaryBlue}
                    OnPress={() =>
                        navigation.navigate('SearchScreen', { backEnable: true })
                    }
                    ButtonText={'View All Products'}
                    ButtonWidth={90}
                />
            </SafeAreaView>
        );
    }
};

export default ShopByCategoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colours.white,
    },
    parentContainer: {
        width: windowWidth * (95 / 100),
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    parentName: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    },
    childContainer: {
        width: windowWidth * (95 / 100),
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingBottom: 10,
    },
    childBtn: {
        width: windowWidth * (36 / 100),
        height: 60,
        borderColor: colours.authText,
        borderWidth: 0.6,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 10,
        padding: 14,
    },
    childName: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10,
        width: windowWidth * (25 / 100),
        textAlign: 'center',
    },
    categoryImage: {
        width: windowWidth * (12 / 100),
        height: windowWidth * (12 / 100),
        resizeMode: 'cover',
        borderRadius: windowWidth * (6 / 100),
    },
});

const resolveF__kingCode = (DATA) => {
    let parent = DATA.filter((cat) => cat.code.split('#').length === 2);
    let children = DATA.filter((cat) => cat.code.split('#').length === 3);
    let arr = [];
    parent.map((parCat) => {
        parCat.children = [];
        children.map((chCat) => {
            if (chCat.code.split('#')[1] == parCat.catId) parCat.children.push(chCat);
        });
        arr.push(parCat);
    });
    return arr;
};