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
import { localization } from "../utils/localization";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

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
  const storedSettings = useSelector((state: RootState) => state.settings);
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
    if (isOpen) {
      space.value = -20;
    }
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
      <Animated.ScrollView
        contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
        nestedScrollEnabled={true}
        style={[
          {
            height: height,
            width: width / 2,
            position: "absolute",
            backgroundColor: isDarkMode ? colors.gray : colors.white,
            zIndex: Math.floor(Math.random() * 100) + 50,
            right: "-50%",
            display: "flex",
            flexDirection: "column",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            flex: 1,
          },
          closeDrawerAnimation,
        ]}
      >
        {children}
        <Button
          mode="contained-tonal"
          buttonColor={colors.mainCyan}
          className="self-center w-[80%] mt-5"
          textColor="white"
          onPress={() => {
            handleCloseDrawer();
          }}
        >
          {localization.Close[storedSettings.language]}
        </Button>
      </Animated.ScrollView>
    </>
  );
};
