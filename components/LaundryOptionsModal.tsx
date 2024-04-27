import { Dispatch, SetStateAction } from "react";
import { View, Modal, useColorScheme, TouchableOpacity } from "react-native";
import { ModalStyles } from "./ColorModal";
import { colors } from "../utils/colors";
import Icon from "react-native-vector-icons/Fontisto";
import { ThemeText } from "./ThemeText";
import { localization } from "../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Checkbox } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const LaundryOptionsModal = ({
  openLaundryOpt,
  setOpenLaundryOpt,
  LaundryCheck,
  setLandryCheck,
}: {
  openLaundryOpt: boolean;
  setOpenLaundryOpt: Dispatch<SetStateAction<boolean>>;
  LaundryCheck: boolean;
  setLandryCheck: Dispatch<SetStateAction<boolean>>;
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const storedSettings = useSelector((state: RootState) => state.settings);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openLaundryOpt}
      onRequestClose={() => {
        setOpenLaundryOpt((prev) => !prev);
      }}
    >
      <View style={ModalStyles.centeredView}>
        <View
          style={[
            ModalStyles.modalView,
            { backgroundColor: isDarkMode ? colors.gray : colors.white },
          ]}
        >
          <TouchableOpacity
            onPress={() => setOpenLaundryOpt((prev) => !prev)}
            className="absolute top-3 right-3"
            hitSlop={{ bottom: 20, left: 20, right: 20, top: 20 }}
          >
            <Icon name="close-a" size={20} color="red" />
          </TouchableOpacity>
          <ThemeText classNameStyle="self-center text-2xl font-bold mt-1">
            Laundry Options
          </ThemeText>
          <View className="flex flex-col items-center mr-5">
            <ThemeText classNameStyle="text-xs">
              {localization.Washable[storedSettings.language]}
            </ThemeText>

            <View className="flex flex-row items-center">
              <Checkbox
                status={LaundryCheck ? "checked" : "unchecked"}
                onPress={() => {
                  setLandryCheck((prev) => !prev);
                }}
                color={colors.mainGreen}
              />
              <MaterialCommunityIcons
                name="bell-ring"
                size={25}
                color={colors.mainGreen}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
