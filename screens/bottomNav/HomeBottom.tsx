import {
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
  ScrollView,
  Keyboard,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import Icon from "react-native-vector-icons/Feather";
import { useEffect, useRef, useState } from "react";
import { Button, RadioButton, Searchbar } from "react-native-paper";
import { ThemeText } from "../../components/ThemeText";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemBox } from "../../components/ItemBox";
import { CollectionContainer } from "../../components/CollectionContainer";
import { item } from "../../redux/itemsSlice";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import settingsIcon from "../../assets/images/settings.png";
import settingsIconDark from "../../assets/images/settingsUnselected.png";
import { addOpacityToHex, colors } from "../../utils/colors";
import { FlashList } from "@shopify/flash-list";
import { useSharedValue } from "react-native-reanimated";
import { SideModal } from "../../components/SideModal";
import { HomeFilter } from "../../utils/filters";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import { seasonList } from "../../utils/data";
import { clothesList, localization } from "../../utils/localization";
import { defaultCategories } from "../stackNav/Category";
import ColorFilter from "../../components/ColorFilter";
import useWidthScreen from "../../hooks/useWidthScreen";

export function filterCollectionsBySearch(array: item[][], search: string) {
  let newAllCollections = [];
  for (let i in array) {
    newAllCollections.push(
      array[i].filter((x) =>
        x.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }
  return newAllCollections;
}
export function filter(array: item[], search: string) {
  return array.filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase()),
  );
}

export function HomeBottom() {
  //this is the main page
  const navigation = useNavigation<any>();
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const [search, setSearch] = useState("");
  const searchFocus = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const [allCollections, setAllCollections] = useState<item[][]>([]);
  const [nonCollectnized, setNonCollectnized] = useState<item[]>([]);
  const [laundryItems, setLaundryItems] = useState<item[]>([]);
  const [allCollectnizedFilter, setAllCollectnizedFilter] = useState<item[][]>(
    [],
  );
  const [nonCollectnizedFilter, setNonCollectnizedFilter] = useState<item[]>(
    [],
  );

  const [sortValue, setSortValue] = useState("LA");
  const [categoriesFilter, setCategoriesFilter] = useState([]);
  const [TypeFilter, setTypeFilter] = useState<string[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [colorFilter, setColorFilter] = useState<string[]>([]);

  const [OpenCategoriesFilter, setOpenCategoriesFilter] = useState(false);
  const [OpenTypeFilter, setOpenTypeFilter] = useState(false);
  const [OpenSeasonFilter, setOpenSeasonFilter] = useState(false);
  const [OpenColorFilter, setOpenColorFilter] = useState(false);

  const refreshItems = useSelector(
    (state: RootState) => state.itemsList.refreshItems,
  );
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
    ?.map((item) => ({
      label: item.name[storedSettings.language],
      value: item.index,
    }));

  const colorScheme = String(useColorScheme()?.toUpperCase()) as ThemeNameType;
  const space = useSharedValue(-20);
  const [isOpen, setIsOpen] = useState(false);
  const screenWidth = useWidthScreen();

  const handleOpenDrawer = () => {
    // Update the space value to trigger the animation
    Keyboard.dismiss();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      space.value = screenWidth / 2 - 20;
    }
  };
  useEffect(() => {
    let col = [];
    let nonCol = [];
    let final = [];
    if (itemsState.collectionTags.length > 0) {
      // if there is a collection and items
      for (let i = 0; i < itemsState.collectionTags.length; i++) {
        col = [];
        nonCol = [];
        for (let j = 0; j < itemsState.items.length; j++) {
          if (
            itemsState.items[j].collection?.includes(
              itemsState.collectionTags[i].value,
            )
          ) {
            col.push(itemsState.items[j]);
          } else if (itemsState.items[j].collection?.length == 0) {
            nonCol.push(itemsState.items[j]);
          }
        }
        final.push(col);
      }
    } else {
      // if there is no collections
      nonCol = [];
      for (let i = 0; i < itemsState.items.length; i++) {
        if (itemsState.items[i].collection?.length == 0) {
          nonCol.push(itemsState.items[i]);
        }
      }
      final.push([]);
    }
    setAllCollections(
      HomeFilter(
        {
          categories: categoriesFilter,
          sortValue: sortValue,
          types: TypeFilter,
          season: seasonFilter,
          colors: colorFilter,
        },
        final,
        true,
      ) as item[][],
    );
    setNonCollectnized(
      HomeFilter(
        {
          categories: categoriesFilter,
          sortValue: sortValue,
          types: TypeFilter,
          season: seasonFilter,
          colors: colorFilter,
        },
        nonCol,
        false,
      ) as item[],
    );
    return () => {
      col = null;
      nonCol = null;
      final = null;
    };
  }, [
    itemsState.items,
    refreshItems,
    categoriesFilter,
    sortValue,
    TypeFilter,
    seasonFilter,
    colorFilter,
  ]);

  useEffect(() => {
    if (storedSettings.enableLaundry) {
      setLaundryItems(
        itemsState.items.filter(
          (x) =>
            (x.laundryCounter ?? 0) >=
              (x.overrideMaxLaundry ?? false
                ? x.maxLaundryNumber
                : storedSettings.laundryNumber) &&
            (x.laundryable ?? true),
        ),
      );
    }
  }, [
    storedSettings.laundryNumber,
    itemsState.logs,
    refreshLaundry,
    storedSettings.enableLaundry,
  ]);

  useEffect(() => {
    setAllCollectnizedFilter(
      filterCollectionsBySearch(
        HomeFilter(
          {
            categories: categoriesFilter,
            sortValue: sortValue,
            types: TypeFilter,
            season: seasonFilter,
            colors: colorFilter,
          },
          allCollections,
          true,
        ) as item[][],
        search,
      ),
    );
    setNonCollectnizedFilter(
      filter(
        HomeFilter(
          {
            categories: categoriesFilter,
            sortValue: sortValue,
            types: TypeFilter,
            season: seasonFilter,
            colors: colorFilter,
          },
          nonCollectnized,
          false,
        ) as item[],
        search,
      ),
    );
  }, [
    search,
    categoriesFilter,
    sortValue,
    TypeFilter,
    seasonFilter,
    colorFilter,
  ]);

  useEffect(() => {
    if (categoriesFilter.length != 1) setTypeFilter([]);
  }, [categoriesFilter]);

  return (
    <ThemeView classNameStyle="px-5">
      <>
        <SideModal space={space} isOpen={isOpen} setIsOpen={setIsOpen}>
          {OpenColorFilter ? (
            <>
              <ColorFilter colors={colorFilter} setColors={setColorFilter} />
            </>
          ) : (
            <>
              <RadioButton.Group
                onValueChange={(value) => setSortValue(value)}
                value={sortValue}
              >
                <RadioButton.Item
                  label={localization.Last_Added[storedSettings.language]}
                  value="LA"
                  color={colors.mainCyan}
                  labelStyle={{ fontSize: 14 }}
                />
                <RadioButton.Item
                  label={localization.Name_Asc[storedSettings.language]}
                  value="NA"
                  color={colors.mainCyan}
                  labelStyle={{ fontSize: 14 }}
                />
                <RadioButton.Item
                  label={localization.Name_Desc[storedSettings.language]}
                  value="ND"
                  color={colors.mainCyan}
                  labelStyle={{ fontSize: 14 }}
                />
                <RadioButton.Item
                  label={localization.PurchaseDateAsc[storedSettings.language]}
                  value="PDA"
                  color={colors.mainCyan}
                  labelStyle={{ fontSize: 14 }}
                />
                <RadioButton.Item
                  label={localization.PurchaseDateDesc[storedSettings.language]}
                  value="PDD"
                  color={colors.mainCyan}
                  labelStyle={{ fontSize: 14 }}
                />
              </RadioButton.Group>
              <View
                style={{
                  zIndex: Math.floor(Math.random() * 2) + 4,
                  width: "90%",
                  marginTop: 5,
                  marginBottom: 20,
                }}
              >
                <DropDownPicker
                  open={OpenSeasonFilter}
                  value={seasonFilter}
                  items={[
                    {
                      label:
                        localization.SeasonNotSpecified[
                          storedSettings.language
                        ],
                      value: "",
                    },
                    ...seasonList[storedSettings.language],
                  ]}
                  setOpen={setOpenSeasonFilter}
                  setValue={setSeasonFilter}
                  theme={colorScheme}
                  showBadgeDot={false}
                  badgeTextStyle={{ color: colors.black }}
                  placeholder="Season filter"
                  style={{ borderColor: colors.mainGreen }}
                  dropDownContainerStyle={{ borderColor: colors.mainGreen }}
                />
              </View>
              <View
                style={{
                  zIndex: Math.floor(Math.random() * 2) + 2,
                  width: "90%",
                  marginBottom: 20,
                }}
              >
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
                  placeholder={
                    localization.CategoryFilter[storedSettings.language]
                  }
                  style={{
                    borderColor: colors.mainGreen,
                  }}
                  dropDownContainerStyle={{ borderColor: colors.mainGreen }}
                />
              </View>
              {categoriesFilter.length == 1 && (
                <View style={{ zIndex: 1, width: "90%" }}>
                  <DropDownPicker
                    open={OpenTypeFilter}
                    value={TypeFilter}
                    items={(
                      clothesList[storedSettings.language][
                        categoriesFilter[0]
                      ] ?? []
                    )
                      .concat(
                        storedCatTypes[categoriesFilter[0]]?.customTypes || [],
                      )
                      ?.map((item) => ({
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
                    placeholder={
                      localization.TypeFilter[storedSettings.language]
                    }
                    style={{ borderColor: colors.mainGreen }}
                    dropDownContainerStyle={{ borderColor: colors.mainGreen }}
                  />
                </View>
              )}
              <Button
                mode="contained-tonal"
                buttonColor={colors.mainCyan}
                className="self-center mt-5 w-[80%]"
                textColor="white"
                onPress={() => {
                  setSeasonFilter("");
                  setCategoriesFilter([]);
                  setTypeFilter([]);
                  setSortValue("LA");
                }}
              >
                {localization.Reset[storedSettings.language]}
              </Button>
            </>
          )}
        </SideModal>

        <View className="flex flex-col">
          <View
            className={`w-full flex ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            } justify-between items-center pt-5`}
          >
            <View className="flex flex-row space-x-2 justify-center items-center">
              <ThemeText classNameStyle="font-light text-lg italic">
                {localization.Welcome[storedSettings.language] +
                  storedSettings.name}
              </ThemeText>
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                className="rounded-full"
              >
                {/* <IonIcon
                name="settings-outline"
                size={25}
                color={isDarkMode ? "white" : "gray"}
              /> */}
                <Image
                  style={{ width: 35, height: 35 }}
                  source={isDarkMode ? settingsIcon : settingsIconDark}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("CollectionForm")}
              className="flex flex-col bg-mainGreen w-[20%] h-12 justify-center items-center rounded-t-2xl"
            >
              <Icon name="plus-square" size={20} color={colors.white} />
              <Text className="text-xs text-white">
                {localization.Collection[storedSettings.language]}
              </Text>
            </TouchableOpacity>
            <View className="bg-mainCyan w-[20%] h-12 rounded-t-2xl absolute -z-10 right-1 bottom-1 " />
            <View className="bg-mainPink w-[20%] h-12 rounded-t-2xl absolute -z-20 right-2 bottom-2 " />
          </View>
          <View className="w-full flex flex-col mt-5">
            <View className="w-full flex flex-row justify-between">
              <TouchableOpacity
                onPress={() => navigation.navigate("ClosetInfo")}
                className={`flex ${
                  storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
                } items-center h-14 w-[37%] bg-goldenrod rounded-tl-2xl shadow-2xl`}
              >
                <View className="flex flex-row space-x-1 justify-center items-center w-full">
                  <FontAwesome5
                    name="question-circle"
                    size={30}
                    color={colors.white}
                  />

                  <Text className="text-white font-bold capitalize">
                    {localization.ClosetInfo[storedSettings.language]}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleOpenDrawer();
                  setOpenColorFilter(true);
                }}
                className="h-14 w-[20%] bg-mainPink justify-center items-center shadow-xl"
              >
                <Ionicons
                  name="color-palette-outline"
                  size={28}
                  color={colors.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleOpenDrawer();
                  setOpenColorFilter(false);
                }}
                className="h-14 w-[20%] bg-mainGreen justify-center items-center shadow-xl"
              >
                <Icon name="filter" size={26} color={colors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await setIsSearchVisible(!isSearchVisible);
                  setSearch("");
                  if (!isSearchVisible) {
                    setTimeout(() => {
                      try {
                        searchFocus.current.focus();
                      } catch (e) {
                        console.log("searchFocus has an error:", e);
                      }
                    }, 100);
                  }
                }}
                className="h-14 w-[20%] bg-mainCyan rounded-tr-2xl justify-center items-center shadow-xl"
              >
                <Icon name="search" size={30} color={colors.white} />
              </TouchableOpacity>
            </View>
            {isSearchVisible && (
              <Searchbar
                className="mt-[1%]"
                ref={searchFocus}
                theme={{
                  roundness: 0,
                  colors: {
                    onSurfaceVariant: isDarkMode ? colors.white : colors.black,
                    elevation: { level3: "#aebb77b0" },
                  },
                }}
                value={search}
                style={{
                  flexDirection:
                    storedSettings.language == 1 ? "row-reverse" : "row",
                }}
                inputStyle={{
                  textAlign: storedSettings.language == 1 ? "right" : "left",
                }}
                selectionColor="#C0C0C0"
                onChange={(text) => setSearch(text.nativeEvent.text)}
                onClearIconPress={() => setSearch("")}
              />
            )}
            <View
              style={{
                backgroundColor: "#C9C9C9",
                marginTop: "1%",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                height: "85%",
                paddingBottom: 10,
              }}
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {search.length == 0 &&
                  laundryItems.length > 0 &&
                  storedSettings.enableLaundry && (
                    <CollectionContainer
                      color={colors.gray}
                      label={"Laundry"}
                      LaundryReminder={true}
                    >
                      <>
                        <FlashList
                          numColumns={4}
                          extraData={refreshLaundry}
                          data={laundryItems}
                          estimatedItemSize={64}
                          renderItem={({ item, index }) => (
                            <View
                              style={{
                                display: "flex",
                                flex: 1,
                                alignItems: "center",
                              }}
                            >
                              <ItemBox
                                primary={item.primaryColor || "#fff"}
                                secondary={item.secondaryColor || "#fff"}
                                tertiary={item.tertiaryColor || "#fff"}
                                key={"laundry" + index}
                                image={item.image}
                                name={item.name}
                                type={item.type}
                                id={item.id}
                                logs={item.logIds || []}
                              />
                            </View>
                          )}
                        />
                      </>
                    </CollectionContainer>
                  )}

                {itemsState.collectionTags.map((collection, index) => {
                  if (!search) {
                    if (allCollections[index]?.length ?? 0 != 0) {
                      return (
                        <CollectionContainer
                          key={index}
                          color={addOpacityToHex(collection.color, 0.2)}
                          label={collection.label}
                        >
                          <>
                            <FlashList
                              numColumns={4}
                              extraData={refreshItems}
                              data={allCollections[index]}
                              estimatedItemSize={64}
                              renderItem={({ item }) => (
                                <View
                                  style={{
                                    display: "flex",
                                    flex: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <ItemBox
                                    primary={item.primaryColor || "#fff"}
                                    secondary={item.secondaryColor || "#fff"}
                                    tertiary={item.tertiaryColor || "#fff"}
                                    key={item.id}
                                    image={item.image}
                                    name={item.name}
                                    type={item.type}
                                    id={item.id}
                                    logs={item.logIds || []}
                                  />
                                </View>
                              )}
                            />
                          </>
                        </CollectionContainer>
                      );
                    }
                  } else {
                    if (allCollectnizedFilter[index]?.length ?? 0 != 0) {
                      return (
                        //searching & filtering
                        <CollectionContainer
                          key={index}
                          color={addOpacityToHex(collection.color, 0.2)}
                          label={collection.label}
                        >
                          <>
                            <FlashList
                              numColumns={4}
                              extraData={refreshItems}
                              data={
                                filterCollectionsBySearch(
                                  allCollections,
                                  search,
                                )[index]
                              }
                              estimatedItemSize={64}
                              renderItem={({ item, index }) => (
                                <View
                                  style={{
                                    display: "flex",
                                    flex: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <ItemBox
                                    primary={item.primaryColor || "#fff"}
                                    secondary={item.secondaryColor || "#fff"}
                                    tertiary={item.tertiaryColor || "#fff"}
                                    key={"serAll" + item.id}
                                    image={item.image}
                                    name={item.name}
                                    type={item.type}
                                    id={item.id}
                                    logs={item.logIds || []}
                                  />
                                </View>
                              )}
                            />
                          </>
                        </CollectionContainer>
                      );
                    }
                  }
                })}
                {search == "" ? (
                  <FlashList
                    data={nonCollectnized}
                    columnWrapperStyle={{
                      flex: 1,
                      justifyContent: "space-around",
                    }}
                    numColumns={4}
                    estimatedItemSize={64}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <ItemBox
                          primary={item.primaryColor || "#fff"}
                          secondary={item.secondaryColor || "#fff"}
                          tertiary={item.tertiaryColor || "#fff"}
                          key={index + item.id}
                          image={item.image}
                          name={item.name}
                          type={item.type}
                          id={item.id}
                          logs={item.logIds || []}
                        />
                      </View>
                    )}
                  />
                ) : (
                  <FlashList
                    numColumns={4}
                    data={nonCollectnizedFilter}
                    estimatedItemSize={64}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <ItemBox
                          primary={item.primaryColor || "#fff"}
                          secondary={item.secondaryColor || "#fff"}
                          tertiary={item.tertiaryColor || "#fff"}
                          key={index + item.id}
                          image={item.image}
                          name={item.name}
                          type={item.type}
                          id={item.id}
                          logs={item.logIds || []}
                        />
                      </View>
                    )}
                  />
                )}
                <View className={isSearchVisible ? "h-36" : "h-6"} />
              </ScrollView>
            </View>
          </View>
        </View>
      </>
    </ThemeView>
  );
}
