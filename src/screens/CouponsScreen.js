import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import { LoaderContext } from '../Context/loaderContext';
import { getCoupons } from '../api';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import { AppContext } from '../Context/appContext';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const CouponsScreen = ({ navigation }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [data, setData] = React.useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let res = await getCoupons();
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  // React.useEffect(() => {
  //   _fetchHomeData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      _fetchHomeData();
    }, []),
  );


  if (data === null) {
    return null;
  } else {
    if (data.length === 0)
      return (
        <SafeAreaView style={styles.mainContainer}>
          <Header
            navigation={navigation}
            HeaderText={'Coupons'}
            Cart
            WishList
            backEnable
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colours.primaryWhite,
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle3}>{'Coupons Empty'}</Text>
            {/* <Text style={styles.fontStyle4}>
            It is a Long Established fact that a Reader will be distracted by the
            readable content
          </Text> */}
            {/* <AuthButton
            BackgroundColor={colours.primaryColor}
            OnPress={() => navigation.navigate('Home')}
            ButtonText={'Browse More'}
            ButtonWidth={90}
          /> */}
          </View>
        </SafeAreaView>
      );
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'Coupons'}
          WishList
          Cart
        />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={_fetchHomeData} />
          }
          data={data}
          renderItem={({ item }, i) => (
            <Card
              MinOAmount={item.cpMinOrderAmount}
              Mode={item.cpMode}
              CpAmount={item.cpAmount}
              Date={item.cpDate}
              Code={item.cpCode}
            />
          )}
          keyExtractor={(item) => item.cpId.toString()}
          contentContainerStyle={{
            alignItems: 'center',
            marginTop: '5%',
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
};

export default CouponsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 14,
    color: colours.primaryBlack,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 12,
    color: colours.primaryBlack,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  cardContainer: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (30 / 100),
    backgroundColor: colours.kapraLow,
    borderRadius:5,
    shadowColor: 'rgba(242, 242, 242, .1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 2,
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    width: windowWidth * (30 / 100),
    height: windowWidth * (20 / 100),
    alignItems: 'center',
    borderRightColor: colours.primaryGrey,
    borderRightWidth: 1,
  },
  rightContainer: {
    width: windowWidth * (53 / 100),
    height: windowWidth * (15 / 100),
    justifyContent: 'space-between',
  },
  cardFont1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 28,
    color: colours.kapraMain,
  },
  cardFont2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 28,
    color: colours.primaryRed,
    marginTop: -13,
  },
  cardFont3: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: 14,
    color: colours.primaryBlack,
  },
  cardFont4: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: 16,
    color: colours.primaryBlack,
  },
  cardFont5: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 16,
    color: colours.kapraMain,
  },
  cardFont6: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: 13,
    color: '#887D80',
  },
  copyContainer: {
    flexDirection: 'row',
    width: windowWidth * (50 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4%',
  },
});

const Card = ({ Mode, MinOAmount, Code, Date, CpAmount }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <View style={styles.cardContainer}>
      {Mode === 'FIXED' ? (
        <View style={styles.leftContainer}>
          <Text style={styles.cardFont1}>₹ {CpAmount}</Text>
          <Text/>
          <Text style={styles.cardFont2}>{'OFF'}</Text>
        </View>
      ) : (
        <View style={styles.leftContainer}>
          <Text style={styles.cardFont1}>{CpAmount}%</Text>
          <Text/>
          <Text style={styles.cardFont2}>{'OFF'}</Text>
        </View>
      )}
      <View style={styles.rightContainer}>
        <Text style={styles.cardFont3}>{"On Min. Purchase of "}
        ₹ {MinOAmount}
        </Text>
        <Text style={styles.cardFont4}>
          {"CODE :"}<Text style={styles.cardFont5}> {Code}</Text>
        </Text>
        <View style={styles.copyContainer}>
          <Text style={styles.cardFont6}>
            {"Expiry :"} {moment(Date).format('DD-MM-YYYY')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(Code), Toast.show('Code Copied.');
            }}>
            <Text>{showIcon('copy', colours.primaryBlack, 18)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
