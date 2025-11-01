import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text } from 'react-native';
import colours from '../globals/colours';

const windowWidth = Dimensions.get('window').width;
export default function ShadowTextInput({
  Width,
  Height,
  Placeholder,
  OnChangeText,
  Border,
  value,
  Error,
  top,
  ErrorText,
}) {
  return (
    <View>
      <TextInput
        style={[
          styles.textInput,
          { width: windowWidth * (Width / 100), height: Height, borderRadius: 20 },
          Border ? { borderWidth: 1 } : { borderWidth: 0 },
        ]}
        placeholderTextColor={colours.kapraLight}
        placeholder={Placeholder}
        onChangeText={OnChangeText}
        value={value}
        textAlignVertical={top ? 'top' : 'center'}
      />
      {Error && (
        <Text style={[styles.error,{ width: windowWidth * (Width / 105) }]}>{ErrorText ? ErrorText : 'Required'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: '5%',
    paddingHorizontal: '8%',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 7,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 14,
    color: colours.primaryBlack,
    shadowColor:  colours.kapraLight,
    borderColor: colours.kapraLow,
  },
  error: {
    color: colours.primaryRed,
    marginTop: '2%',
    paddingLeft: '2%',
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 11,
    textAlign:'right'
  },
});
