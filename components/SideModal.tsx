import { Dispatch, ReactElement, SetStateAction } from "react";
import { Dimensions, TouchableOpacity, useColorScheme } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../utils/colors";
import { Button } from "react-native-paper";

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

  const handleCloseDrawer = () => {
    // Update the space value to trigger the animation
    setIsOpen((prev) => !prev);
    space.value = -20;
  };

  return (
    <>
      {/* this is a clickable background solution */}
      {isOpen && (
        <TouchableOpacity
          onPress={handleCloseDrawer}
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          },
          closeDrawerAnimation,
        ]}
      >
        {children}
        <Button
          mode="contained-tonal"
          buttonColor={colors.mainCyan}
          className="self-center mt-5"
          textColor="white"
          onPress={() => {
            handleCloseDrawer();
          }}
        >
          Close
        </Button>
      </Animated.View>
    </>
  );
};
