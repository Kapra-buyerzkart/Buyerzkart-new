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
  Dimensions
} from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import AuthButton from '../components/AuthButton';
import { addressList, DeleteAddress } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import showIcon from '../globals/icons';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import { useFocusEffect } from '@react-navigation/native';
import { getFontontSize } from '../globals/functions';
import { colors } from 'react-native-elements';
import AddressCard from '../components/AddressCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const AddressScreen = ({ navigation, route }) => {
  const { showLoader, loading } = React.useContext(LoaderContext);
  let fromCart = route?.params?.fromCart ? true : false;
  let fromDrawer = route?.params?.fromDrawer ? true : false;
  const [data, setData] = React.useState(null);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

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

  React.useEffect(() => {
    _fetchAddressData();
  }, []);

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

  if (data === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colours.primaryWhite }}>
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'My Addresses'}
          Cart
          WishList
        />
      </SafeAreaView>
    )
  } else {
    if (data.length === 0)
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.primaryWhite }}>
          <Header
            backEnable
            navigation={navigation}
            HeaderText={'My Addresses'}
            Cart
            WishList
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colours.primaryWhite,
              height: windowHeight * (70 / 100),
              //paddingBottom: windowHeight * (10 / 100),
              paddingTop: windowHeight * (20 / 100),
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle3}>My Address Empty</Text>
            {/* <Text style={styles.fontStyle4}>
            It is a Long Established fact that a Reader will be distracted by the
            readable content
          </Text> */}
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() => navigation.navigate('AddAddressMap')}
              ButtonText={'Add New'}
              ButtonWidth={90}
            />
          </View>
        </SafeAreaView>
      );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colours.primaryWhite, alignItems:'center' }}>
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'My Addresses'}
          Cart
          WishList
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={_fetchAddressData}
            />
          }>
          {data.map((item, i) => {
            return (
              <AddressCard
                Data={item}
                OnEdit={()=>navigation.navigate('AddAddressMap', { Data: item })}
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
              >
              </AddressCard>
            );
          })}
        </ScrollView>
        <View style={{ bottom: 0, alignItems: 'center', paddingTop: ' 5%' }}>
          <AuthButton
            BackgroundColor={colours.kapraMain}
            OnPress={() => navigation.navigate('AddAddressMap')}
            ButtonText={'Add New'}
            ButtonWidth={90}
          />
        </View>
      </SafeAreaView>
    );
  }
};

export default AddressScreen;

const styles = StyleSheet.create({
  addressCard: {
    margin: 15,
    padding: 10,
    paddingLeft: 20,
    marginBottom: 8,
    borderRadius: 5,
    justifyContent: 'space-around',
    backgroundColor: colours.primaryWhite
  },
  addressType: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    color: colours.kapraMain,
  },
  addressLabel: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(12),
    color: colours.primaryGreen,
  },
  name: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
    color: colours.kapraMain,
    paddingTop: '1%',
    paddingBottom: '1%',
  },
  address: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    color: colours.kapraMain,
  },
  phone: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.kapraMain,
  },
  makeDefault: {
    color: '#0B0BD8',
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    paddingVertical: 20
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Light',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
