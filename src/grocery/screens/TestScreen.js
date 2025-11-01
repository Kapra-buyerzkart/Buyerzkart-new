import React, { useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const images = [
  { uri: "https://via.placeholder.com/300/FF0000", bgColor: "green" }, // Image 1 with Green background
  { uri: "https://via.placeholder.com/300/00FF00", bgColor: "blue" },  // Image 2 with Blue background
  { uri: "https://via.placeholder.com/300/0000FF", bgColor: "purple" } // Image 3 with Purple background
];

const TestScreen = () => {
  const animationValue = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    animationValue.value = withTiming(currentIndex, { duration: 2000 }); // Smooth transition
  }, [currentIndex]);

  // Animated background color transition
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      images.map((_, index) => index),
      images.map((item) => item.bgColor)
    );

    return { backgroundColor };
  });

  return (
    <Animated.View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, animatedStyle]}>
      <Carousel
        data={images}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={{ width: width * 0.8, height: 300, borderRadius: 10, borderWidth:1 }} />
        )}
        autoplay
        loop
        sliderWidth={width}
        itemWidth={width * 0.8}
        onSnapToItem={(index) => setCurrentIndex(index)}
      />
    </Animated.View>
  );
};

export default TestScreen;
