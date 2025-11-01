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
  Modal,
  ScrollView
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

import { redeemWallet, getBCoin, getBToken, redeemBCoin, getValueHistory, getCoinRedeemModes  } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import AuthButton from '../components/AuthButton';
import { getFontontSize } from '../globals/GroFunctions';
import { AppContext } from '../../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroBCoinScreen({ navigation, route }) {
  
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { profile } = React.useContext(AppContext)

  const [ data, setData ] = React.useState(null);
  const [ bCoin, setBCoin ] = React.useState(null);
  const [ bToken, setBToken ] = React.useState(null);
  const [ switchValue, setSwitchValue ] = React.useState('WAL')
  const [ redeemModes, setRedeemModes ] = React.useState(null);
  const [ coinValueHistory, setCoinValueHistory ] = React.useState(null);
  const [ selectedMode, setSelectedMode ] = React.useState('');
  const [ redeemModal, setRedeemModal ] = React.useState(false);
  const [ coinHistoryModal, setCoinHistoryModal ] = React.useState(false);

  const _fetchCoinData = async () => {
    setBCoin(null),
    setBToken(null)
    try {
      showLoader(true);
      // let res = await getWallet();
      // setData(res);
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
        custId: profile.groceryCustId,
        bCoinsAmount: 0 ,
        mode: selectedMode
      });
      Toast.show('Redeem request submitted.')
      setRedeemModal(false)
      setSelectedMode('')
      _fetchCoinData()
      showLoader(false);

    } catch(err){
      showLoader(false);
      setRedeemModal(false)
      setSelectedMode('')
    }
  }
  
  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Address</Text>
      </View>

      {/* Coin Container  */}
      <>
        <View style={styles.walletAmountCard}>
            <Image
              source={require('../../assets/images/Bcoin.png')}
              style={styles.walletAmountImg}
            />
            <View style={{alignItems:'flex-end'}}>
              <Text style={styles.fontStyle1}>B-Coin Balance </Text>
              <Text/>
              <Text style={styles.fontStyle2}>{(bCoin&&bCoin[0]?.BCoinBalance)?bCoin[0]?.BCoinBalance:'0'}</Text>
              {
                (bCoin&&bCoin[0]?.bCoinValue)&&(
                  <Text style={styles.fontStyle5}>( Today's B-Coin Value :<Text style={[styles.fontStyle1,{fontSize: getFontontSize(11)}]}> ₹{(bCoin&&bCoin[0]?.bCoinValue)?bCoin[0]?.bCoinValue:'0'} </Text>)</Text>
                )
              }
              <Text/>
              <TouchableOpacity onPress={()=>setCoinHistoryModal(true)} style={styles.iconCon}>
                {showIcon('rightarrow', colours.primaryBlack, windowWidth * (7 / 100))}
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.walletAmountCard}>
            <Image
              source={require('../../assets/images/Btoken.png')}
              style={styles.walletAmountImg}
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

      {/* Switch Buttons  */}
      <View style={styles.switchCon}>
        <AuthButton
          FirstColor={switchValue === 'WAL'?colours.kapraOrange : colours.kapraBlackLight}
          SecondColor={switchValue === 'WAL'?colours.kapraOrangeDark : colours.kapraMain}
          OnPress={() => setSwitchValue('WAL')}
          ButtonText={'BCoin History'}
          ButtonWidth={44}
          ButtonHeight={4}
          FSize={12}
        />
        <AuthButton
          FirstColor={switchValue === 'REF'?colours.kapraOrange : colours.kapraBlackLight}
          SecondColor={switchValue === 'REF'?colours.kapraOrangeDark : colours.kapraMain}
          OnPress={() => setSwitchValue('REF')}
          ButtonText={'BToken History'}
          ButtonWidth={44}
          ButtonHeight={4}
          FSize={12}
        />
      </View>

      <ScrollView contentContainerStyle={{width: windowWidth, alignItems:'center'}}>
      {
        switchValue === 'WAL'?

        // Flatlist 1 
        <>
          <FlatList
            contentContainerStyle={styles.flatlistCon}
            data={bCoin}
            renderItem={({ item, i }) => (
              <View style={styles.flatlistRowCon}>
                {
                  item.transactionType == 'Credit'?
                  <Image
                    source={require('../../assets/images/CreditIcon.png')}
                    style={styles.flatlistRowImgCon}
                  />
                  :
                  <Image
                    source={require('../../assets/images/DebitIcon.png')}
                    style={styles.flatlistRowImgCon}
                  />
                }
                <Text style={[styles.fontStyle4,{width: windowWidth*(30/100),color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]} numberOfLines={3}>  {item.description}</Text>
                <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{moment(item.transactionDate).format('DD-MM-YYYY')}</Text>
                <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>₹ {item.amount}</Text>
              </View>
            )}
            keyExtractor={(item, i) => i.toString()}
          />
        </>
        :

        // Flatlist 2
        <>
        <FlatList
          contentContainerStyle={styles.flatlistCon}
          data={bToken}
          renderItem={({ item, i }) => (
            <View style={styles.flatlistRowCon}>
              {
                item.transactionType == 'Credit'?
                <Image
                  source={require('../../assets/images/CreditIcon.png')}
                  style={styles.flatlistRowImgCon}
                />
                :
                <Image
                  source={require('../../assets/images/DebitIcon.png')}
                  style={styles.flatlistRowImgCon}
                />
              }

              <Text style={[styles.fontStyle4,{width: windowWidth*(30/100),color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]} numberOfLines={3}>  {item.description}</Text>
              <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>{moment(item.transactionDate).format('DD-MM-YYYY')}</Text>
              <Text style={[styles.fontStyle4,{color: item.transactionType == 'Credit'? colours.primaryGreen: colours.primaryRed}]}>₹ {item.amount}</Text>
            </View>
          )}
          keyExtractor={(item, i) => i.toString()}
        />
        </>
      }
      </ScrollView>

      {/* Bottom Button  */}
      {
        bCoin&&(
          <AuthButton
            SecondColor={(bCoin&&(bCoin[0]?.BCoinBalance > bCoin[0]?.bcoinMinRedeemAmount) && !bCoin[0]?.isRequested)?colours.primaryGreen : colours.primaryGrey}
            FirstColor={(bCoin&&(bCoin[0]?.BCoinBalance > bCoin[0]?.bcoinMinRedeemAmount) && !bCoin[0]?.isRequested)?colours.primaryGreen : colours.primaryGrey}
            OnPress={() => (bCoin&&(bCoin[0]?.BCoinBalance > bCoin[0]?.bcoinMinRedeemAmount) && !bCoin[0]?.isRequested)? setRedeemModal(true) : bCoin[0]?.isRequested?Toast.show('Already requested') : Toast.show("You need more B-Coins to redeem.")}
            ButtonText={'Redeem B-Coin'}
            ButtonWidth={90}
            ButtonHeight={5}
          />
        )
      }
      <Text/>

      {/* Redeem Coin Modal  */}
      <Modal
        animationType='fade'
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
                ListEmptyComponent={
                  <View>
                    <Text/>
                    <Text/>
                    <Text/>
                    <Text>No History Found</Text>
                  </View>
                }
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

      {/* B-Coin Transaction Modal  */}
      <Modal
        animationType='fade'
        visible={coinHistoryModal}
        transparent={true}
      >
        <View style={styles.modalMainCon}>
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
                ListEmptyComponent={
                  <View>
                    <Text/>
                    <Text/>
                    <Text/>
                    <Text>No History Found</Text>
                  </View>
                }
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
  walletAmountCard: {
    borderWidth:1,
    borderRadius:5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderStyle:'dashed', 
    width: windowWidth*(90/100),
    marginTop: windowHeight*(1/100),
    paddingVertical: windowHeight*(1/100),
    paddingHorizontal: windowWidth*(5/100),
    borderColor: colours.kapraBlackLow,
  },
  walletAmountImg: {
    height: windowWidth * (20 / 100),
    width: windowWidth * (20 / 100),
    resizeMode: 'contain',
  },
  iconCon: {
    width: windowWidth*(5/100),
    height: windowWidth*(5/100),
    alignItems:'center',
    justifyContent:'center',
  },
  switchCon: { 
    width: windowWidth*(90/100),  
    flexDirection:'row', 
    justifyContent:'space-between',
    marginVertical:10, 
    backgroundColor: colours.kapraWhite, 
  },
  flatlistCon: {
    width: windowWidth*(90/100),
    borderWidth:2, 
    borderRadius:10, 
    borderColor: colours.kapraWhiteLow, 
    padding:5, 
    marginBottom: windowHeight*(20/100)
  },
  flatlistRowCon: {
    flexDirection:'row',
    height: windowHeight*(7/100),
    alignItems:'center',
    justifyContent:'space-between',
  },
  flatlistRowImgCon: {
    height: windowWidth * (7 / 100),
    width: windowWidth * (7 / 100),
    resizeMode: 'contain',
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


  modalMainCon: {
    width:windowWidth, 
    height: windowHeight, 
    backgroundColor: 'rgba(100, 100, 100,0.3)'
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



  // Font style
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(15),
    color: colours.primaryBlack,
  },
  fontStyle2: {
    fontFamily: 'Lexend-Black',
    fontSize: getFontontSize(25),
    color: colours.goldenYellow,
  },
  fontStyle4: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    width: windowWidth*(20/100),
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  fontStyle5: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(11),
    color: colours.primaryGrey,
  },
});
