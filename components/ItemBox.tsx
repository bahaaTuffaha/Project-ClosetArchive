import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
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
  const BOX_SIZE = 64;
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
  const storedCatTypes = useSelector(
    (state: RootState) => state.CategoryList.CategoryCustomTypes,
  );
  const combinedCustomTypes = storedCatTypes
    ? [].concat(...storedCatTypes.map(x => x?.customTypes))
    : [];
  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <Animated.View style={animatedStyle}>
        <GestureDetector gesture={scaleHandler}>
          <View
            style={[
              styles.container,
              {
                width: BOX_SIZE,
                height: BOX_SIZE,
                marginHorizontal: addSpace ? 4 : 0,
              },
            ]}
          >
            <Image
              source={layoutFinder(type, combinedCustomTypes)}
              style={[
                styles.overlaySprite,
                {
                  borderColor: storedSettings.enableHeatMap
                    ? HeatBorderColor
                    : "transparent",
                  borderWidth: storedSettings.enableHeatMap ? 4 : 0,
                },
              ]}
            />
            <Text
              style={[
                styles.nameText,
                { textShadowColor: colors.black, textShadowRadius: 15 },
              ]}
            >
              {name}
            </Text>

            {image !== "" ? (
              <Image
                source={{ uri: `data:image/*;base64,${image}` }}
                style={styles.fullImage}
              />
            ) : (
              <View
                style={[
                  styles.colorStripContainer,
                  { width: BOX_SIZE, height: BOX_SIZE },
                ]}
              >
                <View
                  style={[
                    styles.colorStrip,
                    styles.leftRounded,
                    { backgroundColor: primary },
                  ]}
                />
                <View
                  style={[styles.colorStrip, { backgroundColor: secondary }]}
                />
                <View
                  style={[
                    styles.colorStrip,
                    styles.rightRounded,
                    { backgroundColor: tertiary },
                  ]}
                />
              </View>
            )}
          </View>
        </GestureDetector>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  overlaySprite: {
    position: "absolute",
    zIndex: 20,
    borderRadius: 8,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  nameText: {
    position: "absolute",
    zIndex: 10,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "white",
    width: "100%",
    marginTop: 4,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  colorStripContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  colorStrip: {
    flex: 1,
    height: "100%",
  },
  leftRounded: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightRounded: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
