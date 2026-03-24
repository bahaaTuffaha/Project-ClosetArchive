import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { localization } from "../utils/localization";
import { colors } from "../utils/colors";
import { ThemeText } from "./ThemeText";
import CustomModal from "./CustomModal";

interface ConfirmationDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmationDialog = ({
  visible,
  setVisible,
  onConfirm,
  title,
  message,
}: ConfirmationDialogProps) => {
  const language =
    useSelector((state: RootState) => state.settings.language) || 0;

  const handleConfirm = () => {
    onConfirm();
    setVisible(false);
  };

  return (
    <CustomModal
      visible={visible}
      setVisible={setVisible}
      label={title || localization.Delete[language]}
    >
      <View style={styles.container}>
        <ThemeText customStyle={styles.message}>
          {message || localization.ConfirmDelete[language]}
        </ThemeText>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.button}
            buttonColor={colors.red}
            textColor={colors.white}
          >
            {localization.Yes[language]}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setVisible(false)}
            style={styles.button}
            buttonColor={colors.darkblue}
            textColor={colors.white}
          >
            {localization.No[language]}
          </Button>
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
});
