import React, { ReactNode } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
  /** Optional content rendered under the disclaimer/message (e.g. section checkboxes). */
  children?: ReactNode;
  /** Disable confirm (e.g. when no sections are selected). */
  confirmDisabled?: boolean;
  confirmColor?: string;
}

export const ConfirmationDialog = ({
  visible,
  setVisible,
  onConfirm,
  title,
  message,
  children,
  confirmDisabled = false,
  confirmColor = colors.red,
}: ConfirmationDialogProps) => {
  const language =
    useSelector((state: RootState) => state.settings.language) || 0;

  const handleConfirm = () => {
    if (confirmDisabled) return;
    onConfirm();
    setVisible(false);
  };

  return (
    <CustomModal
      visible={visible}
      setVisible={setVisible}
      label={title || localization.Delete[language]}
      maxHeight={560}
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemeText customStyle={styles.message}>
            {message || localization.ConfirmDelete[language]}
          </ThemeText>
          {children != null ? (
            <View style={styles.extraContent}>{children}</View>
          ) : null}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.button}
            buttonColor={confirmColor}
            textColor={colors.white}
            disabled={confirmDisabled}
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
  scroll: {
    width: "100%",
    maxHeight: 360,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 4,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  extraContent: {
    width: "100%",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
});
