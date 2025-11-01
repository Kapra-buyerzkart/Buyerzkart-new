import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import LinearGradient from 'react-native-linear-gradient';

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
  disabled
}) {
  return (
    <View>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{x: 0, y: 1 }}
        colors={[ FirstColor?FirstColor:colours.kapraMain, SecondColor?SecondColor:colours.kapraMain ]}
        style={[
          styles.buttonStyle,
          {  shadowColor:BackgroundColor, },
          { width: windowWidth * (ButtonWidth / 100) },
          { height: ButtonHeight ? windowHeight * (ButtonHeight / 100) : windowHeight * (6 / 100), },
          ,]}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={OnPress}
          style={{width: windowWidth * (ButtonWidth / 100) , height: ButtonHeight ? windowHeight * (ButtonHeight / 100) : windowHeight * (6 / 100), alignItems:'center', justifyContent:'center', flexDirection:'row'}}
        >
          <Text style={[styles.buttonText,{ color: FColor?FColor:colours.primaryWhite, fontSize:FSize?getFontontSize(FSize):getFontontSize(18)}]}>{ButtonText}</Text>
        </TouchableOpacity>
        
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 4.68,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Proxima Nova Alt Bold',
  },
});
