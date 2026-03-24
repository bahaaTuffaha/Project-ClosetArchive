import { ComponentProps, ReactElement } from "react";
import { useColorScheme, View } from "react-native";
import { colors } from "../utils/colors";

export const ThemeView = ({
  classNameStyle,
  customStyle,
  children,
}: {
  children: ReactElement[];
  classNameStyle?: ComponentProps<"div">["className"];
  customStyle?: {};
}) => {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View
      className={classNameStyle || ""}
      style={[
        {
          flex: 1,
          backgroundColor: isDarkMode ? colors.darkblue : colors.white,
        },
        customStyle,
      ]}
    >
      {children}
    </View>
  );
};
