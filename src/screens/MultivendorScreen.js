import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import VendorCard from '../components/VendorCard';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import Carousel from 'react-native-snap-carousel';
import { getImage } from '../globals/functions';
import { LoaderContext } from '../Context/loaderContext';
import AuthButton from '../components/AuthButton';
import { getVendorData } from '../api';
import { AppContext } from '../Context/appContext';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
export default function MultivendorScreen({ navigation, route }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [data, setData] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const { showLoader, loading } = React.useContext(LoaderContext);

  const _fetchVendorData = async () => {
    try {
      showLoader(true);
      let res = await getVendorData({
        currentpage: 1,
        pagesize: 25,
        minPrice: 0,
        maxPrice: 433353545,
        pincode: '682030', //pincode From FE default as "682024" or "682030"  : 682030 has More products
        filtervalues: '', //attrValueIds
        sortorder: {
          field: '',
          direction: 'latest', /// Sortby Values= "highToLow" ,"lowToHigh","a-z","z-a","latest". Put "latest" as default
        },
        searchstring: searchText, //any  string
        filter: {
          category: null, //catUrlKey .not catName
        },
        vendorname: route?.params?.vendorName,
      });
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchVendorData();
  }, [searchText]);
  if (data === null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} backEnable WishList Cart />
      {data?.vendorBanners.length !== 0 && (
        <>
          <View>
            <Carousel
              autoplay
              data={data?.vendorBanners}
              renderItem={_renderMainBanner}
              sliderWidth={500}
              sliderHeight={200}
              itemWidth={500}
            />
          </View>
        </>
      )}
      <View style={{ alignItems: 'center' }}>
        <View style={styles.topContainer}>
          <View style={styles.topInnerContainer}>
            <Text style={styles.fontStyle1}>
              {data?.vendorDetails?.vendorName}
            </Text>
            <Text style={styles.fontStyle2}>
              {data?.vendorDetails?.shopAddress}
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => { }}>
            <Text style={styles.searchButton}>
              {showIcon('search', colours.black, 17)}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputArea}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            placeholder={'Search'}
          />
          <TouchableOpacity onPress={() => setSearchText()}>
            <Text style={styles.closeButton}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => { }} />
        }
        data={data?.Proddetails}
        renderItem={({ item }, i) => (
          <VendorCard
            Title={item.prName}
            Rating={item.IsReviewAvgrating}
            SpeacialPrice={item.specialPrice}
            UnitPrice={item.unitPrice}
            OnPress={() =>
              navigation.push('SingleItem', {
                UrlKey: item.urlKey,
              })
            }
            img={getImage(item.imageUrl)}
          />
        )}
        keyExtractor={(item, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          width: windowWidth,
          alignItems: 'center',
          marginTop: 10
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle5}>No Products Found</Text>
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() => navigation.navigate('Home')}
              ButtonText={'Browse More'}
              ButtonWidth={90}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 20,
    height: windowWidth * (8 / 100),
  },
  topContainer: {
    width: windowWidth * (90 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  topInnerContainer: {
    justifyContent: 'center',
  },
  fontStyle2: {
    fontSize: 12,
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  fontStyle3: {
    fontSize: 20,
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.kapraMain,
    paddingTop: 2,
    paddingLeft: '3%',
  },
  searchContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowWidth * (9 / 100),
    borderWidth: 0.5,
    borderColor: colours.authText,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
    marginBottom: '5%',
  },
  inputArea: {
    width: windowWidth * (60 / 100),
    height: windowWidth * (10 / 100),
    fontSize: 10,
    fontFamily: 'Proxima Nova Alt Bold',
  },
  searchButton: {
    padding: windowWidth * (6 / 100),
  },
  closeButton: {
    padding: windowWidth * (6 / 100),
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: 13,
  },
  fontStyle5: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 14,
    color: colours.black,
    paddingTop: '5%',
  },
  fontStyle6: {
    fontFamily: 'Proxima Nova Alt Light',
    fontSize: 12,
    color: colours.black,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});

const _renderMainBanner = ({ item, index }) => {
  return (
    <View>
      <FastImage
        style={{
          width: windowWidth,
          height: windowWidth * (50 / 100),
          resizeMode: 'contain',
        }}
        source={{
          uri: getImage(item.imageUrl),
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};
