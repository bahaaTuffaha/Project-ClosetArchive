import { ComponentProps, ReactElement } from "react";
import { useColorScheme, View } from "react-native";

export const ThemeView = ({
  classNameStyle,
  children,
}: {
  children: ReactElement;
  classNameStyle?: ComponentProps<"div">["className"];
}) => {
  //used for background usually
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View
      className={classNameStyle}
      style={{ flex: 1, backgroundColor: isDarkMode ? "gray" : "white" }}
    >
      {children}
    </View>
  );
};