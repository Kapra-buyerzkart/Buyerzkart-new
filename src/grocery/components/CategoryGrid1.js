import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import { getFAIcon } from '../../globals/fa-icons';
import FastImage from 'react-native-fast-image'
import colours from '../../globals/colours';

const windowWidth = Dimensions.get('window').width;
export default function CategoryGrid1({ title, image, Nav, index }) {

  return (
    <TouchableOpacity onPress={Nav} style={styles.mainContainer}>
      {
        image ?
          <View style={styles.imageContainer}>
            <FastImage
              style={styles.categoryImage}
              source={{
                uri: getImage(image),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        :
          <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/logo/Kapra.png')}
            style={styles.categoryImage}
          />
          </View>
      }
      <View style={styles.textContainer}>
        <Text style={styles.textStyle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (22 / 100),
    height: windowWidth * (27 / 100),
    justifyContent:'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: windowWidth * (13 / 100),
    height: windowWidth * (13 / 100),
    backgroundColor: "#fff",
    borderRadius: windowWidth*(4/100),
    alignItems: "center",
    justifyContent:'space-between',
    
    
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Android Shadow
    elevation: 5,


  },
  categoryImage: {
    width: windowWidth * (13 / 100),
    height: windowWidth * (13 / 100),
    borderRadius: windowWidth*(4/100),
    resizeMode: 'contain',
  },
  textContainer: {
    width: windowWidth * (20 / 100),
    height: windowWidth * (9 / 100),
    paddingTop:3,
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(11),
    color: colours.kapraBlack,
    textAlign:'center'
  },
});