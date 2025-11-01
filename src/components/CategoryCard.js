import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colours from '../globals/colours';

export default function CategoryCard({ CardText, OnPress }) {
  return (
    <View
      style={[
        styles.mainContainer,
        OnPress === true ? { backgroundColor: colours.primaryOrange } : '',
      ]}>
      <Text
        style={[
          styles.cardText,
          OnPress === true ? { color: '#fff' } : { color: '#000' },
        ]}>
        {CardText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});
