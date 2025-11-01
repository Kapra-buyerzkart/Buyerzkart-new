import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, Modal, Image, TouchableOpacity, KeyboardAvoidingView, FlatList, PermissionsAndroid, Platform, TextInput, Switch, Share, ScrollView } from 'react-native';
import Header from '../components/Header';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';
import AuthButton from '../components/AuthButton';
import { postReferral, getReferral, getPolicies } from '../api';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../../Context/appContext';
import moment from 'moment';
import showIcon from '../../globals/icons';
import Contacts from 'react-native-contacts';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const GroReferralScreen = ({ navigation }) => {

  const { profile } = React.useContext(AppContext);

  const [phone, setPhone] = React.useState('');
  const [PhoneError, setPhoneError] = React.useState(false);
  const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');

  const [data, setData] = React.useState(null);
  const [shareModal, setShareModal] = React.useState(false);
  const [switchValue, setSwitchValue] = React.useState('CUS');
  const [policy, setPolicy] = React.useState([]);
  const [dummy, setDummy] = React.useState(true);


  const toggleSwitch = (value) => {
    if (phone.length < 5) {
      if (!phone.includes(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))) {
        setPhone([...phone, value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")])
        setDummy(!dummy)
      } else if (phone.includes(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))) {
        phone.splice(phone.indexOf(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")), 1);
        setDummy(!dummy)
      }
      setDummy(!dummy)
    } else {
      if (phone.includes(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))) {
        phone.splice(phone.indexOf(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")), 1);
        setDummy(!dummy)
      } else {
        Toast.show("Maximum 5 numbers can select at a time.")
      }
    }
  }

  const _getReferrals = async () => {
    try {
      let res = await getReferral();
      setData(res)
    } catch (err) {
    }
  }

  let [contacts, setContacts] = useState([]);

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        contacts.sort(
          (a, b) =>
            a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      })
      .catch(e => {
        // alert('Permission to access contacts was denied');
      });
  };

  const search = (text) => {
    const phoneNumberRegex =
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(contacts => {
        contacts.sort(
          (a, b) =>
            a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text).then(contacts => {
        contacts.sort(
          (a, b) =>
            a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    }
  };

  React.useEffect(() => {
    _getReferrals();
    const effect = async () => {
      let res = await getPolicies();
      setPolicy(res);
    };
    effect();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Share & Earn',
        message: `${policy && policy.length > 0 && policy.find((item) => item.stName == 'referMsg').stValue}
        
        https://kapradaily.com/refer/regrefer?custrefcd=${profile.referralCode}`


      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
      setShareModal(false)
    } catch (error) {
      // Alert(error.message);
      setShareModal(false)
    }
  };

  const addReferral = async () => {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phone.match(phoneno)) {
      setPhoneError(true)
    } else {
      try {
        let res = await postReferral({
          referredNumber: phone,
          referralId: profile.groceryCustId
        });
        Toast.show('New Referral Added Successfully')
        setShareModal(false)
        setPhone('');
        onShare();
      } catch (err) {
        Toast.show(err)
        setPhone('');
        setShareModal(false)
      }
    }
  }



  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={() => navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth * (5 / 100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>My Referral</Text>
      </View>


      {/* Add new con  */}
      <TouchableOpacity style={styles.addNewCon} onPress={() => setShareModal(true)}>
        <Text style={[styles.headerText, { color: colours.primaryGreen }]}>+ Add new referral</Text>
        <View style={[styles.smallIconCon, { backgroundColor: colours.kapraWhite }]}>
          {showIcon('right3', colours.kapraBlackLow, windowWidth * (5 / 100))}
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ width: windowWidth, alignItems: 'center' }}>
        {
          switchValue == 'REF' ?
            data && data.MyReference.length > 0 ?
              <FlatList
                contentContainerStyle={{ width: windowWidth * (90 / 100), borderWidth: 1, marginTop: 20, borderRadius: 10, marginBottom: windowHeight * (20 / 100) }}
                data={data.MyReference}
                ListHeaderComponent={
                  <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <Text style={[styles.fontStyle4, { width: windowWidth * (45 / 100), textAlign: 'center', color: colours.kapraMain }]}>Referral Date</Text>
                    <Text style={[styles.fontStyle4, { width: windowWidth * (45 / 100), textAlign: 'center', color: colours.kapraMain }]}>Mob Number</Text>
                  </View>
                }
                renderItem={({ item }, i) => (
                  <View style={{ flexDirection: 'row', borderTopWidth: 1, paddingVertical: 10 }}>
                    <Text style={[styles.fontStyle1, { width: windowWidth * (45 / 100), textAlign: 'center', color: colours.kapraMain }]}>{moment(item.referredDate).format('DD-MM-YYYY')}</Text>
                    <Text style={[styles.fontStyle1, { width: windowWidth * (45 / 100), textAlign: 'center', color: colours.kapraMain }]}>{item.referredNumber}</Text>
                  </View>
                )}
                keyExtractor={(item, i) => i.toString()}
              />
              :
              <View style={{ width: windowWidth, height: windowHeight * (60 / 100), alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ height: windowHeight * (20 / 100) }}>{showIcon('bin', colours.primaryRed, windowWidth * (30 / 100))}</View>
                <Text style={[styles.fontStyle3, { color: colours.primaryRed }]}>Oh no! No referrals found.</Text>
              </View>
            :
            data && data.MyCustomer.length > 0 ?
              <FlatList
                contentContainerStyle={styles.tableCon1}
                data={data.MyCustomer}
                ListHeaderComponent={
                  <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <Text style={[styles.fontStyle4, { width: windowWidth * (30 / 100), textAlign: 'center', color: colours.kapraMain }]}>Registered Date</Text>
                    <Text style={[styles.fontStyle4, { width: windowWidth * (30 / 100), textAlign: 'center', color: colours.kapraMain }]}>Name</Text>
                    <Text style={[styles.fontStyle4, { width: windowWidth * (30 / 100), textAlign: 'center', color: colours.kapraMain }]}>Phone</Text>
                  </View>
                }
                renderItem={({ item }, i) => (
                  <View style={{ flexDirection: 'row', borderTopColor: colours.kapraWhiteLow, borderTopWidth: 1, paddingVertical: 10 }}>
                    <Text style={[styles.fontStyle1, { width: windowWidth * (30 / 100), textAlign: 'center', color: colours.kapraMain }]}>{moment(item.actDate).format('DD-MM-YYYY')}</Text>
                    <Text style={[styles.fontStyle1, { width: windowWidth * (30 / 100), textAlign: 'center', color: colours.kapraMain }]}>{item.custName}</Text>
                    <Text style={[styles.fontStyle1, { width: windowWidth * (30 / 100), textAlign: 'center', color: colours.kapraMain }]}>{item.phoneNo}</Text>
                  </View>
                )}
              />
              :

              <View style={{ width: windowWidth, height: windowHeight * (60 / 100), alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ height: windowHeight * (20 / 100) }}>{showIcon('bin', colours.primaryRed, windowWidth * (30 / 100))}</View>
                <Text style={[styles.fontStyle3, { color: colours.primaryRed, textAlign: 'center' }]}>Oh no! No one has taken referral registration yet.</Text>
              </View>
        }
      </ScrollView>


      {/* <Modal
          animationType="slide"
          visible={shareModal}
          transparent={true}
        >
          <KeyboardAvoidingView behavior="position" enabled>
            <View style={styles.modalCon}>
              <View style={styles.updateModalView}>
                <Image
                    source={require('../../assets/logo/logo.png')}
                    style={styles.modalConImg}
                />
                <Text style={styles.fontStyle2}>Refer a friend</Text>
                  <Text style={[styles.fontStyle1,{color:colours.primaryBlack}]}>{policy&&policy.length>0&&policy.find((item)=>item.stName == 'referCardMsg').stValue}</Text>
                  <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-between'}}>
                      <AuthButton
                          FirstColor={colours.primaryRed}
                          SecondColor={colours.lightRed}
                          OnPress={() => { setShareModal(false) }}
                          ButtonText={'Cancel'}
                          ButtonWidth={44}
                          ButtonHeight={4}
                      />
                      <AuthButton
                          FirstColor={colours.kapraOrangeDark}
                          SecondColor={colours.kapraOrange}
                          BackgroundColor={colours.kapraMain}
                          OnPress={() => onShare()}
                          ButtonText={'Refer Now'}
                          ButtonWidth={44}
                          ButtonHeight={4}
                      />
                  </View>
              </View> 
            </View>
          </KeyboardAvoidingView>
        </Modal> */}
      <Modal
        animationType="slide"
        visible={shareModal}
        transparent={true}
      >
        <KeyboardAvoidingView behavior="position" enabled>
          <View style={[styles.modalCon, { overflow: 'visible' }]}>
            <View style={[styles.updateModalView, { zIndex: 1000, elevation: 5 }]}>
              <Image
                source={require('../../assets/logo/logo.png')}
                style={styles.modalConImg}
              />

              <Text style={styles.fontStyle2}>Refer a friend</Text>

              <Text
                style={[
                  styles.fontStyle1,
                  { color: colours.primaryBlack, textAlign: 'center' },
                ]}
              >
                {policy &&
                  policy.length > 0 &&
                  policy.find((item) => item.stName === 'referCardMsg')?.stValue}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidth * 0.9,
                  justifyContent: 'space-between',
                  overflow: 'visible', // ✅ prevents clipping on Android 15
                  marginBottom: windowHeight * 0.03, // ✅ ensures visible bottom area
                }}
              >
                <AuthButton
                  FirstColor={colours.primaryRed}
                  SecondColor={colours.lightRed}
                  OnPress={() => setShareModal(false)}
                  ButtonText="Cancel"
                  ButtonWidth={44}
                  ButtonHeight={4}
                />
                <AuthButton
                  FirstColor={colours.kapraOrangeDark}
                  SecondColor={colours.kapraOrange}
                  BackgroundColor={colours.kapraMain}
                  OnPress={() => onShare()}
                  ButtonText="Refer Now"
                  ButtonWidth={44}
                  ButtonHeight={4}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

export default GroReferralScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.kapraWhite,
    flex: 1,
    alignItems: 'center',
  },
  headerCon: {
    width: windowWidth,
    height: windowHeight * (8 / 100),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: windowWidth * (5 / 100)
  },
  backButtonCon: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (10 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  addNewCon: {
    width: windowWidth * (85 / 100),
    height: windowHeight * (8 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colours.kapraWhiteLow
  },
  tableCon1: {
    width: windowWidth * (90 / 100),
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
    marginTop: 20,
    borderRadius: 5,
    marginBottom: windowHeight * (20 / 100)
  },
  // modalCon: {
  //   width: windowWidth,
  //   height: windowHeight,
  //   backgroundColor: 'rgba(247, 146, 69, 0.1)',
  //   marginBottom: windowHeight * (2 / 100)
  // },
  modalCon: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(247, 146, 69, 0.1)',
    justifyContent: 'flex-end',   // ✅ ensures modal aligns correctly from bottom
    overflow: 'visible',          // ✅ prevents cut-off
  },
  modalConImg: {
    height: windowWidth * (15 / 100),
    width: windowWidth * (80 / 100),
    resizeMode: 'contain',
  },
  // updateModalView: {
  //   height: windowHeight * (50 / 100),
  //   marginTop: windowHeight * (50 / 100),
  //   paddingTop: windowHeight * (5 / 100),
  //   paddingBottom: windowHeight * (2 / 100),
  //   paddingHorizontal: windowWidth * (5 / 100),
  //   backgroundColor: colours.kapraWhiteLow,
  //   borderTopRightRadius: 40,
  //   borderTopLeftRadius: 40,
  //   elevation: 10,
  //   alignItems: "center",
  //   justifyContent: 'space-between'
  // },

  updateModalView: {
    height: windowHeight * 0.5,
    paddingVertical: windowHeight * 0.03,
    paddingHorizontal: windowWidth * 0.05,
    backgroundColor: colours.kapraWhiteLow,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,                 // ✅ lower elevation (10 may cause clipping)
    zIndex: 1000,                 // ✅ ensures on top of blur or background
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Font style
  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle1: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(13),
    color: colours.primaryWhite
  },
  fontStyle2: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
  },
  fontStyle3: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(20),
    color: colours.kapraMain,
  },
  fontStyle4: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(15),
    color: colours.primaryWhite,
    textAlign: 'center',
  },


});
