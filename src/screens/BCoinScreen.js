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
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';

import Header from '../components/Header';
import { getWallet, getRefHistory, redeemWallet, getBCoin, getBToken, redeemBCoin, getValueHistory, getCoinRedeemModes } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import Toast from 'react-native-simple-toast';
import { getFontontSize } from '../globals/functions';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function BCoinScreen({ navigation, route }) {
  let showSideNav = route?.params?.showSideNav ? true : false;
  const { showLoader, loading } = React.useContext(LoaderContext);
  const {profile} = React.useContext(AppContext)

  const [data, setData] = React.useState(null);
  const [bCoin, setBCoin ] = React.useState(null);
  const [bToken, setBToken ] = React.useState(null);
  const [redeemModes, setRedeemModes] = React.useState(null);
  const [coinValueHistory, setCoinValueHistory] = React.useState(null);
  const [selectedMode, setSelectedMode] = React.useState('');
  const [ switchValue, setSwitchValue ] = React.useState('WAL');
  const [redeemModal, setRedeemModal] = React.useState(false);
  const [coinHistoryModal, setCoinHistoryModal] = React.useState(false);


  const _fetchCoinData = async () => {
    try {
      showLoader(true);
      let res = await getBCoin()
      setBCoin(res.btokenDetails)
      let res1 = await getBToken()
      setBToken(res1.btokenDetails)
      let res2 = await getValueHistory();
      setCoinValueHistory(res2.btokenDetails)
      let res3 = await getCoinRedeemModes();
      setRedeemModes(res3.btokenDetails)
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchCoinData();
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
            _fetchCoinData();
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

  const _funRedeemBCoin = async() => {
    try{
      showLoader(true);
      let res = await redeemBCoin({
        custId: profile.bkCustId,
        bCoinsAmount: 0,
        mode: selectedMode
      });
      Toast.show('Redeem request submitted.')
      setRedeemModal(false)
      setSelectedMode('')
      _fetchCoinData()
      showLoader(false);

    } catch(err){
      showLoader(false);
      Toast.show('Something went wrong')
      setRedeemModal(false)
      setSelectedMode('')
    }
  }
  // if(bCoin === null || bCoin.length<=0) return(
  //   <SafeAreaView style={styles.mainContainer}>
  //     <Header
  //       navigation={navigation}
  //       HeaderText={'B Wallet'}
  //       backEnable
  //       Cart
  //       Search
  //     />
  //     <View style={{height: windowHeight*(90/100), justifyContent:'center'}}>
  //         <View style={{height: windowHeight*(30/100)}}>{showIcon('bin', colours.primaryRed, windowWidth*(28/100))}</View>
  //         <Text style={styles.fontStyle1}>No wallet transactions found</Text>
  //     </View>

  //   </SafeAreaView>
  // );
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'B Wallet'}
        backEnable
        Cart
        Search
      />
      <>
        <View style={styles.walletAmountCard}>
            <Image
              source={require('../assets/images/Bcoin.png')}
              style={{
                height: windowWidth * (20 / 100),
                width: windowWidth * (20 / 100),
                resizeMode: 'contain',
              }}
            />
            <View style={{
              alignItems:'flex-end'
            }}>
              <Text style={styles.fontStyle1}>B-Coin Balance </Text>
              <Text/>
              <Text style={styles.fontStyle2}>{(bCoin&&bCoin[0]?.BCoinBalance)?bCoin[0]?.BCoinBalance:'0'}</Text>
              {
                (bCoin&&bCoin[0]?.bCoinValue)&&(
                  <Text style={styles.fontStyle5}>( Today's B-Coin Value :<Text style={[styles.fontStyle1,{fontSize: getFontontSize(11)}]}> ₹{(bCoin&&bCoin[0]?.bCoinValue)?bCoin[0]?.bCoinValue:'0'} </Text>)</Text>
                )
              }
              <Text/>
              <TouchableOpacity onPress={()=>setCoinHistoryModal(true)} style={{
                width: windowWidth*(5/100),
                height: windowWidth*(5/100),
              }}>
                {showIcon('rightarrow', colours.primaryBlack, windowWidth * (7 / 100))}
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.walletAmountCard}>
            <Image
              source={require('../assets/images/Btoken.png')}
              style={{
                height: windowWidth * (20 / 100),
                width: windowWidth * (20 / 100),
                resizeMode: 'contain',
              }}
            />
            <View style={{
              alignItems:'flex-end'
            }}>
              <Text style={styles.fontStyle1}>B-Token Balance </Text>
              <Text/>
              <Text style={styles.fontStyle2}>{(bToken&&bToken[0]?.BTokenBalance)?bToken[0]?.BTokenBalance:'0'}</Text>
            </View>
        </View>
      </>
      <View style={{ flexDirection:'row', width: windowWidth*(90/100), justifyContent:'space-evenly', marginTop:10, paddingTop:5, backgroundColor: colours.kapraLow, borderRadius:10}}>
        <AuthButton
          SecondColor={switchValue === 'WAL'?colours.primaryOrange : colours.kapraMain}
          FirstColor={switchValue === 'WAL'?colours.primaryOrange : colours.kapraMain}
          OnPress={() => setSwitchValue('WAL')}
          ButtonText={'BCoin History'}
          ButtonWidth={42}
        />
        <AuthButton
          SecondColor={switchValue === 'REF'?colours.primaryOrange : colours.kapraMain}
          FirstColor={switchValue === 'REF'?colours.primaryOrange : colours.kapraMain}
          OnPress={() => setSwitchValue('REF')}
          ButtonText={'BToken History'}
          ButtonWidth={42}
        />
      </View>
      <ScrollView contentContainerStyle={{width: windowWidth, alignItems:'center'}}>
        
      {
        switchValue === 'WAL'?
        <>
          <FlatList
            contentContainerStyle={{width: windowWidth*(90/100),borderWidth:1, borderRadius:15, borderColor: colours.kapraLow, padding:5, marginBottom: windowHeight*(20/100)}}
            data={bCoin}
            renderItem={({ item, i }) => (
              <View style={{
                flexDirection:'row',
                height: windowHeight*(7/100),
                alignItems:'center',
                justifyContent:'space-between',
              }}>
              {
                item.transactionType == 'Credit'?
                <Image
                  source={require('../assets/images/CreditIcon.png')}
                  style={{
                    height: windowWidth * (7 / 100),
                    width: windowWidth * (7 / 100),
                    resizeMode: 'contain',
                  }}
                />
                :
                <Image
                  source={require('../assets/images/DebitIcon.png')}
                  style={{
                    height: windowWidth * (7 / 100),
                    width: windowWidth * (7 / 100),
                    resizeMode: 'contain',
                  }}
                />
              }
                {/* <View>{showIcon(item.transactionType == 'Credit'?'credit':'debit', item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed, windowWidth*(8/100))}</View> */}
                <Text style={[styles.fontStyle4,{width: windowWidth*(30/100),color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]} numberOfLines={3}>  {item.description}</Text>
                {/* <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{item.orderedBy?item.orderedBy:'-----'}</Text> */}
                <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{moment(item.transactionDate).format('DD-MM-YYYY')}</Text>
                <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>₹ {item.amount}</Text>
              </View>
            )}
            keyExtractor={(item, i) => i.toString()}
          />
        </>
        :
        <>
        <FlatList
          contentContainerStyle={{width: windowWidth*(90/100),borderWidth:1, borderRadius:15, borderColor: colours.kapraLow, padding:5, marginBottom: windowHeight*(20/100)}}
          data={bToken}
          renderItem={({ item, i }) => (
            <View style={{
              flexDirection:'row',
              height: windowHeight*(7/100),
              alignItems:'center',
              justifyContent:'space-between',
            }}>
            {
              item.transactionType == 'Credit'?
              <Image
                source={require('../assets/images/CreditIcon.png')}
                style={{
                  height: windowWidth * (7 / 100),
                  width: windowWidth * (7 / 100),
                  resizeMode: 'contain',
                }}
              />
              :
              <Image
                source={require('../assets/images/DebitIcon.png')}
                style={{
                  height: windowWidth * (7 / 100),
                  width: windowWidth * (7 / 100),
                  resizeMode: 'contain',
                }}
              />
            }
              {/* <View>{showIcon(item.transactionType == 'Credit'?'credit':'debit', item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed, windowWidth*(8/100))}</View> */}
              <Text style={[styles.fontStyle4,{width: windowWidth*(30/100),color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]} numberOfLines={3}>  {item.description}</Text>
              {/* <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{item.orderedBy?item.orderedBy:'-----'}</Text> */}
              <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{moment(item.transactionDate).format('DD-MM-YYYY')}</Text>
              <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>₹ {item.amount}</Text>
            </View>
          )}
          keyExtractor={(item, i) => i.toString()}
        />
        </>
      }
      </ScrollView>
        <AuthButton
          SecondColor={(bCoin&&(bCoin[0]?.BCoinBalance > bCoin[0]?.bcoinMinRedeemAmount) && !bCoin[0]?.isRequested)?colours.kapraMain : colours.primaryGrey}
          FirstColor={(bCoin&&(bCoin[0]?.BCoinBalance > bCoin[0]?.bcoinMinRedeemAmount) && !bCoin[0]?.isRequested)?colours.kapraMain : colours.primaryGrey}
          OnPress={() => (bCoin&&(bCoin[0]?.BCoinBalance > bCoin[0]?.bcoinMinRedeemAmount) && !bCoin[0]?.isRequested)? setRedeemModal(true) : bCoin[0]?.isRequested?Toast.show('Already requested') : Toast.show("You need more B-Coins to redeem.")}
          ButtonText={'Redeem BCoin'}
          ButtonWidth={90}
        />
      <Text/>

      <Modal
        animationType="slide"
        visible={redeemModal}
        transparent={true}
      >
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)'}}>
          <View style={styles.updateModalView1}>
            <View style={styles.modalHeader}>
              <Text style={[styles.fontStyle1,{color: colours.primaryWhite}]} >
                Select a redeem mode
              </Text>
              <TouchableOpacity onPress={() => setRedeemModal(false) }>
                <Text>
                  {showIcon('close', colours.primaryWhite, windowWidth * (7 / 100))}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <FlatList
                data={redeemModes}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={()=>setSelectedMode(item.mode)} style={[styles.coinHistoryCon,{backgroundColor: index%2 == 0?colours.lightPink:colours.kapraLow,}]}>
                    <Text style={styles.fontStyle1}>{item.mode}</Text>
                    {
                      selectedMode == item.mode &&(
                          <Text>
                            {showIcon('rightTick', colours.kapraMain, windowWidth * (7 / 100))}
                          </Text>
                      )
                    }
                  </TouchableOpacity>
                )}
                keyExtractor={(item, i) => i.toString()}
              />

            </ScrollView>
            <AuthButton
              SecondColor={colours.kapraMain}
              FirstColor={colours.kapraMain }
              OnPress={() => selectedMode == ''? Toast.show("Please select a redeem mode") : _funRedeemBCoin()}
              ButtonText={'Redeem Now'}
              ButtonWidth={90}
            />
          </View> 
        </View>
      </Modal>

      <Modal
        animationType="slide"
        visible={coinHistoryModal}
        transparent={true}
      >
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)'}}>
          <View style={styles.updateModalView1}>
            <View style={styles.modalHeader}>
              <Text style={[styles.fontStyle1,{color: colours.primaryWhite}]} >
                B-Coin Rate History
              </Text>
              <TouchableOpacity onPress={() => setCoinHistoryModal(false) }>
                <Text>
                  {showIcon('close', colours.primaryWhite, windowWidth * (7 / 100))}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <FlatList
                data={coinValueHistory}
                renderItem={({ item, index }) => (
                  <View style={[styles.coinHistoryCon,{backgroundColor: index%2 == 0?colours.lightPink:colours.kapraLow,}]}>
                    <Text style={styles.fontStyle1}>{moment(item.updatedOn).format('DD-MM-YYYY,  hh:mm a')}</Text>
                    <Text style={styles.fontStyle1}>₹ {item.bCoinValue}</Text>
                  </View>
                )}
                keyExtractor={(item, i) => i.toString()}
              />

            </ScrollView>
          </View> 
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.primaryWhite,
    flex: 1,
    alignItems: 'center',
  },
  updateModalView1: {
    height: windowHeight * (55 / 100),
    marginTop: windowHeight * (45 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent:'space-between'
  },
  modalHeader: {
    width: windowWidth, 
    height: windowHeight*(7/100), 
    backgroundColor: colours.kapraMain, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius:20,
    paddingHorizontal: windowWidth*(3/100), 
    alignItems:'center', 
    flexDirection:'row', 
    justifyContent:'space-between'  
  },
  coinHistoryCon: {
    flexDirection: 'row',
    width:windowWidth*(90/100),
    justifyContent:'space-between',
    paddingHorizontal:windowWidth*(5/100),
    paddingVertical: windowWidth*(3/100),
    borderRadius:5,
    marginTop:5,
    
  },
  walletAmountCard: {
    borderWidth:2,
    borderRadius:20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderStyle:'dashed', 
    width: windowWidth*(80/100),
    marginTop: windowHeight*(1/100),
    paddingVertical: windowHeight*(1/100),
    paddingHorizontal: windowWidth*(5/100),
    borderColor: colours.primaryGrey,
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
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(15),
    color: colours.primaryBlack,
  },
  fontStyle2: {
    fontFamily: 'Montserrat-Black',
    fontSize: getFontontSize(25),
    color: colours.goldenYellow,
  },
  fontStyle3: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryWhite,
  },
  fontStyle4: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    width: windowWidth*(20/100),
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  fontStyle5: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(11),
    color: colours.primaryGrey,
  },
});
