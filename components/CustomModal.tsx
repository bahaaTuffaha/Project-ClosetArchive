import { Dispatch, ReactElement, SetStateAction } from "react";
import { useColorScheme } from "react-native";
import { colors } from "../utils/colors";
import { Button, Dialog, Portal } from "react-native-paper";
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
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={{
          minHeight: 200,
          backgroundColor: isDarkMode ? colors.gray : colors.white,
        }}
      >
        <Dialog.Title className="self-center text-2xl font-bold capitalize italic">
          {label}
        </Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>
          <Button textColor={colors.white} onPress={() => setVisible(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
export default CustomModal;
