import { ReactElement } from "react";
import { useColorScheme } from "react-native";
import { colors } from "../utils/colors";
import { Button, Dialog, Portal } from "react-native-paper";
import { localization } from "../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
const CustomModal = ({
  setVisible,
  visible,
  label,
  minHeight = 200,
  maxHeight,
  showClose = true,
  children,
}: {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  label?: string;
  minHeight?: number;
  maxHeight?: number;
  showClose?: boolean;
  children: ReactElement;
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const storedSettings = useSelector((state: RootState) => state.settings);
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={{
          minHeight: minHeight,
          maxHeight: maxHeight,
          backgroundColor: isDarkMode ? colors.gray : colors.white,
        }}
      >
        {label && (
          <Dialog.Title
            style={{
              color: isDarkMode ? colors.white : colors.gray,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              fontStyle: "italic",
              paddingHorizontal: 10,
              marginHorizontal: 0,
            }}
          >
            {label}
          </Dialog.Title>
        )}
        <Dialog.Content>{children}</Dialog.Content>
        {showClose && (
          <Dialog.Actions>
            <Button textColor={colors.white} onPress={() => setVisible(false)}>
              {localization.Close[storedSettings.language]}
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
};
export default CustomModal;
