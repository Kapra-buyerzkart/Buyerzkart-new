import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
//import RNRestart from "react-native-restart";
import { I18nManager } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/appContext';

//import DropDownPicker from 'react-native-dropdown-picker';

const SettingsScreen = ({ navigation }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const languageRestart = async (value) => {
    //changing language based on what was chosen
    if (value === "en") {
      await AsyncStorage.setItem('LangCode', "en");
      //await AsyncStorage.setItem('LangCode', "ar");
      if (I18nManager.isRTL) {
        await I18nManager.forceRTL(false);
      }
    } else {
      await AsyncStorage.setItem('LangCode', "ar");
      if (!I18nManager.isRTL) {
        await I18nManager.forceRTL(true);
      }
    }
    RNRestart.Restart();
  };
  return (
    <>
      <Header backEnable navigation={navigation} HeaderText={'Settings'} />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: colours.white,
        }}>
        <View style={styles.itemContainer}>
          <Text style={styles.fontStyle4}>{I18nManager.isRTL ? 'لغة' : "Language"}</Text>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => languageRestart(I18nManager.isRTL ? "en" : "ar")}>
            <Text style={styles.fontStyle3}>  {I18nManager.isRTL ? "English" : "عربى"}</Text>
            <View style={{ transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '180deg' }], height: '60%' }}>{showIcon('back', colours.black, 15)}</View>
          </TouchableOpacity>
        </View>
        {/* <DropDownPicker
          items={[
            { label: 'English', value: 'en' },
            { label: 'عربى', value: 'ar' },
          ]}
          //defaultValue={"usa"}
          placeholder="Choose Language"
          containerStyle={{ height: 40, width: '90%' }}
          style={{ backgroundColor: '#fafafa' }}
          itemStyle={{
            justifyContent: 'flex-start'
          }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
          onChangeItem={(items) => languageRestart(items.value)}
        /> */}

        {/* <AuthButton
          BackgroundColor={colours.primaryColor}
          OnPress={() => languageRestart(true)}
          ButtonText={'English'}
          ButtonWidth={90}
        />
        <AuthButton
          BackgroundColor={colours.primaryColor}
          OnPress={() => languageRestart(false)}
          ButtonText={'عربى'}
          ButtonWidth={90}
        /> */}
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    margin: "5%",
    justifyContent: 'space-between',
    height: '6%',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 16,
    color: colours.black,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 16,
    color: colours.black,
    textAlign: 'center',
  },
});
