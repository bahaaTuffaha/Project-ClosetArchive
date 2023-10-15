import {
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import Icon from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import { Button, Searchbar } from "react-native-paper";
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

export function filterCategories(array: item[][], search: string) {
  let newAllCategories = [];
  for (let i in array) {
    newAllCategories.push(
      array[i].filter((x) =>
        x.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }
  return newAllCategories;
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
  const [allCategories, setAllCategories] = useState<item[][]>([]);
  const [nonCategorized, setNonCategorized] = useState<item[]>([]);
  const [laundryItems, setLaundryItems] = useState<item[]>([]);
  const [allCategoriesFilter, setAllCategoriesFilter] = useState<item[][]>([]);
  const [nonCategorizedFilter, setNonCategorizedFilter] = useState<item[]>([]);
  const refreshItems = useSelector(
    (state: RootState) => state.itemsList.refreshItems,
  );
  const refreshLaundry = useSelector(
    (state: RootState) => state.itemsList.refreshLaundry,
  );
  const storedSettings = useSelector((state: RootState) => state.settings);

  const space = useSharedValue(-10);
  const { width } = Dimensions.get("window");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDrawer = () => {
    // Update the space value to trigger the animation
    setIsOpen((prev) => !prev);
    space.value = width / 2 - 15;
  };
  const handleCloseDrawer = () => {
    // Update the space value to trigger the animation
    setIsOpen((prev) => !prev);
    space.value = -10;
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
    setAllCategories(HomeFilter({categories:[""],sortValue:"",types:[""]},final,true));
    setNonCategorized(nonCat);
    return () => {
      cat = null;
      nonCat = null;
      final = null;
    };
  }, [itemsState.items, refreshItems]);

  useEffect(() => {
    setLaundryItems(
      itemsState.items.filter(
        (x) => (x.laundryCounter ?? 0) >= storedSettings.laundryNumber,
      ),
    );
  }, [storedSettings.laundryNumber, itemsState.logs, refreshLaundry]);

  useEffect(() => {
    setAllCategoriesFilter(filterCategories(allCategories, search));
    setNonCategorizedFilter(filter(nonCategorized, search));
  }, [search]);

  return (
    <ThemeView classNameStyle="px-5">
      <>
        <SideModal space={space} isOpen={isOpen} setIsOpen={setIsOpen}>
          <>
            {/* <RadioButton.Group
              onValueChange={(value) => setSortValue(value)}
              value={sortValue}
            >
              <RadioButton.Item label="Last Added" value="LA" />
              <RadioButton.Item label="Name Asc" value="NA" />
              <RadioButton.Item label="Name Desc" value="ND" />
              <RadioButton.Item label="Date Asc" value="DA" />
              <RadioButton.Item label="Date Desc" value="DD" />
            </RadioButton.Group> */}
            <Button
              mode="contained-tonal"
              buttonColor={colors.mainCyan}
              className="self-center"
              onPress={() => {
                handleCloseDrawer();
              }}
            >
              Apply
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
                  if (allCategories[index]?.length ?? 0 != 0) {
                    return (
                      <CollectionContainer
                        key={index}
                        color={addOpacityToHex(collection.color, 0.2)}
                        label={collection.label}
                      >
                        <>
                          {allCategories[index].map((item) => {
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
                  if (allCategoriesFilter[index]?.length ?? 0 != 0) {
                    return (
                      //searching & filtering
                      <CollectionContainer
                        key={index}
                        color={addOpacityToHex(collection.color, 0.2)}
                        label={collection.label}
                      >
                        <>
                          {filterCategories(allCategories, search)[index].map(
                            (item) => {
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
                            },
                          )}
                        </>
                      </CollectionContainer>
                    );
                  }
                }
              })}
              {search == "" ? (
                <FlashList
                  data={nonCategorized}
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
                  data={nonCategorizedFilter}
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
