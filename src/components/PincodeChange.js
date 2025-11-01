import React from 'react';
import {
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import { AppContext } from '../Context/appContext';
import { changePincode } from '../api';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PincodeChange = ({ fun = () => { } }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [pincodes, setPincodes] = React.useState({});
  const [pincodeLocal, setPincodeLocal] = React.useState();
  const [pinLocal, setPinLocal] = React.useState();
  const [pinScroll, setPinScroll] = React.useState(false);
  const { profile, editPincode } = React.useContext(AppContext);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const _changePincode = async (text) => {
    try {
      setPinLocal(text);
      let pincodeResponse = await changePincode(text);
      setPincodes(pincodeResponse);
      setPinScroll(true);
    } catch (err) {
      setPincodes({});
    }
  };

  const _setPincode = async () => {
    if (!pinScroll) {
      try {
        await editPincode(pincodeLocal);
        setModalVisible(false);
        fun();
      } catch (err) {
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          width: windowWidth*(60/100),
          height: windowHeight * (6 / 100),
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colours.kapraMain
        }}
        onPress={() => {
          setModalVisible(true);
        }}>
        <View>{showIcon('address', colours.primaryWhite, windowWidth * (5 / 100))}</View>
        <Text
          numberOfLines={1}
          style={styles.pincodeText1}>
          <Text style={styles.pincodeText2}>Delivery to </Text>{profile.pinAddress}
        </Text>
        <TouchableOpacity
          style={styles.pincodeChange}
          onPress={() => {
            setModalVisible(true);
          }}>
          {/* <Text style={[styles.pincode, { color: colours.primaryColor }]}>Change</Text> */}
          <Text>{showIcon('downArrow', colours.primaryWhite, windowWidth * (5 / 100))}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* <View style={styles.centeredView}> */}
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View
            style={[
              styles.centeredView,
              { paddingTop: windowWidth * (40 / 100) },
            ]}>
            <View style={styles.modalView}>
              <View
                style={{
                  alignItems: 'flex-end',
                  width: windowWidth * (75 / 100),
                  marginBottom: 15,
                  marginRight: '2%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: '20%',
                }}>
                <Text
                  style={{
                    marginLeft: -26,
                    fontFamily: 'Proxima Nova Alt Bold',
                    fontSize: getFontontSize(16),
                  }}>Change Area</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setPinScroll(false);
                  }}
                  style={{ marginLeft: '20%' }}>
                  <Text style={{ fontFamily: 'Proxima Nova Alt Bold', padding: 10 }}>X</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: windowWidth * (75 / 100),
                }}>
                <TextInput
                  style={{
                    width: windowWidth * (50 / 100),
                    paddingLeft: windowWidth * (2 / 100),
                    backgroundColor: colours.primaryWhite,
                    color: colours.primaryBlack,
                    textAlignVertical: 'center',
                    fontSize: getFontontSize(14),
                    fontFamily: 'Proxima Nova Alt Bold',
                    alignItems: 'center',
                    paddingVertical: 5,
                    borderWidth: 0.5,
                    borderRadius:5,
                    borderColor: colours.primaryGrey,
                  }}
                  placeholder={'Search here..'}
                  placeholderTextColor={colours.primaryGrey}
                  onChangeText={_changePincode}
                  value={pinLocal}
                  autoFocus={true}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: colours.kapraMain,
                    width: windowWidth * (20 / 100),
                    paddingVertical: 2,
                    borderRadius:5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={_setPincode}>
                  <Text style={{ fontFamily: 'Proxima Nova Alt Bold', color: colours.primaryWhite }}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
            {pincodes.length > 0 && pinScroll && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: windowWidth * (75 / 100),
                  marginTop: -30,
                }}>
                <ScrollView
                  contentContainerStyle={{
                    width: windowWidth * (50 / 100),
                    backgroundColor: colours.primaryWhite,
                    borderBottomLeftRadius:10,
                    borderBottomRightRadius:10,
                  }}>
                  {pincodes.map((item, i) => (
                    <TouchableOpacity
                      style={{ paddingVertical: 5 }}
                      onPress={() => {
                        setPinLocal(item.place);
                        setPincodeLocal(item);
                        setPinScroll(false);
                      }}>
                      <Text
                        key={i}
                        style={{
                          fontFamily: 'Proxima Nova Alt Bold',
                          fontSize: getFontontSize(14),
                          paddingLeft: '3%',
                        }}>
                        {item.place}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {pincodes.length == undefined && pinScroll && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: windowWidth * (75 / 100),
                  marginTop: -30,
                }}>
                <ScrollView
                  contentContainerStyle={{
                    width: windowWidth * (50 / 100),
                    backgroundColor: colours.primaryWhite,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Proxima Nova Alt Bold',
                      fontSize: getFontontSize(14),
                      paddingLeft: '3%',
                    }}>Delivery Not Available</Text>
                </ScrollView>
              </View>
            )}
          </View>
        </Modal>
      {/* </View> */}
    </>
  );
};

export default PincodeChange;
const styles = StyleSheet.create({
  pincode: {
    color: colours.primaryWhite,
    fontSize: getFontontSize(16),
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  pincodeChange: {
  },
  centeredView: {
    backgroundColor: '#0009',
    flex: 1,
    alignItems: 'center',
  },
  pincodeText1: {
    color: colours.primaryWhite,
    fontSize: getFontontSize(14),
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  pincodeText2: {
    color: colours.primaryWhite,
    fontSize: getFontontSize(14),
    fontFamily: 'Proxima Nova Alt Regular',
  },
  modalView: {
    backgroundColor: colours.primaryWhite,
    borderRadius:10,
    paddingBottom: 35,
    marginLeft: '10%',
    marginRight: '10%',
    alignItems: 'center',
  },
});
