import { Dispatch, SetStateAction, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import { ThemeText } from "./ThemeText";
import { colors as appColors } from "../utils/colors";
import { Text } from "react-native-paper";

// const handleSlicePress = (color) => {
//   Alert.alert("Color Selected", `You selected color: ${color}`);
// };

const ColorFilter = ({
  colors,
  setColors,
}: {
  colors: string[];
  setColors: Dispatch<SetStateAction<string[]>>;
}) => {
  // const isDarkMode = useColorScheme() === "dark";

  const basicColors: { [key: string]: string } = {
    yellow: "#FEFD00",
    yellow_Orange: "#F8A900",
    yellow_Green: "#48FE00",
    orange: "#F67300",
    green: "#206F00",
    red_Orange: "#F53C00",
    blue_Green: "#31A6A6",
    red: "#F40000",
    blue: "#1420FF",
    red_Violet: "#BE0FAA",
    blue_Violet: "#66169F",
    violet: "#AC1DFF",
    black: "#000",
    white: "#fff",
    gray: "#808080",
    unknown: "",
  };

  return (
    <View>
      <ThemeText classNameStyle="self-center text-xl font-bold mt-1 my-1">
        Filter By Color
      </ThemeText>
      <View className="flex flex-row flex-wrap w-full">
        {Object.keys(basicColors).map((name) => (
          <TouchableOpacity
            onPress={() => {
              if (!colors.includes(name)) {
                setColors((prev) => [...prev, name]);
              } else {
                setColors((prev) => prev.filter((color) => color !== name));
              }
            }}
            key={name}
            className={`flex flex-col justify-center items-center bg-white rounded-md
            w-16 h-16  m-1 border-solid border-mainCyan ${
              colors.includes(name) ? "border-[3px]" : ""
            }`}
          >
            <Text
              style={{
                fontSize: 9,
                textTransform: "capitalize",
                color: appColors.black,
              }}
            >
              {name}
            </Text>
            <View
              style={{ backgroundColor: basicColors[name] }}
              className="w-10 h-10"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ColorFilter;
