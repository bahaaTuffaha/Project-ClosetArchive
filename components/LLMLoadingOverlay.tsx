import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeText } from "./ThemeText";
import { colors } from "../utils/colors";

interface LLMLoadingOverlayProps {
  visible: boolean;
  preparingText: string;
  statusText: string;
}

export const LLMLoadingOverlay = ({
  visible,
  preparingText,
  statusText,
}: LLMLoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.mainGreen} />
      <ThemeText
        darkColor={colors.white}
        lightColor={colors.white}
        customStyle={styles.text}
      >
        {preparingText}
      </ThemeText>
      <ThemeText
        darkColor={colors.lightGray}
        lightColor={colors.lightGray}
        customStyle={styles.subtext}
      >
        {statusText}
      </ThemeText>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    paddingHorizontal: 32,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  subtext: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
  },
});
