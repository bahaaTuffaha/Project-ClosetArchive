import { View, Image, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const ItemBox = ({
  image,
  primary,
  secondary,
  tertiary,
  name,
}: {
  image: string;
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
}) => {
  const boxStyle = "w-16 h-16 rounded-lg";
  const layout = require("../assets/images/layout1.png");
  const scaleDownAnimation = useSharedValue(1);
  const scaleHandler = Gesture.Tap()
    .onBegin(() => {
      "worklet";
      scaleDownAnimation.value = withSpring(0.8);
    })
    .onFinalize(() => {
      "worklet";
      scaleDownAnimation.value = withSpring(1);
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleDownAnimation.value }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={scaleHandler}>
        <View className={`m-2 relative ${boxStyle}`}>
          <Image className="absolute z-20 rounded-lg" source={layout} />
          <Text
            style={{
              textShadowColor: "black",
              textShadowRadius: 15,
            }}
            className="absolute z-10 rounded-lg text-center font-medium text-xs text-white self-center w-full mt-1"
          >
            {name}
          </Text>
          {image !== "" ? (
            <Image
              className="w-full h-full rounded-lg"
              source={{ uri: image }}
            />
          ) : (
            <View className={`flex flex-row rounded-lg ${boxStyle}`}>
              <View
                className="w-1/3 h-full rounded-l-lg"
                style={{ backgroundColor: primary }}
              ></View>
              <View
                className="w-1/3 h-full"
                style={{ backgroundColor: secondary }}
              ></View>
              <View
                className="w-1/3 h-full rounded-r-lg"
                style={{ backgroundColor: tertiary }}
              ></View>
            </View>
          )}
        </View>
      </GestureDetector>
    </Animated.View>
  );
};
