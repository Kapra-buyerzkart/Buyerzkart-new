import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Pressable } from 'react-native';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import { getFontontSize } from '../globals/GroFunctions';

const windowWidth = Dimensions.get('window').width;
export default function MultilineShadowTextInput({
  Width,
  Height,
  Placeholder,
  OnChangeText,
  value,
  Error,
  top,
  Length,
  ErrorText,
  KeyboardType,
  secureEntry,
  Title
}) {
  const [secureEntryStatus, setSecureEntryStatus] = React.useState(secureEntry ? true : false);
  const [show, setShow] = React.useState(false);
  const [focusStatus, setFocusStatus] = React.useState(false);
  return (
    <View style={{height: Height*1.5,  alignItems:'flex-start',}}>
      <View >
        <Text style={[styles.titleFont]}>
          {Title}
        </Text>
      </View>
      <Pressable
        style={[styles.container,{height:Height, borderRadius:5,  width:windowWidth*(Width/100), backgroundColor: colours.kapraWhiteLow }]}
        onPress={()=>setFocusStatus(!focusStatus)}
      > 
        <TextInput
          style={{ width: windowWidth * ((Width-18 )/ 100), marginLeft:10, color:colours.primaryBlack, fontFamily:'Lexend-Regular', fontSize: getFontontSize(14),paddingLeft:10,}}
          onChangeText={OnChangeText}
          value={value}
          autoFocus={focusStatus}
          placeholderTextColor={colours.kapraBlackLow}
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
                show ? colours.kapraMain : colours.primaryGrey,
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
    backgroundColor: colours.kapraWhiteLow,
    fontFamily: 'Lexend-SemiBold',
    fontSize: 14,
    marginVertical:5,
    paddingTop:5
  },
  error: {
    color: colours.primaryRed,
    marginTop: '1%',
    paddingLeft: '1%',
    fontFamily:'Lexend-Light',
    fontSize: getFontontSize(12),
  },
  fontStyle1: {
    color: colours.primaryGrey,
    fontFamily: 'Montserrat-Medium',
    fontSize: getFontontSize(12), 
  },
  titleFont: {
    color: colours.kapraBlackLow,
    fontFamily:'Lexend-Light',
    fontSize: getFontontSize(12),
    marginBottom:5
  },
});
