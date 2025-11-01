import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Dimensions, Modal, Image, TouchableOpacity, KeyboardAvoidingView, FlatList, PermissionsAndroid, Platform, TextInput, Switch, Share, ScrollView } from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import {postReferral, getReferral, getPolicies} from '../api';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import moment from 'moment';
import showIcon from '../globals/icons';
import Contacts from 'react-native-contacts';
import LoginTextInput from '../components/LoginTextInput';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ReferralScreen = ({navigation}) => {

    const { profile } = React.useContext(AppContext);

    const [phone, setPhone] = React.useState('');
    const [PhoneError, setPhoneError] = React.useState(false);
    const [PhoneErrorMessage, setPhoneErrorMessage] = React.useState('');

    const [ data, setData ] = React.useState(null);
    const [ shareModal, setShareModal ] = React.useState(false);
    const [ switchValue, setSwitchValue ] = React.useState('CUS');
    const [policy, setPolicy] = React.useState([]);
    const [ dummy, setDummy ] = React.useState(true);


    const toggleSwitch = (value) => {
      if(phone.length<5){
        if(!phone.includes(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))){
          setPhone([...phone, value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")])
          setDummy(!dummy)
        } else if(phone.includes(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))) {
          phone.splice(phone.indexOf(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")), 1);
          setDummy(!dummy)
        }
        setDummy(!dummy)
      } else{
        if(phone.includes(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))) {
          phone.splice(phone.indexOf(value.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")), 1);
          setDummy(!dummy)
        } else {
          Toast.show("Maximum 5 numbers can select at a time.")
        }
      }
    }

    const _getReferrals = async() => {
        try{
            let res = await getReferral();
            setData(res)
        } catch (err){
        }
    }

    let [contacts, setContacts] = useState([]);

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
  //         title: 'Contacts',
  //         message: 'This app would like to view your contacts.',
  //       }).then(() => {
  //         loadContacts();
  //       }
  //     );
  //   } else {
  //     loadContacts();
  //   }
  // }, []);

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
        message: `${policy&&policy.length>0&&policy.find((item)=>item.stName == 'referMsg').stValue}
        
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

  const addReferral = async() => {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(!phone.match(phoneno)){
    setPhoneError(true)
    } else{
    try {
        let res = await postReferral({
          referredNumber: phone,
          referralId: profile.bkCustId
        });
        Toast.show('New Referral Added Successfully')
        setShareModal(false)
        setPhone('');
        onShare();
    } catch(err){
        Toast.show(err)
        setPhone('');
        setShareModal(false)
    }
    }
  }



    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'My Referral'}
          WishList
          Cart
        />
        <View style={styles.addContainer}>
            <TouchableOpacity onPress={()=>setShareModal(true)}>
                <Text style={[styles.fontStyle3,{color: colours.primaryRed}]}>+ Add new referral</Text>
            </TouchableOpacity>
        </View>
        {/* <View style={styles.switchContainer}>
            <TouchableOpacity style={[styles.switchButton,{backgroundColor: switchValue === 'REF'? colours.primaryOrange:colours.primaryBlue}]} onPress={()=>setSwitchValue('REF')}>
                <Text style={styles.fontStyle4}>Referrals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.switchButton,{backgroundColor: switchValue === 'CUS'? colours.primaryBlue:colours.primaryBlue}]} onPress={()=>setSwitchValue('CUS')}>
                <Text style={styles.fontStyle4}>Customers</Text>
            </TouchableOpacity>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
            {
                // switchValue === 'REF'?
                // data && data.MyReference.length>0 ?
                //     <FlatList
                //       contentContainerStyle={{width: windowWidth*(90/100),borderWidth:1, marginTop:20, borderRadius:10}}
                //       data={data.MyReference}
                //       ListHeaderComponent={
                //         <View style={{flexDirection:'row', paddingVertical:10}}>
                //             <Text style={[styles.fontStyle4,{width: windowWidth*(45/100), textAlign:'center', color: colours.primaryBlue}]}>Referral Date</Text>
                //             <Text style={[styles.fontStyle4,{width: windowWidth*(45/100), textAlign:'center', color: colours.primaryBlue}]}>Mob Number</Text>
                //         </View>
                //       }
                //       renderItem={({ item }, i) => (
                //         <View style={{flexDirection:'row', borderTopWidth:1, paddingVertical:10}}>
                //             <Text style={[styles.fontStyle1,{width: windowWidth*(45/100), textAlign:'center', color: colours.primaryBlue}]}>{moment(item.referredDate).format('DD-MM-YYYY')}</Text>
                //             <Text style={[styles.fontStyle1,{width: windowWidth*(45/100), textAlign:'center', color: colours.primaryBlue}]}>{item.referredNumber}</Text>
                //         </View>
                //         )}
                //       keyExtractor={(item, i) => i.toString()}
                //     />
                // :
                // <View style={{width:windowWidth, height: windowHeight*(60/100), alignItems:'center', justifyContent:'center'}}>
                //   <View style={{height: windowHeight*(20/100)}}>{showIcon('bin', colours.primaryRed, windowWidth*(30/100))}</View>
                //   <Text style={[styles.fontStyle3,{color: colours.primaryRed}]}>Oh no! No referrals found.</Text>
                // </View>
                // :
                data && data.MyCustomer.length>0 ?
                    <FlatList
                      contentContainerStyle={{width: windowWidth*(90/100),borderWidth:1, marginTop:20, borderRadius:10, marginBottom: windowHeight*(20/100)}}
                      data={data.MyCustomer}
                      ListHeaderComponent={
                        <View style={{flexDirection:'row', paddingVertical:10}}>
                            <Text style={[styles.fontStyle4,{width: windowWidth*(30/100), textAlign:'center', color: colours.kapraMain}]}>Registered Date</Text>
                            <Text style={[styles.fontStyle4,{width: windowWidth*(30/100), textAlign:'center', color: colours.kapraMain}]}>Name</Text>
                            <Text style={[styles.fontStyle4,{width: windowWidth*(30/100), textAlign:'center', color: colours.kapraMain}]}>Phone</Text>
                        </View>
                      }
                      renderItem={({ item }, i) => (
                        <View style={{flexDirection:'row', borderTopWidth:1, paddingVertical:10}}>
                            <Text style={[styles.fontStyle1,{width: windowWidth*(30/100), textAlign:'center', color: colours.kapraMain}]}>{moment(item.actDate).format('DD-MM-YYYY')}</Text>
                            <Text style={[styles.fontStyle1,{width: windowWidth*(30/100), textAlign:'center', color: colours.kapraMain}]}>{item.custName}</Text>
                            <Text style={[styles.fontStyle1,{width: windowWidth*(30/100), textAlign:'center', color: colours.kapraMain}]}>{item.phoneNo}</Text>
                        </View>
                      )}
                    />
                :

                <View style={{width:windowWidth, height: windowHeight*(60/100), alignItems:'center', justifyContent:'center'}}>
                  <View style={{height: windowHeight*(20/100)}}>{showIcon('bin', colours.primaryRed, windowWidth*(30/100))}</View>
                  <Text style={[styles.fontStyle3,{color: colours.primaryRed, textAlign:'center'}]}>Oh no! No one has taken referral registration yet.</Text>
                </View>
            }

        </ScrollView>


      <Modal
        animationType="slide"
        visible={shareModal}
        transparent={true}
      >
      <KeyboardAvoidingView
        behavior="position"
        enabled
      >
        <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)', marginBottom:windowHeight*(2/100)}}>
          <View style={styles.updateModalView}>
            <Image
                source={require('../assets/logo/logo.png')}
                style={{
                    height: windowWidth * (15 / 100),
                    width: windowWidth * (80 / 100),
                    resizeMode: 'contain',
                }}
            />
            <Text style={styles.fontStyle2}>Refer a friend</Text>
              <Text style={[styles.fontStyle1,{color:colours.primaryBlack}]}>{policy&&policy.length>0&&policy.find((item)=>item.stName == 'referCardMsg').stValue}</Text>
              
              {/* <LoginTextInput
                OnChangeText={(text) => {
                  setPhone(text),
                  setPhoneError(false)
                }}
                Width={90}
                Placeholder={"Phone Number"}
                value={phone}
                Error={PhoneError}
                ErrorText={PhoneErrorMessage}
                PhoneCode
                Length={10}
                KeyboardType={'numeric'}
                Height={windowWidth * (14 / 100)}
              /> */}
              <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                  <AuthButton
                      FirstColor={colours.primaryRed}
                      SecondColor={colours.lightRed}
                      OnPress={() => { setShareModal(false) }}
                      ButtonText={'Cancel'}
                      ButtonWidth={40}
                  />
                  <AuthButton
                      BackgroundColor={colours.kapraMain}
                      // OnPress={() => addReferral()}
                      OnPress={() => onShare()}
                      ButtonText={'Refer Now'}
                      ButtonWidth={40}
                  />
              </View>
          </View> 
        </View>
        </KeyboardAvoidingView>
      </Modal>

        {/* <Modal
            animationType="slide"
            visible={shareModal}
            transparent={true}
        >
        <KeyboardAvoidingView
            behavior="position"
            enabled
        >
            <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)', marginBottom:windowHeight*(2/100)}}>
                <View style={styles.updateModalView}>
                    <Text style={styles.fontStyle2}>Refer a friend</Text>
                    <Text/>
                    <Text style={[styles.fontStyle1,{color:colours.primaryBlack}]}>Supply your connection's mobile number to invite</Text>
                    
                    <TextInput
                      onChangeText={search}
                      placeholder="Search Contacts..."
                      style={styles.searchBar}
                    />
                    <FlatList
                      data={contacts}
                      renderItem={(contact) => {
                        return (
                          <View style={{
                            width: windowWidth*(90/100),
                            height: windowHeight*(7/100),
                            flexDirection: 'row',
                            alignItems:'center',
                            borderBottomWidth:2,
                            borderBottomColor: colours.lowGrey
                          }}>
                            <View style={{
                              width: windowHeight*(6/100),
                              height: windowHeight*(6/100),
                              alignItems:'center',
                              justifyContent:'center'
                            }}>
                              {showIcon('profile', colours.primaryBlue, windowWidth*(8/100))}
                            </View>
                            <View style={{
                              height: windowHeight*(6/100),
                              width: windowWidth*(60/100),
                              justifyContent:'space-evenly',
                              alignItems: 'flex-start'

                            }}>
                              <Text style={[styles.fontStyle4,{color: colours.primaryBlue}]} numberOfLines={1}>
                              {contact?.item?.displayName?contact.item.displayName:contact.item.givenName} 
                              </Text>
                              <Text style={[styles.fontStyle2,{fontSize: getFontontSize(16)}]}>
                              {contact?.item?.phoneNumbers[0]?.number?contact?.item?.phoneNumbers[0]?.number:'Phone number not found!'}
                              </Text>
                            </View>
                            {
                              contact?.item?.phoneNumbers[0]?.number&&contact?.item?.phoneNumbers[0]?.number.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("").length==10&&(
                                <Switch
                                  trackColor={{false: colours.primaryGrey, true: colours.primaryBlue}}
                                  thumbColor={phone.includes(contact?.item?.phoneNumbers[0]?.number.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join("")) ? colours.primaryOrange : colours.lightBlue}
                                  ios_backgroundColor={colours.BuyersBlue}
                                  onValueChange={()=>toggleSwitch(contact?.item?.phoneNumbers[0]?.number)}
                                  value={phone.includes(contact?.item?.phoneNumbers[0]?.number.split(' ').join("").split('+91').join("").split('-').join("").split('(').join("").split(')').join(""))}
                                />
                              )
                            }
                          </View>
                        );
                      }}
                      keyExtractor={(item) => item.recordID}
                    />
                    
                    <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                        <AuthButton
                            FirstColor={colours.primaryRed}
                            SecondColor={colours.lightRed}
                            OnPress={() => { setShareModal(false) }}
                            ButtonText={'Cancel'}
                            ButtonWidth={40}
                        />
                        <AuthButton
                            FirstColor={colours.BuyersBlue}
                            SecondColor={colours.lightBlue}
                            OnPress={() => addReferral()}
                            ButtonText={'Refer Now'}
                            ButtonWidth={40}
                        />
                    </View>
                </View> 
            </View>
        </KeyboardAvoidingView>
        </Modal> */}
      </SafeAreaView>
    );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraLow,
    alignItems: 'center',
  },
  addContainer: {
    width: windowWidth*(90/100),
    height: windowHeight*(8/100),
    paddingTop: windowHeight*(1/100),
    alignItems: 'flex-end',
  },
  switchContainer: {
    width: windowWidth*(80/100),
    height: windowHeight*(7/100),
    backgroundColor: colours.kapraMain,
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'center'
  },
  switchButton: {
    width: windowWidth*(40/100),
    height: windowHeight*(7/100),
    backgroundColor: colours.kapraMain,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center'
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(20),
    color: colours.kapraMain,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(18),
    color: colours.primaryWhite,
    textAlign: 'center',
  },
  updateModalView: {
      height: windowHeight * (50 / 100),
      marginTop: windowHeight * (50 / 100),
      paddingTop: windowHeight * (5 / 100),
      paddingBottom: windowHeight * (2 / 100),
      paddingHorizontal: windowWidth*(5/100),
      backgroundColor: colours.kapraLow,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      elevation: 10,
      alignItems: "center",
      justifyContent:'space-between'
  },
  searchBar: {
    marginVertical:20,
    width: windowWidth*(90/100),
    height: windowHeight*(6/100),
    backgroundColor: colours.primaryWhite,
    borderRadius:10,
    paddingHorizontal:20,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(16),
  },
});
