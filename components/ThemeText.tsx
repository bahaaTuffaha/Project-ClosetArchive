import { ReactNode } from "react";
import { useColorScheme, Text, StyleProp, TextStyle } from "react-native";
import { colors } from "../utils/colors";

export const ThemeText = ({
  classNameStyle,
  customStyle,
  darkColor = colors.white,
  lightColor = colors.gray,
  children,
}: {
  children?: ReactNode;
  classNameStyle?: string;
  customStyle?: StyleProp<TextStyle>;
  darkColor?: string;
  lightColor?: string;
}) => {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Text
      className={classNameStyle || ""}
      style={[{ color: isDarkMode ? darkColor : lightColor }, customStyle]}
    >
      {children}
    </Text>
  );
};
