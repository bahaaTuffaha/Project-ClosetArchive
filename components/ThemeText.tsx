import { ComponentProps } from "react";
import { useColorScheme, Text } from "react-native";

export const ThemeText = ({
  classNameStyle,
  customStyle,
  children,
}: {
  children: string;
  classNameStyle?: ComponentProps<"p">["className"];
  customStyle?: {};
}) => {
  //used for background usually
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Text
      className={classNameStyle}
      style={[{ color: isDarkMode ? "white" : "gray" }, customStyle]}
    >
      {children}
    </Text>
  );
};
