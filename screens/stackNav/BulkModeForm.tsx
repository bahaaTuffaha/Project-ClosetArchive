import { Button } from "react-native-paper";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { colors } from "../../utils/colors";
import { CustomInput } from "../../components/CustomInput";
import {
  Text,
  View,
  useColorScheme,
  StyleSheet,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useMemo } from "react";
import { ThemeText } from "../../components/ThemeText";
import Icon from "react-native-vector-icons/FontAwesome5";
import { handleNumberChange } from "../../utils/validators";
import { addItem } from "../../redux/itemsSlice";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import { CommonActions } from "@react-navigation/native";
import { clothesList, localization } from "../../utils/localization";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ReactNativeBlobUtil from "react-native-blob-util";
import ImageResizer from "@bam.tech/react-native-image-resizer";

export const BulkModeForm = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { selectedCategory } = route.params;
  const [prefix, setPrefix] = useState("");
  const [imageNum, setImageNum] = useState(2);
  const [openType, setOpenType] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const colorScheme = String(useColorScheme()?.toUpperCase()) as ThemeNameType;
  const [collection, setCollection] = useState([]);
  const [type, setType] = useState("");
  const dispatch = useDispatch();
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const storedSettings = useSelector((state: RootState) => state.settings);
  const collectionState = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const storedCatTypes = useSelector(
    (state: RootState) => state.CategoryList.CategoryCustomTypes,
  );

  const language = storedSettings.language ?? 0;
  const isRTL = language === 1;

  const combiningTypesData = useMemo(() => {
    if (selectedCategory <= 3) {
      return [
        ...(clothesList[language]?.[selectedCategory] || []),
        ...(storedCatTypes?.[selectedCategory]?.customTypes || []).map(
          item => ({
            label: item.label,
            value: item.value,
          }),
        ),
      ];
    }
    return (
      storedCatTypes?.[selectedCategory]?.customTypes.map(item => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [selectedCategory, language, storedCatTypes]);

  const createItemsFromUris = async (uris: string[]) => {
    try {
      for (let i = 0; i < uris.length; i++) {
        const response = await ImageResizer.createResizedImage(
          uris[i],
          500,
          500,
          "JPEG",
          40,
          0,
        );

        const imgBase64 = await ReactNativeBlobUtil.fs.readFile(
          response.uri,
          "base64",
        );

        dispatch(
          addItem({
            name: prefix + ` ${i + 1}`,
            collection: collection,
            category: selectedCategory,
            type: type,
            fit: "",
            season: "",
            size: "",
            sizeUnit: "",
            quantity: 1,
            purchaseDate: JSON.stringify(new Date()),
            image: imgBase64,
            automaticColor: false,
            primaryColor: "",
            secondaryColor: "",
            tertiaryColor: "",
          }),
        );
      }
      navigation.popToTop();
      navigation.dispatch(CommonActions.goBack());
    } catch (error) {
      console.error("Bulk item creation error:", error);
      Alert.alert("Error", "Something went wrong while processing images.");
    }
  };

  const handleImagePicker = async (mode: number) => {
    if (mode === 0) {
      // Gallery
      try {
        const response = await launchImageLibrary({
          mediaType: "photo",
          selectionLimit: imageNum,
        });

        if (response.didCancel || !response.assets) return;

        const uris = response.assets
          .map(asset => asset.uri)
          .filter((uri): uri is string => !!uri);

        createItemsFromUris(uris);
      } catch (error) {
        console.error("Gallery picker error:", error);
      }
    } else {
      // Camera
      Alert.alert(
        "Notice",
        "Camera mode requires taking one photo at a time. This feature is being updated.",
      );
    }
  };

  const addItemHandler = (mode: number) => {
    Keyboard.dismiss();
    const errors = [];

    if (prefix.trim().length <= 0) {
      errors.push("Please enter item prefix");
    } else if (prefix.length > 20) {
      errors.push("Please enter a name within 20 characters");
    }

    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    handleImagePicker(mode);
  };

  return (
    <ThemeView>
      <BackButton pageTitle={localization.addMultiItems[language]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <CustomInput
            mode="outlined"
            outlineColor={colors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={colors.mainGreen}
            textContentType="name"
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
            label={localization.Prefix[language]}
            value={prefix}
            onChangeText={setPrefix}
          />

          {combiningTypesData?.length > 0 && (
            <View style={[styles.dropdownContainer, { zIndex: 2 }]}>
              <DropDownPicker
                open={openType}
                value={type}
                items={combiningTypesData}
                setOpen={setOpenType}
                setValue={setType}
                mode="SIMPLE"
                listMode="MODAL"
                placeholder={localization.Type[language]}
                style={styles.picker}
                dropDownContainerStyle={styles.pickerDropdown}
                theme={colorScheme}
              />
            </View>
          )}

          <View style={[styles.dropdownContainer, { zIndex: 1 }]}>
            <DropDownPicker
              open={openCollection}
              value={collection}
              items={collectionState}
              setOpen={setOpenCollection}
              setValue={setCollection}
              multiple={true}
              theme={colorScheme}
              showBadgeDot={false}
              badgeTextStyle={{ color: colors.black }}
              mode="BADGE"
              placeholder={localization.Collection[language]}
              style={styles.picker}
              dropDownContainerStyle={styles.pickerDropdown}
            />
          </View>

          <CustomInput
            mode="outlined"
            outlineColor={colors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={colors.mainGreen}
            label={localization.NumberOfItems[language]}
            value={imageNum.toString()}
            onChangeText={text =>
              handleNumberChange(() => setImageNum(Number(text)), text, 0, 30)
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <View
            style={[
              styles.infoRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Icon name="info-circle" size={15} color={colors.mainCyan} />
            <ThemeText customStyle={styles.infoText}>
              {localization.bulkInfo[language]}
            </ThemeText>
          </View>

          {errorsList.length > 0 && (
            <View style={styles.errorContainer}>
              {errorsList.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  {error}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.buttonGroup}>
            <Button
              style={styles.actionButton}
              mode="contained"
              buttonColor={colors.mainCyan}
              textColor={colors.white}
              onPress={() => addItemHandler(0)}
            >
              {localization.startLocalImages[language]}
            </Button>

            <Button
              style={styles.actionButton}
              mode="contained"
              buttonColor={colors.mainCyan}
              textColor={colors.white}
              onPress={() => addItemHandler(1)}
            >
              {localization.startWCamera[language]}
            </Button>
          </View>
        </View>
      </ScrollView>
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    alignItems: "center",
    gap: 20,
    marginTop: 10,
  },
  input: {
    width: "80%",
  },
  dropdownContainer: {
    width: "80%",
  },
  picker: {
    borderColor: colors.mainGreen,
    borderRadius: 4,
  },
  pickerDropdown: {
    borderColor: colors.mainGreen,
  },
  infoRow: {
    width: "80%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  errorContainer: {
    width: "80%",
    alignItems: "center",
  },
  errorText: {
    color: "#C70039",
    fontSize: 14,
    marginBottom: 4,
  },
  buttonGroup: {
    width: "80%",
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
});
