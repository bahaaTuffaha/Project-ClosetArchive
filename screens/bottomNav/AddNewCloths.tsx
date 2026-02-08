import { CommonActions, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import hangerImage from "../../assets/images/hanger.png";
import recordImage from "../../assets/images/record.png";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeView } from "../../components/ThemeView";
import { colors } from "../../utils/colors";
import { localization } from "../../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const AddNewCloths = ({ navigation }: { navigation: any }) => {
  const { width, height } = useWindowDimensions();
  const amountOfSpace = 200;
  const space = useSharedValue(amountOfSpace);
  const invisibility4Content = useSharedValue(0.01);

  const closeLeftAnimation = useAnimatedStyle(() => ({
    marginLeft: withTiming(space.value, { duration: 500 }),
  }));

  const closeRightAnimation = useAnimatedStyle(() => ({
    marginRight: withTiming(space.value, { duration: 500 }),
  }));

  const showTextAnimation = useAnimatedStyle(() => ({
    opacity: withTiming(invisibility4Content.value, { duration: 500 }),
  }));

  const storedSettings = useSelector((state: RootState) => state.settings);
  const isDark = useColorScheme() === "dark";

  useFocusEffect(
    useCallback(() => {
      space.value = 0;
      invisibility4Content.value = 1;
      return () => {
        space.value = amountOfSpace;
        invisibility4Content.value = 0.01;
      };
    }, [amountOfSpace, invisibility4Content, space]),
  );

  const rotateAngle = useMemo(() => {
    const angleA =
      Math.asin(height / Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))) *
      (180 / Math.PI);
    return -(90 - angleA);
  }, [width, height]);

  const backgroundStyle = useMemo(
    () => ({
      transform: [{ rotate: `${rotateAngle}deg` }],
      position: "absolute" as const,
      elevation: 1,
    }),
    [rotateAngle],
  );

  const panelBaseStyle = useMemo(
    () => ({
      height: height * 2,
      width: width * 2,
      position: "absolute" as const,
    }),
    [width, height],
  );

  return (
    <ThemeView>
      <View style={backgroundStyle}>
        <Animated.View
          style={[
            panelBaseStyle,
            {
              backgroundColor: colors.mainGreen,
              left: "50%",
              marginLeft: amountOfSpace,
            },
            closeLeftAnimation,
          ]}
        />
        <Animated.View
          style={[
            panelBaseStyle,
            {
              backgroundColor: colors.mainCyan,
              right: "50%",
              marginRight: amountOfSpace,
            },
            closeRightAnimation,
          ]}
        />
      </View>

      <Animated.View style={[styles.contentContainer, showTextAnimation]}>
        <View style={[styles.labelButton, styles.topRight]}>
          <Text style={styles.labelText}>
            {localization.Add_a_new[storedSettings.language]}
          </Text>
          <Image
            resizeMode="contain"
            source={hangerImage}
            style={{ width: width * 0.4, alignSelf: "flex-end" }}
          />
        </View>
        <View style={[styles.labelButton, styles.bottomLeft]}>
          <Image
            resizeMode="contain"
            source={recordImage}
            style={{ width: width * 0.3, alignSelf: "flex-start" }}
          />
          <Text style={styles.labelText}>
            {localization.Record_a_log[storedSettings.language]}
          </Text>
        </View>
      </Animated.View>

      <View style={[backgroundStyle, { elevation: 3 }]}>
        <Pressable
          onPress={() => navigation.navigate("Category")}
          style={[panelBaseStyle, { left: "50%" }]}
        />
        <Pressable
          onPress={() => navigation.navigate("ItemSelector")}
          style={[panelBaseStyle, { right: "50%" }]}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.dispatch(CommonActions.goBack())}
        style={[
          styles.backButtonAction,
          { backgroundColor: isDark ? colors.gray : colors.white },
        ]}
      >
        <Icon
          color={isDark ? colors.white : colors.black}
          name="caret-back"
          size={30}
        />
      </TouchableOpacity>
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    elevation: 2,
    flex: 1,
  },
  labelButton: {
    position: "absolute",
    width: "60%",
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    left: 0,
    bottom: 0,
  },
  labelText: {
    fontFamily: "TSMorabaat-Regular",
    fontSize: 50,
    color: colors.white,
    textAlign: "center",
    marginVertical: 15,
  },
  backButtonAction: {
    width: 64,
    position: "absolute",
    top: 8,
    left: 4,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
});
