import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, View, Linking, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import { LoaderContextProvider } from './src/Context/loaderContext';
import { AppContextProvider } from './src/Context/appContext';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import './src/globals/facebookConfig'

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = { ...(TextInput.defaultProps || {}), allowFontScaling: false };
const App = () => {

  const navigationRef = React.useRef();

  const linking = {
    prefixes: ['buyerzkart://', 'https://kapradaily.com'],
    config: {
      initialRouteName: 'DrawerNavigator',
      screens: {
        SingleItemScreen: {
          path: 'SingleItemScreen/:UrlKey'
        },
        SingleItemScreen: {
          path: 'product/:UrlKey'
        },
        SearchScreen: {
          path: 'SearchScreen/:Keyword'
        },
        SearchScreen: {
          path: 'products/:Keyword'
        },
        SingleOrderScreen: {
          path: 'SingleorderScreen/:orderId'
        },
        SingleOrderScreen: {
          path: 'account/orderdetails/:orderId'
        },
      },
    }
  }

  
  const handleOpenURL= async(event) => {
    let refCode = event.url.split('custrefcd=')[1];
    if(refCode){
      await AsyncStorage.setItem('ProductRef', refCode);
    } else{
      await AsyncStorage.removeItem('ProductRef')
    }
  }
  
  // React.useEffect(() => {
  //   Linking.addEventListener('url',(event)=>handleOpenURL(event));
  // },[]);



  React.useEffect(() => {
    
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("266dbe6c-b4a8-458c-ba84-28f64cac2796");
          
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
    });
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData
      const button1 = {
        text: "Cancel",
        onPress: () => { notificationReceivedEvent.complete(); },
        style: "cancel"
      };
      const button2 = { text: "Complete", onPress: () => { notificationReceivedEvent.complete(notification); }};
    });
    
    OneSignal.setNotificationOpenedHandler(notification => {
    });
    }, []
  );


  return (
    <AppContextProvider>
      <LoaderContextProvider>
        {/* <StatusBar backgroundColor="#0a367f" barStyle="light-content" /> */}
        <MyStatusBar backgroundColor='#FFFFFF' barStyle="dark-content" />
        {/* <NavigationContainer  ref={navigationRef}> */}
        <NavigationContainer  linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </LoaderContextProvider>
    </AppContextProvider>
  );
};

export default App;


const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);


const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});