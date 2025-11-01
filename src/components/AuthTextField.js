import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { AppContext } from '../Context/appContext';
import { getFontontSize } from '../globals/functions';
import { colors } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
export default function AuthTextField({
  Placeholder,
  BackgroundColor,
  SecureText,
  TextColor,
  Border,
  OnChangeText,
  Value,
  Error,
  ErrorText,
}) {
  const [show, setShow] = React.useState(false);
  const [secureEntry, setSecureEntry] = React.useState(SecureText);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 3,
          marginBottom:'1%',
          borderRadius: windowWidth * (14 / 100),
          width: windowWidth * (78 / 100),
          height: windowWidth * (14 / 100),
          marginTop: '5%',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colours.kapraLow,
        }}>
        <TextInput
          placeholder={Placeholder}
          style={[styles.textField]}
          placeholderTextColor={colours.kapraLight}
          secureTextEntry={secureEntry}
          onChangeText={OnChangeText}
          value={Value}/>

          {/* </TextInput> */}
        {SecureText && (
          <TouchableOpacity
            style={{ padding: 10, borderRadius: 5, marginRight: 5 }}
            onPress={() => {
              setSecureEntry(!secureEntry);
              setShow(!show);
            }}>
            <Text>
              {showIcon(
                'eye',
                show ? colours.primaryColor : colours.primaryGrey,
                20,
              )}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {Error && (
        <View style={{width: windowWidth * (75 / 100), alignItems:'flex-end'}}>
          <Text style={styles.error}>{ErrorText ? ErrorText : 'Required'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textField: {
    height: windowWidth * (13 / 100),
    borderRadius:  windowWidth * (14 / 100),
    paddingLeft: 20,
    color: colours.primaryBlack,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    width: windowWidth * (65 / 100),
  },
  error: {
    color: colours.primaryRed,
    // marginTop: '2%',
    paddingLeft: '2%',
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12),
  },
});
