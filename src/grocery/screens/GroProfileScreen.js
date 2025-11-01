

// Done 


import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Linking
} from 'react-native';
import RNRestart from "react-native-restart";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import { BlurView } from '@react-native-community/blur';

import showIcon from '../../globals/icons';
import colours from '../../globals/colours';
import { AppContext } from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import GroLoginScreen from '../screens/GroLoginScreen';
import { getFontontSize } from '../globals/GroFunctions';
import AuthButton from '../components/AuthButton';
import { deleteAccount, getProfile } from '../api';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GroProfileScreen = ({ navigation, route }) => {

  const { profile, logout } = React.useContext(AppContext);
  const [data, setData] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);

  const _fetchHomeData = async () => {
    try {
      let res = await getProfile();
      setData(res);
    } catch (err) {
    }
  };

  React.useEffect(() => {
    if (profile.groceryCustId) {
      _fetchHomeData();
    }
  }, [profile]);


  const deleteUser = async () => {
    try {
      let res = await deleteAccount(profile.groceryCustId);
      await AsyncStorage.clear();
      RNRestart.Restart();
    } catch (error) {
      Toast.show("SOMETHING WENT WRONG")
    }
  }


  if (!profile.groceryCustId) {
    return <GroLoginScreen navigation={navigation} />;
  }
  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={() => navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth * (5 / 100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* User detaisl con  */}
      <View style={styles.userDetailsCon}>
        <View style={styles.nameCon}>
          <Text style={styles.headerText}>{profile.custName}</Text>
          {profile.isPrime === true ? (
            <View style={{
              flexDirection: "row"
            }}>
              <Image
                source={require('../../assets/images/primebadge.png')}
                style={{
                  height: windowWidth * (16 / 100),
                  width: windowWidth * (16 / 100),
                  // resizeMode: 'contain',
                }} />

              <TouchableOpacity style={[styles.smallIconCon, { top: -windowWidth * (3 / 100), right: -windowWidth * (3 / 100) }]} onPress={() => navigation.navigate('GroEditProfileScreen')}>
                {showIcon('edit', colours.kapraOrangeDark, windowWidth * (3 / 100))}
              </TouchableOpacity>
            </View>
          ) : (<TouchableOpacity style={[styles.smallIconCon, { top: -windowWidth * (3 / 100), right: -windowWidth * (3 / 100) }]} onPress={() => navigation.navigate('GroEditProfileScreen')}>
            {showIcon('edit', colours.kapraOrangeDark, windowWidth * (3 / 100))}
          </TouchableOpacity>
          )}

        </View>
        <View style={[styles.nameCon, { justifyContent: 'flex-start' }]}>
          <View style={[styles.nameSubCon1, { width: windowWidth * (30 / 100) }]}>
            <TouchableOpacity style={[styles.smallIconCon]}>
              {showIcon('call', colours.kapraBlackLight, windowWidth * (3 / 100))}
            </TouchableOpacity>
            <Text style={styles.lightFont1}>{profile?.phoneNo}  </Text>
          </View>
          <View style={[styles.nameSubCon1, { width: windowWidth * (50 / 100) }]}>
            <TouchableOpacity style={[styles.smallIconCon,]}>
              {showIcon('mail', colours.kapraBlackLight, windowWidth * (3 / 100))}
            </TouchableOpacity>
            <Text style={styles.lightFont1}>{profile?.emailId}</Text>
          </View>
        </View>
        {
          data && data.isPrevilaged && (
            <Text style={[styles.fontStyle2, { color: colours.kapraOrange }]}>Smart Card Holder</Text>
          )
        }
        <View style={styles.nameSmallCon}>
          <TouchableOpacity style={styles.nameConSmallBtn} onPress={() => Linking.openURL('whatsapp://send?text=Hi Kapra Daily..&phone=+919539701110')}>
            <View style={styles.nameConSmallIcon}>
              {showIcon('whatsapp', colours.kapraBlackLow, windowWidth * (5 / 100))}
            </View>
            <Text style={styles.fontStyle3}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nameConSmallBtn} onPress={() => navigation.navigate('GroBCoinScreen')}>
            <View style={styles.nameConSmallIcon}>
              {showIcon('wallet', colours.kapraBlackLow, windowWidth * (5 / 100))}
            </View>
            <Text style={styles.fontStyle3}>B-Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nameConSmallBtn} onPress={() => profile.groceryCustId ? navigation.navigate('GroReferralScreen') : Toast.show('Please Login!')}>
            <View style={styles.nameConSmallIcon}>
              {showIcon('refer', colours.kapraBlackLow, windowWidth * (5 / 100))}
            </View>
            <Text style={styles.fontStyle3}>Refer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nameConSmallBtn} onPress={() => navigation.navigate('GroWriteToUsScreen')}>
            <View style={styles.nameConSmallIcon}>
              {showIcon('support', colours.kapraBlackLow, windowWidth * (5 / 100))}
            </View>
            <Text style={styles.fontStyle3}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollStyle} showsVerticalScrollIndicator={false}>
        {/* Menu List  */}
        <Text />
        <Text />
        <TouchableOpacity style={styles.menuCon} onPress={() => navigation.navigate('GroMyOrdersScreen')}>
          <View style={styles.smallIconCon}>
            {showIcon('orders', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>My Orders</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon} onPress={() => navigation.navigate('GroWishListScreen')}>
          <View style={styles.smallIconCon}>
            {showIcon('heart1', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>My Wishlist</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon} onPress={() => navigation.navigate('GroCartScreen')}>
          <View style={styles.smallIconCon}>
            {showIcon('cart', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>My Cart</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon} onPress={() => navigation.navigate('GroAddressScreen')}>
          <View style={styles.smallIconCon}>
            {showIcon('addressPin', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>My Address</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon} onPress={() => navigation.navigate('GroBCoinScreen')}>
          <View style={styles.smallIconCon}>
            {showIcon('bCoin', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>B Coin & B Token</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon} onPress={() => navigation.navigate('GroChangePasswordScreen')}>
          <View style={styles.smallIconCon}>
            {showIcon('lock1', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>Change Password</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon}
          onPress={() =>
            navigation.navigate('PolicyScreen', {
              Type: 'Privacy Policy',
              fromReg: true,
            })
          }
        >
          <View style={styles.smallIconCon}>
            {showIcon('privacy', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>Privacy Policy</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon}
          onPress={() =>
            navigation.navigate('PolicyScreen', {
              Type: 'Terms of Use',
              fromReg: true,
            })
          }
        >
          <View style={styles.smallIconCon}>
            {showIcon('terms', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>Terms of Use</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon}
          onPress={() =>
            navigation.navigate('PolicyScreen', {
              Type: 'About Us',
              fromReg: true,
            })
          }
        >
          <View style={styles.smallIconCon}>
            {showIcon('about', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>About Us</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraBlackLow, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuCon}
          onPress={() => setLogoutModal(true)}
        >
          <View style={styles.smallIconCon}>
            {showIcon('logout', colours.kapraOrange, windowWidth * (4 / 100))}
          </View>
          <Text style={[styles.lightFont1, { color: colours.kapraOrange, fontSize: getFontontSize(14), width: windowWidth * (70 / 100) }]}>Logout</Text>
          <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
            {showIcon('right3', colours.kapraOrange, windowWidth * (4 / 100))}
          </View>
        </TouchableOpacity>


        <View style={styles.logoCon} >
          <Image
            source={require('../../assets/logo/logo.png')}
            style={styles.logoImg}
          />
          <Text style={[styles.lightFont1, { fontSize: getFontontSize(9) }]}>{DeviceInfo.getVersion()}</Text>
        </View>
      </ScrollView>

      {/* Logout Modal  */}
      <Modal
        animationType='fade'
        visible={logoutModal}
        transparent={true}
      >
        <BlurView
          style={styles.blurStyle}
          blurType="light"
          blurAmount={1}
          overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
          reducedTransparencyFallbackColor='black'
        />
        <View style={styles.modalMainCon}>
          <View style={styles.updateModalView}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={{
                height: windowWidth * (15 / 100),
                width: windowWidth * (80 / 100),
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.headerText}>Are you sure, want to logout?</Text>
            <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-around' }}>
              <AuthButton
                FirstColor={colours.kapraLight}
                SecondColor={colours.kapraMain}
                OnPress={() => { setLogoutModal(false) }}
                ButtonText={'No'}
                ButtonWidth={40}
                ButtonHeight={5}
              />
              <AuthButton
                FirstColor={colours.kapraOrange}
                SecondColor={colours.kapraOrangeDark}
                OnPress={() => { setLogoutModal(false), logout() }}
                ButtonText={'Yes'}
                ButtonWidth={40}
                ButtonHeight={5}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal  */}
      <Modal
        animationType="slide"
        visible={deleteModal}
        transparent={true}
      >
        <View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)' }}>
          <View style={styles.updateModalView}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={{
                height: windowWidth * (15 / 100),
                width: windowWidth * (80 / 100),
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.headerText}>Are you sure, want to delete this account?</Text>
            <Text style={[styles.fontStyle2, { color: colours.primaryRed }]}>( We will delete this account permanently )</Text>
            <View style={{ flexDirection: 'row', width: windowWidth * (90 / 100), justifyContent: 'space-around' }}>
              <AuthButton
                BackgroundColor={colours.primaryRed}
                OnPress={() => { setDeleteModal(false) }}
                ButtonText={'No'}
                ButtonWidth={40}
                ButtonHeight={5}
              />
              <AuthButton
                BackgroundColor={colours.primaryColor}
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

export default GroProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
  },
  headerCon: {
    width: windowWidth,
    height: windowHeight * (8 / 100),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: windowWidth * (5 / 100)
  },
  backButtonCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (10 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIconCon: {
    width: windowWidth * (7 / 100),
    height: windowWidth * (7 / 100),
    borderRadius: windowWidth * (7 / 100),
    backgroundColor: colours.kapraWhiteLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetailsCon: {
    width: windowWidth * (90 / 100),
    backgroundColor: colours.kapraWhiteLow,
    padding: windowWidth * (5 / 100),
    borderRadius: 5
  },
  nameCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameSubCon1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  nameSmallCon: {
    width: windowWidth * (80 / 100),
    paddingVertical: windowHeight * (1 / 100),
    borderRadius: 5,
    backgroundColor: colours.kapraWhite,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 15
  },
  nameConSmallBtn: {
    width: windowWidth * (15 / 100),
    height: windowWidth * (15 / 100),
    borderRadius: windowWidth * (15 / 100),
    backgroundColor: colours.kapraWhiteLow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameConSmallIcon: {
    width: windowWidth * (8 / 100),
    height: windowWidth * (8 / 100),
    borderRadius: windowWidth * (8 / 100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuCon: {
    width: windowWidth * (90 / 100),
    paddingVertical: windowHeight * (1 / 100),
    marginTop: windowHeight * (1 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoCon: {
    width: windowWidth * (90 / 100),
    alignItems: 'center'
  },
  blurStyle: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: null,
    overflow: 'hidden'
  },


  modalMainCon: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(172, 150, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  updateModalView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (25 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  scrollStyle: {
    width: windowWidth,
    paddingBottom: windowHeight * (10 / 100),
    borderRadius: 5,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  logoImg: {
    width: windowWidth * (12 / 100),
    height: windowWidth * (6 / 100),
    resizeMode: 'contain'
  },




  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  lightFont1: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(12),
    color: colours.kapraBlack,
  },
  fontStyle2: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
  },
  fontStyle3: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(9),
    color: colours.kapraBlackLight,
  },
});
