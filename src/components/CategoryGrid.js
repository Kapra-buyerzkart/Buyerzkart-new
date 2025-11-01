import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { getImage, getFontontSize } from '../globals/functions';
import { getFAIcon } from '../globals/fa-icons';
import FastImage from 'react-native-fast-image'
import colours from '../globals/colours';

const windowWidth = Dimensions.get('window').width;
export default function CategoryGrid({ title, image, Nav, Big }) {
  return (
    <TouchableOpacity onPress={Nav} style={[styles.mainContainer, { width: Big ? windowWidth * (25 / 100) : windowWidth * (20 / 100) }]}>
      <View style={styles.iconContainer}>
        {/* {getFAIcon(image)} */}
        {
          image ?
            <FastImage
              style={[styles.categoryImage, { width: Big ? windowWidth * (23 / 100) : windowWidth * (18 / 100) }]}
              source={{
                uri: getImage(image),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            :
            getFAIcon('fas fa-apple-alt')
        }

      </View>
      {
        Big ?
          <Text style={styles.textStyle} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          :
          <Text style={styles.textStyle} numberOfLines={2} ellipsizeMode="tail">
            {title.toUpperCase()}
          </Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    width: windowWidth * (20 / 100),
    height: windowWidth * (27 / 100),
    justifyContent: 'space-around',
    alignItems: 'center',
    // margin: 4,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.18,
    // shadowRadius: 1.0,
    // elevation: 1,
    marginRight: windowWidth * (2 / 100),
    marginVertical: windowWidth * (4 / 100),
  },
  iconContainer: {
    width: windowWidth * (18 / 100),
    height: windowWidth * (18 / 100),
    alignItems: 'center',
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.18,
    // shadowRadius: 1.0,
    // elevation: 1,
  },
  categoryImage: {
    width: windowWidth * (18 / 100),
    height: windowWidth * (18 / 100),
    resizeMode: 'contain',
  },
  textStyle: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    textAlign: 'center',
    color: colours.primaryGrey
  },
});