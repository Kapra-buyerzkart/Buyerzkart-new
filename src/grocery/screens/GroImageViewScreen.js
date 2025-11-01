import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  PixelRatio,
  StyleSheet
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { getImage } from '../globals/GroFunctions';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import FastImage from 'react-native-fast-image'
import YoutubePlayer from "react-native-youtube-iframe";
import showIcon from '../../globals/icons';
import colours from '../../globals/colours';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const GroImageViewScreen = ({ navigation, route }) => {

  const [img, setImg] = React.useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [containerWidth, setContainerWidth] = useState(windowWidth);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
      </View>

      <View style={{}}>
        {
          route.params.images[img].imgType === "Image" ?
            <GestureRecognizer
              config={config}
              style={{
                height: Dimensions.get('window').height * (70 / 100),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
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
            :
            <View style={{ height: Dimensions.get('window').height * (70 / 100), justifyContent: 'center' }}>

              {/* <YouTube
                ref={youtubePlayerRef}
                apiKey="AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y"
                videoId={route.params.images[img].imageUrl.replace('https://youtu.be/', '')}
                play={isPlaying}
                loop={isLooping}
                fullscreen={fullscreen}
                controls={1}
                style={[
                  {
                    height: PixelRatio.roundToNearestPixel(
                      containerWidth / (16 / 9),
                    ),
                  },
                  styles.player,
                ]}
                onError={(e) => setError(e.error)}
                onReady={(e) => setIsReady(true)}
                onChangeState={(e) => setStatus(e.state)}
                onChangeQuality={(e) => setQuality(e.quality)}
                onChangeFullscreen={(e) => setFullscreen(e.isFullscreen)}
                onProgress={(e) => {
                  setDuration(e.duration);
                  setCurrentTime(e.currentTime);
                }}
              /> */}
              <YoutubePlayer
                height={PixelRatio.roundToNearestPixel(
                  containerWidth / (16 / 9),
                )}
                play={isPlaying}
                videoId={route.params.images[img].imageUrl.replace('https://youtu.be/', '').replace('https://www.youtube.com/watch?v=', '')}
              />
            </View>
        }
      </View>

      <View style={{ flex: 1 }}></View>
      <ScrollView horizontal>
        {route.params.images.map((item, i) => {
          if (item.imgType === "Image") {
            return (
              <TouchableOpacity
                onPress={() => {
                  reff.reset();
                  setImg(i);
                }}
                key={i}
                style={{ margin: 10 }}>
                <FastImage
                  style={{ width: 100, height: 100, resizeMode: 'contain'}}
                  source={{
                    uri: getImage(item.imageUrl),
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                style={{ width: 100, height: 100, margin: 10 }}
                onPress={() => {
                  setImg(i);
                }}
              >
                <Image
                  source={require('../../assets/logo/play.png')}
                  style={{ width: 100, height: 100, resizeMode: 'contain' }}
                />
              </TouchableOpacity>
            )
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroImageViewScreen;


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 100,
    height: 100
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    height: Dimensions.get('window').height * (70 / 100)
  },
  player: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
});


