import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  View,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native';

import Header from '../components/Header';
import WishlistCard from '../components/WishlistCard';
import { getImage } from '../globals/functions';
import { getWallet, getRefHistory, redeemWallet } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../Context/appContext';
import { getFontontSize } from '../globals/functions';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function WalletScreen({ navigation, route }) {
  let showSideNav = route?.params?.showSideNav ? true : false;
  const [data, setData] = React.useState(null);
  const [ switchValue, setSwitchValue ] = React.useState('WAL')
  const { showLoader, loading } = React.useContext(LoaderContext);

  const _fetchWishlistData = async () => {
    try {
      showLoader(true);
      let res = await getWallet();
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchWishlistData();
  }, []);

  const _redeemWallet = async() => {
    if(data.walletDetails&&!data.walletDetails[0].isRequest){
      if( data.walletDetails[0].amount>= data.walletDetails[0].walletMinRedeemAmount ) {
        try {
            showLoader(true);
            let res = await redeemWallet();
            // setData(res);
            // let res1 = await getRefHistory();
            // setRefData(res1)
            _fetchWishlistData();
            showLoader(false);
          } catch (err) {
            showLoader(false);
            // Toast.show(err);
          }
        }
        else {
          Toast.show(`Minimum redeem amount : ${data.walletDetails[0].walletMinRedeemAmount}`)
        }
    }
    else {
      Toast.show(`Already request submitted for redeem`)
    }
  }

//   useFocusEffect(
//     React.useCallback(() => {
//       _fetchWishlistData();
//     }, []),
//   );
  if(data === null || data.length<=0) return(
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'My Wallet'}
        backEnable
        Cart
        Search
      />
      <View style={{height: windowHeight*(90/100), justifyContent:'center'}}>
          <View style={{height: windowHeight*(30/100)}}>{showIcon('bin', colours.primaryRed, windowWidth*(28/100))}</View>
          <Text style={styles.fontStyle1}>No wallet transactions found</Text>
      </View>

    </SafeAreaView>
  );
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'My Wallet'}
        backEnable
        Cart
        Search
      />
      <ScrollView contentContainerStyle={{width: windowWidth, alignItems:'center'}}>
        
        {
          switchValue === 'WAL'?
          <View style={styles.walletAmountCard}>
            <Text style={styles.fontStyle1}>Wallet Balance {<Text style={[styles.fontStyle3,{color:data.walletDetails&&data.walletDetails[0].status? colours.primaryGreen : colours.primaryGrey }]}>{data.walletDetails&&data.walletDetails[0].status?'(ACTIVE)':'(IN-ACTIVE)'}</Text>}</Text>
            <Text/>
            <Text style={styles.fontStyle2}>₹ {data.walletDetails[0].amount}</Text>
          </View>
          :
          <View style={styles.walletAmountCard}>
            <Text style={styles.fontStyle1}>Achieved Balance </Text>
            <Text/>
            <Text style={styles.fontStyle2}>₹ {data.draftWalletDetails&&data.draftWalletDetails.length!=0?data.draftWalletDetails[0].amount:0}</Text>
          </View>

        }
      <View style={{ flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-evenly', marginTop:10, paddingTop:5, backgroundColor: colours.kapraLow, borderRadius:10}}>
            <AuthButton
              SecondColor={switchValue === 'WAL'?colours.primaryOrange : colours.kapraMain}
              FirstColor={switchValue === 'WAL'?colours.primaryOrange : colours.kapraMain}
              OnPress={() => setSwitchValue('WAL')}
              ButtonText={'Wallet History'}
              ButtonWidth={42}
            />
            <AuthButton
              SecondColor={switchValue === 'REF'?colours.primaryOrange : colours.kapraMain}
              FirstColor={switchValue === 'REF'?colours.primaryOrange : colours.kapraMain}
              OnPress={() => setSwitchValue('REF')}
              ButtonText={'Achieved History'}
              ButtonWidth={42}
            />
      </View>
      {
        switchValue === 'WAL'?
        <>
        {
        data && data.walletHistory&& data.walletHistory.length>0?(
          <>
          <View style={styles.walletStatusCon}>
            {
              data.walletDetails[0].amount>= data.walletDetails[0].walletMinRedeemAmount?
              <TouchableOpacity 
                style={[styles.walletStatusBtn,{backgroundColor: data.walletDetails&&data.walletDetails[0].isRequest?colours.primaryOrange:colours.primaryGreen}]}
                onPress={() =>_redeemWallet() }
              >
                <Text style={styles.fontStyle3}>{data.walletDetails&&data.walletDetails[0].isRequest?'Redeem Requested':'Redeem Request'}</Text>
              </TouchableOpacity>
              :
              null
            }
            {/* <TouchableOpacity 
              style={[styles.walletStatusBtn,{backgroundColor: data.walletDetails&&data.walletDetails[0].isRequest?colours.primaryOrange:colours.primaryGreen}]}
              onPress={() =>_redeemWallet() }
            >
              <Text style={styles.fontStyle3}>{data.walletDetails&&data.walletDetails[0].isRequest?'Redeem Requested':'Redeem Request'}</Text>
            </TouchableOpacity> */}
          </View>
            <FlatList
              contentContainerStyle={{width: windowWidth*(90/100),borderWidth:1, borderRadius:15, borderColor: colours.kapraLow, padding:5, marginBottom: windowHeight*(20/100)}}
              data={data.walletHistory}
              renderItem={({ item, i }) => (
                <View style={{
                  flexDirection:'row',
                  height: windowHeight*(7/100),
                  alignItems:'center',
                  justifyContent:'space-between',
                }}>
                  <View>{showIcon(item.transactionType == 'Credit'?'credit':'debit', item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed, windowWidth*(8/100))}</View>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]} numberOfLines={3}>  {item.description}</Text>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{item.orderedBy?item.orderedBy:'-----'}</Text>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{moment(item.transactionDate).format('DD-MM-YYYY')}</Text>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>₹ {item.amount}</Text>
                </View>
              )}
              keyExtractor={(item, i) => i.toString()}
            />
          </>
        )
        :
        <View style={{width: windowWidth, height: windowHeight*(40/100), alignItems:'center', justifyContent:'center'}}>
          <View style={{height: windowHeight*(10/100)}}>{showIcon('bin', colours.primaryRed, windowWidth*(15/100))}</View>
          <Text>Nothing to show!</Text>
        </View>
        }
        </>
        :
        data && data.draftWalletHistory&& data.draftWalletHistory.length>0 ?(
          <>
            <Text />
            <FlatList
              contentContainerStyle={{width: windowWidth*(90/100),borderWidth:1, borderRadius:15, borderColor: colours.kapraLow, padding:5, marginBottom: windowHeight*(20/100)}}
              data={data.draftWalletHistory}
              renderItem={({ item, i }) => (
                <View style={{
                  flexDirection:'row',
                  height: windowHeight*(7/100),
                  alignItems:'center',
                  justifyContent:'space-between',
                }}>
                  <View>{showIcon(item.transactionType == 'Credit'?'credit':'debit', item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed, windowWidth*(8/100))}</View>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>  {item.description}</Text>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{item.orderedBy?item.orderedBy:'-----'}</Text>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{moment(item.transactionDate).format('DD-MM-YYYY')}</Text>
                  <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>₹ {item.amount}</Text>
                </View>
              )}
              keyExtractor={(item, i) => i.toString()}
            />
          </>
        )
        :
        <View style={{width: windowWidth, height: windowHeight*(40/100), alignItems:'center', justifyContent:'center'}}>
          <View style={{height: windowHeight*(10/100)}}>{showIcon('bin', colours.primaryRed, windowWidth*(15/100))}</View>
          <Text>Nothing to show!</Text>
        </View>
      }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.primaryWhite,
    flex: 1,
    alignItems: 'center',
  },
  walletAmountCard: {
    borderWidth:3,
    borderColor: colours.primaryGrey,
    borderRadius:20,
    borderStyle:'dashed', 
    marginTop: windowHeight*(4/100),
    width: windowWidth*(80/100),
    alignItems:'center',
    paddingVertical: windowHeight*(2/100)
  },
  headerTextView: {
    width: windowWidth*(90/100),
    height: windowHeight*(8/100),
    justifyContent:'center'
  },
  walletStatusCon: {
    width: windowWidth*(90/100),
    height: windowHeight*(7/100),
    alignItems:'center',
    justifyContent: 'space-between',
    flexDirection:'row',
  },
  walletStatusBtn: {
    // width: windowWidth*(40/100),
    paddingHorizontal: windowWidth*(3/100),
    height: windowHeight*(5/100),
    alignItems:'center',
    justifyContent: 'center',
    borderRadius: windowHeight*(5/100),
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(30),
    color: colours.primaryRed,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
    color: colours.primaryWhite,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    width: windowWidth*(20/100),
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
