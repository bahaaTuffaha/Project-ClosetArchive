import { ReactElement, useState } from "react";
import { Pressable, View, useColorScheme } from "react-native";
import { ThemeText } from "./ThemeText";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleCollection } from "../redux/itemsSlice";
import { colors } from "../utils/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const CollectionContainer = ({
  label,
  children,
  color = colors.gray,
  LaundryReminder = false,
}: {
  label: string;
  children: ReactElement;
  color?: string;
  LaundryReminder?: boolean;
}) => {
  const collectionTags = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const [isFolded, setIsFolded] = useState(
    LaundryReminder
      ? false
      : collectionTags.find((x) => x.label === label)?.isOpen,
  );

  const isDarkMode = useColorScheme() === "dark";
  const dispatch = useDispatch();

  const pulseAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
    display: "flex",
    flexDirection: "row",
    paddingLeft: 8,
    paddingRight: 8,
  }));
  return (
    <View
      style={{ backgroundColor: color }}
      className="flex flex-row flex-wrap w-full h-auto self-center border-[0.4px]"
    >
      <Pressable
        onPress={() => {
          setIsFolded((prev) => !prev);
          !LaundryReminder && dispatch(toggleCollection({ name: label }));
        }}
        className="w-full h-8 flex flex-row items-center justify-between pr-5"
        style={{
          backgroundColor: isDarkMode
            ? LaundryReminder
              ? colors.yellow
              : "#181818"
            : LaundryReminder
            ? colors.yellow
            : colors.white,
        }}
      >
        <Animated.View style={animatedStyle}>
          {LaundryReminder && (
            <Icon
              style={{ marginRight: 5 }}
              color={colors.gray}
              name={"warning-outline"}
              size={20}
            />
          )}
          <ThemeText
            darkColor={LaundryReminder ? colors.gray : colors.mainCyan}
            classNameStyle="font-medium italic"
          >
            {label}
          </ThemeText>
        </Animated.View>
        <Icon
          color={
            LaundryReminder
              ? colors.gray
              : isDarkMode
              ? colors.white
              : colors.black
          }
          name={isFolded ? "chevron-down" : "chevron-up"}
          size={20}
        />
      </Pressable>
      {isFolded && children}
    </View>
  );
};
