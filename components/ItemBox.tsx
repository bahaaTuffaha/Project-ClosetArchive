import { View, Image, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { categoryLayoutImages } from "../utils/data";
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";

export const ItemBox = ({
  image,
  primary,
  secondary,
  tertiary,
  name,
  categoryNumber,
  id,
  setRefresh,
}: {
  image: string;
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
  categoryNumber: number;
  id: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) => {
  const boxStyle = "w-16 h-16 rounded-lg";
  const layout = require("../assets/images/layout1.png");
  const scaleDownAnimation = useSharedValue(1);
  const navigation = useNavigation<any>();
  function navToEdit() {
    navigation.navigate("ItemForm", {
      editingIndex: id,
    });
  }
  const scaleHandler = Gesture.Tap()
    .onBegin(() => {
      "worklet";
      scaleDownAnimation.value = withSpring(0.8);
    })
    .onFinalize(() => {
      "worklet";
      scaleDownAnimation.value = withSpring(1);
    })
    .onEnd(() => {
      "worklet";
      runOnJS(navToEdit)();
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleDownAnimation.value }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={scaleHandler}>
        <View className={`m-1 relative ${boxStyle}`}>
          <Image
            className="absolute z-20 rounded-lg"
            source={categoryLayoutImages[categoryNumber] ?? layout}
          />
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
