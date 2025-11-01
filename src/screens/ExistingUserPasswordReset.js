/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import { LoaderContext } from '../Context/loaderContext';
import HeaderTextField from '../components/HeaderTextField';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { forgotPassword } from '../api';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').width;
export default function LoginScreen({ navigation }) {
    const [data, setData] = React.useState('');
    const [DataError, setDataError] = React.useState(false);
    const [DataErrorMessage, setDataErrorMessage] = React.useState('');
    const { showLoader, loading } = React.useContext(LoaderContext);
    const { Language, updateLanguage } = React.useContext(AppContext);
    const Lang = Language;

    const languageRestart = async (value) => {
        //changing language based on what was chosen
        if (value === "en") {
            await AsyncStorage.setItem('LangCode', "en");
            updateLanguage();
            //await AsyncStorage.setItem('LangCode', "ar");
            // if (I18nManager.isRTL) {
            //   await I18nManager.forceRTL(false);
            // }
        } else {
            await AsyncStorage.setItem('LangCode', "pt");
            updateLanguage();
            // if (!I18nManager.isRTL) {
            //   await I18nManager.forceRTL(true);
            // }
        }
        //RNRestart.Restart();
    };

    const handleSubmit = async () => {
        const dataError = data === '';
        if (!dataError) {
            let flag = data.includes('@');
            try {
                let url;
                showLoader(true);
                if (flag) {
                    url = await forgotPassword('', data);
                } else {
                    url = await forgotPassword(data, '');
                }
                navigation.navigate('OTP', {
                    type: 'forgot',
                    otpUrlKey: url,
                });
                showLoader(false);
            } catch (error) {
                showLoader(false);
                Toast.show(error);
            }
        } else {
            setDataErrorMessage('Required');
            setDataError(dataError);
        }
    };
    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.languageContainer}>
                        <TouchableOpacity style={{ width: windowWidth * (10 / 100), borderRightWidth: 1, alignItems: 'center' }} onPress={() => languageRestart("en")}>
                            <Text style={styles.fontStyle5}>
                                EN
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: windowWidth * (10 / 100), alignItems: 'center' }} onPress={() => languageRestart("pt")}>
                            <Text style={styles.fontStyle5}>
                                PT
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require('../assets/logo/logo.png')}
                        style={{
                            height: windowWidth * (20 / 100),
                            width: windowWidth * (60 / 100),
                            marginBottom: '20%',
                            marginTop: '10%',
                            resizeMode: 'contain',
                        }}
                    />
                    <View style={styles.innerContainer}>
                        <Text style={styles.fontStyle4}>Security Alert</Text>
                        <Text style={styles.fontStyle1}>
                            {Lang.SecurityDescription}
                        </Text>

                        <HeaderTextField
                            HeaderText={'Email Id Or Mobile Number'}
                            OnChangeText={(txt) => {
                                setData(txt);
                                setDataError(false);
                            }}
                            Error={DataError}
                            errtxt={DataErrorMessage}
                        />

                        <AuthButton
                            BackgroundColor={colours.kapraMain}
                            OnPress={handleSubmit}
                            ButtonText={'Sent OTP'}
                            ButtonWidth={88}
                            Icon={'lightning'}
                        />
                        {/* <View style={styles.socialLogin}>
            <AuthButton
              BackgroundColor={colours.primaryBlue}
              OnPress={() => navigation.navigate('DrawerNavigator')}
              ButtonText={'Facebook'}
              ButtonWidth={42}
              Icon={'facebook'}
            />
            <AuthButton
              BackgroundColor={colours.primaryRed}
              OnPress={() => navigation.navigate('DrawerNavigator')}
              ButtonText={'Google'}
              ButtonWidth={42}
              Icon={'google'}
            />
          </View> */}
                    </View>
                    <View style={styles.loginContainer}>
                        <Text style={styles.fontStyle2}>Already Have An Account </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.fontStyle3}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colours.authScreens.background,
    },
    innerContainer: {
        paddingTop: '5%',
        alignItems: 'center',
    },
    languageContainer: {
        flexDirection: 'row',
        width: windowWidth * (90 / 100),
        height: windowWidth * (10 / 100),
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    forgotButton: {
        paddingBottom: '12%',
    },
    fontStyle1: {
        fontFamily: 'Proxima Nova Alt Bold',
        color: colours.headerTextInput,
        width: windowWidth * (88 / 100),
        paddingBottom: '10%',
    },
    loginContainer: {
        flexDirection: 'row',
        paddingBottom: '8%',
        paddingTop: '8%',
    },
    fontStyle2: {
        fontFamily: 'Proxima Nova Alt Semibold',
        color: colours.grey,
        fontSize: 12,
    },
    fontStyle3: {
        fontFamily: 'Proxima Nova Alt Semibold',
        color: colours.secondaryPink,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        fontSize: 12,
    },
    fontStyle4: {
        fontFamily: 'Proxima Nova Alt Bold',
        color: colours.black,
        fontSize: 20,
        width: windowWidth * (88 / 100),
        textAlign: 'left',
        paddingBottom: '3%',
    },
    fontStyle5: {
        fontFamily: 'Proxima Nova Alt Bold',
        color: colours.kapraMain,
        fontSize: 14,
    },
    socialLogin: {
        flexDirection: 'row',
        width: windowWidth * (88 / 100),
        justifyContent: 'space-between',
    },
});
