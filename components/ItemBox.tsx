import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { layoutFinder } from "../utils/data";
import useHeatmap from "../hooks/useHeatmap";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const ItemBox = ({
  image,
  primary,
  secondary,
  tertiary,
  name,
  type,
  id,
  logs,
  addSpace,
}: {
  image: string;
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
  type: string;
  id: string;
  logs: string[];
  addSpace?: boolean;
}) => {
  const boxStyle = "w-16 h-16 rounded-lg";
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
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleDownAnimation.value }],
  }));
  const handleTap = () => {
    // Handle the tap event here
    // You can add your animation logic or navigation logic here
    navToEdit();
  };
  const HeatBorderColor = useHeatmap(logs);
  const storedSettings = useSelector((state: RootState) => state.settings);
  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <Animated.View style={animatedStyle}>
        <GestureDetector gesture={scaleHandler}>
          <View
            className={`my-1 relative ${boxStyle} ${addSpace ? "mx-1" : ""}`}
          >
            <Image
              style={{
                borderColor: storedSettings.enableHeatMap
                  ? HeatBorderColor
                  : "transparent",
                borderWidth: storedSettings.enableHeatMap ? 4 : 0,
              }}
              className="absolute z-20 rounded-lg "
              source={layoutFinder(type)}
            />
            <Text
              style={{
                textShadowColor: colors.black,
                textShadowRadius: 15,
              }}
              className="absolute z-10 rounded-lg text-center font-medium text-xs text-white self-center w-full mt-1"
            >
              {name}
            </Text>
            {image !== "" ? (
              <Image
                className="w-full h-full rounded-lg"
                source={{ uri: `data:image/*;base64,${image}` }}
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
    </TouchableWithoutFeedback>
  );
};
