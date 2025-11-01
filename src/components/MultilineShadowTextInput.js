import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Pressable } from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
export default function MultilineShadowTextInput({
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
  const [focusStatus, setFocusStatus] = React.useState(false);
  return (
    <View style={{height: Height*1.5,  alignItems:'flex-start',}}>
      {/* <View >
        <Text style={[styles.fontStyle1]}>
          {Placeholder}
        </Text>
      </View> */}
      <Pressable
        style={[styles.container,{height:Height, borderRadius:25, marginTop:Height/6,  width:windowWidth*(Width/100), backgroundColor: colours.primaryWhite }]}
        onPress={()=>setFocusStatus(!focusStatus)}
      > 
      {
        PhoneCode&&(
          <Text style={[styles.fontStyle1,{paddingLeft:10, color: colours.kapraLight}]}>+91</Text>
        )
      }
      {
        CurrencyCode&&(
          <Text style={[styles.fontStyle1,{paddingLeft:10}]}>₹</Text>
        )
      }
        <TextInput
          style={{ width: windowWidth * ((Width-6 )/ 100), color:colours.primaryBlack, fontFamily: 'Proxima Nova Alt Semibold', fontSize:getFontontSize(14), paddingHorizontal: '8%',}}
          onChangeText={OnChangeText}
          value={value}
          autoFocus={focusStatus}
          placeholderTextColor={colours.kapraLight}
          placeholder={Placeholder}
          maxLength={Length?Length:null}
          secureTextEntry={secureEntryStatus}
          multiline={true}
          numberOfLines={5}
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
                show ? colours.primaryColor : colours.primaryGrey,
                windowWidth * (5 / 100),
              )}
            </Text>
          </TouchableOpacity>
        )}
      </Pressable>
      {Error && (
        <Text style={[styles.error, {width: windowWidth * (Width / 105),textAlign:"right"}]}>{ErrorText ? ErrorText : 'Required'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor: colours.primaryWhite,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 7,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 14,
    shadowColor:  colours.kapraLight,
    borderColor: colours.kapraLow,
    marginVertical:5,
    paddingTop:5
  },
  error: {
    color: colours.primaryRed,
    marginTop: '1%',
    paddingLeft: '1%',
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12),
  },
  fontStyle1: {
    color: colours.primaryGrey,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12), 
  }
});
