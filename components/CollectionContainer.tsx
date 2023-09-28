import { ReactElement, useState } from "react";
import { Pressable, View, useColorScheme } from "react-native";
import { ThemeText } from "./ThemeText";
import Icon from "react-native-vector-icons/Ionicons";

export const CollectionContainer = ({
  label,
  children,
  color = "gray",
}: {
  label: string;
  children: ReactElement;
  color?: string;
}) => {
  const [isFolded, setIsFolded] = useState(true);
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View
      style={{ backgroundColor: color }}
      className="flex flex-row flex-wrap w-full h-auto self-center border-[0.4px]"
    >
      <Pressable
        onPress={() => {
          setIsFolded((prev) => !prev);
        }}
        className="w-full h-8 flex flex-row items-center justify-between pr-5"
        style={{ backgroundColor: isDarkMode ? "#181818" : "white" }}
      >
        <ThemeText classNameStyle="px-2 font-medium italic">{label}</ThemeText>
        <Icon
          color={isDarkMode ? "white" : "black"}
          name={isFolded ? "chevron-down" : "chevron-up"}
          size={20}
        />
      </Pressable>
      {isFolded && children}
    </View>
  );
};
