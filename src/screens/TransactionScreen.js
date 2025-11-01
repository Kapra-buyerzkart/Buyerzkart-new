import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Header from '../components/Header';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
const windowWidth = Dimensions.get('window').width;
export default function TransactionScreen({ navigation }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [heading, setHeading] = React.useState('Today');
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header navigation={navigation} Cart WishList />
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => setHeading('Today')}
          style={[
            styles.heading,
            heading === 'Today'
              ? { borderBottomColor: colours.primaryColor }
              : '',
            { borderBottomLeftRadius: 5 },
          ]}>
          <Text style={styles.headingText}>{'Today'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHeading('Weekly')}
          style={[
            styles.heading,
            heading === 'Weekly'
              ? { borderBottomColor: colours.primaryColor }
              : '',
          ]}>
          <Text style={styles.headingText}>{'Weekly'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHeading('Monthly')}
          style={[
            styles.heading,
            heading === 'Monthly'
              ? { borderBottomColor: colours.kapraMain }
              : '',
          ]}>
          <Text style={styles.headingText}>{'Monthly'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHeading('Yearly')}
          style={[
            styles.heading,
            heading === 'Yearly'
              ? { borderBottomColor: colours.kapraMain }
              : '',
          ]}>
          <Text style={styles.headingText}>{'Yearly'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.fontStyle1, { paddingLeft: '8%', paddingTop: '5%' }]}>
        21 Oct, Wed
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        <Card
          OrderNo={'2323'}
          Time={'03:00 PM'}
          Method={'Debit'}
          Price={'-₹74.45'}
        />
        <Card
          OrderNo={'2323'}
          Time={'03:00 PM'}
          Method={'Debit'}
          Price={'-₹74.45'}
        />
        <Card
          OrderNo={'2323'}
          Time={'03:00 PM'}
          Method={'Debit'}
          Price={'-₹74.45'}
        />
        <Card
          OrderNo={'2323'}
          Time={'03:00 PM'}
          Method={'Debit'}
          Price={'-₹74.45'}
        />
        <Card
          OrderNo={'2323'}
          Time={'03:00 PM'}
          Method={'Debit'}
          Price={'-₹74.45'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.whiteBackground,
  },
  container: {
    alignItems: 'center',
    width: windowWidth,
    marginTop: '1%',
  },
  headingContainer: {
    flexDirection: 'row',
    width: windowWidth,
    justifyContent: 'center',
    marginTop: '10%',
  },
  heading: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomColor: colours.grey,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colours.secondaryColour,
  },
  cardContainer: {
    width: windowWidth * (85 / 100),
    borderBottomColor: colours.kapraMain,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 25,
  },
  innerContainer1: {
    width: windowWidth * (45 / 100),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  innerContainer2: {
    width: windowWidth * (40 / 100),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  inner: {
    flexDirection: 'row',
  },
  fontStyle1: {
    fontWeight: 'bold',
    color: colours.secondaryColour,
  },
  fontStyle2: {
    fontWeight: '600',
    color: colours.secondaryColour,
  },
});

const Card = ({ OrderNo, Time, Method, Price }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.innerContainer1}>
        <Text style={styles.fontStyle1}>Order #{OrderNo}</Text>
        <View style={styles.inner}>
          <Text style={styles.fontStyle2}>{Time},</Text>
          <Text style={styles.fontStyle2}> {Method}</Text>
        </View>
      </View>
      <View style={styles.innerContainer2}>
        <Text style={styles.fontStyle1}>{Price}</Text>
      </View>
    </View>
  );
};
