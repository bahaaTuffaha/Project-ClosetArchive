import { View, useColorScheme } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { BackButton } from "../../components/BackButton";
import { ThemeText } from "../../components/ThemeText";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { languagesList } from "../../utils/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CustomInput } from "../../components/CustomInput";
import {
  changeLanguage,
  laundryNumberSetter,
  setEnableLaundry,
  userNameSetter,
} from "../../redux/settingsSlice";
import { Button, Checkbox, Snackbar } from "react-native-paper";
import { exportStoreToJson } from "../../utils/exportStoreToJson";
import { importStoreFromJson } from "../../utils/importStoreFromJson";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../utils/colors";
import { itemRefresher } from "../../redux/itemsSlice";

export const handleNumberChange = (
  func: any,
  text: string,
  min: number,
  max: number,
) => {
  // Use regular expressions to allow only numbers and optionally a single decimal point
  const regex = /^[0-9]*\.?[0-9]*$/;
  if (regex.test(text) && Number(text) >= min && Number(text) <= max) {
    func();
  }
};

export const Settings = () => {
  const [openLang, setOpenLang] = useState(false);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [lang, setLang] = useState(
    storedSettings ? storedSettings.language : "",
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // return () => {

    // }
    dispatch(changeLanguage({ lang: lang }));
  }, [lang]);
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [exportOrImport, setExportOrImport] = useState(0);
  const [checked, setChecked] = useState(storedSettings.enableLaundry);

  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">Settings</ThemeText>
        </View>
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
          {exportOrImport == 0
            ? "Exported to destination"
            : "Imported successfully"}
        </Snackbar>
        <View className="w-full px-5 space-y-3 pt-2">
          <View className="flex flex-row space-x-2 justify-between items-center">
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              Your Name
            </ThemeText>
            <CustomInput
              mode="outlined"
              outlineColor={colors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={colors.mainGreen}
              textContentType="name"
              style={{ width: "50%" }}
              label="User Name"
              value={storedSettings.name}
              onChange={(text) =>
                text.nativeEvent.text.length < 8 &&
                dispatch(userNameSetter({ name: text.nativeEvent.text }))
              }
            />
          </View>
          <View className="flex flex-row space-x-2 justify-between items-center z-20">
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              Language
            </ThemeText>
            <View style={{ marginBottom: 10, width: "50%" }}>
              <DropDownPicker
                open={openLang}
                value={lang}
                items={languagesList}
                setOpen={setOpenLang}
                setValue={setLang}
                mode="SIMPLE"
                placeholder="Language"
                style={{ borderColor: colors.mainGreen, zIndex: 10 }}
                dropDownContainerStyle={{
                  borderColor: colors.mainGreen,
                }}
                theme={String(useColorScheme()?.toUpperCase()) as ThemeNameType}
              />
            </View>
          </View>
          <View className="flex flex-row justify-between items-center">
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              Export
            </ThemeText>
            <Button
              onPress={async () => {
                if (await exportStoreToJson()) {
                  setExportOrImport(0);
                  onToggleSnackBar();
                }
              }}
              mode="contained"
              className="w-[50%]"
              buttonColor={colors.mainCyan}
            >
              Export
            </Button>
          </View>
          <View className="flex flex-row justify-between items-center z-0 ">
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              Import
            </ThemeText>
            <Button
              onPress={async () => {
                if (await importStoreFromJson()) {
                  setExportOrImport(1);
                  onToggleSnackBar();
                }
              }}
              mode="contained"
              className="w-[50%]"
              buttonColor={colors.mainCyan}
            >
              Import
            </Button>
          </View>
          <View className="flex flex-row justify-between items-center">
            <ThemeText customStyle={{ paddingBottom: 5, fontSize: 15 }}>
              Laundry Reminder
            </ThemeText>
            <CustomInput
              mode="outlined"
              outlineColor={colors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={colors.mainGreen}
              textContentType="name"
              className="w-[50px] mx-5"
              label="n"
              value={storedSettings.laundryNumber.toString()}
              onChange={(text) =>
                handleNumberChange(
                  () => {
                    dispatch(
                      laundryNumberSetter({
                        number: Number(text.nativeEvent.text),
                      }),
                    );
                    dispatch(itemRefresher());
                  },
                  text.nativeEvent.text,
                  0,
                  30,
                )
              }
              keyboardType="numeric"
            />
            <ThemeText customStyle={{ paddingBottom: 5, fontSize: 15 }}>
              times
            </ThemeText>
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked((prev) => !prev);
                dispatch(setEnableLaundry({ enableLaundry: !checked }));
              }}
            />
          </View>
          <View className="flex flex-row">
            <Icon name="info-circle" size={15} color={colors.mainCyan} />
            <ThemeText classNameStyle="text-xs mx-5">
              This will remind you to put an item in the laundry after n number
              of uses.
            </ThemeText>
          </View>
        </View>
        {/* <View className="w-full h-1 bg-gray" /> */}
      </>
    </ThemeView>
  );
};
