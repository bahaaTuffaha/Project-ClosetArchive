import React, { useEffect, useState } from "react";
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ActivityIndicator,
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
  visible?: boolean;
}

const SpriteAnimation: React.FC<Props> = ({
  spriteSheet,
  frameWidth,
  frameHeight,
  columns,
  totalFrames = 72,
  fps = 24,
  style,
  visible = true,
}) => {
  const progress = useSharedValue(0);
  const [loading, setLoading] = useState(true);

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

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Animated.Image
        width={sheetWidth}
        height={sheetHeight}
        source={spriteSheet}
        style={animatedStyle}
        resizeMode="stretch"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
};

export default SpriteAnimation;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
