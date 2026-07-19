import { ReactElement, useState } from "react";
import { Pressable, StyleSheet, View, useColorScheme } from "react-native";
import { ThemeText } from "./ThemeText";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleCollection } from "../redux/itemsSlice";
import { colors } from "../utils/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
      : collectionTags.find(x => x.label === label)?.isOpen,
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
    <View style={[styles.container, { backgroundColor: color }]}>
      <Pressable
        onPress={() => {
          setIsFolded(prev => !prev);
          !LaundryReminder && dispatch(toggleCollection({ name: label }));
        }}
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode
              ? LaundryReminder
                ? colors.yellow
                : colors.darkSurface
              : LaundryReminder
              ? colors.yellow
              : colors.white,
          },
        ]}
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
            customStyle={styles.headerText}
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
      <View style={isFolded ? styles.childrenContainer : undefined}>
        {isFolded && children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 0.4,
  },
  header: {
    width: "100%",
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  headerText: {
    fontStyle: "italic",
    fontWeight: "500",
  },
  childrenContainer: {
    minHeight: 72,
  },
});
