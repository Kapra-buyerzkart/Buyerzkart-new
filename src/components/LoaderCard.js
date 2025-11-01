import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
export default function LoaderCard({ }) {

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require('../assets/images/skeleton.gif')}
        style={styles.imageContainer}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: windowWidth * (100 / 100),
    height: windowWidth * (30 / 100),
    borderRadius: 10,
    alignItems: 'center'
  },
  imageContainer: {
    width: windowWidth * (95 / 100),
    height: windowWidth * (30 / 100),
    borderRadius: 10,
  },
});
