import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    Platform,
    SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

import { AppContext } from '../../Context/appContext';
import { LoaderContext } from '../../Context/loaderContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GroLoginScreenThree = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { GroLogin } = useContext(AppContext);
    const { showLoader, loading } = useContext(LoaderContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const insets = useSafeAreaInsets()

    const handleLogin = async () => {
        const EmailError = email === '';
        const PasswordError = password === '';
        if (!(EmailError || PasswordError)) {
            let data = {
                userName: email,
                password,
            };
            try {
                showLoader(true);
                let reg = await GroLogin(data);
                Toast.show(reg);

                // if (route?.params?.fromCart) {
                //     navigation.reset({
                //         index: 0,
                //         routes: [{ name: 'GroHomeScreen' }, { name: 'GroCartScreen' }],
                //     });
                // } else if (route?.params?.fromProd) {
                //     navigation.goBack();
                // } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'GroHomeScreen' }],
                });
                // }
            } catch (error) {
                if (error.status === 401) {
                    Toast.show(error.Message);
                } else if (error === 'StatusCode:404, Please Reset Your Password') {
                    Toast.show(error);
                    // navigation.navigate('ExistingUserPasswordReset');
                } else {
                    Toast.show(error);
                }
            } finally {
                showLoader(false);
            }
        } else {
            setEmailError(EmailError);
            setPasswordError(PasswordError);
            setEmailErrorMessage('Required*');
            setPasswordErrorMessage('Required*');
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                style={Platform.OS === 'android' ? {
                    flex: 1,
                    paddingBottom: insets.bottom
                } : {
                    flex: 1,
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <ImageBackground
                        style={styles.backgroundImage}
                        source={require('../../assets/images/login_background_image.jpg')}
                    >
                        <Image style={styles.kapraLogo} source={require('../../assets/images/kapra_logo.png')} />
                        <Image style={styles.tagLine} source={require('../../assets/images/login_content.png')} />
                    </ImageBackground>

                    {/* <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login or Sign up</Text>
                        <Text style={styles.enterNumberText}>Enter your credentials</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter Phone Number / Email"
                                placeholderTextColor="#DADADA"
                                style={styles.input}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailError(false);
                                }}
                                value={email}
                            />
                            {emailError && (
                                <Text style={{ color: 'red', fontSize: wp('3.25%') }}>{emailErrorMessage}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter Password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showPassword}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setPasswordError(false);
                                    }}
                                    value={password}
                                />
                                <TouchableOpacity
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Image
                                        tintColor={showPassword ? 'red' : undefined}
                                        style={styles.eyeIcon}
                                        source={require('../../assets/images/eye_icon.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError && (
                                <Text style={{ color: 'red', fontSize: wp('3.25%') }}>{passwordErrorMessage}</Text>
                            )}
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('GroForgotPasswordScreen')}>
                            <Text style={styles.forgotPwdText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogin}
                            style={[styles.continueButton, loading && { opacity: 0.7 }]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.continueButtonText}>Continue</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.enterNumberText}>New to Kapra Daily? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('GroRegisterScreen')}>
                                <Text style={styles.registerText}>Register Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}

                    <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login</Text>
                        {/* <Text style={styles.enterNumberText}>Enter your email</Text> */}

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter email / phone number"
                                    placeholderTextColor="#DADADA"
                                    style={Platform.OS === 'android' ? [styles.input, { bottom: hp('-0.4%') }] : styles.input}
                                    // secureTextEntry={!showPassword}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setEmailError(false);
                                    }}
                                    value={email}
                                />
                                {/* <TouchableOpacity
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => setShowPassword(!showPassword)}>
                                    <Image tintColor={showPassword ? 'red' : undefined} style={styles.eyeIcon} source={require('../assets/images/eye_icon.png')} />
                                </TouchableOpacity> */}
                            </View>
                            {emailError && (
                                <Text style={{ color: 'red', fontSize: wp('3.25%') }}>{emailErrorMessage}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor="#DADADA"
                                    style={Platform.OS === 'android' ? [styles.input, { bottom: hp('-0.4%') }] : styles.input}
                                    secureTextEntry={!showPassword}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setPasswordError(false);
                                    }}
                                    value={password}
                                />
                                <TouchableOpacity
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => setShowPassword(!showPassword)}>
                                    <Image tintColor={showPassword ? 'red' : undefined} style={styles.eyeIcon} source={require('../../assets/images/eye_icon.png')} />
                                </TouchableOpacity>
                            </View>
                            {passwordError && (
                                <Text style={{ color: 'red', fontSize: wp('3.25%') }}>{passwordErrorMessage}</Text>
                            )}
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen', {
                            type: 'reset'
                        })}>
                            <Text style={styles.forgotPwdText}>Forgot password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleLogin} style={styles.continueButton}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.continueButtonText}>Continue</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default GroLoginScreenThree;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp('6%'),
        paddingBottom: hp('7.5%'),
    },
    kapraLogo: {
        width: wp('47%'),
        height: hp('10%'),
        resizeMode: 'cover',
    },
    tagLine: {
        width: wp('50.7%'),
        height: hp('16.95%'),
        resizeMode: 'contain',
    },
    bottomContainer: {
        height: hp('40%'),
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3%'),
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: '#FFFFFF',
        bottom: hp('4%'),
    },
    headerText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp('4.65%'),
        color: '#000000',
        alignSelf: 'center',
        marginBottom: hp('3%'),
    },
    enterNumberText: {
        fontFamily: 'Poppins-Regular',
        fontSize: wp('3.72%'),
        color: '#616161',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp('5.36%'),
        borderRadius: wp('2.33%'),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: wp('4.18%'),
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        color: '#000',
        fontSize: wp('4.19%'),
    },
    inputContainer: {
        marginTop: hp('1.5%'),
    },
    eyeIcon: {
        width: wp('4.19%'),
        height: hp('1.29%'),
        resizeMode: 'contain',
    },
    forgotPwdText: {
        alignSelf: 'flex-end',
        marginTop: hp('0.5%'),
        color: '#F25000',
        fontFamily: 'Poppins-Medium',
        fontSize: wp('3.25%'),
        textDecorationLine: 'underline',
    },
    // continueButton: {
    //     backgroundColor: '#F25000',
    //     width: '100%',
    //     height: hp('6.11%'),
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    inputContainer: {
        marginTop: hp('1.5%')
    },
    eyeIcon: {
        width: wp('4.19%'),
        height: hp('1.29%'),
        resizeMode: 'contain'
    },
    forgotPwdText: {
        alignSelf: "flex-end",
        marginTop: hp('0.5%'),
        color: '#F25000',
        fontFamily: "Poppins-Medium",
        fontSize: wp('3.25%')
    },
    continueButton: {
        backgroundColor: '#F25000',
        width: '100%',
        height: hp('6.11%'),
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: wp('2.33%'),
        marginTop: hp('5%')
    },
    continueButtonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: wp('4.18%'),
        color: '#FFFFFF'
    }
})