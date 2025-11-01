import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AppContext } from '../Context/appContext';
import colours from '../globals/colours';

const AnimatedView = Animated.createAnimatedComponent(View);

CustomLabel.defaultProps = {
  leftDiff: 0,
};

const width = 50;
const pointerWidth = width * 0.47;

function LabelBase(props) {
  const { position, value, leftDiff, pressed } = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);
  const { Language } = React.useContext(AppContext);
  const Lang = Language;

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 1,
      duration: 0,
      delay: pressed ? 0 : 0,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) && (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position - width / 2,
            transform: [
              { translateY: width },
              { scale: scaleValue.current },
              { translateY: -width },
            ],
          },
        ]}>
        <View style={styles.pointer} />
        <Text style={styles.sliderLabelText}>₹ {value}</Text>
      </AnimatedView>
    )
  );
}

export default function CustomLabel(props) {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;

  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: {
    position: 'relative',
  },
  sliderLabel: {
    // position: 'absolute',
    justifyContent: 'center',
    bottom: -10,
  },
  sliderLabelText: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: 12,
    marginLeft: 15,
    color: colours.kapraLight
  },
  pointer: {},
});
