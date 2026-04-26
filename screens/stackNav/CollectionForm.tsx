import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useMemo, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { CustomInput } from "../../components/CustomInput";
import ColorModal from "../../components/ColorModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ThemeText } from "../../components/ThemeText";
import { addCollection, moveCollection } from "../../redux/itemsSlice";
// replaced FlashList with FlatList from react-native
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { colors as appColors } from "./../../utils/colors";
import { localization } from "../../utils/localization";
import { CollectionList } from "../../components/CollectionList";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import {
  COLLECTION_SORT_VALUES,
  getCollectionSortValue,
  type CollectionSortValue,
  getOrderedCollectionTags,
} from "../../utils/collectionOrder";
import { setCollectionSortValue } from "../../redux/settingsSlice";

export const CollectionForm = () => {
  // const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [colors, setColors] = useState([appColors.defaultCollectionColor]);
  const [refresh, setRefresh] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const CollectionsState = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const storedSettings = useSelector((state: RootState) => state.settings);
  const sortValue = getCollectionSortValue(storedSettings.collectionSortValue);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const dispatch = useDispatch();
  const colorScheme = String(
    useColorScheme()?.toUpperCase() ?? "LIGHT",
  ) as ThemeNameType;
  const language = storedSettings.language;

  const orderedCollections = useMemo(
    () => getOrderedCollectionTags(CollectionsState, sortValue),
    [CollectionsState, sortValue],
  );

  const sortOptions = useMemo(
    () => [
      {
        label: localization.Custom[language],
        value: COLLECTION_SORT_VALUES.CUSTOM,
      },
      {
        label: localization.Name_Asc[language],
        value: COLLECTION_SORT_VALUES.NAME_ASC,
      },
      {
        label: localization.Name_Desc[language],
        value: COLLECTION_SORT_VALUES.NAME_DESC,
      },
    ],
    [language],
  );

  const handleSortValueChange = (
    valueOrUpdater:
      | CollectionSortValue
      | ((prevState: CollectionSortValue) => CollectionSortValue),
  ) => {
    const nextSortValue =
      typeof valueOrUpdater === "function"
        ? valueOrUpdater(sortValue)
        : valueOrUpdater;

    dispatch(setCollectionSortValue({ collectionSortValue: nextSortValue }));
  };

  const addCollectionHandler = async () => {
    const errors = [];

    if (name.length <= 0) {
      errors.push("Please enter a name for this Collection");
    }
    if (name.length > 20) {
      errors.push("Please enter a name within 20 characters max");
    }
    if (
      CollectionsState.find(x => x.label.toLowerCase() === name.toLowerCase())
    ) {
      errors.push("Please enter a different name");
    }
    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    dispatch(
      addCollection({
        name: name,
        color: colors[0],
      }),
    );
  };

  const moveCollectionHandler = (value: string, direction: "up" | "down") => {
    dispatch(moveCollection({ value, direction }));
    setRefresh(prev => !prev);
  };

  return (
    <>
      <ColorModal
        colors={colors}
        setColors={setColors}
        visible={visible}
        setVisible={setVisible}
        colorSelection={0}
      />
      <ThemeView>
        <BackButton pageTitle={localization.Add_a_collection[language]} />

        <View style={styles.formGroup}>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: colors[0] }]}
            onPress={() => {
              setVisible(true);
            }}
          >
            <Icon2 name="colorize" size={30} color={appColors.mainCyan} />
          </TouchableOpacity>
          <CustomInput
            mode="outlined"
            outlineColor={appColors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={appColors.mainGreen}
            textContentType="name"
            style={styles.inputWidth}
            label={localization.Collection_name[language]}
            value={name}
            onChange={text => setName(text.nativeEvent.text)}
          />
          {errorsList.length > 0 && (
            <View>
              {errorsList.map((error, index) => {
                return (
                  <Text key={index} style={styles.errorText}>
                    {error}
                  </Text>
                );
              })}
            </View>
          )}
        </View>

        <Button
          mode="contained"
          buttonColor={appColors.mainCyan}
          textColor={appColors.white}
          onPress={() => {
            addCollectionHandler();
            Keyboard.dismiss();
          }}
          style={styles.saveButton}
        >
          {localization.Save[language]}
        </Button>
        <View style={styles.divider} />
        <ThemeText customStyle={styles.sectionTitle}>
          {localization.Collections[language]}
        </ThemeText>
        <View style={styles.sortRow}>
          <ThemeText customStyle={styles.sortLabel}>
            {localization.Sort[language]}
          </ThemeText>
          <View style={styles.sortControlWrapper}>
            <DropDownPicker
              open={isSortOpen}
              value={sortValue}
              items={sortOptions}
              setOpen={setIsSortOpen}
              setValue={handleSortValueChange}
              theme={colorScheme}
              listMode="SCROLLVIEW"
              style={styles.sortDropdown}
              dropDownContainerStyle={styles.sortDropdownContainer}
            />
          </View>
        </View>
        <CollectionList
          collections={orderedCollections}
          sortValue={sortValue}
          refresh={refresh}
          setRefresh={setRefresh}
          emptyText={localization.There_is_no_collection[language]}
          onMoveCollection={moveCollectionHandler}
        />
      </ThemeView>
    </>
  );
};
const styles = StyleSheet.create({
  formGroup: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  colorButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderWidth: 2,
    borderColor: appColors.gray,
    borderRadius: 12,
    marginTop: 8,
  },
  inputWidth: {
    width: "80%",
  },
  errorText: {
    color: appColors.error,
  },
  saveButton: {
    marginHorizontal: 40,
    marginVertical: 20,
  },
  divider: {
    width: "100%",
    height: 4,
    backgroundColor: appColors.gray,
  },
  sectionTitle: {
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 20,
    fontStyle: "italic",
  },
  sortRow: {
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sortLabel: {
    width: "20%",
    textAlign: "center",
  },
  sortControlWrapper: {
    width: "80%",
    zIndex: 2,
  },
  sortDropdown: {
    borderColor: appColors.mainGreen,
  },
  sortDropdownContainer: {
    borderColor: appColors.mainGreen,
  },
});
