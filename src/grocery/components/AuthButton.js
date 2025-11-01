import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AuthButton({
  BackgroundColor,
  OnPress,
  ButtonText,
  ButtonWidth,
  ButtonHeight,
  FirstColor,
  SecondColor,
  FSize,
  FColor,
  disabled,
  Font2,
}) {
  const width = windowWidth * (ButtonWidth / 100);
  const height = ButtonHeight
    ? windowHeight * (ButtonHeight / 100)
    : windowHeight * 0.06;

  return (
    <View
      style={{
        borderRadius: 10,
        overflow: 'visible', // ✅ important for SDK 35
        elevation: Platform.OS === 'android' ? 2 : 0,
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[
          FirstColor ? FirstColor : colours.kapraMain,
          SecondColor ? SecondColor : colours.kapraMain,
        ]}
        style={[
          styles.buttonStyle,
          {
            width,
            height,
            borderRadius: 10,
            backgroundColor: BackgroundColor || 'transparent',
            shadowColor: BackgroundColor || '#000',
          },
        ]}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={OnPress}
          activeOpacity={0.8}
          style={{
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            overflow: 'visible', // ✅ ensures visibility on Android 15
          }}
        >
          <Text
            style={[
              Font2 ? styles.buttonText : styles.buttonText1,
              {
                color: FColor || colours.primaryWhite,
                fontSize: FSize ? getFontontSize(FSize) : getFontontSize(18),
              },
            ]}
          >
            {ButtonText}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontFamily: 'Montserrat-BoldItalic',
  },
  buttonText1: {
    fontFamily: 'Lexend-SemiBold',
  },
});
