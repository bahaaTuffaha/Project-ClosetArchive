import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/stackNav/Home";
import { AddNewItem } from "../screens/stackNav/AddNewItem";
export default function Navigator() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="StackNavHome"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddNewItem"
          component={AddNewItem}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
