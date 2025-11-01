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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {AppContext} from '../../Context/appContext';
import {changePincode} from '../api';
import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import {getFontontSize} from '../globals/GroFunctions';
import Toast from 'react-native-simple-toast';
import DelayInput from 'react-native-debounce-input';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PincodeChange = ({fun = () => {}, Width}) => {
  const searchInputRef = React.createRef();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [pincodes, setPincodes] = React.useState(null);
  const [pincodeLocal, setPincodeLocal] = React.useState(null);
  const [pinLocal, setPinLocal] = React.useState();
  const [pinScroll, setPinScroll] = React.useState(false);
  const {profile, editPincode} = React.useContext(AppContext);

  const [dummy, setDummy] = React.useState(false);

  const [loadStatus, setLoadStatus] = React.useState(false);

  const _changePincode = async text => {
    try {
      setLoadStatus(true);
      setPinLocal(text);
      setDummy(!dummy);
      if (text == '') {
        setPincodes({});
      } else {
        let pincodeResponse = await changePincode(text);
        setPincodes(pincodeResponse);
      }
      setLoadStatus(false);
      setPinScroll(true);
    } catch (err) {
      setPincodes({});
      setLoadStatus(false);
    }
  };

  const _setPincode = async () => {
    if (!pinScroll) {
      try {
        await editPincode(pincodeLocal);
        setPinLocal('');
        setModalVisible(false);
        fun();
      } catch (err) {}
    } else {
      Toast.show('Please select any location');
    }
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => {
          setModalVisible(true);
        }} 
        style={[styles.mainContainer,{width: Width ? windowWidth*(Width/100) : windowWidth*(90/100) }]}
      >
        <View>
          {showIcon('address', colours.kapraWhite, windowWidth * (5 / 100))}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.pincodeText1, {width: Width? windowWidth*((Width-15)/100):  windowWidth * (75 / 100)}]}>
          <Text style={styles.pincodeText2} >Delivery to </Text>
          {profile.pinAddress}
        </Text>
        <View>
          {showIcon('downArrow', colours.kapraWhite, windowWidth * (5 / 100))}
        </View>
        {/* <TouchableOpacity
          style={styles.pincodeChange}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.pincodeText1}>Change</Text>
        </TouchableOpacity> */}
      </TouchableOpacity>
      
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={[styles.centeredView]}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.fontStyle1}>
                Change Delivery Location
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setPinLocal('');
                  setPinScroll(false);
                }}
                style={{ marginLeft: '20%' }}
              >
                {showIcon('close', colours.lightGrey, windowWidth * (5 / 100))}
              </TouchableOpacity>
            </View>
            <View style={styles.changeBtnInnerCon}>
              {
                pincodeLocal ?(
                  <>
                    <Text style={[styles.fontStyle3,{paddingHorizontal: windowWidth*(5/100),}]}>Selected Delivery Location</Text>
                    <View  style={styles.changeBtnCon}>
                      <Text style={styles.fontStyle2}>{pincodeLocal?.place}</Text>
                      {
                        pincodeLocal?.place == profile?.pinAddress ?
                        <TouchableOpacity
                          style={[styles.buttonCon,{backgroundColor: colours.primaryGrey}]}
                          onPress={()=>Toast.show('To change, please choose another location.')}
                        >
                          <Text style={styles.fontStyle1}>Change</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                          style={styles. buttonCon}
                          onPress={_setPincode}>
                          <Text style={styles.fontStyle1}>Change</Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </>
                )
                :
                (
                  <View style={styles.changeBtnCon}>
                    <Text style={styles.fontStyle3}>Select your location from search list</Text>
                    <TouchableOpacity
                      style={[styles.buttonCon,{backgroundColor: colours.primaryGrey}]}
                      onPress={()=>Toast.show('Search for locations and pick from the list')}
                    >
                      <Text style={styles.fontStyle1}>Change</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>
            {
              pincodeLocal ? 
                <>
                  <Text/>
                  <Text style={styles.fontStyle2}>OR</Text>
                  <Text style={[styles.fontStyle3,{paddingHorizontal: windowWidth*(5/100), textAlign:'center', color: colours.primaryRed}]}>Search for a new Delivery Location to see product availability</Text>
                  <Text/>
                </>
              :
              <Text/>
            }
            <View
              style={styles.searchCon}>
              <DelayInput
                value={pinLocal}
                minLength={3}
                ref={searchInputRef}
                onChangeText={_changePincode}
                delayTimeout={500}
                style={styles.inputText}
                placeholder={'Search here..'}
                placeholderTextColor={colours.primaryGrey}
              />
            </View>

            {
              loadStatus ?
              <View style={styles.loaderCon}>
                <ActivityIndicator size="large" color={colours.kapraMain} />
              </View>
              :
              pincodes?.length > 0 && pinScroll && (
                <View style={styles.itemRowCon}>
                  <ScrollView
                  >
                    {pincodes.map((item, i) => (
                      <TouchableOpacity
                        style={styles.itemCon}
                        onPress={() => {
                          setPinLocal(``);
                          setDummy(!dummy)
                          setPincodeLocal(item);
                          setPinScroll(false);
                        }}>
                        <Text
                          key={i}
                          style={styles.fontStyle4}>
                          {item.place}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )
            }
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PincodeChange;
const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (90 / 100),
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: windowHeight * (6 / 100),
    alignItems: 'center',
  },
  pincodeText1: {
    color: colours.kapraWhite,
    fontSize: getFontontSize(14),
    fontFamily: 'Montserrat-SemiBold',
  },
  pincodeText2: {
    color: colours.kapraWhite,
    fontSize: getFontontSize(14),
    fontFamily: 'Lexend-Regular',
  },
  pincodeChange: {
    width: windowWidth * (25 / 100),
    height: windowHeight * (4 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colours.kapraMain
  },
  inputText: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    paddingLeft: windowWidth * (2 / 100),
    backgroundColor: colours.lowWhite,
    color: colours.primaryBlack,
    textAlignVertical: 'center',
    fontSize: getFontontSize(14),
    fontFamily: 'Montserrat-SemiBold',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 5,
  },
  centeredView: {
    backgroundColor: '#0009',
    flex: 1,
    alignItems: 'center',
  },
  modalView: {
    width: windowWidth,
    height: windowHeight * (90 / 100),
    marginTop: windowHeight * (10 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colours.kapraOrangeLight,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  changeBtnInnerCon:{
    width: windowWidth,
    height: windowHeight*(9/100),
    backgroundColor: colours.lowWhite,
    justifyContent:'center',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  changeBtnCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: windowWidth,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    height: windowHeight*(5/100),
    paddingHorizontal: windowWidth*(5/100),
    backgroundColor: colours.lowWhite,
  },
  buttonCon: {
    backgroundColor: colours.kapraMain,
    width: windowWidth * (20 / 100),
    height: windowHeight*(4/100),
    paddingVertical: 2,
    borderRadius:5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    width: windowWidth,
    height: windowHeight*(7/100),
  },
  loaderCon: {
    width: windowWidth,
    height: windowHeight*(40/100),
    justifyContent:'center',
    alignItems: 'center',
  },
  itemRowCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * (90 / 100),
  },
  itemCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: windowWidth * (90 / 100),
    height: windowHeight*(5/100),
    paddingHorizontal: windowWidth*(3/100),
    borderBottomWidth:0.5,
    borderBottomColor: colours.lowBlue,
  },

  fontStyle1: {
    color: colours.primaryWhite,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: getFontontSize(16),
  },
  fontStyle2: {
    fontFamily:'Montserrat-SemiBold',
    color: colours.primaryBlue,
    fontSize: getFontontSize(14),
  },
  fontStyle3: {
    fontFamily:'Montserrat-Regular',
    color: colours.primaryGrey,
    fontSize: getFontontSize(12),
  },
  fontStyle4: {
    fontFamily:'Montserrat-SemiBold',
    fontSize: getFontontSize(14),
    color: colours. primaryGrey,
  }
});
