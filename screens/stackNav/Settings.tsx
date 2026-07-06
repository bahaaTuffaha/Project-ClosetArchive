import {
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { BackButton } from "../../components/BackButton";
import { ThemeText } from "../../components/ThemeText";
import { LLMLoadingOverlay } from "../../components/LLMLoadingOverlay";
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
import { generateLLMText } from "../../utils/exportForLLM";
import Clipboard from "@react-native-clipboard/clipboard";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../utils/colors";
import { laundryRefresher } from "../../redux/itemsSlice";
import { localization } from "../../utils/localization";
import { handleNumberChange } from "../../utils/validators";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";

export const Settings = () => {
  const [openLang, setOpenLang] = useState(false);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const {
    language,
    name,
    laundryNumber,
    enableLaundry,
    enableReminder,
    enableHeatMap,
  } = storedSettings;
  const isRtl = language === 1;

  const [lang, setLang] = useState(language);
  const dispatch = useDispatch();

  useEffect(() => {
    setLang(language);
  }, [language]);

  useEffect(() => {
    dispatch(changeLanguage({ lang: lang }));
  }, [lang, dispatch]);

  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [exportOrImport, setExportOrImport] = useState(0);
  const [checkedLau, setCheckedLau] = useState(enableLaundry);
  const [checkedRem, setCheckedRem] = useState(enableReminder);
  const [checkedHeatMap, setCheckedHeatMap] = useState(enableHeatMap);

  // LLM copy states
  const [llmConfirmVisible, setLlmConfirmVisible] = useState(false);
  const [pendingWithImages, setPendingWithImages] = useState(false);
  const [isLLMGenerating, setIsLLMGenerating] = useState(false);

  const setCheckboxes = (
    newEnableLaundry: boolean,
    newEnableReminder: boolean,
    newEnableHeatMap: boolean,
  ) => {
    setCheckedLau(newEnableLaundry);
    setCheckedRem(newEnableReminder);
    setCheckedHeatMap(newEnableHeatMap);
  };

  const rowStyle = isRtl ? styles.rowReverse : styles.row;

  // LLM copy handlers (with confirmation)
  const handleLLMButtonPress = (withImages: boolean) => {
    setPendingWithImages(withImages);
    setLlmConfirmVisible(true);
  };

  const confirmAndCopyLLM = async () => {
    const withImages = pendingWithImages;
    setLlmConfirmVisible(false);

    if (withImages) {
      setIsLLMGenerating(true);
    }

    try {
      const text = await generateLLMText(withImages);
      Clipboard.setString(text);
      setExportOrImport(2);
      onToggleSnackBar();
    } catch (error) {
      console.warn("LLM export failed:", error);
    } finally {
      if (withImages) {
        setIsLLMGenerating(false);
      }
    }
  };

  return (
    <ThemeView>
      <BackButton pageTitle={localization.Settings[language]} />
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
        {exportOrImport === 0
          ? "Exported to destination"
          : exportOrImport === 1
          ? "Imported successfully"
          : localization.LLMCopied[language]}
      </Snackbar>
      <View style={styles.container}>
        <View style={[rowStyle, { columnGap: 8 }]}>
          <ThemeText customStyle={styles.textLabel10}>
            {localization.Your_Name[language]}
          </ThemeText>
          <CustomInput
            mode="outlined"
            outlineColor={colors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={colors.mainGreen}
            textContentType="name"
            style={[{ width: "50%" }, { textAlign: isRtl ? "right" : "left" }]}
            label={localization.User_Name[language]}
            value={name}
            onChange={(text: any) =>
              text.nativeEvent.text.length < 8 &&
              dispatch(userNameSetter({ name: text.nativeEvent.text }))
            }
          />
        </View>
        <View style={[rowStyle, { columnGap: 8 }, { zIndex: 20 }]}>
          <ThemeText customStyle={styles.textLabel10}>
            {localization.Language[language]}
          </ThemeText>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={openLang}
              value={lang}
              items={languagesList}
              setOpen={setOpenLang}
              setValue={setLang}
              mode="SIMPLE"
              placeholder="Language"
              style={styles.dropdown}
              dropDownContainerStyle={{ borderColor: colors.mainGreen }}
              theme={String(useColorScheme()?.toUpperCase()) as ThemeNameType}
            />
          </View>
        </View>
        <View style={rowStyle}>
          <ThemeText customStyle={styles.textLabel10}>
            {localization.Export[language]}
          </ThemeText>
          <Button
            onPress={async () => {
              if (await exportStoreToJson()) {
                setExportOrImport(0);
                onToggleSnackBar();
              }
            }}
            mode="contained"
            style={{ width: "50%" }}
            buttonColor={colors.mainCyan}
          >
            {localization.Export[language]}
          </Button>
        </View>
        <View style={[rowStyle, { zIndex: 0 }]}>
          <ThemeText customStyle={styles.textLabel10}>
            {localization.Import[language]}
          </ThemeText>
          <Button
            onPress={async () => {
              if (await importStoreFromJson(setCheckboxes)) {
                setExportOrImport(1);
                onToggleSnackBar();
              }
            }}
            mode="contained"
            style={{ width: "50%" }}
            buttonColor={colors.mainCyan}
          >
            {localization.Import[language]}
          </Button>
        </View>

        <View style={rowStyle}>
          <ThemeText customStyle={styles.textLabel5}>
            {localization.Laundry_reminder[language]}
          </ThemeText>
          <CustomInput
            mode="outlined"
            outlineColor={colors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={colors.mainGreen}
            textContentType="name"
            style={styles.laundryInput}
            label={localization.N[language]}
            value={laundryNumber.toString()}
            onChange={(text: any) =>
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
          <ThemeText customStyle={styles.textLabel5}>
            {localization.Times[language]}
          </ThemeText>
          <Checkbox
            status={checkedLau ? "checked" : "unchecked"}
            onPress={() => {
              setCheckedLau(prev => !prev);
              dispatch(setEnableLaundry({ enableLaundry: !checkedLau }));
            }}
          />
        </View>
        <View style={{ flexDirection: isRtl ? "row-reverse" : "row" }}>
          <Icon name="info-circle" size={15} color={colors.mainCyan} />
          <ThemeText customStyle={styles.infoText}>
            {localization.ThisWillRemind[language]}
          </ThemeText>
        </View>
        <View style={rowStyle}>
          <ThemeText customStyle={styles.textLabel5}>
            {localization.Daily_reminder[language]}
          </ThemeText>
          <Checkbox
            status={checkedRem ? "checked" : "unchecked"}
            onPress={() => {
              setCheckedRem(prev => !prev);
              dispatch(setReminder({ enableReminder: !checkedRem }));
            }}
          />
        </View>

        <View style={rowStyle}>
          <ThemeText customStyle={styles.textLabel5}>
            {localization.Enable_heatMap[language]}
          </ThemeText>
          <Checkbox
            status={checkedHeatMap ? "checked" : "unchecked"}
            onPress={() => {
              setCheckedHeatMap(prev => !prev);
              dispatch(setHeatMap({ enableHeatMap: !checkedHeatMap }));
            }}
          />
        </View>
        <View style={{ flexDirection: isRtl ? "row-reverse" : "row" }}>
          <Icon name="info-circle" size={15} color={colors.mainCyan} />
          <ThemeText customStyle={styles.infoText}>
            {localization.HeatMap_description[language]}
          </ThemeText>
        </View>

        {/* LLM export buttons moved to the end of settings */}
        <View style={{ width: "100%" }}>
          <Button
            onPress={() => handleLLMButtonPress(false)}
            mode="contained"
            style={{ width: "100%" }}
            buttonColor={colors.mainCyan}
            disabled={isLLMGenerating}
          >
            {localization.LLMText[language]}
          </Button>
        </View>
        <View style={{ width: "100%" }}>
          <Button
            onPress={() => handleLLMButtonPress(true)}
            mode="contained"
            style={{ width: "100%" }}
            buttonColor={colors.mainGreen}
            disabled={isLLMGenerating}
          >
            {localization.LLMWithImages[language]}
          </Button>
        </View>
        <View style={{ flexDirection: isRtl ? "row-reverse" : "row" }}>
          <Icon name="info-circle" size={15} color={colors.mainCyan} />
          <ThemeText customStyle={styles.infoText}>
            {localization.LLM_info[language]}
          </ThemeText>
        </View>
      </View>

      <>
        <ConfirmationDialog
          visible={llmConfirmVisible}
          setVisible={setLlmConfirmVisible}
          onConfirm={confirmAndCopyLLM}
          title={localization.LLMConfirmTitle[language]}
          message={localization.LLMConfirmMessage[language]}
        />

        <LLMLoadingOverlay
          visible={isLLMGenerating}
          preparingText={localization.LLMLoadingPreparing[language]}
          compressingText={localization.LLMLoadingCompressing[language]}
        />
      </>
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 8,
    rowGap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowReverse: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textLabel10: {
    paddingBottom: 10,
    fontSize: 15,
  },
  textLabel5: {
    paddingBottom: 5,
    fontSize: 15,
  },

  dropdownWrapper: {
    marginBottom: 10,
    width: "50%",
  },
  dropdown: {
    borderColor: colors.mainGreen,
    zIndex: 10,
  },

  laundryInput: {
    width: 50,
    marginHorizontal: 20,
  },

  infoText: {
    fontSize: 12,
    marginHorizontal: 20,
  },
});
