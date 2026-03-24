import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AddNewCloths } from "../screens/bottomNav/AddNewCloths";
import { HomeBottom } from "../screens/bottomNav/HomeBottom";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
  type ImageSourcePropType,
} from "react-native";
import closetIcon from "../assets/images/closet.png";
import closetUnselectedIcon from "../assets/images/closetUnselected.png";
import addIcon from "../assets/images/add.png";
import outfitLogIcon from "../assets/images/outfitLog.png";
import outfitLogUnselectedIcon from "../assets/images/outfitUnselected.png";
import { OutfitLog } from "../screens/bottomNav/OutfitLog";
import { colors } from "../utils/colors";
import { localization } from "../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  iconLarge: {
    height: 50,
    width: 50,
  },
  iconSmall: {
    height: 25,
    width: 25,
  },
  tabBarStyle: {
    marginHorizontal: 5,
    height: 85,
    backgroundColor: colors.mainCyan,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 5,
  },
  customButtonPressable: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonBase: {
    width: 70,
    height: 70,
    backgroundColor: colors.mainCyan,
    borderRadius: 50,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonBorderDark: {
    borderColor: colors.darkblue,
  },
  customButtonBorderLight: {
    borderColor: colors.white,
  },
  tabIconStyle: {
    marginTop: 10,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontStyle: "italic",
    paddingTop: 10,
  },
});

const TabIcon = ({
  source,
  size,
}: {
  source: ImageSourcePropType;
  size: "small" | "large";
}) => {
  return (
    <Image
      resizeMode="contain"
      source={source}
      style={size === "large" ? styles.iconLarge : styles.iconSmall}
    />
  );
};

const closetTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon source={focused ? closetIcon : closetUnselectedIcon} size="large" />
);

const addTabIcon = () => <TabIcon source={addIcon} size="small" />;

const outfitTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon
    source={focused ? outfitLogIcon : outfitLogUnselectedIcon}
    size="large"
  />
);

const CustomTabButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const borderStyle = isDarkMode
    ? styles.customButtonBorderDark
    : styles.customButtonBorderLight;

  return (
    <Pressable onPress={onPress} style={styles.customButtonPressable}>
      <View style={[styles.customButtonBase, borderStyle]}>{children}</View>
    </Pressable>
  );
};

const addTabBarButton = (props: any) => {
  return <CustomTabButton {...props} />;
};

export default function MyTabs() {
  const storedSettings = useSelector((state: RootState) => state.settings);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
      }}
      initialRouteName={localization.My_closet[storedSettings.language]}
    >
      <Tab.Screen
        name={localization.My_closet[storedSettings.language]}
        component={HomeBottom}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIcon: closetTabIcon,
          tabBarIconStyle: styles.tabIconStyle,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddNewCloths}
        options={{
          tabBarLabelStyle: { display: "none" },
          tabBarStyle: {
            display: "none",
          },
          tabBarIcon: addTabIcon,
          tabBarButton: addTabBarButton,
        }}
      />
      <Tab.Screen
        name={localization.Outfit_Log[storedSettings.language]}
        component={OutfitLog}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIcon: outfitTabIcon,
          tabBarIconStyle: styles.tabIconStyle,
        }}
      />
    </Tab.Navigator>
  );
}
