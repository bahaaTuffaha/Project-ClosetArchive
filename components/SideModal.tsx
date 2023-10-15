import { Dispatch, ReactElement, SetStateAction } from "react";
import { Dimensions, TouchableOpacity, useColorScheme } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../utils/colors";

export const SideModal = ({
  space,
  setIsOpen,
  isOpen,
  children,
}: {
  space: SharedValue<number>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactElement;
}) => {
  const { width, height } = Dimensions.get("window");
  const isDarkMode = useColorScheme() === "dark";
  const closeDrawerAnimation = useAnimatedStyle(() => {
    return {
      marginRight: withTiming(space.value, {
        duration: 500,
        easing: Easing.ease,
      }),
    };
  }, []);

  return (
    <>
      {/* this is a clickable background solution */}
      {isOpen && (
        <TouchableOpacity
          onPress={() => {
            setIsOpen((prev) => !prev);
            space.value = -20;
          }}
          className="z-40 h-full w-full absolute bg-black opacity-30 rounded-xl"
        />
      )}
      <Animated.View
        style={[
          {
            height: height,
            width: width / 2,
            position: "absolute",
            backgroundColor: isDarkMode ? colors.gray : colors.white,
            zIndex: 50,
            right: "-50%",
          },
          closeDrawerAnimation,
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
};
