import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function SplashScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground source={require('../assets/images/BACKGROUND.png')} resizeMode="cover" style={styles.image}>
        <Image
          source={require('../assets/logo/logo.png')}
          style={{
            height: windowWidth * (30 / 100),
            width: windowWidth * (80 / 100),
            resizeMode: 'contain',
            marginBottom: windowWidth * (20 / 100),
          }}
        />
        <AuthButton
          BackgroundColor={colours.primaryRed}
          ButtonText={"Explore"}
          ButtonWidth={90}
          Icon={'search'}
          FirstColor={colours.primaryOrange}
          SecondColor={colours.lightOrange}
          OnPress={async () => {
            await AsyncStorage.setItem('isOpenedBefore', 'true');
            navigation.reset({
              index: 0,
              routes: [{ name: 'DrawerNavigator' }],
            });
          }}
        />
        <AuthButton
          BackgroundColor={colours.primaryColor}
          ButtonText={'Login'}
          ButtonWidth={90}
          FColor={colours.kapraMain}
          FirstColor={colours.primaryWhite}
          SecondColor={colours.primaryWhite}
          OnPress={async () => {
            await AsyncStorage.setItem('isOpenedBefore', 'true');
            navigation.navigate('Login')
          }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.kapraMain
  },
  image: {
    width: windowWidth,
    height: windowHeight,
    paddingTop: windowHeight*(20/100),
    justifyContent: 'center',
    alignItems: 'center',
  }
});
