import { Text, View, useColorScheme } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { BackButton } from "../../components/BackButton";
import { ThemeText } from "../../components/ThemeText";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { languagesList } from "../../utils/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CustomInput } from "../../components/CustomInput";
import { changeLanguage, userNameSetter } from "../../redux/settingsSlice";
import { Button, Snackbar } from "react-native-paper";
import { exportStoreToJson } from "../../utils/exportStoreToJson";
import { importStoreFromJson } from "../../utils/importStoreFromJson";

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

  return (
    <ThemeView classNameStyle="px-5">
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center mb-5">
          <BackButton />
          <ThemeText classNameStyle="text-xl">Settings</ThemeText>
        </View>
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
          {exportOrImport == 0
            ? "Exported to destination"
            : "Imported successfully"}
        </Snackbar>
        <View className="flex flex-row space-x-2 justify-between items-center">
          <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
            Your Name
          </ThemeText>
          <CustomInput
            mode="outlined"
            outlineColor="#AEBB77"
            selectionColor="#C0C0C0"
            activeOutlineColor="#AEBB77"
            textContentType="name"
            style={{ width: "50%" }}
            className="mb-5"
            label="User Name"
            value={storedSettings.name}
            onChange={(text) =>
              text.nativeEvent.text.length < 14 &&
              dispatch(userNameSetter({ name: text.nativeEvent.text }))
            }
          />
        </View>
        <View className="flex flex-row space-x-2 justify-between items-center mb-5">
          <ThemeText customStyle={{ paddingBottom: 10, fontSize: 15 }}>
            Language
          </ThemeText>
          <View style={{ zIndex: 2, marginBottom: 10, width: "50%" }}>
            <DropDownPicker
              open={openLang}
              value={lang}
              items={languagesList}
              setOpen={setOpenLang}
              setValue={setLang}
              mode="BADGE"
              placeholder="Language"
              style={{ borderColor: "#AEBB77" }}
              dropDownContainerStyle={{
                borderColor: "#AEBB77",
              }}
              theme={String(useColorScheme()?.toUpperCase()) as ThemeNameType}
            />
          </View>
        </View>
        <View className="flex flex-row justify-between items-center mb-5">
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
          >
            Export
          </Button>
        </View>
        <View className="flex flex-row justify-between items-center">
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
          >
            Import
          </Button>
        </View>
        {/* <View className="w-full h-1 bg-gray" /> */}
      </>
    </ThemeView>
  );
};
