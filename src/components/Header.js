import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Share,
  Alert
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { AppContext } from '../Context/appContext';
import { Badge } from 'react-native-elements';
import { I18nManager } from "react-native";
import { ScaledSheet } from 'react-native-size-matters';
import { getFontontSize } from '../globals/functions';
import AuthButton from './AuthButton';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Header({
  HeaderText,
  navigation,
  Cart,
  WishList,
  Search,
  sideNav,
  backEnable,
  Logo,
  shareEarn, 
  LightMode
}) {
  const { cartData, wishCount, profile } = React.useContext(AppContext);
  const [ shareModal, setShareModal ] = React.useState(false);

  return (
    <>
    {
      LightMode?
      <View style={[styles.mainContainer,{ backgroundColor: colours.kapraLow}]}>
      {sideNav && (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.SideNavIcon}>
          <View
            style={{
              // width: 25,
              height: 30,
              paddingLeft: '10%',
            }}>
            {showIcon('sidemenu', colours.primaryBlack, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
      )}
      {backEnable && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.SideNavIcon}>
          <View
            style={{
              width: 25,
              height: 30,
              paddingLeft: '10%',
              marginLeft: I18nManager.isRTL ? 10 : 0,
              transform: I18nManager.isRTL ? [{ rotateY: '180deg' }] : [{ rotateY: '0deg' }]
            }}>
            {showIcon('back', colours.primaryBlack, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
      )}

      {!Logo && (
        <View
          style={styles.logoContainer}>
          <Text
            numberOfLines={2}
            style={[styles.headerText, { color: colours.primaryBlack }]}
          >
            {HeaderText ? HeaderText.toUpperCase() : HeaderText}
          </Text>
        </View>
      )}
      {Logo && (
        <View
          style={[styles.logoContainer]}>
          <Image
            source={require('../assets/logo/logoHeader.png')}
            style={{
              height: windowHeight * (6 / 100),
              width: windowWidth * (50 / 100),
              resizeMode: 'contain',
            }}
          />
        </View>
      )}
      <View style={styles.rightIconContainer}>
          {Search ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => navigation.navigate('SearchModalScreen')}>
              <Text>{showIcon('search', colours.primaryWhite, windowWidth * (5 / 100))}</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
          {shareEarn ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => profile.bkCustId? navigation.navigate('ReferralScreen'):Toast.show('Please Login!')}>
              <Text>{showIcon('share', colours.primaryBlack, windowWidth * (5 / 100))}</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
          {WishList ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => navigation.navigate('WishList')}>
              <Text>{showIcon('heart', colours.primaryBlack, windowWidth * (5 / 100))}</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
          {Cart ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => navigation.navigate('Cart')}>
              <Text>{showIcon('cart', colours.primaryBlack, windowWidth * (5 / 100))}</Text>
              {Object.keys(cartData).length > 0 && (
                <Badge value={Object.keys(cartData).length} containerStyle={{ position: 'absolute', top: 5, right: 5, color:colours.primaryWhite}} badgeStyle={{backgroundColor:colours.primaryRed, borderColor: colours.primaryRed}}  />
              )}
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
      </View>
      <View></View>

    </View>
    :
    <View style={[styles.mainContainer]}>
      {sideNav && (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.SideNavIcon}>
          <View
            style={{
              // width: 25,
              height: 30,
              paddingLeft: '10%',
            }}>
            {showIcon('sidemenu', colours.white, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
      )}
      {backEnable && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.SideNavIcon}>
          <View
            style={{
              width: 25,
              height: 30,
              paddingLeft: '10%',
              marginLeft: I18nManager.isRTL ? 10 : 0,
              transform: I18nManager.isRTL ? [{ rotateY: '180deg' }] : [{ rotateY: '0deg' }]
            }}>
            {showIcon('back', colours.primaryWhite, windowWidth * (5 / 100))}
          </View>
        </TouchableOpacity>
      )}

      {!Logo && (
        <View
          style={styles.logoContainer}>
          <Text
            numberOfLines={2}
            style={[styles.headerText, { color: colours.primaryWhite }]}
          >
            {HeaderText ? HeaderText.toUpperCase() : HeaderText}
          </Text>
        </View>
      )}
      {Logo && (
        <View
          style={[styles.logoContainer]}>
          <Image
            source={require('../assets/logo/logoHeader.png')}
            style={{
              height: windowHeight * (6 / 100),
              width: windowWidth * (50 / 100),
              resizeMode: 'contain',
            }}
          />
        </View>
      )}
      <View style={styles.rightIconContainer}>
          {Search ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => navigation.navigate('SearchModalScreen')}>
              <Text>{showIcon('search', colours.primaryWhite, windowWidth * (5 / 100))}</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
          {shareEarn ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => profile.bkCustId? navigation.navigate('ReferralScreen'):Toast.show('Please Login!')}>
              <Text>{showIcon('share', colours.primaryWhite, windowWidth * (5 / 100))}</Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
          {WishList ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => navigation.navigate('WishList')}>
              <Text>{showIcon('heart', colours.primaryWhite, windowWidth * (5 / 100))}</Text>
              {wishCount > 0 && (
                <Badge value={wishCount} status="error" containerStyle={{ position: 'absolute', top: 5, right: 0 }} />
              )}
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
          {Cart ? (
            <TouchableOpacity
              style={styles.rightIcons}
              onPress={() => navigation.navigate('Cart')}>
              <Text>{showIcon('cart', colours.primaryWhite, windowWidth * (5 / 100))}</Text>
              {Object.keys(cartData).length > 0 && (
                <Badge value={Object.keys(cartData).length} containerStyle={{ position: 'absolute', top: 5, right: 5, color:colours.primaryWhite}} badgeStyle={{backgroundColor:colours.primaryRed, borderColor: colours.primaryRed}}  />
              )}
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
      </View>
      <View></View>

    </View>
    }
    </>
  );
}

const styles = ScaledSheet.create({
  mainContainer: {
    paddingVertical: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth,
    height: windowHeight * (8 / 100),
    backgroundColor: colours.kapraMain
  },
  SideNavIcon: {
    // backgroundColor: '#ff0',
    width: windowWidth * (20 / 100),
    height: windowHeight * (7 / 100),
    marginLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    width: windowWidth * (40 / 100),
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: windowWidth * (3.8 / 100),
    textAlign: 'center',
  },
  logoContainer: {
    width: windowWidth * (50 / 100),
    height: windowHeight * (7 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconContainer: {
    width: windowWidth * (20 / 100),
    height: windowHeight * (7 / 100),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:'center'
  },
  rightIcons: {
    width: windowWidth * (10 / 100),
    height: windowHeight * (7 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
