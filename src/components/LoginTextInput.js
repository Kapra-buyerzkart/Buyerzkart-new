import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import showIcon from '../globals/icons';

const windowWidth = Dimensions.get('window').width;
export default function LoginTextInput({
  Width,
  Height,
  Placeholder,
  OnChangeText,
  Border,
  value,
  Error,
  top,
  Length,
  ErrorText,
  KeyboardType,
  secureEntry,
  PhoneCode,
  CurrencyCode,
  ShowValuePlaceHolder
}) {
  const [secureEntryStatus, setSecureEntryStatus] = React.useState(secureEntry ? true : false);
  const [show, setShow] = React.useState(false);
  return (
    <View style={{height: Height*1.5,  alignItems:'flex-start', justifyContent:'flex-end',}}>
      {/* <View style={{marginLeft: windowWidth*(5/100)}}>
        <Text style={[styles.fontStyle1]}>
          {Placeholder}
        </Text>
      </View> */}
      <View
        style={[styles.container,{height:Height*0.9, borderRadius:20, marginTop:Height/6,  width:windowWidth*(Width/100) }]}
      > 
      {
        PhoneCode&&(
          <Text style={[styles.fontStyle1,{paddingLeft:20, color: colours.primaryBlack}]}>+91</Text>
        )
      }
      {
        CurrencyCode&&(
          <Text style={[styles.fontStyle1,{paddingLeft:10}]}>₹</Text>
        )
      }
        <TextInput
          style={{ width: windowWidth * ((Width-18 )/ 100), marginLeft:10, color:colours.primaryBlack, fontFamily: 'Proxima Nova Alt Semibold', fontSize: getFontontSize(16),paddingLeft:10,}}
          onChangeText={OnChangeText}
          value={value}
          placeholder={Placeholder}
          placeholderTextColor={colours.lightGrey}
          maxLength={Length?Length:null}
          secureTextEntry={secureEntryStatus}
          textAlignVertical={top ? 'top' : 'center'}
          keyboardType={KeyboardType?KeyboardType:'default'}
        />
        {secureEntry && (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              setSecureEntryStatus(!secureEntryStatus);
              setShow(!show);
            }}>
            <Text>
              {showIcon(
                'eye',
                show ? colours.kapraLow : colours.lightGrey,
                windowWidth * (7 / 100),
              )}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {Error? (
        <Text style={[styles.error, {width: windowWidth * (Width / 105),textAlign:"right"}]}>{ErrorText ? ErrorText : '*Required'}</Text>
      )
      :
      <Text style={[styles.error, {width: windowWidth * (Width / 105),textAlign:"right"}]}></Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    alignItems:'center', 
    backgroundColor: colours.primaryWhite,
    marginBottom:5
  },
  error: {
    color: colours.primaryRed,
    marginTop: '1%',
    paddingLeft: '1%',
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  },
  fontStyle1: {
    color: colours.kapraLight,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
  }
});
