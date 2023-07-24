import { ReactElement } from "react";
import { View, Text } from "react-native";
import { ThemeText } from "./ThemeText";

export const CollectionContainer = ({
  label,
  children,
  color,
}: {
  label: string;
  children: ReactElement;
  color: string;
}) => {
  return (
    <View
      style={{ backgroundColor: color }}
      className="flex flex-row flex-wrap w-4/5 h-auto self-center"
    >
      <View className="w-full h-8 bg-white flex flex-row items-center">
        <ThemeText classNameStyle="px-2 font-medium italic">{label}</ThemeText>
      </View>
      {children}
    </View>
  );
};
