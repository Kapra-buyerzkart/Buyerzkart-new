import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image
} from 'react-native';
import showIcon from '../globals/icons';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import Header from '../components/Header';
import LoginScreen from '../screens/LoginScreen';
import { getFontontSize } from '../globals/functions';
import LinearGradient from 'react-native-linear-gradient';
import AuthButton from '../components/AuthButton';
import {deleteAccount, getProfile} from '../api';
import RNRestart from "react-native-restart";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProfileScreen = ({ navigation, route }) => {
  let fromDrawer = route?.params?.fromDrawer ? true : false;
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { profile, logout } = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);

  const _fetchHomeData = async () => {
    try {
      showLoader(true);
      let res = await getProfile();
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    if (profile.bkCustId) {
      _fetchHomeData();
    }
  }, [profile]);


  const deleteUser = async() => {
    try {
      let res = await deleteAccount(profile.bkCustId);
      await AsyncStorage.clear();
      RNRestart.Restart();
    } catch (error) {
      Toast.show("SOMETHING WENT WRONG")
    }
  }


  if (!profile.bkCustId) {
    return <LoginScreen navigation={navigation} />;
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
    <ScrollView contentContainerStyle={styles.tableStyle} showsVerticalScrollIndicator={false}>
      <View style={styles.topContainer}>
        <Image
          source={require('../assets/logo/logoHeader.png')}
          style={styles.topImage}
        />
      </View>
      <View style={{width:windowWidth}}>
        {/* <View style={styles.topProImage}>
          {showIcon('profile', colours.primaryOrange, windowHeight*(10/100))}
        </View> */}
        {
          data && data.isPrevilaged ?
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{x: 0, y: 1 }}
            colors={[ colours.primaryOrange, colours.lightOrange,  colours.kapraLight, colours.kapraMain, ]}
            style={styles.topProImage}
          >
            <View style={styles.privilageCon}>
              <Image
                source={require('../assets/images/avatar.png')}
                style={{
                  width: windowHeight*(10/100),
                  height: windowHeight*(10/100),
                }}
              />
            </View>
            <Image
              source={require('../assets/images/prevLogo.png')}
              style={styles.privilageImg}
            />
          </LinearGradient>
        :
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{x: 0, y: 1 }}
            colors={[ colours.lightGrey, colours.lightGrey ]}
            style={styles.topProImage}
          >
            <View style={styles.privilageCon}>
              <Image
                source={require('../assets/images/avatar.png')}
                style={{
                  width: windowHeight*(10/100),
                  height: windowHeight*(10/100),
                }}
              />
            </View>
          </LinearGradient>
        }

      </View>
      <View style={styles.nameContainer}>
        <View>
          <Text style={styles.fontStyle1}>{profile.custName}</Text>
          <Text style={[styles.fontStyle2,{color: colours.kapraLight}]}>{profile.emailId}</Text>
          {
            data && data.isPrevilaged && (
              <Text style={[styles.fontStyle2,{color: colours.primaryOrange}]}>Smartcard Holder</Text>
            )
          }
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
          {showIcon('edit', colours.primaryOrange, windowHeight*(3/100))}
        </TouchableOpacity>
      </View>

          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('MyOrdersScreen')}>
              <View style={styles.iconStyle}>
                {showIcon('shoppingbag', colours.kapraLight, windowWidth*(5/100))}
              </View>
            <Text style={styles.fontStyle3}>My Orders</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('WishList')}>
            <View style={styles.iconStyle}>
              {showIcon('heart', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>My WishList</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('Address')}>
            <View style={styles.iconStyle}>
              {showIcon('address_thin', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>My Addresses</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('ReferralScreen')}>
            <View style={styles.iconStyle}>
              {showIcon('refer', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>My Referrals</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('WalletScreen')}>
            <View style={styles.iconStyle}>
              {showIcon('wallet', colours.lightBlue, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>My Wallet</Text>
            <Text>{showIcon('rightarrow', colours.lightBlue, windowWidth*(5/100))}</Text>
          </TouchableOpacity> */}
           <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('BCoinScreen')}>
            <View style={styles.iconStyle}>
              {showIcon('wallet', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>B Coin & B Token</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('ChangePassword')}>
            <View style={styles.iconStyle}>
              {showIcon('padlock', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>Change Password</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => navigation.navigate('WriteToUsScreen')}>
            <View style={styles.iconStyle}>
              {showIcon('support', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>Support</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() =>
              navigation.navigate('PolicyScreen', {
                Type: 'Privacy Policy',
                fromReg: true,
              })
            }
          >
          <View style={styles.iconStyle}>
            {showIcon('privacy', colours.kapraLight, windowWidth*(5/100))}
          </View>
            <Text style={styles.fontStyle3}>Privacy Policy</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() =>
              navigation.navigate('PolicyScreen', {
                Type: 'Terms of Use',
                fromReg: true,
              })
            }
          >
            <View style={styles.iconStyle}>
              {showIcon('terms', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>Terms of Use</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() =>
              navigation.navigate('PolicyScreen', {
                Type: 'About Us',
                fromReg: true,
              })
            }
          >
            <View style={styles.iconStyle}>
              {showIcon('delivery', colours.kapraLight, windowWidth*(5/100))}
            </View>
            <Text style={styles.fontStyle3}>About Us</Text>
            <Text>{showIcon('rightarrow', colours.kapraLight, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={()=>setLogoutModal(true)}
          >
            <View style={[styles.iconStyle,{backgroundColor:colours.lowOrange}]}>
              {showIcon('logout', colours.primaryOrange, windowWidth*(5/100))}
            </View>
            <Text style={[styles.fontStyle3,{color:colours.primaryOrange}]}>Logout</Text>
            <Text>{showIcon('rightarrow', colours.primaryOrange, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={()=>setDeleteModal(true)}
          >
            <View style={[styles.iconStyle,{backgroundColor:colours.lowRed}]}>
              {showIcon('bin1', colours.primaryRed, windowWidth*(5/100))}
            </View>
            <Text style={[styles.fontStyle3,{color:colours.primaryRed}]}>Delete Account</Text>
            <Text>{showIcon('rightarrow', colours.primaryRed, windowWidth*(5/100))}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.rowContainer}
            onPress={()=>navigation.navigate('SupportScreen')}
          >
            <Text style={[styles.fontStyle3,{color:colours.primaryRed}]}>Testing Screen</Text>
            <Text>{showIcon('bin1', colours.primaryRed, windowWidth*(5/100))}</Text>
          </TouchableOpacity> */}
        </ScrollView>

      <Modal
        animationType="slide"
        visible={logoutModal}
        transparent={true}
      >
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)'}}>
          <View style={styles.updateModalView}>
            <Image
                source={require('../assets/logo/logo.png')}
                style={{
                    height: windowWidth * (15 / 100),
                    width: windowWidth * (80 / 100),
                    resizeMode: 'contain',
                }}
            />
            <Text style={styles.headerText}>Are you sure, want to logout?</Text>
            <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                <AuthButton
                    BackgroundColor={colours.primaryRed}
                    OnPress={() => { setLogoutModal(false) }}
                    ButtonText={'No'}
                    ButtonWidth={40}
                />
                <AuthButton
                    BackgroundColor={colours.kapraMain}
                    OnPress={() => {setLogoutModal(false), logout()}}
                    ButtonText={'Yes'}
                    ButtonWidth={40}
                />
            </View>
          </View> 
        </View>
      </Modal>

      <Modal
        animationType="slide"
        visible={deleteModal}
        transparent={true}
      >
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)'}}>
          <View style={styles.updateModalView}>
            <Image
                source={require('../assets/logo/logo.png')}
                style={{
                    height: windowWidth * (15 / 100),
                    width: windowWidth * (80 / 100),
                    resizeMode: 'contain',
                }}
            />
            <Text style={styles.headerText}>Are you sure, want to delete this account?</Text>
            <Text style={[styles.fontStyle2,{color: colours.primaryRed}]}>( We will delete this account permanently )</Text>
            <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                <AuthButton
                    BackgroundColor={colours.primaryRed}
                    OnPress={() => { setDeleteModal(false) }}
                    ButtonText={'No'}
                    ButtonWidth={40}
                    ButtonHeight={5}
                />
                <AuthButton
                    BackgroundColor={colours.kapraMain}
                    OnPress={() => deleteUser()}
                    ButtonText={'Yes'}
                    ButtonWidth={40}
                    ButtonHeight={5}
                />
            </View>
          </View> 
        </View>
      </Modal>


    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraLow,
  },
  topContainer: {
    width: windowWidth,
    height: windowHeight*(25/100),
    backgroundColor: colours.kapraLow,
    alignItems:'center',
  },
  topImage: {
    height: windowHeight * (10 / 100),
    width: windowWidth * (70 / 100),
    resizeMode: 'contain',
    marginTop: windowHeight*(5/100)
  },
  topProImage: {
    width: windowHeight*(15/100),
    height: windowHeight*(15/100),
    backgroundColor: colours.kapraLow,
    alignItems:'center',
    justifyContent: 'center',
    marginLeft: windowWidth*(15/100),
    marginTop: -windowHeight*(7/100),
    borderRadius: 20,
    shadowColor: colours.kapraLight,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5,
  },
  privilageCon: {
    width: windowHeight*(14/100),
    height: windowHeight*(14/100),
    borderRadius: 20,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: colours.primaryWhite
  },
  privilageImg: {
    width: windowHeight*(5/100),
    height: windowHeight*(5/100),
    top:windowHeight*(0.5/100),
    right:windowHeight*(0.1/100),
    position:'absolute'
  },
  editButton: {
    width: windowHeight*(5/100),
    height: windowHeight*(5/100),
    backgroundColor: colours.kapraLow,
    alignItems:'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: colours.kapraLight,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:5,
  },
  nameContainer: {
    width: windowWidth * (90 / 100),
    marginLeft: windowWidth*(5/100),
    marginVertical: windowHeight*(3/100),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  iconStyle:{
    width :windowWidth*(10/100),
    height :windowWidth*(10/100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.kapraLow,
    borderRadius:5
  },
  tableStyle: {
    width: windowWidth ,
    paddingBottom: windowHeight*(10/100),
    borderRadius: 5,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    height: windowHeight*(8/100),
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: colours.lowWhite,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(25),
    color: colours.kapraMain,
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.kapraLight,
    width: windowWidth*(70/100)
  },
  headerText: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlack
  },
  updateModalView: {
      height: windowHeight * (30 / 100),
      marginTop: windowHeight * (70 / 100),
      paddingTop: windowHeight * (1 / 100),
      paddingBottom: windowHeight * (2 / 100),
      backgroundColor: colours.primaryWhite,
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
      elevation: 10,
      alignItems: "center",
      justifyContent:'space-between'
  },
});
