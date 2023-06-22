import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AddNewCloths } from "../screens/bottomNav/AddNewCloths";
import { Settings } from "../screens/bottomNav/Settings";
import { HomeBottom } from "../screens/bottomNav/HomeBottom";
import { Image, Pressable, View, useColorScheme } from "react-native";
import closetIcon from '../assets/images/closet.png';
import closetUnselectedIcon from '../assets/images/closetUnselected.png';
import addIcon from '../assets/images/add.png';
import settingsIcon from '../assets/images/settings.png';
import settingsUnselectedIcon from '../assets/images/settingsUnselected.png';
const Tab = createBottomTabNavigator();

const CustomTabButton = ({ children, onPress }: { children: any, onPress?: any }) => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <Pressable onPress={onPress} style={{ top: -30, justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: 70, height: 70, backgroundColor: "#77AEBB", borderRadius: 50, borderColor: isDarkMode ? "gray" : "#ffffff", borderWidth: 5 }}>
                {children}
            </View>
        </Pressable>
    )
}
export default function MyTabs() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false, tabBarStyle: {
                // backgroundColor: 'rgba(34,36,40,1)',
                height: "10%",
                backgroundColor: "#77AEBB", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 5
            },
        }} initialRouteName="My closet">
            <Tab.Screen name="My closet" component={HomeBottom} options={{
                tabBarActiveTintColor: "white",
                tabBarLabelStyle: {
                    fontSize: 14, fontStyle: "italic"
                },
                tabBarIcon: ({ focused }) => {
                    return <View>
                        <Image resizeMode="contain" source={focused ? closetIcon : closetUnselectedIcon} style={{ height: 50, width: 50 }} />
                    </View>
                }
            }} />
            <Tab.Screen name="Add" component={AddNewCloths} options={{
                tabBarLabelStyle: { display: "none" },
                tabBarStyle: {
                    display: "none" //hiding bottomNav
                },
                tabBarIcon: ({ focused }) => {
                    return <View>
                        <Image resizeMode="contain" source={addIcon} style={{ height: 25, width: 25 }} />
                    </View>
                }, tabBarButton: (props) => {
                    return <CustomTabButton {...props} />;
                }
            }} />
            <Tab.Screen name="Settings" component={Settings} options={{
                tabBarActiveTintColor: "white",
                tabBarLabelStyle: { fontSize: 14, fontStyle: "italic" },
                tabBarIcon: ({ focused }) => {
                    return <View>
                        <Image resizeMode="contain" source={focused ? settingsIcon : settingsUnselectedIcon} style={{ height: 50, width: 50 }} />
                    </View>
                }
            }} />
        </Tab.Navigator>
    );
}