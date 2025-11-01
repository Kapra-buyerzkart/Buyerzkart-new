import React from 'react';
import { FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView, View } from 'react-native';
import Toast from 'react-native-simple-toast';

import Header from '../components/Header';
import { getCategoryArchive } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import GroProductCard from '../components/GroProductCard';
import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroCategoryArchiveScreen({ navigation, route }) {
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { type } = route.params;


  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let res = await getCategoryArchive(type.split(" ").join(""));
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  if (data == null) return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>{type}</Text>
      </View>
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>{type}</Text>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
        }
        data={data}
        contentContainerStyle={{width:windowWidth*(90/100), marginTop:10}}
        columnWrapperStyle={{justifyContent: "space-between"}}
        numColumns={2}
        renderItem={({ item }, i) => (
          <GroProductCard
            Name={item.prName}
            Image={item.imageUrl}
            Price={item.unitPrice}
            SpecialPrice={item.specialPrice}
            BTValue={item.bvValue}
            ProductWeight={item.prWeight}
            Variations={item.variationJson?item.variationJson:null}
            GotoCart={()=>navigation.navigate("GroCartScreen")}
            URLKey={item.urlKey}
            StockAvailability={item.stockAvailability}
            ProductID={item.productId}
            OnPress={() => {
              if (item.urlKey !== null) {
                navigation.navigate('GroSingleItemScreen', {
                  UrlKey: item.urlKey,
                  ItemData: item
                });
              } else {
                Toast.show("Url Key Is Null");
              }
            }}
          />
        )}
        keyExtractor={(item, i) => i.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.kapraWhite,
    flex: 1,
    alignItems: 'center',
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },



  // Font style
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
})