import React, { useEffect } from "react";
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";

interface Props {
  spriteSheet: ImageSourcePropType;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  totalFrames?: number;
  fps?: number;
  style?: StyleProp<ViewStyle>;
}

const SpriteAnimation: React.FC<Props> = ({
  spriteSheet,
  frameWidth,
  frameHeight,
  columns,
  totalFrames = 72,
  fps = 24,
  style,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const loopDuration = (totalFrames / fps) * 1000;

    progress.value = withRepeat(
      withTiming(1, { duration: loopDuration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress, totalFrames, fps]);

  const frameIndex = useDerivedValue(() => {
    const idx = Math.floor(progress.value * totalFrames);
    return idx % totalFrames;
  });

  const column = useDerivedValue(() => frameIndex.value % columns);
  const row = useDerivedValue(() => Math.floor(frameIndex.value / columns));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -Math.round(column.value * frameWidth) },
      { translateY: -Math.round(row.value * frameHeight) },
    ],
  }));

  const sheetWidth = columns * frameWidth;
  const rows = Math.ceil(totalFrames / columns);
  const sheetHeight = rows * frameHeight;

  return (
    <View style={[styles.container, style]}>
      <Animated.Image
        source={spriteSheet}
        style={[{ width: sheetWidth, height: sheetHeight }, animatedStyle]}
        resizeMode="stretch"
      />
    </View>
  );
};

export default SpriteAnimation;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
