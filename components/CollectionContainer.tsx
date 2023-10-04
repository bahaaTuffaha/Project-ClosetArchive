import { ReactElement, useState } from "react";
import { Pressable, View, useColorScheme } from "react-native";
import { ThemeText } from "./ThemeText";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleCollection } from "../redux/itemsSlice";
import { colors } from "../utils/colors";

export const CollectionContainer = ({
  label,
  children,
  color = colors.gray,
}: {
  label: string;
  children: ReactElement;
  color?: string;
}) => {
  const collectionTags = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const [isFolded, setIsFolded] = useState(
    collectionTags.find((x) => x.label === label)?.isOpen,
  );
  const isDarkMode = useColorScheme() === "dark";
  const dispatch = useDispatch();
  return (
    <View
      style={{ backgroundColor: color }}
      className="flex flex-row flex-wrap w-full h-auto self-center border-[0.4px]"
    >
      <Pressable
        onPress={() => {
          setIsFolded((prev) => !prev);
          dispatch(toggleCollection({ name: label }));
        }}
        className="w-full h-8 flex flex-row items-center justify-between pr-5"
        style={{ backgroundColor: isDarkMode ? "#181818" : colors.white }}
      >
        <ThemeText darkColor={colors.mainCyan} classNameStyle="px-2 font-medium italic">
          {label}
        </ThemeText>
        <Icon
          color={isDarkMode ? colors.white : colors.black}
          name={isFolded ? "chevron-down" : "chevron-up"}
          size={20}
        />
      </Pressable>
      {isFolded && children}
    </View>
  );
};
