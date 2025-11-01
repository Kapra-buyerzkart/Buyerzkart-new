import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TextInput,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AirbnbRating } from 'react-native-ratings';
import Toast from 'react-native-simple-toast';

import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import { writeReview } from '../api';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroWriteReviewScreen({ navigation, route }) {

  const { ProdDetails } = route.params;
  const [title, setTitle] = React.useState('');
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(0);

  const handleSubmit = async () => {
    if (title !== '' && review !== '' && rating !== 0) {
      await writeReview({
        urlKey: ProdDetails.urlKey,
        rating: rating,
        review: review,
        reviewtitle: title,
      });
      Toast.show('Review submitted successfully.');
      navigation.goBack();
    } else {
      Toast.show('Enter All Fields & rate the product');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Reviews</Text>
      </View>

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
            placeholderTextColor={colours.kapraBlackLow}
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
            placeholderTextColor={colours.kapraBlackLow}
            numberOfLines={6}
            maxLength={250}
            multiline={true}
            onChangeText={(text) => setReview(text)}
          />
          <Text style={styles.fontStyle3}>  (Maximum 250 Characters)</Text>
          <AuthButton
            FirstColor={colours.kapraOrangeDark}
            SecondColor={colours.kapraOrange}
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
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
    alignItems: 'center',
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
    backgroundColor: colours.kapraWhite,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingHorizontal: windowWidth*(5/100)
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    alignItems:'center',
    justifyContent:'center',
  },
  topSection: {
    height: '25%',
    width: '100%',
  },
  topImg: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
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
    borderRadius:5,
    width: windowWidth * (90 / 100),
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: colours.kapraWhiteLow,
    color: colours.kapraBlackLight,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: colours.kapraWhiteLow,
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(12),
  },

  // Fonts 

  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack
  },
  fontStyle2: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(10),
    color: colours.primaryGrey,
  },
  fontStyle3: {
    fontFamily: 'Lexend-Light',
    fontSize: getFontontSize(10),
    color: colours.primaryGrey,
    marginBottom: 20,
  },






});
