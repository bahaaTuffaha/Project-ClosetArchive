import { Dispatch, SetStateAction, useState } from "react";
import { View, Keyboard, useColorScheme } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { Button, TextInput } from "react-native-paper";
import { colors as appColors } from "../utils/colors";
import CustomModal from "./CustomModal";
let Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
const ColorModal = ({
  setVisible,
  visible,
  colors,
  setColors,
  colorSelection,
}: {
  colors: string[];
  colorSelection: number;
  setColors: Dispatch<SetStateAction<string[]>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}) => {
  let newColors = colors;
  const [currentColor, setCurrentColor] = useState(colors[colorSelection]);
  const isDarkMode = useColorScheme() === "dark";

  return (
    <CustomModal
      visible={visible}
      setVisible={setVisible}
      label="Pick a color"
      minHeight={250}
    >
      <>
        <View className="h-52">
          <ColorPicker
            onInteractionStart={() => Keyboard.dismiss()}
            color={colors[colorSelection]}
            onColorChangeComplete={(color) => {
              newColors[colorSelection] = color;
              setColors(newColors);
              setCurrentColor(color);
            }}
            thumbSize={40}
            sliderSize={40}
            noSnap={true}
            row={false}
            swatches={false}
            sliderHidden={true}
          />
        </View>
        <View className="flex flex-row justify-center">
          <Button
            mode="text"
            textColor={isDarkMode ? appColors.white : appColors.mainCyan}
            onPress={() => {
              newColors[colorSelection] = "#ffffff";
              setColors(newColors);
              setCurrentColor("#ffffff");
            }}
          >
            Reset
          </Button>
          <Button
            mode="text"
            textColor={appColors.black}
            onPress={() => {
              newColors[colorSelection] = "#000";
              setColors(newColors);
              setCurrentColor("#000");
            }}
          >
            Set Black
          </Button>
        </View>
        <TextInput
          mode="outlined"
          outlineColor={appColors.mainGreen}
          selectionColor="#C0C0C0"
          activeOutlineColor={appColors.mainGreen}
          textContentType="name"
          className="m-2"
          theme={{
            roundness: 10,
            colors: {
              background: isDarkMode ? appColors.darkblue : appColors.white,
            },
          }}
          label="HEX"
          value={currentColor}
          onChange={(text) => {
            setCurrentColor(text.nativeEvent.text);
            if (Reg_Exp.test(currentColor)) {
              newColors[colorSelection] = currentColor;
              setColors(newColors);
            }
          }}
        />
      </>
    </CustomModal>
  );
};
export default ColorModal;
