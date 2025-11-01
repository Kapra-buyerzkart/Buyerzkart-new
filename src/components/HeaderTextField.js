import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import { getImage, getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
import colours from '../globals/colours';
import showIcon from '../globals/icons';
export default function HeaderTextField({
  HeaderText,
  OnChangeText,
  SecureEntry,
  Error,
  value,
  errtxt,
  Password,
}) {
  const [secureEntry, setSecureEntry] = React.useState(Password ? true : false);
  const [show, setShow] = React.useState(false);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.upperContainer}>
        <Text style={styles.fontStyle1}>{HeaderText}</Text>
      </View>
      <View style={styles.textInput}>
        <TextInput
          style={
            Password
              ? {
                width: windowWidth * (70 / 100),
                height: windowWidth * (11.5 / 100),
                color: colours.kapraLight,
                fontFamily:'Proxima Nova Alt Bold',
              }
              : {
                width: windowWidth * (80 / 100),
                height: windowWidth * (11.5 / 100),
                color: colours.kapraLight,
                fontFamily:'Proxima Nova Alt Bold',
              }
          }
          onChangeText={OnChangeText}
          secureTextEntry={secureEntry}
          value={value}
        // caretHidden={true}
        />
        {Password && (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              setSecureEntry(!secureEntry);
              setShow(!show);
            }}>
            <Text>
              {showIcon(
                'eye',
                show ? colours.kapraMain : colours.primaryGrey,
                20,
              )}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {Error && <Text style={styles.error}>{errtxt}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth,
    alignItems: 'center',
    paddingBottom: '5%',
  },
  upperContainer: {
    width: windowWidth * (88 / 100),
    alignItems: 'flex-start',
    paddingBottom: '2%',
  },
  textInput: {
    width: windowWidth * (88 / 100),
    borderRadius:  20,
    backgroundColor: colours.kapraLow,
    height: windowWidth * (11.5 / 100),
    fontFamily:'Proxima Nova Alt Bold',
    fontSize: getFontontSize(10),
    paddingLeft: windowWidth * (6 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontStyle1: {
    fontFamily:'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.kapraLight,
  },
  error: {
    width: windowWidth * (84 / 100),
    color: colours.primaryRed,
    marginTop: '2%',
    fontFamily:'Proxima Nova Alt Bold',
    fontSize: getFontontSize(10),
  },
});
