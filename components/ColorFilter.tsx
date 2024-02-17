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
  const isDarkMode = useColorScheme() === "dark";

  const basicColors = {
    yellow: "#FEFD00",
    yellowOrange: "#F8A900",
    yellowGreen: "#48FE00",
    orange: "#F67300",
    green: "#206F00",
    redOrange: "#F53C00",
    blueGreen: "#31A6A6",
    red: "#F40000",
    blue: "#1420FF",
    redViolet: "#BE0FAA",
    blueViolet: "#66169F",
    violet: "#AC1DFF",
  };

  return (
    <View style={styles.centeredView}>
      <ThemeText classNameStyle="self-center text-2xl font-bold mt-1">
        Filter By Color
      </ThemeText>
      <View className="flex flex-row flex-wrap">
        {Object.keys(basicColors).map((name) => (
          <View
            key={name}
            className="flex flex-col justify-center items-center bg-white rounded-md
            w-14 h-14 p-2 m-2"
          >
            <ThemeText customStyle={{ color: appColors.black, fontSize: 10 }}>
              {name}
            </ThemeText>
            <View
              style={{ backgroundColor: basicColors[name] }}
              className="w-5 h-5"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#49494968",
  },
  modalView: {
    backgroundColor: appColors.white,
    borderRadius: 20,
    width: "80%",
    height: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default ColorFilter;
