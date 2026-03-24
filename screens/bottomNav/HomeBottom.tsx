import {
  View,
  useColorScheme,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemBox } from "../../components/ItemBox";
import { item } from "../../redux/itemsSlice";
import { useNavigation } from "@react-navigation/native";
import settingsIcon from "../../assets/images/settings.png";
import settingsIconDark from "../../assets/images/settingsUnselected.png";
import { colors } from "../../utils/colors";
import { useSharedValue } from "react-native-reanimated";
import { SideModal } from "../../components/SideModal";
import HomeFilterPanel, {
  HomeFilterActions,
  HomeFilterState,
} from "./HomeFilterPanel";
import HomeHeader from "./HomeHeader";
import {
  HomeFilter,
  filterCollectionsBySearch,
  filterItemsBySearch,
} from "../../utils/filters";
import { defaultCategories } from "../stackNav/Category";
import useWidthScreen from "../../hooks/useWidthScreen";
import { ThemeNameType } from "react-native-dropdown-picker";
import { CollectionContainer } from "../../components/CollectionContainer";
import { localization } from "../../utils/localization";

export function HomeBottom() {
  //this is the main page
  const navigation = useNavigation<any>();
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const [search, setSearch] = useState("");
  const searchFocus = useRef<any>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";

  const [sortValue, setSortValue] = useState("LA");
  const [categoriesFilter, setCategoriesFilter] = useState<any[]>([]);
  const [TypeFilter, setTypeFilter] = useState<string[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [colorFilter, setColorFilter] = useState<string[]>([]);

  const [OpenCategoriesFilter, setOpenCategoriesFilter] = useState(false);
  const [OpenTypeFilter, setOpenTypeFilter] = useState(false);
  const [OpenSeasonFilter, setOpenSeasonFilter] = useState(false);
  const [OpenColorFilter, setOpenColorFilter] = useState(false);

  const filterState: HomeFilterState = {
    sortValue,
    seasonFilter,
    categoriesFilter,
    TypeFilter,
    colorFilter,
    OpenSeasonFilter,
    OpenCategoriesFilter,
    OpenTypeFilter,
    OpenColorFilter,
  };

  const filterActions: HomeFilterActions = {
    setSortValue,
    setSeasonFilter,
    setCategoriesFilter,
    setTypeFilter,
    setColorFilter,
    setOpenSeasonFilter,
    setOpenCategoriesFilter,
    setOpenTypeFilter,
  };

  const refreshLaundry = useSelector(
    (state: RootState) => state.itemsList.refreshLaundry,
  );
  const storedSettings = useSelector((state: RootState) => state.settings);

  const storedCategories = useSelector(
    (state: RootState) => state.CategoryList.Categories,
  );

  const storedCatTypes = useSelector(
    (state: RootState) => state.CategoryList.CategoryCustomTypes,
  );

  const CategoriesList = defaultCategories
    .concat(storedCategories)
    ?.map(cat => ({
      label: cat.name[storedSettings.language ?? 0],
      value: cat.index,
    }));

  const colorScheme = (useColorScheme()?.toUpperCase() ??
    "LIGHT") as ThemeNameType;
  const space = useSharedValue(-20);
  const [isOpen, setIsOpen] = useState(false);
  const screenWidth = useWidthScreen();

  const handleOpenDrawer = () => {
    Keyboard.dismiss();
    setIsOpen(prev => !prev);
    if (!isOpen) {
      space.value = screenWidth / 2 - 20;
    }
  };

  const groupedCollectionsRaw = useMemo(() => {
    let final: item[][] = [];
    let tags = itemsState.collectionTags;
    let items = itemsState.items;

    if (tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const col = items.filter(x => x.collection?.includes(tags[i].value));
        final.push(col);
      }
    } else {
      final.push([]);
    }

    const nonColRaw = items.filter(
      x => !x.collection || x.collection.length === 0,
    );

    return { final, nonColRaw };
  }, [itemsState.items, itemsState.collectionTags]);

  const filteredData = useMemo(() => {
    const filters = {
      categories: categoriesFilter,
      sortValue: sortValue,
      types: TypeFilter,
      season: seasonFilter,
      colors: colorFilter,
    };

    const filteredCol = HomeFilter(
      filters,
      [...groupedCollectionsRaw.final],
      true,
    ) as item[][];
    const filteredNon = HomeFilter(
      filters,
      [...groupedCollectionsRaw.nonColRaw],
      false,
    ) as item[];

    return {
      collections: filterCollectionsBySearch(filteredCol, search),
      nonCollectnized: filterItemsBySearch(filteredNon, search),
    };
  }, [
    groupedCollectionsRaw,
    categoriesFilter,
    sortValue,
    TypeFilter,
    seasonFilter,
    colorFilter,
    search,
  ]);

  useEffect(() => {
    if (categoriesFilter.length !== 1) setTypeFilter([]);
  }, [categoriesFilter]);

  const laundryItems = useMemo(() => {
    if (!storedSettings.enableLaundry) return [];
    return itemsState.items.filter(
      x =>
        (x.laundryCounter ?? 0) >=
          (x.overrideMaxLaundry ?? false
            ? x.maxLaundryNumber
            : storedSettings.laundryNumber) &&
        (x.laundryable ?? true),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    itemsState.items,
    storedSettings.enableLaundry,
    storedSettings.laundryNumber,
    refreshLaundry,
  ]);

  return (
    <ThemeView customStyle={styles.screenContainer}>
      <SideModal space={space} isOpen={isOpen} setIsOpen={setIsOpen}>
        <HomeFilterPanel
          filterState={filterState}
          filterActions={filterActions}
          CategoriesList={CategoriesList}
          colorScheme={colorScheme}
          storedSettings={storedSettings}
          storedCatTypes={storedCatTypes}
        />
      </SideModal>

      <HomeHeader
        navigation={navigation}
        storedSettings={storedSettings}
        isDarkMode={isDarkMode}
        settingsIcon={settingsIcon}
        settingsIconDark={settingsIconDark}
        handleOpenDrawer={handleOpenDrawer}
        setOpenColorFilter={setOpenColorFilter}
        setIsSearchVisible={setIsSearchVisible}
        isSearchVisible={isSearchVisible}
        searchFocus={searchFocus}
        setSearch={setSearch}
        search={search}
      />

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {storedSettings.enableLaundry &&
            laundryItems.length > 0 &&
            !search && (
              <CollectionContainer
                color={colors.gray}
                label={
                  localization.Laundry_reminder[storedSettings.language ?? 0]
                }
                LaundryReminder={true}
              >
                <View style={styles.gridContainer}>
                  {laundryItems.map((lItem, lIndex) => (
                    <View
                      key={`laundry-${lItem.id}-${lIndex}`}
                      style={styles.gridItem}
                    >
                      <ItemBox
                        primary={lItem.primaryColor || colors.white}
                        secondary={lItem.secondaryColor || colors.white}
                        tertiary={lItem.tertiaryColor || colors.white}
                        image={lItem.image}
                        name={lItem.name}
                        type={lItem.type}
                        id={lItem.id}
                        logs={lItem.logIds || []}
                      />
                    </View>
                  ))}
                </View>
              </CollectionContainer>
            )}

          {itemsState.collectionTags.map((collection, index) => {
            const collectionItems = filteredData.collections[index];
            if (!collectionItems || collectionItems.length === 0) return null;

            return (
              <CollectionContainer
                key={`collection-${index}`}
                color={collection.color ?? colors.white}
                label={collection.label}
              >
                <View style={styles.gridContainer}>
                  {collectionItems.map(collectionItem => (
                    <View
                      key={`colItem-${collectionItem.id}`}
                      style={styles.gridItem}
                    >
                      <ItemBox
                        primary={collectionItem.primaryColor || colors.white}
                        secondary={
                          collectionItem.secondaryColor || colors.white
                        }
                        tertiary={collectionItem.tertiaryColor || colors.white}
                        image={collectionItem.image}
                        name={collectionItem.name}
                        type={collectionItem.type}
                        id={collectionItem.id}
                        logs={collectionItem.logIds || []}
                      />
                    </View>
                  ))}
                </View>
              </CollectionContainer>
            );
          })}

          {filteredData.nonCollectnized.length > 0 && (
            <View style={styles.gridContainer}>
              {filteredData.nonCollectnized.map((nonItem, idx) => (
                <View
                  key={`nonItem-${nonItem.id || idx}`}
                  style={styles.gridItem}
                >
                  <ItemBox
                    primary={nonItem.primaryColor || colors.white}
                    secondary={nonItem.secondaryColor || colors.white}
                    tertiary={nonItem.tertiaryColor || colors.white}
                    image={nonItem.image}
                    name={nonItem.name}
                    type={nonItem.type}
                    id={nonItem.id}
                    logs={nonItem.logIds || []}
                  />
                </View>
              ))}
            </View>
          )}

          <View
            style={
              isSearchVisible
                ? styles.bottomSpacerLarge
                : styles.bottomSpacerSmall
            }
          />
        </ScrollView>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  // Main Layout
  screenContainer: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: colors.lightGray,
    marginTop: "1%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: "85%",
    paddingBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },

  // Item Grids
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    justifyContent: "flex-start",
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 5,
  },

  // Spacing & Utilities
  bottomSpacerSmall: {
    height: 24,
  },
  bottomSpacerLarge: {
    height: 144,
  },
});
