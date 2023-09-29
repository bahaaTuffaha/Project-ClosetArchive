import { useNavigation } from "@react-navigation/native";
import { Keyboard, TouchableOpacity, View, useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const BackButton = () => {
  const navigation = useNavigation<any>();
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View className="absolute top-3 left-3 z-10">
      <TouchableOpacity
        className="w-12 h-12"
        onPress={() => {
          Keyboard.dismiss();
          navigation.goBack();
        }}
      >
        <Icon
          name="caret-back"
          size={30}
          color={isDarkMode ? "white" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};
