import React from 'react';
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Header from '../components/Header';
import { getImage } from '../globals/functions';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import FastImage from 'react-native-fast-image'

const ImageViewScreen = ({ navigation, route }) => {
  // route.params.images = [
  //   'assets/images/uploads/productimages/NadanKudampuli250g20200910T072135-1.jpg',
  //   'assets/images/uploads/productimages/MORELIGHTDETERGENTWASHINGPOWDER500G20200820T033936-1.jpg',
  //   'assets/images/uploads/productimages/NadanKudampuli250g20200910T072135-1.jpg',
  //   'assets/images/uploads/productimages/MORELIGHTDETERGENTWASHINGPOWDER500G20200820T033936-1.jpg',
  //   'assets/images/uploads/productimages/NadanKudampuli250g20200910T072135-1.jpg',
  // ];
  let reff;
  const [img, setImg] = React.useState(0);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        backEnable
        // HeaderText={'Product Details'}
        navigation={navigation}
      />
      {/* <View style={{}}> */}
      <GestureRecognizer
        config={config}
        style={{
          // flex: 1,
          height: Dimensions.get('window').height * (70 / 100),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#f00',
        }}>
        <ImageZoom
          ref={(ref) => (reff = ref)}
          style={{}}
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height * (75 / 100)}
          imageWidth={Dimensions.get('window').width * (80 / 100)}
          imageHeight={Dimensions.get('window').height * (70 / 100)}>
          <FastImage
            style={{
              width: Dimensions.get('window').width * (80 / 100),
              height: Dimensions.get('window').height * (70 / 100),
              resizeMode: 'contain',
            }}
            source={{
              uri: getImage(route.params.images[img].imageUrl),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </ImageZoom>
      </GestureRecognizer>
      {/* </View> */}

      <View style={{ flex: 1 }}></View>
      <ScrollView horizontal>
        {route.params.images.map((item, i) => {
          return (
            <TouchableOpacity
              onPress={() => {
                reff.reset();
                setImg(i);
              }}
              key={i}
              style={{ margin: 10 }}>
              <FastImage
                style={{ width: 100, height: 100, resizeMode: 'contain' }}
                source={{
                  uri: getImage(item.imageUrl),
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageViewScreen;
