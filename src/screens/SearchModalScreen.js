import React, { useState, createRef } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { getImage, getFontontSize } from '../globals/functions';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import {
  getSearchAutoCompleteList
} from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import FastImage from 'react-native-fast-image'
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SearchModalScreen({ navigation }) {
  const searchInputRef = createRef();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState(null);
  const [historyData, setHistoryData] = React.useState(null);
  const [keyword, setkeyword] = React.useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const { profile, updateWishCount, cart, updateCart, updateWishList, loadWishList } = React.useContext(AppContext);

  const _fetchHomeData = async () => {
    setHistoryData(JSON.parse(await AsyncStorage.getItem('SearchHistory')))
    let res = await getSearchAutoCompleteList(keyword);
    setData(res);
  };

  const gotoSearch = async (item) => {
    var obj = [];
    var count = 0;
    var obj = JSON.parse(await AsyncStorage.getItem('SearchHistory'));
    if (obj) {

      for (let i = 0; i < obj.length; i++) {
        if (obj[i].ProductName === item.ProductName) {
          count = count + 1;
        }
      }
      if (count === 0) {
        obj.push(item);
        await AsyncStorage.setItem('SearchHistory', JSON.stringify(obj));
      }
      var obj = [];
    } else {
      var obj1 = [];
      obj1.push(item);
      await AsyncStorage.setItem('SearchHistory', JSON.stringify(obj1));
    }
    navigation.navigate('SingleItemScreen', {
      UrlKey: item.urlKey,
    })
  };

  React.useEffect(() => {
    _fetchHomeData(false);
  }, [keyword]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setkeyword('');
  //     _fetchHomeData(false);
  //   }, []),
  // );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} HeaderText={'Search'} backEnable Cart WishList  />
      <LinearGradient
        colors={[ colours.kapraMain, colours.kapraMain ]}
        style={{ width: windowWidth,}}
      >
      {/* <View style={{ backgroundColor: colours.lowWhite, width: windowWidth, }}> */}
        <View style={styles.inputContainer}>
          <View style={styles.iconStyle}>
            {showIcon('search', colours.kapraMain, windowWidth * (4 / 100))}
          </View>
          <TextInput
            value={keyword}
            onChangeText={(text) => setkeyword(text)}
            style={styles.inputText}
            placeholder={'What Are You Looking For ?'}
            placeholderTextColor={colours.kapraMain}
            autoFocus={true}
            ref={searchInputRef}
          />
        </View>
      {/* </View> */}
      </LinearGradient>

      <View style={{ width: windowWidth * (90 / 100), justifyContent: 'flex-start' }}>
        {
          data !== null && data.length > 0 && keyword !== '' ?
            <>
              <View style={{ backgroundColor: colours.primaryWhite, width: windowWidth * (90 / 100), height: windowHeight * (7 / 100), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.fontStyle1}>
                  Result(s) found : {data.length}
                </Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate('SearchScreen', { Keyword: keyword })}>
                  <Text style={styles.ViewAllText}> View All </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={({ item }, index) => (
                  <>
                    <TouchableOpacity
                      onPress={() => gotoSearch(item)}
                      style={styles.searchItem}
                    >
                      <FastImage
                        style={styles.imageStyle}
                        source={{
                          uri: getImage(item.featuredImage),
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <View>
                        <Text style={[styles.fontStyle1,{width: windowWidth*(60/100)}]} numberOfLines={2}>{item.ProductName.toUpperCase()}</Text>
                        <Text style={styles.fontStyle2}>in {item.CatName}</Text>
                      </View>
                      <Text style={styles.iconStyle}>
                        {"  "}{showIcon('rightarrow', colours.primaryBlack, windowWidth * (5 / 100))}
                      </Text>
                    </TouchableOpacity>

                  </>
                )}
                contentContainerStyle={{ paddingBottom: windowHeight * (20 / 100) }}
              />
            </>
            :
            historyData !== null && historyData.length > 0 ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={historyData}
                inverted={true}
                renderItem={({ item }, index) => (
                  <>
                    <TouchableOpacity
                      // onPress={() => {
                      //     navigation.navigate('Cart');
                      // }}
                      onPress={() => gotoSearch(item)}
                      style={styles.searchItem}
                    >
                      <Text style={[styles.iconStyle, { marginRight: windowWidth * (5 / 100) }]}>
                        {showIcon('clock', colours.primaryBlack, windowWidth * (5 / 100))}
                      </Text>
                      <View>
                        <Text style={styles.fontStyle1} numberOfLines={2}>{item.ProductName.toUpperCase()}</Text>
                        <Text style={styles.fontStyle2}>in {item.CatName}</Text>
                      </View>
                      <Text style={styles.iconStyle}>
                        {showIcon('rightarrow', colours.primaryBlack, windowWidth * (5 / 100))}
                      </Text>
                    </TouchableOpacity>

                  </>
                )}
              />
              :
              null
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  inputContainer: {
    borderRadius: windowHeight * (6 / 100),
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (94 / 100),
    margin: windowWidth * (3 / 100),
    fontWeight: 'bold',
    fontSize: getFontontSize(18),
    flexDirection: 'row',
    alignItems: 'center',
    height: windowHeight * (6 / 100)
  },

  imageStyle: {
    width: windowWidth * (15 / 100),
    height: windowWidth * (15 / 100),
    borderRadius: 5,
    marginLeft: windowWidth * (4.5 / 100),
    marginRight:10
  },
  iconStyle: {
    paddingLeft: windowWidth * (5 / 100),
  },
  searchItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 5,
    marginVertical: 5,
    borderBottomWidth:2,
    borderBottomColor: colours.lowWhite,
    width: windowWidth*(90/100)
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(15),
    width: windowWidth * (65 / 100)
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    paddingTop:10,
    paddingLeft: 15,
    color: colours.kapraLight,
  },
  inputText: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    paddingLeft: 15,
    width: windowWidth * (65 / 100),
    color: colours.kapraLight,
  },
  viewAllButton: {
    backgroundColor: colours.lowWhite,
    paddingHorizontal: 4,
    height: windowWidth * (6 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  ViewAllText: {
    color: colours.primaryRed,
    fontSize: getFontontSize(16),
    fontFamily: 'Proxima Nova Alt Bold',
    paddingTop: -5
  },
});
