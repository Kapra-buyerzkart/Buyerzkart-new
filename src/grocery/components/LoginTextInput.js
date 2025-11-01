import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function LoginTextInput({
  Width,
  Height,
  Title,
  PhoneCode,
  Placeholder,
  OnChangeText,
  value,
  Error,
  top,
  Length,
  ErrorText,
  KeyboardType,
  secureEntry,
  CurrencyCode,
}) {
  const [secureEntryStatus, setSecureEntryStatus] = React.useState(secureEntry ? true : false);
  const [show, setShow] = React.useState(false);
  return (
    <View style={{height: Height?windowHeight*(Height/100):windowHeight*(10/100), width : Width?windowWidth*(Width/100): windowWidth*(90/100)}}>
      {
        Title&&(
          <Text style={[styles.titleFont]}>
            {Title}
          </Text>
        )
      }

      <View
        style={[styles.container,{height: Height?windowHeight*((Height)/200):windowHeight*(10/100),  width:Width?windowWidth*(Width/100): windowWidth*(90/100) }]}
      > 
        {
          PhoneCode&&(
            <Text style={[styles.fontStyle1,{paddingLeft:20, color: colours.kapraBlackLight}]}>+91</Text>
          )
        }
        {
          CurrencyCode&&(
            <Text style={[styles.fontStyle1,{paddingLeft:10}]}>₹</Text>
          )
        }
        <TextInput
          style={{ width: windowWidth * ((Width-18 )/ 100), marginLeft:10, color:colours.primaryBlack, fontFamily:'Lexend-Regular', fontSize: getFontontSize(14),paddingLeft:10,}}
          onChangeText={OnChangeText}
          value={value}
          placeholder={Placeholder}
          placeholderTextColor={colours.kapraBlackLow}
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
                show ? colours.kapraOrange : colours.lightGrey,
                windowWidth * (5 / 100),
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
    backgroundColor: colours.kapraWhiteLow, 
    borderRadius:5,
    marginBottom:5
  },
  error: {
    color: colours.primaryRed,
    marginTop: '1%',
    paddingLeft: '1%',
    fontFamily:'Lexend-Light',
    fontSize: getFontontSize(12),
  },
  
  titleFont: {
    color: colours.kapraBlackLow,
    fontFamily:'Lexend-Light',
    fontSize: getFontontSize(12),
    marginBottom:5
  },
  fontStyle1: {
    color: colours.kapraOrange,
    fontFamily:'Lexend-SemiBold',
    fontSize: getFontontSize(14),
  }
});
