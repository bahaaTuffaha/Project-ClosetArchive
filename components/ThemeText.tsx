import { ComponentProps } from "react";
import { useColorScheme, Text } from "react-native";

export const ThemeText = ({
  classNameStyle,
  customStyle,
  darkColor = "white",
  lightColor = "gray",
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
