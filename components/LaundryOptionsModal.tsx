import { Dispatch, SetStateAction } from "react";
import { View, useColorScheme } from "react-native";
import { colors } from "../utils/colors";
import { ThemeText } from "./ThemeText";
import { localization } from "../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Checkbox, Dialog, Portal } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CustomInput } from "./CustomInput";
import { handleNumberChange } from "../utils/validators";

export const LaundryOptionsModal = ({
  openLaundryOpt,
  setOpenLaundryOpt,
  LaundryCheck,
  setLandryCheck,
  overrideMaxLaundry,
  setOverrideMaxLaundry,
  maxLaundryNumber,
  setMaxLaundryNumber,
}: {
  openLaundryOpt: boolean;
  setOpenLaundryOpt: Dispatch<SetStateAction<boolean>>;
  LaundryCheck: boolean;
  setLandryCheck: Dispatch<SetStateAction<boolean>>;
  overrideMaxLaundry: boolean;
  setOverrideMaxLaundry: Dispatch<SetStateAction<boolean>>;
  maxLaundryNumber: number;
  setMaxLaundryNumber: Dispatch<SetStateAction<number>>;
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const storedSettings = useSelector((state: RootState) => state.settings);
  const rtl = storedSettings.language == 1 ? "flex-row-reverse" : "flex-row";

  return (
    <Portal>
      <Dialog
        visible={openLaundryOpt}
        onDismiss={() => setOpenLaundryOpt(false)}
        style={{
          minHeight: 200,
          backgroundColor: isDarkMode ? colors.gray : colors.white,
        }}
      >
        <Dialog.Title className="self-center">
          {localization.Laundry_Options[storedSettings.language]}
        </Dialog.Title>
        <Dialog.Content>
          <View className="space-y-2">
            <View className={`flex ${rtl} items-center justify-start`}>
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
              <ThemeText classNameStyle="mx-1">
                {localization.Washable[storedSettings.language]}
              </ThemeText>
            </View>
            <View className={`flex ${rtl} justify-start items-center`}>
              <Checkbox
                disabled={!LaundryCheck}
                status={overrideMaxLaundry ? "checked" : "unchecked"}
                onPress={() => {
                  setOverrideMaxLaundry((prev) => !prev);
                }}
              />
              <ThemeText>
                {localization.Override_Laundry[storedSettings.language]}
              </ThemeText>
              <CustomInput
                mode="outlined"
                outlineColor={colors.mainGreen}
                selectionColor="#C0C0C0"
                activeOutlineColor={colors.mainGreen}
                textContentType="name"
                className="h-[40px] w-[50px] mx-5"
                value={String(maxLaundryNumber || 0)}
                disabled={!overrideMaxLaundry}
                onChange={(text) =>
                  handleNumberChange(
                    () => {
                      setMaxLaundryNumber(Number(text.nativeEvent.text));
                    },
                    text.nativeEvent.text,
                    0,
                    30,
                  )
                }
                keyboardType="numeric"
              />
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            textColor={colors.white}
            onPress={() => setOpenLaundryOpt(false)}
          >
            {localization.Close[storedSettings.language]}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
