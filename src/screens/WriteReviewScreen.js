import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TextInput,
  ImageBackground,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;

import Header from '../components/Header';
import colours from '../globals/colours';
import { AirbnbRating } from 'react-native-ratings';
import AuthButton from '../components/AuthButton';
import { writeReview } from '../api';
import { getImage } from '../globals/functions';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import { StackActions } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

export default function WriteReviewScreen({ navigation, route }) {
  const { ProdDetails } = route.params;
  const [title, setTitle] = React.useState('');
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  const handleSubmit = async () => {
    if (title !== '' && review !== '' && rating !== 0) {
      await writeReview({
        urlKey: ProdDetails.urlKey,
        rating: rating,
        review: review,
        reviewtitle: title,
      });
      Toast.show('Review submitted successfully.');
      navigation.dispatch(
        StackActions.replace('Review', {
          ProdDetails: ProdDetails,
        })
      );
      // navigation.navigate('Review', {
      //   ProdDetails: ProdDetails,
      // });
    } else {
      Toast.show('Enter All Fields & rate the product');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'Write A Review'}
        backEnable
      />
      <View style={styles.topSection}>
        <ImageBackground
          style={styles.topImg}
          source={{
            uri: getImage(ProdDetails.imageUrl),
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(256,256,266,.9)',
              justifyContent: 'flex-end',
              paddingLeft: '6%',
            }}>
            <Text style={styles.fontStyle1} numberOfLines={1}>
              {ProdDetails.prName}
            </Text>
            {ProdDetails.specialPrice ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: '2%',
                    paddingBottom: '1%',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.fontStyle1}>
                  ₹ {ProdDetails.specialPrice}
                  </Text>
                  <Text
                    style={[
                      styles.fontStyle2,
                      {
                        marginLeft: '2%',
                        fontSize: 13,
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      },
                    ]}>
                    ₹ {ProdDetails.unitPrice}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: '2%',
                    paddingBottom: '1%',
                  }}>
                  <Text style={styles.fontStyle1}>
                  ₹ {ProdDetails.unitPrice}
                  </Text>
                </View>
              </>
            )}
          </View>
        </ImageBackground>
      </View>
      <ScrollView>
        <View style={styles.innerContainer}>
          <AirbnbRating
            defaultRating={0}
            count={5}
            size={30}
            showRating={false}
            onFinishRating={(value) => {
              setRating(value);
            }}
          />
          <TextInput
            placeholder={'Title'}
            placeholderTextColor={colours.kapraLow}
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            placeholder={'Write Your Review'}
            style={[
              styles.textInput,
              {
                height: windowWidth * (35 / 100),
                marginBottom: 5,
                justifyContent: 'flex-start',
                textAlignVertical: 'top',
              },
            ]}
            placeholderTextColor={colours.kapraLow}
            numberOfLines={6}
            maxLength={250}
            multiline={true}
            onChangeText={(text) => setReview(text)}
          />
          <Text style={styles.fontStyle3}>  (Maximum 250 Characters)</Text>
          <AuthButton
            BackgroundColor={colours.kapraMain}
            OnPress={handleSubmit}
            ButtonText={'Submit'}
            ButtonWidth={90}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    height: '25%',
    width: '100%',
  },
  topImg: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  fontStyle1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 20,
    color: colours.primaryBlack
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 11,
    color: colours.primaryGrey,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: colours.primaryWhite,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: windowWidth * (90 / 100),
    paddingTop: 20
  },
  textInput: {
    marginTop: '3%',
    borderRadius:25,
    width: windowWidth * (90 / 100),
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: colours.kapraLow,
    color: colours.primaryBlack,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: colours.kapraLow,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: 12,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 10,
    color: colours.primaryGrey,
    marginBottom: 20,
  },
});
