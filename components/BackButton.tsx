import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const BackButton = () => {
  const navigation = useNavigation<any>();
  return (
    <View className="absolute top-3 left-3 z-10">
      <TouchableOpacity
        className="w-12 h-12"
        onPress={() => navigation.goBack()}
      >
        <Icon name="caret-back" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};
