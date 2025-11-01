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
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import { getImage, getFontontSize } from '../globals/GroFunctions';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import { getSearchAutoCompleteList } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import Header from '../components/Header';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroSearchModalScreen({ navigation }) {

  const searchInputRef = createRef();
  
  const [data, setData] = React.useState(null);
  const [historyData, setHistoryData] = React.useState(null);
  const [keyword, setkeyword] = React.useState('');
  

  const _fetchHomeData = async () => {
    setHistoryData(JSON.parse(await AsyncStorage.getItem('SearchGHistory')))
    let res = await getSearchAutoCompleteList(keyword);
    setData(res);
  };

  const gotoSearch = async (item) => {
    var obj = [];
    var count = 0;
    var obj = JSON.parse(await AsyncStorage.getItem('SearchGHistory'));
    if (obj) {

      for (let i = 0; i < obj.length; i++) {
        if (obj[i].ProductName === item.ProductName) {
          count = count + 1;
        }
      }
      if (count === 0) {
        obj.push(item);
        await AsyncStorage.setItem('SearchGHistory', JSON.stringify(obj));
      }
      var obj = [];
    } else {
      var obj1 = [];
      obj1.push(item);
      await AsyncStorage.setItem('SearchGHistory', JSON.stringify(obj1));
    }
    navigation.navigate('GroSingleItemScreen', {
      UrlKey: item.urlKey,
    })
  };

  React.useEffect(() => {
    _fetchHomeData(false);
  }, [keyword]);


  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Search</Text>
      </View>

      {/* Search Input  */}
      <View style={styles.inputContainer}>
        <View style={styles.iconCon}>
          {showIcon('search', colours.kapraBlackLow, windowWidth * (4 / 100))}
        </View>
        <TextInput
          value={keyword}
          onChangeText={(text) => setkeyword(text)}
          style={styles.inputText}
          placeholder={'What Are You Looking For ?'}
          placeholderTextColor={colours.kapraBlackLow}
          autoFocus={true}
          ref={searchInputRef}
        />
      </View>

      {/* Items List  */}
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
                  onPress={() => navigation.navigate('GroSearchScreen', { Keyword: keyword })}>
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
                      <View style={styles.iconCon}>
                        {showIcon('rightarrow', colours.primaryBlack, windowWidth * (5 / 100))}
                      </View>
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
                      onPress={() => gotoSearch(item)}
                      style={styles.searchItem}
                    > 
                      <View style={styles.iconCon}>
                        {showIcon('clock', colours.primaryBlack, windowWidth * (5 / 100))}
                      </View>
                      <View>
                        <Text style={styles.fontStyle1} numberOfLines={2}>{item.ProductName.toUpperCase()}</Text>
                        <Text style={styles.fontStyle2}>in {item.CatName}</Text>
                      </View>
                      <View style={styles.iconCon}>
                        {showIcon('rightarrow', colours.primaryBlack, windowWidth * (5 / 100))}
                      </View>
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
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
    backgroundColor: colours.kapraWhite,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingHorizontal: windowWidth*(5/100)
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    alignItems:'center',
    justifyContent:'center',
  },
  inputContainer: {
    borderRadius: windowHeight * (6 / 100),
    backgroundColor: colours.kapraWhiteLow,
    width: windowWidth * (94 / 100),
    fontSize: getFontontSize(18),
    flexDirection: 'row',
    alignItems: 'center',
    height: windowHeight * (6 / 100)
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
  iconCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    alignItems:'center',
    justifyContent:'center',
  },
  imageStyle: {
    width: windowWidth * (15 / 100),
    height: windowWidth * (15 / 100),
    borderRadius: 5,
    marginLeft: windowWidth * (4.5 / 100),
    marginRight:10
  },
  viewAllButton: {
    backgroundColor: colours.kapraWhiteLow,
    paddingHorizontal: 4,
    height: windowWidth * (6 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },






  // Fonts 
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  inputText: {
    fontFamily: 'Lexend-Bold',
    fontSize: getFontontSize(13),
    paddingLeft: 15,
    width: windowWidth * (65 / 100),
    color: colours.kapraLight,
  },
  fontStyle1: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(12),
    width: windowWidth * (65 / 100),
    color: colours.kapraBlackLight,
  },
  fontStyle2: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(11),
    paddingTop:10,
    paddingLeft: 15,
    color: colours.kapraBlackLow,
  },
  ViewAllText: {
    color: colours.kapraRed,
    fontSize: getFontontSize(14),
    fontFamily: 'Lexend-Regular',
    paddingTop: -5
  },
});
