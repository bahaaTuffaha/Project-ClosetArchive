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
  setHeatMap,
  setReminder,
  userNameSetter,
} from "../../redux/settingsSlice";
import { Button, Checkbox, Snackbar } from "react-native-paper";
import { exportStoreToJson } from "../../utils/exportStoreToJson";
import { importStoreFromJson } from "../../utils/importStoreFromJson";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../utils/colors";
import { laundryRefresher } from "../../redux/itemsSlice";
import { localization } from "../../utils/localization";
import { handleNumberChange } from "../../utils/validators";

export const Settings = () => {
  const [openLang, setOpenLang] = useState(false);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [lang, setLang] = useState(
    storedSettings ? storedSettings.language : "",
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeLanguage({ lang: lang }));
  }, [lang]);
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [exportOrImport, setExportOrImport] = useState(0);
  const [checkedLau, setCheckedLau] = useState(storedSettings.enableLaundry);
  const [checkedRem, setCheckedRem] = useState(storedSettings.enableReminder);
  const [checkedHeatMap, setCheckedHeatMap] = useState(
    storedSettings.enableHeatMap,
  );
  const setCheckboxes = (
    // a callback
    enableLaundry: boolean,
    enableReminder: boolean,
    enableHeatMap: boolean,
  ) => {
    setCheckedLau(enableLaundry);
    setCheckedRem(enableReminder);
    setCheckedHeatMap(enableHeatMap);
  };
  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">
            {localization.Settings[storedSettings.language]}
          </ThemeText>
        </View>
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
          {exportOrImport == 0
            ? "Exported to destination"
            : "Imported successfully"}
        </Snackbar>
        <View className="w-full px-5 space-y-3 pt-2">
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } space-x-2 justify-between items-center`}
          >
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              {localization.Your_Name[storedSettings.language]}
            </ThemeText>
            <CustomInput
              mode="outlined"
              outlineColor={colors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={colors.mainGreen}
              textContentType="name"
              style={{
                width: "50%",
                textAlign: storedSettings.language == 1 ? "right" : "left",
              }}
              label={localization.User_Name[storedSettings.language]}
              value={storedSettings.name}
              onChange={(text) =>
                text.nativeEvent.text.length < 8 &&
                dispatch(userNameSetter({ name: text.nativeEvent.text }))
              }
            />
          </View>
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } space-x-2 justify-between items-center z-20`}
          >
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              {localization.Language[storedSettings.language]}
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
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } justify-between items-center`}
          >
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              {localization.Export[storedSettings.language]}
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
              {localization.Export[storedSettings.language]}
            </Button>
          </View>
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } justify-between items-center z-0 `}
          >
            <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
              {localization.Import[storedSettings.language]}
            </ThemeText>
            <Button
              onPress={async () => {
                if (await importStoreFromJson(setCheckboxes)) {
                  setExportOrImport(1);
                  onToggleSnackBar();
                }
              }}
              mode="contained"
              className="w-[50%]"
              buttonColor={colors.mainCyan}
            >
              {localization.Import[storedSettings.language]}
            </Button>
          </View>
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } justify-between items-center`}
          >
            <ThemeText customStyle={{ paddingBottom: 5, fontSize: 15 }}>
              {localization.Laundry_reminder[storedSettings.language]}
            </ThemeText>
            <CustomInput
              mode="outlined"
              outlineColor={colors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={colors.mainGreen}
              textContentType="name"
              className="w-[50px] mx-5"
              label={localization.N[storedSettings.language]}
              value={storedSettings.laundryNumber.toString()}
              onChange={(text) =>
                handleNumberChange(
                  () => {
                    dispatch(
                      laundryNumberSetter({
                        number: Number(text.nativeEvent.text),
                      }),
                    );
                    dispatch(laundryRefresher());
                  },
                  text.nativeEvent.text,
                  0,
                  30,
                )
              }
              keyboardType="numeric"
            />
            <ThemeText customStyle={{ paddingBottom: 5, fontSize: 15 }}>
              {localization.Times[storedSettings.language]}
            </ThemeText>
            <Checkbox
              status={checkedLau ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedLau((prev) => !prev);
                dispatch(setEnableLaundry({ enableLaundry: !checkedLau }));
              }}
            />
          </View>
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Icon name="info-circle" size={15} color={colors.mainCyan} />
            <ThemeText classNameStyle="text-xs mx-5">
              {localization.ThisWillRemind[storedSettings.language]}
            </ThemeText>
          </View>
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } justify-between items-center`}
          >
            <ThemeText customStyle={{ paddingBottom: 5, fontSize: 15 }}>
              {localization.Daily_reminder[storedSettings.language]}
            </ThemeText>
            <Checkbox
              status={checkedRem ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedRem((prev) => !prev);
                dispatch(setReminder({ enableReminder: !checkedRem }));
              }}
            />
          </View>

          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } justify-between items-center`}
          >
            <ThemeText customStyle={{ paddingBottom: 5, fontSize: 15 }}>
              {localization.Enable_heatMap[storedSettings.language]}
            </ThemeText>
            <Checkbox
              status={checkedHeatMap ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedHeatMap((prev) => !prev);
                dispatch(setHeatMap({ enableHeatMap: !checkedHeatMap }));
              }}
            />
          </View>
          <View
            className={`flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Icon name="info-circle" size={15} color={colors.mainCyan} />
            <ThemeText classNameStyle="text-xs mx-5">
              {localization.HeatMap_description[storedSettings.language]}
            </ThemeText>
          </View>
        </View>
        {/* <View className="w-full h-1 bg-gray" /> */}
      </>
    </ThemeView>
  );
};
