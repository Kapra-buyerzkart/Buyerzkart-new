import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  Image
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { ProgressBar } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

import { getSingleItemReviews } from '../api';
import { AppContext } from '../../Context/appContext';
import { getImage, getFontontSize } from '../globals/GroFunctions';
import showIcon from '../../globals/icons';
import colours from '../../globals/colours';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroReviewScreen({ navigation, route }) {
  
  
  
  const { profile } = React.useContext(AppContext);
  const { ProdDetails } = route.params;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({});

  const _fetchItemReviews = async () => {
    let res = await getSingleItemReviews(ProdDetails.urlKey);
    setData(res);
    setLoading(false);
  };

  React.useEffect(() => {
    _fetchItemReviews();
  }, []);

  if (loading) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>Reviews</Text>
      </View>

      {/* Image Background Con  */}
      <View style={styles.topSection}>
        <ImageBackground
          style={styles.topImg}
          source={{
            uri: getImage(ProdDetails.imageUrl),
          }}
        >
          <View style={styles.imgBackCon}>
            <Text style={styles.fontStyle1} numberOfLines={1}>
              {ProdDetails.prName}
            </Text>
            {ProdDetails.specialPrice ? (
              <>
                <View style={styles.priceCon}>
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
                  <View style={styles.priceCon}>
                    <Text style={styles.fontStyle1}>
                    ₹{ProdDetails.unitPrice}
                    </Text>
                  </View>
                </>
              )}
          </View>
        </ImageBackground>
      </View>

      {/* Review & Write a review Con  */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>All Reviews</Text>
        {data.ProdRev[0].Reviewstatus ? (
          <TouchableOpacity
            onPress={() => {
              if (profile.groceryCustId) {
                navigation.navigate('GroWriteReviewScreen', {
                  ProdDetails,
                });
              } else {
                Toast.show('Please Login For Write Review');
              }
            }}>
            <Text style={[styles.titleText, { fontSize: getFontontSize(12) }]}>
              Write A Review
            </Text>
          </TouchableOpacity>
        ) : (
            <Text></Text>
          )}
      </View>

      {/* Review Stats  */}
      {
        data?.ProdRev[0]?.review_count > 0 && (
          <View style={styles.ratingContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.ratingText}>
                {data.ProdRev[0].IsReviewAvgrating}
              </Text>
              <Text style={styles.ratingNumber}>Out Of 5</Text>
            </View>
            <View>
              <View style={styles.ratingLevelStyle}>
                <AirbnbRating
                  defaultRating={5}
                  count={5}
                  isDisabled={true}
                  size={10}
                  showRating={false}
                />
                <ProgressBar
                  progress={data.ProdRev[0].rating5 / data.ProdRev[0].TotalCount}
                  color={'#000'}
                  style={{ width: windowWidth * (35 / 100), height: 5 }}
                />
              </View>
              <View style={styles.ratingLevelStyle}>
                <AirbnbRating
                  defaultRating={4}
                  count={5}
                  isDisabled={true}
                  size={10}
                  showRating={false}
                />
                <ProgressBar
                  progress={data.ProdRev[0].rating4 / data.ProdRev[0].TotalCount}
                  color={'#000'}
                  style={{ width: windowWidth * (35 / 100), height: 5 }}
                />
              </View>
              <View style={styles.ratingLevelStyle}>
                <AirbnbRating
                  defaultRating={3}
                  count={5}
                  isDisabled={true}
                  size={10}
                  showRating={false}
                />
                <ProgressBar
                  progress={data.ProdRev[0].rating3 / data.ProdRev[0].TotalCount}
                  color={'#000'}
                  style={{ width: windowWidth * (35 / 100), height: 5 }}
                />
              </View>
              <View style={styles.ratingLevelStyle}>
                <AirbnbRating
                  defaultRating={2}
                  count={5}
                  isDisabled={true}
                  size={10}
                  showRating={false}
                />
                <ProgressBar
                  progress={data.ProdRev[0].rating2 / data.ProdRev[0].TotalCount}
                  color={'#000'}
                  style={{ width: windowWidth * (35 / 100), height: 5 }}
                />
              </View>
              <View style={styles.ratingLevelStyle}>
                <AirbnbRating
                  defaultRating={1}
                  count={5}
                  isDisabled={true}
                  size={10}
                  showRating={false}
                />
                <ProgressBar
                  progress={data.ProdRev[0].rating1 / data.ProdRev[0].TotalCount}
                  color={'#000'}
                  style={{ width: windowWidth * (35 / 100), height: 5 }}
                />
              </View>
            </View>
          </View>
        ) 
      }

      {/* Reviews  */}
      <>
        <View style={{ width: windowWidth * (80 / 100), alignItems: 'flex-end' }}>
          <Text style={[styles.titleText, { fontSize: getFontontSize(10) }]}>
            {data.ProdRev[0].review_count} Reviews
          </Text>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={_fetchItemReviews} />
          }
          data={data.ReviewDetails}
          renderItem={({ item, index }) => {
            return (
              <Card
                reviewerName={item.reviewerName}
                // dateOfReview={moment(
                //   item.dateOfReview,
                //   'ddd DD-MMM-YYYY, hh:mm A',
                // ).format('ddd DD-MMM-YYYY')}
                dateOfReview={moment(new Date(item.dateOfReview)).format(
                  'DD MMM YYYY',
                )}
                reviewTitle={item.reviewTitle}
                reviewDetails={item.reviewDetails}
                rating={item.rating}
              />
            );
          }}
          contentContainerStyle={styles.scroll}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </>
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
    height: windowHeight*(25/100),
    width: windowWidth,
  },
  topImg: {
    resizeMode: 'contain',
    width: windowWidth,
    height: windowHeight*(25/100),
  },
  imgBackCon: {
    flex: 1,
    backgroundColor: 'rgba(256,256,266,.7)',
    justifyContent: 'flex-end',
    paddingLeft: '6%',
  },
  priceCon: {
    flexDirection: 'row',
    paddingTop: '2%',
    paddingBottom: '1%',
    alignItems: 'center',
  },
  titleContainer: {
    width: windowWidth*(90/100),
    marginTop: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    width: windowWidth * (80 / 100),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
    flexDirection: 'row',
  },



  // Fonts 

  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle1: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlack,
  },
  fontStyle2: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(11),
    color: colours.authText,
    color: colours.primaryBlack,
  },
  ratingText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(40),
    color: colours.primaryBlack,
  },
  ratingNumber: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(10),
    color: colours.primaryBlack,
    marginBottom: '4%',
  },
  titleText: {
    fontSize: getFontontSize(16),
    fontFamily: 'Lexend-SemiBold',
    color: colours.primaryBlack,
  },
  contentText: {
    fontSize: getFontontSize(12),
    fontFamily: 'Lexend-SemiBold',
    color: colours.primaryBlack,
  },


  ratingLevelStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: windowWidth * (85 / 100),
    borderTopColor: '#cccccc',
    borderTopWidth: 1,
    marginTop: windowWidth * (8 / 100),
    marginBottom: '8%',
  },
  cardTopContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth * (85 / 100),
  },
  cardImage: {
    width: windowWidth * (10 / 100),
    height: windowWidth * (10 / 100),
    borderRadius: windowWidth * (20 / 100),
    backgroundColor: colours.primaryOrange,
  },
  userContainer: {
    paddingLeft: windowWidth * (3 / 100),
    width: windowWidth * (67 / 100),
  },
});

const Card = ({
  reviewerName,
  dateOfReview,
  reviewTitle,
  reviewDetails,
  rating,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardTopContainer}>
        <View style={styles.cardImage}></View>
        <View style={styles.userContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[styles.titleText, { width: windowWidth * (45 / 100) }]}
              numberOfLines={1}>
              {reviewerName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AirbnbRating
                defaultRating={rating}
                count={5}
                isDisabled={true}
                size={10}
                showRating={false}
              />
              {/* <Text style={[styles.contentText, { color: '#000' }]}>
                ({rating})
              </Text> */}
            </View>
          </View>
          <Text style={[styles.contentText, { fontSize: 10 }]}>
            {dateOfReview}
          </Text>
        </View>
      </View>
      <Text style={[styles.contentText, { color: '#000', paddingTop: '3%' }]}>
        {reviewTitle}
      </Text>
      <Text
        style={[
          styles.contentText,
          { paddingTop: '1%', },
        ]}>
        {reviewDetails}
      </Text>
    </View>
  );
};
