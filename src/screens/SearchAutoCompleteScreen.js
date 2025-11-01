import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
} from 'react-native';

import { getImage } from '../globals/functions';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import SearchCard from '../components/SearchCard';
import { getSearchList } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';

export default function SearchScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [data, setData] = React.useState({});
  const [keyword, setkeyword] = React.useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const _fetchHomeData = async () => {
    showLoader(true);
    let res = await getSearchList({
      currentpage: 1,
      pagesize: 100,
      minPrice: '0',
      maxPrice: '100000',
      custId: 18,
      guestId: null,
      sortorder: {
        field: 'prName',
        direction: 'asc',
      },
      searchstring: keyword,
      filter: {
        category: null,
      },
    });
    setData(res.List);
    showLoader(false);
  };

  React.useEffect(() => {
    _fetchHomeData();
  }, [keyword]);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} HeaderText={'Search'} sideNav />
      <View style={{ zIndex: 10 }}>
        <View style={styles.inputContainer}>
          <View style={styles.iconStyle}>
            {showIcon('search', colours.black, 16)}
          </View>
          <TextInput
            onChangeText={(text) => setkeyword(text)}
            style={styles.inputText}
            placeholder={'Search'}
          />
        </View>
        <View
          style={{
            height: 200,
            width: '95.5%',
            backgroundColor: '#f00',
            position: 'absolute',
            top: 50,
          }}></View>
      </View>
      {Object.keys(data).length > 0 && (
        <FlatList
          style={{ zIndex: 0 }}
          data={data}
          renderItem={({ item }, i) => (
            <SearchCard
              Name={item.prName}
              UnitPrice={item.unitPrice}
              SpecialPrice={item.specialPrice}
              IsCarted={item.IsCarted}
              Rating={item.IsReviewAvgrating}
              ImageUri={getImage(item.imageUrl)}
              IsWishlisted={item.IsWishlisted}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.whiteBackground,
    alignItems: 'center',
  },
  inputText: {
    color: colours.grey,
    paddingVertical: 2,
    width: '88%',
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 14,
  },
  inputContainer: {
    borderWidth: 0.2,
    borderColor: '#707070',
    width: '93%',
    height: 36,
    marginTop: '3%',
    fontWeight: 'bold',
    fontSize: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconStyle: {
    paddingLeft: '5%',
  },
});
