import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import { ThemeText } from "./ThemeText";
import { colors } from "../utils/colors";
const CustomModal = ({
  setVisible,
  visible,
  label,
  children,
}: {
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  label: string;
  children: ReactElement;
}) => {
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
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: isDarkMode ? colors.gray : colors.white },
          ]}
        >
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            className="h-7 w-10 bg-red flex flex-row justify-center items-center z-20 rounded-tr-2xl absolute top-0 right-0"
          >
            <Text className="font-bold text-white">X</Text>
          </TouchableOpacity>
          <ThemeText classNameStyle="self-center text-2xl font-bold mt-[0.5px] capitalize">
            {label}
          </ThemeText>
          {children}
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
    borderStyle: "dashed",
    borderColor: "green",
    borderWidth: 1,
  },
  modalView: {
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
});
export default CustomModal;
