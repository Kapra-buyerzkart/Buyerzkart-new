import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';

import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import { addressList, DeleteAddress } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import showIcon from '../../globals/icons';
import { AppContext } from '../../Context/appContext';
import { getFontontSize } from '../globals/GroFunctions';
import AddressCard from '../components/AddressCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroAddressScreen = ({ navigation, route }) => {
  const { showLoader, loading } = React.useContext(LoaderContext);
  let fromCart = route?.params?.fromCart ? true : false;
  let fromDrawer = route?.params?.fromDrawer ? true : false;
  const [data, setData] = React.useState(null);

  const _fetchAddressData = async () => {
    setData(null)
    try {
      showLoader(true);
      let res = await addressList();
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      _fetchAddressData();
    }, []),
  );

  const deleteAddress = async (value) => {
    try {
      showLoader(true);
      let res1 = await DeleteAddress(value);
      Toast.show('Address removed successfully')
      _fetchAddressData();
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  }

  if (data == null) {
    return (
      <SafeAreaView style={styles.mainContainer}>
  
        {/* Header Con  */}
        <View style={styles.headerCon}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
          <Text style={styles.headerText}>My Addresses</Text>
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={styles.mainContainer}>
  
        {/* Header Con  */}
        <View style={styles.headerCon}>
          <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
            {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
          </TouchableOpacity>
          <Text style={styles.headerText}>My Addresses</Text>
        </View>

        {/* Add new con  */}
        <TouchableOpacity style={styles.addNewCon} onPress={() => navigation.navigate('GroAddAddressMapScreen')}>
          <Text style={[styles.headerText,{color: colours.primaryGreen}]}>+Add new address</Text>
          <View style={[styles.smallIconCon,{backgroundColor: colours.kapraWhite}]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth*(5/100))}
          </View>
        </TouchableOpacity>

        {/* Address List  */}
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={_fetchAddressData} />
          }
          data={data}
          ListHeaderComponent={<View style={styles.headerCon}>
            <Text style={styles.fontStyle4}>Your saved address</Text>
          </View>}
          renderItem={({ item }, i) => (
            <AddressCard
              Data={item}
              OnEdit={()=>navigation.navigate('GroAddAddressMapScreen', { Data: item })}
              OnDelete={async () => {
                Alert.alert(
                  'My Addresses',
                  "Do you want to delete address?",
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      style: 'destructive',
                      onPress: async () => {
                        deleteAddress(item.custAdressId);
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }}
            />
          )}
          keyExtractor={(item) => item.custAdressId.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={styles.emptyCon}>
              <Image 
                source={require('../../assets/images/Address1.png')}
                style={styles.emptyImg}
              />
              <Text style={styles.fontStyle3}>Address Empty</Text>
              <Text style={styles.fontStyle4}>You not yet saved any address...Please add.</Text>
            </View>
          }
        />

      </SafeAreaView>
    );
  }
};

export default GroAddressScreen;

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
  smallIconCon: {
    width: windowWidth*(7/100),
    height: windowWidth*(7/100),
    borderRadius: windowWidth*(7/100),
    alignItems:'center',
    justifyContent:'center',
  },
  addNewCon: {
    width: windowWidth*(85/100),
    height: windowHeight*(8/100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderBottomWidth:2,
    borderBottomColor: colours.kapraWhiteLow
  },


  emptyCon: {
    height: windowHeight*(80/100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImg: {
    width: windowWidth*(70/100),
    height: windowWidth*(70/100),
  },




  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle3: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(16),
    color: colours.kapraBlack,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraBlackLight,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
