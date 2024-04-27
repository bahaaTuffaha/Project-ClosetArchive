import { Dispatch, SetStateAction, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  useColorScheme,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import Icon from "react-native-vector-icons/Fontisto";
import { Button, TextInput } from "react-native-paper";
import { ThemeText } from "./ThemeText";
import { colors as appColors } from "../utils/colors";
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
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}
    >
      <View style={ModalStyles.centeredView}>
        <View
          style={[
            ModalStyles.modalView,
            { backgroundColor: isDarkMode ? appColors.gray : appColors.white },
          ]}
        >
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            className="absolute top-3 right-3"
          >
            <Icon name="close-a" size={20} color="red" />
          </TouchableOpacity>
          <ThemeText classNameStyle="self-center text-2xl font-bold mt-1">
            Pick a color
          </ThemeText>
          <ColorPicker
            onInteractionStart={() => Keyboard.dismiss()}
            color={colors[colorSelection]}
            onColorChange={(color) => {
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
          {!Keyboard.isVisible() && (
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
          )}
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
        </View>
      </View>
    </Modal>
  );
};

export const ModalStyles = StyleSheet.create({
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
export default ColorModal;
