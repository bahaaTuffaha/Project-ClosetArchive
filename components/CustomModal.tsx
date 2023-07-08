import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
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
          <Text className="self-center text-2xl font-bold mt-1">{label}</Text>
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
});
export default CustomModal;
