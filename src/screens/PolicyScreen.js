// CMSScreen

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import AuthButton from '../components/AuthButton';
import { getPolicies } from '../api';
import { AppContext } from '../Context/appContext';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { LoaderContext } from '../Context/loaderContext';

const windowWidth = Dimensions.get('window').width;
const CMSScreen = ({ navigation, route }) => {
  const { Language } = React.useContext(AppContext);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const Lang = Language;
  const { Type } = route.params;
  const fromReg = route.params.fromReg ? true : false;
  const regex = /<br|\n|\r\s*\\?>/g;
  const [policy, setPolicy] = React.useState([]);

  React.useEffect(() => {
    const effect = async () => {
      showLoader(true)
      let res = await getPolicies();
      setPolicy(res);
      showLoader(false)
    };
    effect();
  }, []);

  if (policy.length === 0) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        backEnable
        navigation={navigation}
        HeaderText={Type}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {
          policy.map((item, index) => (
            Type === "Privacy Policy" && item.stName === 'privacyPolicy' ?
              <RenderHtml source={{ html: item.stValue.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                contentWidth={windowWidth * (90 / 100)}
                containerStyle={{ width: windowWidth * (90 / 100), marginLeft: windowWidth * (2.5 / 100), fontFamily: 'Intro Bold' }}
                style={{ fontFamily: 'Intro Bold' }}
                tagsStyles={webViewStyle}
              />
              :
              Type === "Terms of Use" && item.stName === 'terms' ?
                <RenderHtml source={{ html: item.stValue.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                  contentWidth={windowWidth * (90 / 100)}
                  containerStyle={{ width: windowWidth * (90 / 100), marginLeft: windowWidth * (2.5 / 100), fontFamily: 'Intro Bold' }}
                  style={{ fontFamily: 'Intro Bold' }}
                  tagsStyles={webViewStyle}
                />
                :
                Type === "Shipping Policy" && item.stName === 'shipping' ?
                  <RenderHtml source={{ html: item.stValue.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                    contentWidth={windowWidth * (90 / 100)}
                    containerStyle={{ width: windowWidth * (90 / 100), marginLeft: windowWidth * (2.5 / 100), fontFamily: 'Intro Bold' }}
                    style={{ fontFamily: 'Intro Bold' }}
                    tagsStyles={webViewStyle}
                  />
                  :
                  Type === "Payment Policy" && item.stName === 'payment' ?
                    <RenderHtml source={{ html: item.stValue.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                      contentWidth={windowWidth * (90 / 100)}
                      containerStyle={{ width: windowWidth * (90 / 100), marginLeft: windowWidth * (2.5 / 100), fontFamily: 'Intro Bold' }}
                      style={{ fontFamily: 'Intro Bold' }}
                      tagsStyles={webViewStyle}
                    />
                    :
                    Type === "Return Policy" && item.stName === 'return' ?
                      <RenderHtml source={{ html: item.stValue.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                        contentWidth={windowWidth * (90 / 100)}
                        containerStyle={{ width: windowWidth * (90 / 100) }}
                        tagsStyles={webViewStyle}
                      />
                      :
                      Type === "About Us" && item.stName === 'About' ?
                      <RenderHtml source={{ html: item.stValue.split("About").join("").split("\n").join("").split("/>").join("").trim().replace(regex, '\n').trim().replace(', ', '\n') }}
                        contentWidth={windowWidth * (90 / 100)}
                        containerStyle={{ width: windowWidth * (90 / 100) }}
                        tagsStyles={webViewStyle}
                      />
                      :
                      null
          ))
        }
      </ScrollView>
        <View style={{ alignItems: 'center', width: windowWidth }}>
          <AuthButton
            BackgroundColor={colours.kapraMain}
            OnPress={() => navigation.goBack()}
            ButtonText={'Back'}
            ButtonWidth={80}
          />
        </View>
    </SafeAreaView>
  );
};

export default CMSScreen;
const webViewStyle = StyleSheet.create({

  html: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  p: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingLeft:windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  tr: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingLeft:windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  a: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingLeft:windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  h2: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingLeft:windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  h3: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingLeft:windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  strong: {
    fontSize: 20,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingRight: windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  li: {
    fontSize: 18,
    paddingTop: '1%',
    color: '#887D80',
    width: windowWidth * (94 / 100),
    paddingRight: windowWidth * (5 / 100),
    textAlign: 'justify',
    fontFamily: 'Proxima Nova Alt Semibold',
  },

})

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  scroll: {
    alignItems: 'center',
    // width: windowWidth * (94 / 100),
  },
});

