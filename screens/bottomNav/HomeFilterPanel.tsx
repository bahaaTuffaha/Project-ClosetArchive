import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, RadioButton } from "react-native-paper";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import ColorFilter from "../../components/ColorFilter";
import { colors } from "../../utils/colors";
import { localization } from "../../utils/localization";
import { clothesList } from "../../utils/localization";
import { seasonList } from "../../utils/data";

type SetString = React.Dispatch<React.SetStateAction<string>>;
type SetBool = React.Dispatch<React.SetStateAction<boolean>>;
type SetArray<T> = React.Dispatch<React.SetStateAction<T[]>>;

export type HomeFilterState = {
  sortValue: string;
  seasonFilter: string;
  categoriesFilter: any[];
  TypeFilter: string[];
  colorFilter: string[];
  OpenSeasonFilter: boolean;
  OpenCategoriesFilter: boolean;
  OpenTypeFilter: boolean;
  OpenColorFilter: boolean;
};

export type HomeFilterActions = {
  setSortValue: SetString;
  setSeasonFilter: SetString;
  setCategoriesFilter: SetArray<any>;
  setTypeFilter: SetArray<string>;
  setColorFilter: SetArray<string>;
  setOpenSeasonFilter: SetBool;
  setOpenCategoriesFilter: SetBool;
  setOpenTypeFilter: SetBool;
};

type Props = {
  filterState: HomeFilterState;
  filterActions: HomeFilterActions;
  CategoriesList: any[];
  colorScheme: ThemeNameType;
  storedSettings: any;
  storedCatTypes: any[];
};

const HomeFilterPanel = ({
  filterState,
  filterActions,
  CategoriesList,
  colorScheme,
  storedSettings,
  storedCatTypes,
}: Props) => {
  if (!storedSettings) return null;
  const language = storedSettings.language ?? 0;

  const {
    sortValue,
    seasonFilter,
    categoriesFilter,
    TypeFilter,
    colorFilter,
    OpenSeasonFilter,
    OpenCategoriesFilter,
    OpenTypeFilter,
    OpenColorFilter,
  } = filterState;

  const {
    setSortValue,
    setSeasonFilter,
    setCategoriesFilter,
    setTypeFilter,
    setColorFilter,
    setOpenSeasonFilter,
    setOpenCategoriesFilter,
    setOpenTypeFilter,
  } = filterActions;

  const radioColor = colors.mainCyan;

  return (
    <>
      {OpenColorFilter ? (
        <ColorFilter colors={colorFilter} setColors={setColorFilter} />
      ) : (
        <>
          <RadioButton.Group
            onValueChange={value => setSortValue(value)}
            value={sortValue}
          >
            <RadioButton.Item
              label={localization.Last_Added[language]}
              value="LA"
              color={radioColor}
              labelStyle={styles.radioItem}
            />
            <RadioButton.Item
              label={localization.Name_Asc[language]}
              value="NA"
              color={radioColor}
              labelStyle={styles.radioItem}
            />
            <RadioButton.Item
              label={localization.Name_Desc[language]}
              value="ND"
              color={radioColor}
              labelStyle={styles.radioItem}
            />
            <RadioButton.Item
              label={localization.PurchaseDateAsc[language]}
              value="PDA"
              color={radioColor}
              labelStyle={styles.radioItem}
            />
            <RadioButton.Item
              label={localization.PurchaseDateDesc[language]}
              value="PDD"
              color={radioColor}
              labelStyle={styles.radioItem}
            />
          </RadioButton.Group>

          <View
            style={[styles.dropdownWrapper, styles.zIndex4, { marginTop: 5 }]}
          >
            <DropDownPicker
              open={OpenSeasonFilter}
              value={seasonFilter}
              items={[
                { label: localization.SeasonNotSpecified[language], value: "" },
                ...(seasonList[language] || []),
              ]}
              setOpen={setOpenSeasonFilter}
              setValue={setSeasonFilter}
              theme={colorScheme}
              showBadgeDot={false}
              badgeTextStyle={{ color: colors.black }}
              placeholder="Season filter"
              listMode="SCROLLVIEW"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <View style={[styles.dropdownWrapper, styles.zIndex3]}>
            <DropDownPicker
              open={OpenCategoriesFilter}
              value={categoriesFilter}
              items={CategoriesList}
              setOpen={setOpenCategoriesFilter}
              setValue={setCategoriesFilter}
              multiple={true}
              theme={colorScheme}
              showBadgeDot={false}
              badgeTextStyle={{ color: colors.black }}
              mode="BADGE"
              listMode="SCROLLVIEW"
              placeholder={localization.CategoryFilter[language]}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {categoriesFilter.length === 1 && (
            <View style={[styles.dropdownWrapper, styles.zIndex2]}>
              <DropDownPicker
                open={OpenTypeFilter}
                value={TypeFilter}
                items={(
                  (clothesList as any)[language][categoriesFilter[0]] ?? []
                )
                  .concat(
                    storedCatTypes[categoriesFilter[0]]?.customTypes || [],
                  )
                  .map((item: any) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                setOpen={setOpenTypeFilter}
                setValue={setTypeFilter}
                multiple={true}
                theme={colorScheme}
                showBadgeDot={false}
                badgeTextStyle={{ color: colors.black }}
                mode="BADGE"
                listMode="MODAL"
                placeholder={localization.TypeFilter[language]}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
            </View>
          )}
          <Button
            mode="contained-tonal"
            buttonColor={radioColor}
            style={styles.resetButton}
            textColor={colors.white}
            onPress={() => {
              setSeasonFilter("");
              setCategoriesFilter([]);
              setTypeFilter([]);
              setSortValue("LA");
            }}
          >
            {localization.Reset[language]}
          </Button>
        </>
      )}
    </>
  );
};

export default HomeFilterPanel;

const styles = StyleSheet.create({
  // Radio Group
  radioItem: {
    fontSize: 14,
  },

  // Dropdown Pickers
  dropdownWrapper: {
    width: "90%",
    marginBottom: 20,
  },
  zIndex4: { zIndex: 4 },
  zIndex3: { zIndex: 3 },
  zIndex2: { zIndex: 2 },

  dropdown: {
    borderColor: colors.mainGreen,
  },
  dropdownContainer: {
    borderColor: colors.mainGreen,
  },

  // Actions
  resetButton: {
    alignSelf: "center",
    marginTop: 20,
    width: "80%",
  },
});
