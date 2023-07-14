import { Dispatch, SetStateAction, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import Icon from "react-native-vector-icons/Fontisto";
import { TextInput } from "react-native-paper";
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            className="absolute top-3 right-3"
          >
            <Icon name="close-a" size={20} color="red" />
          </TouchableOpacity>
          <Text className="self-center text-2xl font-bold mt-1">
            Pick a color
          </Text>
          <ColorPicker
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
          <TextInput
            mode="outlined"
            outlineColor="#AEBB77"
            // textColor="#BB77AE"
            selectionColor="#C0C0C0"
            activeOutlineColor="#AEBB77"
            textContentType="name"
            className="m-2"
            theme={{ roundness: 10, colors: { background: "white" } }}
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#49494968",
  },
  modalView: {
    backgroundColor: "white",
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
