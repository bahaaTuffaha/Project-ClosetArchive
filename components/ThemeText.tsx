import { ComponentProps } from "react";
import { useColorScheme, Text } from "react-native";
import { colors } from "../utils/colors";

export const ThemeText = ({
  classNameStyle,
  customStyle,
  darkColor = colors.white,
  lightColor = colors.gray,
  children,
}: {
  children: string;
  classNameStyle?: ComponentProps<"p">["className"];
  customStyle?: {};
  darkColor?: string;
  lightColor?: string;
}) => {
  //used for background usually
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Text
      className={classNameStyle}
      style={[{ color: isDarkMode ? darkColor : lightColor }, customStyle]}
    >
      {children}
    </Text>
  );
};
