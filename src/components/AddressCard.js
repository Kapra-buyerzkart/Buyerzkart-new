import React from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Dimensions , ImageBackground, Modal} from 'react-native';
import { AppContext } from '../Context/appContext';
import colours from '../globals/colours';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import showIcon from '../globals/icons';
import { getFontontSize } from '../globals/functions';
import AuthButton from './AuthButton';
import * as Animatable from 'react-native-animatable';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function AddressCard({ Data, OnEdit, OnDelete }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: Data?.latitude ? parseFloat(Data?.latitude) : 10.0224066,
    longitude: Data?.longitude ? parseFloat(Data?.longitude) : 76.3041375, 
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005
  });

  return (
    <TouchableOpacity onPress={()=>setDeleteModal(true)} style={[styles.mainContainer,{borderColor: Data.isDefaultBillingAddress || Data.isDefaultShippingAddress ? colours.kapraLow : colours. lowWhite}]}>
      {
        (Data.isDefaultBillingAddress || Data.isDefaultShippingAddress) && (
            <ImageBackground source={require('../assets/images/requestBadge.png')}  style={styles.reqImgContainer} imageStyle={styles.reqImg}>
                <Animatable.Text animation="zoomIn" iterationCount="infinite" direction="alternate" style={styles.fontStyle3}>{Data.isDefaultBillingAddress && Data.isDefaultShippingAddress ? 'Ship/Bill': Data.isDefaultBillingAddress?'Billing':Data.isDefaultShippingAddress ?'Shipping':'Default'}</Animatable.Text>
                {/* <Text>{JobStatus}</Text> */}
            </ImageBackground>
        )
      }
      <View style={{flexDirection:'row', width:windowWidth*(84/100)}}>
        <View style={{width: windowWidth*(12/100), height: windowWidth*(12/100), borderWidth:3, borderColor:(Data.isDefaultBillingAddress || Data.isDefaultShippingAddress)? colours.kapraLow: colours.lightGrey, borderRadius: windowWidth*(6/100), alignItems: 'center', justifyContent:'center'}}>
          {showIcon('home', (Data.isDefaultBillingAddress || Data.isDefaultShippingAddress)? colours.kapraLow: colours.lightGrey, windowWidth*(8/100))}
        </View>
        <View style={{ height: windowWidth*(12/100), borderRadius: windowWidth*(10/100), justifyContent:'center', paddingLeft: windowWidth*(3/100)}}>
          <Text style={styles.fontStyle1}>{Data.firstName} {Data.lastName}</Text>
        </View>
      </View>
      <View style={{flexDirection:'row', width:windowWidth*(84/100)}}>
        <View style={{ width: windowWidth*(62/100), marginTop: 10}}>
          <Text style={styles.fontStyle2}>{Data.addLine1} {Data.addLine2}</Text>
          <Text style={styles.fontStyle2}>{Data.district} {Data.state} {Data.country}</Text>
          <Text style={styles.fontStyle2}>{Data.landmark}</Text>
          <Text style={styles.fontStyle2}>{Data.phone}</Text>

        </View>
        <View style={{ height: windowWidth * (20 / 100), width: windowWidth * (20 / 100), borderRadius: windowWidth*(10/100), overflow: 'hidden'}}>
          <MapView
            style={{ height: windowWidth * (20 / 100), width: windowWidth * (20 / 100), borderRadius: windowWidth*(10/100), }}
            region={region}
            mapType='satellite'
            legalLabelInsets
            mapPadding={{
              top: windowHeight*(6/100),
              right: 0,
              bottom: windowHeight*(3.5/100),
              left: 0
             }}
          >
            <Marker
              coordinate={{
                "latitude": region.latitude,
                "longitude": region.longitude
              }}
              opacity={0.7}
            />
          </MapView>
        </View>
      </View>
      <Modal
        animationType='fade'
        visible={deleteModal}
        transparent={true}
        onRequestClose={()=>setDeleteModal(false)}
      >
        
          
        <TouchableOpacity style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(10,54,127,0.4)',}}  onPress={()=>setDeleteModal(false)}>
        <Animatable.View animation="fadeInUp" iterationCount={1} direction="alternate">
          <Pressable style={styles.updateModalView}>
            <Text style={styles.fontStyle1}>Choose your action</Text>
            <View style={{flexDirection:'row', width:windowWidth*(94/100), justifyContent: 'space-around'}}>
                <AuthButton
                    BackgroundColor={colours.primaryRed}
                    FirstColor={colours.primaryRed}
                    SecondColor={colours.lightRed}
                    OnPress={() =>{ setDeleteModal(false), OnDelete()} }
                    ButtonText={'DELETE ADDRESS'}
                    ButtonWidth={45}
                    ButtonHeight={5}
                    FSize={getFontontSize(14)}
                />
                <AuthButton
                    BackgroundColor={colours.primaryColor}
                    OnPress={() => { setDeleteModal(false), OnEdit()}}
                    ButtonText={'EDIT ADDRESS'}
                    ButtonWidth={45}
                    ButtonHeight={5}
                    FSize={getFontontSize(14)}
                />
            </View>
          </Pressable> 
        </Animatable.View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth*(90/100),
    alignItems: 'center',
    borderWidth: 3,
    marginTop: 10,
    borderRadius:10,
    padding: windowWidth*(3/100),
    marginHorizontal: windowWidth*(5/100)
  },
  reqImgContainer: {
      width: windowWidth*(25/100), 
      height: windowWidth*(10/100),  
      alignItems:'center', 
      justifyContent:'center',
      position: 'absolute',
      top: windowWidth*(2/100),  
      left: windowWidth*(66/100),
  },
  reqImg: {
      width: windowWidth*(25/100), 
      height: windowWidth*(10/100),  
      resizeMode:'contain',
  },
  updateModalView: {
      height: windowHeight * (20 / 100),
      marginTop: windowHeight * (80 / 100),
      paddingTop: windowHeight * (1 / 100),
      paddingBottom: windowHeight * (2 / 100),
      backgroundColor: colours.primaryWhite,
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
      elevation: 10,
      alignItems: "center",
      justifyContent: 'space-around'
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(12),
    color: colours.primaryWhite,
  },
});
