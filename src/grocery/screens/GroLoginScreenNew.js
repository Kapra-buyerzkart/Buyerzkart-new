import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { checkPhone, sendLoginOtp } from '../api'   // ✅ both APIs

const GroLoginScreenNew = () => {
    const navigation = useNavigation()
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        if (phone.length !== 10) {
            Alert.alert('Error', 'Please enter a valid mobile number');
            return;
        }

        try {
            setLoading(true);

            // Step 1: Check if phone exists
            const response = await checkPhone(phone);
            // console.log('CheckPhone Response:', response);

            if (response?.success && response?.status === 'EXISTS_ACTIVE') {
                // Step 2: Phone exists → send login OTP
                const otpResponse = await sendLoginOtp(phone);
                // console.log('sendLoginOtp Response:', otpResponse);

                if (otpResponse?.success) {
                    navigation.navigate('GroLoginOtpScreen', {
                        phone,
                        // type: 'login'
                    });
                    // console.log("navigate to otp screen")
                } else {
                    Alert.alert('Error', otpResponse?.message || 'Failed to send OTP');
                }
            } else if (response?.status === 'NOT_EXISTS') {
                // Step 3: Phone not registered → go to Registration
                navigation.navigate('GroRegisterNewScreen');
                // console.log("navigate to reg screen")
            } else {
                Alert.alert('Error', response?.message || 'Failed to verify phone');
            }
        } catch (error) {
            console.log('Error:', error);
            Alert.alert('Error', error?.Message || error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/login_background_image.jpg')}>
                        <Image style={styles.kapraLogo} source={require('../../assets/images/kapra_logo.png')} />
                        <Image style={styles.tagLine} source={require('../../assets/images/login_content.png')} />
                    </ImageBackground>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login</Text>
                        <Text style={styles.enterNumberText}>Enter your mobile number</Text>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.countryCode}>+91</Text>
                            <View style={styles.divider} />
                            <TextInput
                                placeholder="9999999999"
                                placeholderTextColor="#c1c1c1"
                                keyboardType="number-pad"
                                style={Platform.OS === 'android' ? [styles.input, { bottom: hp('-0.4%') }] : styles.input}
                                onChangeText={setPhone}
                            />
                        </View>
                        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
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
    )
}

export default GroLoginScreenNew

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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
    countryCode: {
        fontSize: wp('4.19%'),
        color: '#000000',
        marginRight: 12,
    },
    divider: {
        width: 1,
        height: hp('4%'),
        backgroundColor: '#E5E5E5',
        marginRight: wp('4%')
    },
    input: {
        flex: 1,
        color: '#000',
        fontSize: wp('4.19%'),
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp('6%'),
        paddingBottom: hp('7.5%')
    },
    kapraLogo: {
        width: wp('47%'),
        height: hp('10%'),
        resizeMode: 'cover'
    },
    tagLine: {
        width: wp('50.7%'),
        height: hp('16.95%'),
        resizeMode: 'contain',
    },
    bottomContainer: {
        height: hp('30.33%'),
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3%'),
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: '#FFFFFF',
        bottom: hp('4%')
    },
    headerText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp('4.65%'),
        color: '#000000',
        alignSelf: 'center',
        marginBottom: hp('3%')
    },
    enterNumberText: {
        fontFamily: 'Poppins-Regular',
        fontSize: wp('3.72%'),
        color: '#616161',
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
