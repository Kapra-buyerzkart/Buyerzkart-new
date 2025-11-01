import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Header from '../components/Header';
import colours from '../globals/colours';
import {
  changePincode
} from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import PincodeChange from '../components/PincodeChange';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;

export default function SearchScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const { showLoader } = React.useContext(LoaderContext);
  const [pincodes, setPincodes] = React.useState({});

  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let pincodeResponse = await changePincode('');
      setPincodes(pincodeResponse);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };
  React.useEffect(() => {
    _fetchHomeData();
  }, []);

  if (Object.keys(pincodes).length === 0) return null
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={"Change Area"}
        backEnable
        WishList
        Cart
      />
      <View>
        <PincodeChange fun={() => _fetchHomeData()} />
      </View>
      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 20 }}>
        <Text style={styles.fontStyle1}>{"Service Available areas :"}</Text>
        <ScrollView refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
        }>
          {pincodes.map((item, i) => (
            <>
              <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, marginTop: 10, width: windowWidth * (90 / 100), height: windowWidth * (10 / 100), }}>
                <Text style={styles.fontStyle2}>{item.pincodeId}. </Text>
                <Text style={styles.fontStyle2}>{item.area}</Text>
              </View>
            </>
          ))}
        </ScrollView>

      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.whiteBackground,
    // alignItems: 'center',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 18,
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 13,
    marginLeft: '5%',
    marginRight: '5%',
    color: colours.grey,
  },
});
