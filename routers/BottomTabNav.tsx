import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AddNewCloths } from "../screens/bottomNav/AddNewCloths";
import { HomeBottom } from "../screens/bottomNav/HomeBottom";
import { Image, Pressable, View, useColorScheme } from "react-native";
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

const CustomTabButton = ({
  children,
  onPress,
}: {
  children: any;
  onPress?: any;
}) => {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Pressable
      onPress={onPress}
      style={{ top: -30, justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          backgroundColor: colors.mainCyan,
          borderRadius: 50,
          borderColor: isDarkMode ? colors.darkblue : colors.white,
          borderWidth: 5,
        }}
      >
        {children}
      </View>
    </Pressable>
  );
};
export default function MyTabs() {
  const storedSettings = useSelector((state: RootState) => state.settings);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // backgroundColor: 'rgba(34,36,40,1)',
          marginHorizontal: 5,
          height: 85,
          backgroundColor: colors.mainCyan,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 5,
        },
      }}
      initialRouteName={localization.My_closet[storedSettings.language]}
    >
      <Tab.Screen
        name={localization.My_closet[storedSettings.language]}
        component={HomeBottom}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarLabelStyle: {
            fontSize: 14,
            fontStyle: "italic",
          },
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  resizeMode="contain"
                  source={focused ? closetIcon : closetUnselectedIcon}
                  style={{ height: 50, width: 50 }}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddNewCloths}
        options={{
          tabBarLabelStyle: { display: "none" },
          tabBarStyle: {
            display: "none", //hiding bottomNav
          },
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  resizeMode="contain"
                  source={addIcon}
                  style={{ height: 25, width: 25 }}
                />
              </View>
            );
          },
          tabBarButton: (props) => {
            return <CustomTabButton {...props} />;
          },
        }}
      />
      <Tab.Screen
        name={localization.Outfit_Log[storedSettings.language]}
        component={OutfitLog}
        options={{
          tabBarActiveTintColor: colors.white,
          tabBarLabelStyle: { fontSize: 14, fontStyle: "italic" },
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  resizeMode="contain"
                  source={focused ? outfitLogIcon : outfitLogUnselectedIcon}
                  style={{ height: 50, width: 50 }}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
