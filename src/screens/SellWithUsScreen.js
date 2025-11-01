import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import { AppContext } from '../Context/appContext';

const windowHeight = Dimensions.get('window').height;
const SellWithUsScreen = ({ navigation }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [data, setData] = React.useState([]);
  if (data.length === 0)
    return (
      <SafeAreaView>
        <Header sideNav navigation={navigation} HeaderText={'Sell With Us'} />
        <View
          style={{
            //flex: 1,
            height: windowHeight * (90 / 100),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colours.white,
          }}>
          <View style={{ height: windowHeight * (20 / 100), }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
          </View>
          <Text style={styles.fontStyle3}>{'SELL WITH US EMPTY !'}</Text>
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
    <SafeAreaView>
      <Header sideNav navigation={navigation} HeaderText={'Sell With Us'} />
    </SafeAreaView>
  );
};

export default SellWithUsScreen;

const styles = StyleSheet.create({
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 14,
    color: colours.black,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Light',
    fontSize: 12,
    color: colours.black,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
