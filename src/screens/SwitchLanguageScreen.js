import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import RNRestart from "react-native-restart";
import { I18nManager, DevSettings } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import { getLanguageList } from '../api';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SettingsScreen = ({ navigation }) => {
  const { Language, updateLanguage } = React.useContext(AppContext);
  const Lang = Language;
  const { showLoader, loading } = React.useContext(LoaderContext);

  const languageRestart = async (value) => {
    //changing language based on what was chosen
    if (value === "en") {
      await AsyncStorage.setItem('LangCode', "en");
      updateLanguage();
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigator' }],
      })
      //await AsyncStorage.setItem('LangCode', "ar");
      // if (I18nManager.isRTL) {
      //   await I18nManager.forceRTL(false);
      // }
    } else {
      await AsyncStorage.setItem('LangCode', "ar");
      updateLanguage();

      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigator' }],
      })
      // if (!I18nManager.isRTL) {
      //   await I18nManager.forceRTL(true);
      // }
    }
    //RNRestart.Restart();
  };

  return (
    <SafeAreaView>
      <Header backEnable navigation={navigation} HeaderText={"SETTINGS"} />
      <View
        style={{
          backgroundColor: colours.white,
          width: windowWidth,
          height: windowHeight * (80 / 100),
          alignItems: 'center'
        }}>
        <View style={{ height: windowHeight * (8 / 100), justifyContent: 'center' }}>
          <Text style={styles.fontStyle3}>
            {'Choose Your Language'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: windowWidth * (90 / 100), }}>
          <TouchableOpacity style={[styles.itemContainer, { backgroundColor: colours.kapraMain }]} onPress={() => languageRestart('en')}>
            <Text style={styles.fontStyle4}>
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemContainer, { backgroundColor: colours.reviewBoxRed }]} onPress={() => languageRestart('pt')}>
            <Text style={styles.fontStyle4}>
              Português
            </Text>
          </TouchableOpacity>
        </View>



        {/* <DropDownPicker
          items={[
            { label: 'English', value: 'en' },
            {
              label: 'Português', value: 'pt'
            },
          ]}
          placeholder="Choose Language"
          containerStyle={{ height: windowWidth*(10/100), width: '100%' }}
          style={{ backgroundColor: '#fafafa' }}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          labelStyle={{
            fontSize:windowWidth*(4/100),
          }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
          onChangeItem={(items) => languageRestart(items.value)}
        /> */}

      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  itemContainer: {
    width: windowWidth * (40 / 100),
    alignItems: 'center',
    borderWidth: 0.3,
    height: windowHeight * (5 / 100),
    borderRadius: windowHeight * (2.5 / 100)
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: 20,
    color: colours.black,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: 24,
    color: colours.white,
    textAlign: 'center',
  },
});