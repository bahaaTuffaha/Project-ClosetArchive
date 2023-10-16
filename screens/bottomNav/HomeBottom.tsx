import {
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
  ScrollView,
  Dimensions,
  Keyboard,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import Icon from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import { Button, RadioButton, Searchbar } from "react-native-paper";
import { ThemeText } from "../../components/ThemeText";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemBox } from "../../components/ItemBox";
import { CollectionContainer } from "../../components/CollectionContainer";
import { item } from "../../redux/itemsSlice";
import { useNavigation } from "@react-navigation/native";
import { addOpacityToHex } from "../stackNav/CollectionForm";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import settingsIcon from "../../assets/images/settings.png";
import settingsIconDark from "../../assets/images/settingsUnselected.png";
import { colors } from "../../utils/colors";
import { FlashList } from "@shopify/flash-list";
import { useSharedValue } from "react-native-reanimated";
import { SideModal } from "../../components/SideModal";
import { HomeFilter } from "../../utils/filters";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import { clothesList, seasonList } from "../../utils/data";

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

  const [OpenCategoriesFilter, setOpenCategoriesFilter] = useState(false);
  const [OpenTypeFilter, setOpenTypeFilter] = useState(false);
  const [OpenSeasonFilter, setOpenSeasonFilter] = useState(false);

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
  const CategoriesList = storedCategories.map((item) => ({
    label: item.name,
    value: item.index,
  }));

  const colorScheme = String(useColorScheme()?.toUpperCase()) as ThemeNameType;
  const space = useSharedValue(-20);
  const { width } = Dimensions.get("window");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDrawer = () => {
    // Update the space value to trigger the animation
    Keyboard.dismiss();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      space.value = width / 2 - 20;
    }
  };
  useEffect(() => {
    let cat = [];
    let nonCat = [];
    let final = [];
    if (itemsState.collectionTags.length > 0) {
      // if there is a collection and items
      for (let i = 0; i < itemsState.collectionTags.length; i++) {
        cat = [];
        nonCat = [];
        for (let j = 0; j < itemsState.items.length; j++) {
          if (
            itemsState.items[j].collection?.includes(
              itemsState.collectionTags[i].value,
            )
          ) {
            cat.push(itemsState.items[j]);
          } else if (itemsState.items[j].collection?.length == 0) {
            nonCat.push(itemsState.items[j]);
          }
        }
        final.push(cat);
      }
    } else {
      // if there is no collections
      nonCat = [];
      for (let i = 0; i < itemsState.items.length; i++) {
        if (itemsState.items[i].collection?.length == 0) {
          nonCat.push(itemsState.items[i]);
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
        },
        nonCat,
        false,
      ) as item[],
    );
    return () => {
      cat = null;
      nonCat = null;
      final = null;
    };
  }, [
    itemsState.items,
    refreshItems,
    categoriesFilter,
    sortValue,
    TypeFilter,
    seasonFilter,
  ]);

  useEffect(() => {
    setLaundryItems(
      itemsState.items.filter(
        (x) => (x.laundryCounter ?? 0) >= storedSettings.laundryNumber,
      ),
    );
  }, [storedSettings.laundryNumber, itemsState.logs, refreshLaundry]);

  useEffect(() => {
    setAllCollectnizedFilter(
      filterCollectionsBySearch(
        HomeFilter(
          {
            categories: categoriesFilter,
            sortValue: sortValue,
            types: TypeFilter,
            season: seasonFilter,
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
          },
          nonCollectnized,
          false,
        ) as item[],
        search,
      ),
    );
  }, [search, categoriesFilter, sortValue, TypeFilter, seasonFilter]);

  useEffect(() => {
    if (categoriesFilter.length != 1) setTypeFilter([]);
  }, [categoriesFilter]);

  return (
    <ThemeView classNameStyle="px-5">
      <>
        <SideModal space={space} isOpen={isOpen} setIsOpen={setIsOpen}>
          <>
            <RadioButton.Group
              onValueChange={(value) => setSortValue(value)}
              value={sortValue}
            >
              <RadioButton.Item
                label="Last Added"
                value="LA"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label="Name Asc"
                value="NA"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label="Name Desc"
                value="ND"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label="Purchase Date Asc"
                value="PDA"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label="Purchase Date Desc"
                value="PDD"
                color={colors.mainCyan}
              />
            </RadioButton.Group>
            <View
              style={{
                zIndex: 3,
                width: "90%",
                marginTop: 5,
                marginBottom: 20,
              }}
            >
              <DropDownPicker
                open={OpenSeasonFilter}
                value={seasonFilter}
                items={[
                  { label: "Season not specified", value: "" },
                  ...seasonList,
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
            <View style={{ zIndex: 2, width: "90%" }}>
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
                placeholder="Category Filter"
                style={{ borderColor: colors.mainGreen, marginBottom: 20 }}
                dropDownContainerStyle={{ borderColor: colors.mainGreen }}
              />
            </View>
            {categoriesFilter.length == 1 && categoriesFilter[0] <= 3 && (
              <View style={{ zIndex: 1, width: "90%" }}>
                <DropDownPicker
                  open={OpenTypeFilter}
                  value={TypeFilter}
                  items={
                    clothesList[
                      storedCategories.find(
                        (x) => x.index == categoriesFilter[0],
                      )?.index ?? 0
                    ]
                  }
                  setOpen={setOpenTypeFilter}
                  setValue={setTypeFilter}
                  multiple={true}
                  theme={colorScheme}
                  showBadgeDot={false}
                  badgeTextStyle={{ color: colors.black }}
                  mode="BADGE"
                  listMode="MODAL"
                  placeholder="Type Filter"
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
              Reset
            </Button>
          </>
        </SideModal>

        <View className="flex flex-col">
          <View className="w-full flex flex-row justify-between items-center pt-5">
            <View className="flex flex-row space-x-2 justify-center items-center">
              <ThemeText classNameStyle="font-light text-lg italic">
                {`Welcome back, ${storedSettings.name}`}
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
              <Text className="text-xs text-white">Collection</Text>
            </TouchableOpacity>
            <View className="bg-mainCyan w-[20%] h-12 rounded-t-2xl absolute -z-10 right-1 bottom-1 " />
            <View className="bg-mainPink w-[20%] h-12 rounded-t-2xl absolute -z-20 right-2 bottom-2 " />
          </View>
          <View className="w-full flex flex-col mt-5">
            <View className="w-full flex flex-row justify-between">
              <TouchableOpacity className="flex flex-row items-center h-14 w-[58%] bg-mainPink rounded-tl-2xl shadow-2xl">
                <View className="mx-3">
                  <FontAwesome5
                    name="question-circle"
                    size={30}
                    color={colors.white}
                  />
                </View>
                <Text className="text-white font-bold w-3/4 capitalize">
                  Closet Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleOpenDrawer();
                }}
                className="h-14 w-[20%] bg-mainGreen justify-center items-center shadow-xl"
              >
                <Icon name="filter" size={26} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsSearchVisible(!isSearchVisible);
                  setSearch("");
                }}
                className="h-14 w-[20%] bg-mainCyan rounded-tr-2xl justify-center items-center shadow-xl"
              >
                <Icon name="search" size={30} color={colors.white} />
              </TouchableOpacity>
            </View>
            {isSearchVisible && (
              <Searchbar
                className="mt-[1%]"
                theme={{
                  roundness: 0,
                  colors: {
                    onSurfaceVariant: isDarkMode ? colors.white : colors.black,
                    elevation: { level3: "#aebb77b0" },
                  },
                }}
                value={search}
                selectionColor="#C0C0C0"
                // label="Search"
                onChange={(text) => setSearch(text.nativeEvent.text)}
                onClearIconPress={() => setSearch("")}
              />
            )}
            <ScrollView
              nestedScrollEnabled={true}
              contentContainerStyle={{
                backgroundColor: "#C9C9C9",
                marginTop: "1%",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                height: "85%",
                paddingBottom: 10,
              }}
            >
              {search.length == 0 &&
                laundryItems.length > 0 &&
                storedSettings.enableLaundry && (
                  <CollectionContainer
                    color={colors.gray}
                    label={"Laundry"}
                    LaundryReminder={true}
                  >
                    <>
                      {laundryItems.map((item, index) => {
                        return (
                          <ItemBox
                            primary={item.primaryColor || "#fff"}
                            secondary={item.secondaryColor || "#fff"}
                            tertiary={item.tertiaryColor || "#fff"}
                            key={"laundry" + index}
                            image={item.image}
                            name={item.name}
                            type={item.type}
                            id={item.id}
                          />
                        );
                      })}
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
                          {allCollections[index].map((item) => {
                            return (
                              <ItemBox
                                primary={item.primaryColor || "#fff"}
                                secondary={item.secondaryColor || "#fff"}
                                tertiary={item.tertiaryColor || "#fff"}
                                key={item.id}
                                image={item.image}
                                name={item.name}
                                type={item.type}
                                id={item.id}
                              />
                            );
                          })}
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
                          {filterCollectionsBySearch(allCollections, search)[
                            index
                          ].map((item) => {
                            return (
                              <ItemBox
                                primary={item.primaryColor || "#fff"}
                                secondary={item.secondaryColor || "#fff"}
                                tertiary={item.tertiaryColor || "#fff"}
                                key={item.id}
                                image={item.image}
                                name={item.name}
                                type={item.type}
                                id={item.id}
                              />
                            );
                          })}
                        </>
                      </CollectionContainer>
                    );
                  }
                }
              })}
              {search == "" ? (
                <FlashList
                  data={nonCollectnized}
                  contentContainerStyle={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  numColumns={4}
                  estimatedItemSize={100}
                  renderItem={({ item, index }) => (
                    <ItemBox
                      primary={item.primaryColor || "#fff"}
                      secondary={item.secondaryColor || "#fff"}
                      tertiary={item.tertiaryColor || "#fff"}
                      key={index + item.id}
                      image={item.image}
                      name={item.name}
                      type={item.type}
                      id={item.id}
                    />
                  )}
                />
              ) : (
                <FlashList
                  contentContainerStyle={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  numColumns={4}
                  data={nonCollectnizedFilter}
                  estimatedItemSize={100}
                  renderItem={({ item, index }) => (
                    <ItemBox
                      primary={item.primaryColor || "#fff"}
                      secondary={item.secondaryColor || "#fff"}
                      tertiary={item.tertiaryColor || "#fff"}
                      key={index + item.id}
                      image={item.image}
                      name={item.name}
                      type={item.type}
                      id={item.id}
                    />
                  )}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </>
    </ThemeView>
  );
}
