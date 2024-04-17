import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/stackNav/Home";
import { Category } from "../screens/stackNav/Category";
import { ItemForm } from "../screens/stackNav/ItemForm";
import { CategoryForm } from "../screens/stackNav/CategoryForm";
import { ItemSelector } from "../screens/stackNav/ItemSelector";
import { EventLogForm } from "../screens/stackNav/EventLogForm";
import { CollectionForm } from "../screens/stackNav/CollectionForm";
import { Settings } from "../screens/stackNav/Settings";
import { ClosetInfo } from "../screens/stackNav/ClosetInfo";
import { ModeScreen } from "../screens/stackNav/ModeScreen";
export default function Navigator() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="StackNavHome"
          component={Home}
          options={{ headerShown: false, orientation: "portrait" }}
        />
        <Stack.Screen
          name="CollectionForm"
          component={CollectionForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ClosetInfo"
          component={ClosetInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ModeScreen"
          component={ModeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ItemSelector"
          component={ItemSelector}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryForm"
          component={CategoryForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ItemForm"
          component={ItemForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventLogForm"
          component={EventLogForm}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
