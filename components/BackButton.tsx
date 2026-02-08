import { useNavigation } from "@react-navigation/native";
import {
  Keyboard,
  TouchableOpacity,
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { ThemeText } from "./ThemeText";

interface BackButtonProps {
  pageTitle?: string;
}

export const BackButton = ({ pageTitle }: BackButtonProps) => {
  const navigation = useNavigation<any>();
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View style={styles.container}>
      {pageTitle && (
        <View style={styles.titleContainer}>
          <ThemeText classNameStyle="text-xl italic">{pageTitle}</ThemeText>
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Keyboard.dismiss();
          navigation.goBack();
        }}
      >
        <Icon
          name="caret-back"
          size={30}
          color={isDarkMode ? colors.white : colors.black}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    left: 12,
    zIndex: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
