import React from 'react';
import { View, Text, StyleSheet, Dimensions , ImageBackground, Modal, Pressable, TouchableOpacity} from 'react-native';
import { BlurView } from '@react-native-community/blur';

import colours from '../../globals/colours';
import showIcon from '../../globals/icons';
import { getFontontSize } from '../globals/GroFunctions';
import AuthButton from './AuthButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AddressCard({ Data, OnEdit, OnDelete }) {
  
  const [deleteModal, setDeleteModal] = React.useState(false);

  return (
    <>
    {/* Address Con  */}
    <View style={[styles.mainContainer,]}>
      <View style={styles.iconContainer}>
        {showIcon(Data?.addLine3 == 'Work'? 'work' : Data?.addLine3 == 'Others'? 'others' :  'home1', colours.kapraBlackLow, windowWidth*(6/100))}
      </View>
      <View style={{width: windowWidth*(60/100), paddingVertical: windowHeight*(2/100)}}>
        <View style={{flexDirection:'row'}}>
          <Text style={[styles.fontStyle1,{paddingBottom:5}]}>{Data?.addLine3}</Text>
          {
            (Data?.isDefaultBillingAddress || Data?.isDefaultShippingAddress) && (
              <View style={{
                width: windowWidth*(6/100),
                height: windowWidth*(6/100),
              }}>{showIcon('rightTickRound', colours.primaryGreen, windowWidth*(4/100))}</View>
            )
          }
        </View>
        <Text style={styles.fontStyle2}>{Data?.firstName} {Data?.lastName}, {Data?.addLine1} {Data?.addLine2}, {Data?.district} {Data?.state} {Data?.country}</Text>
        <Text style={styles.fontStyle2}>{Data?.landmark}</Text>
        <Text style={[styles.fontStyle1,{fontSize: getFontontSize(13),paddingTop:10}]}>Phone Number: {Data?.phone}</Text>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={()=>setDeleteModal(true)}>
        {showIcon('menu1', colours.kapraBlackLow, windowWidth*(5/100))}
      </TouchableOpacity>
    </View>

    {/* Action Modal  */}
    <Modal
      animationType='fade'
      visible={deleteModal}
      transparent={true}
      onRequestClose={()=>setDeleteModal(false)}
    >

      <BlurView
        style={styles.blurStyle}
        blurType="light"
        blurAmount={1}
        overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
        reducedTransparencyFallbackColor='black'
      />
      <TouchableOpacity style={styles.modalCon}  onPress={()=>setDeleteModal(false)}>
        <Pressable style={styles.updateModalView}>
          <Text style={styles.fontStyle1}>Choose your action</Text>
          <Text/>
          <Text/>
          <View style={{flexDirection:'row', width:windowWidth*(73/100), justifyContent: 'space-around'}}>
              <AuthButton
                  FirstColor={colours.kapraRed}
                  SecondColor={colours.kapraOrangeDark}
                  OnPress={() =>{ setDeleteModal(false), OnDelete()} }
                  ButtonText={'DELETE ADDRESS'}
                  ButtonWidth={35}
                  ButtonHeight={4}
                  FSize={getFontontSize(10)}
              />
              <AuthButton
                  FirstColor={colours.kapraOrangeDark}
                  SecondColor={colours.kapraOrange}
                  OnPress={() => { setDeleteModal(false), OnEdit()}}
                  ButtonText={'EDIT ADDRESS'}
                  ButtonWidth={35}
                  ButtonHeight={4}
                  FSize={getFontontSize(10)}
              />
          </View>
        </Pressable> 
      </TouchableOpacity>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth*(90/100),
    alignItems: 'center',
    flexDirection:'row',
    borderBottomWidth: 3,
    borderBottomColor: colours.kapraWhiteLow,
    padding: windowWidth*(3/100),
    marginHorizontal: windowWidth*(5/100)
  },
  iconContainer: {
    width: windowWidth*(15/100),
    height: windowWidth*(15/100),
    borderRadius: windowWidth*(15/100),
    alignItems:'center',
    justifyContent:'center'
  },

  modalCon: {
    width:windowWidth, 
    height: windowHeight, 
    backgroundColor: 'rgba(177, 139, 117, 0.3)',
    alignItems: "center",
    justifyContent: "center",
  },
  updateModalView: {
    paddingVertical: windowHeight * (10 / 100),
    width: windowWidth*(80/100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: 'space-around'
  },
  blurStyle: {
      width: windowWidth,
      height: windowHeight,
      position:'absolute',
      alignItems:'center', 
      justifyContent:'center' ,
      backgroundColor: null,
      overflow: 'hidden'
  },

  fontStyle1: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(16),
    color: colours.kapraBlack,
  },
  fontStyle2: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(12),
    color: colours.kapraBlackLow,
  },

});
