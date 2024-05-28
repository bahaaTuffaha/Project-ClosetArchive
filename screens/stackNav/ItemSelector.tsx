import { useSelector } from "react-redux";
import { ThemeView } from "../../components/ThemeView";
import { ScrollView, View, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { CollectionContainer } from "../../components/CollectionContainer";
import { filter, filterCollectionsBySearch } from "../bottomNav/HomeBottom";
import { Button, Searchbar, Snackbar } from "react-native-paper";
import { RootState } from "../../redux/store";
import { item } from "../../redux/itemsSlice";
import { SelectionItemBox } from "../../components/SelectionItemBox";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/BackButton";
import { ThemeText } from "../../components/ThemeText";
import { addOpacityToHex, colors } from "../../utils/colors";
import { FlashList } from "@shopify/flash-list";
import { localization } from "../../utils/localization";

export const ItemSelector = () => {
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [search, setSearch] = useState("");
  const isDarkMode = useColorScheme() === "dark";
  const [allCollections, setAllCollections] = useState<item[][]>([]);
  const [nonCollectnized, setNonCollectnized] = useState<item[]>([]);
  const [allCollectionsFilter, setAllCollectionsFilter] = useState<item[][]>(
    [],
  );
  const [nonCategorizedFilter, setNonCategorizedFilter] = useState<item[]>([]);
  const [selectedIdCollector, setSelectedIdCollector] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

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
    setAllCollections(final);
    setNonCollectnized(nonCol);
    return () => {
      col = null;
      nonCol = null;
      final = null;
    };
  }, [itemsState.items.length]);

  useEffect(() => {
    setAllCollectionsFilter(filterCollectionsBySearch(allCollections, search));
    setNonCategorizedFilter(filter(nonCollectnized, search));
  }, [search]);

  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">
            {localization.SelectItems[storedSettings.language]}
          </ThemeText>
        </View>
        <View className="flex flex-row justify-end">
          <Searchbar
            className="w-[100%]"
            theme={{
              roundness: 0,
              colors: {
                onSurfaceVariant: isDarkMode ? colors.white : colors.black,
                elevation: { level3: colors.mainCyan },
              },
            }}
            style={{
              flexDirection:
                storedSettings.language == 1 ? "row-reverse" : "row",
            }}
            inputStyle={{
              textAlign: storedSettings.language == 1 ? "right" : "left",
            }}
            value={search}
            selectionColor="#C0C0C0"
            // label="Search"
            onChange={(text) => setSearch(text.nativeEvent.text)}
            onClearIconPress={() => setSearch("")}
          />
        </View>
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
            {itemsState.collectionTags.map((collection, index) => {
              if (!search) {
                if (allCollections[index]?.length ?? 0 != 0) {
                  return (
                    <CollectionContainer
                      key={index}
                      color={addOpacityToHex(collection.color ?? "#fff", 0.2)}
                      label={collection.label}
                    >
                      <>
                        <FlashList
                          extraData={selectedIdCollector}
                          numColumns={4}
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
                              <SelectionItemBox
                                primary={item.primaryColor || "#fff"}
                                secondary={item.secondaryColor || "#fff"}
                                tertiary={item.tertiaryColor || "#fff"}
                                key={"cols" + item.id}
                                image={item.image}
                                name={item.name}
                                type={item.type}
                                id={item.id}
                                setSelectedIdCollector={setSelectedIdCollector}
                                selectedIdCollector={selectedIdCollector}
                              />
                            </View>
                          )}
                        />
                      </>
                    </CollectionContainer>
                  );
                }
              } else {
                if (allCollectionsFilter[index]?.length ?? 0 != 0) {
                  return (
                    //searching & filtering
                    <CollectionContainer
                      key={index}
                      color={addOpacityToHex(collection.color, 0.2)}
                      label={collection.label}
                    >
                      <>
                        <FlashList
                          extraData={selectedIdCollector}
                          numColumns={4}
                          data={
                            filterCollectionsBySearch(allCollections, search)[
                              index
                            ]
                          }
                          estimatedItemSize={64}
                          renderItem={({ item }) => (
                            <View
                              style={{
                                display: "flex",
                                flex: 1,
                                alignItems: "center",
                              }}
                            >
                              <SelectionItemBox
                                primary={item.primaryColor || "#fff"}
                                secondary={item.secondaryColor || "#fff"}
                                tertiary={item.tertiaryColor || "#fff"}
                                key={"ser" + item.id}
                                image={item.image}
                                name={item.name}
                                type={item.type}
                                id={item.id}
                                setSelectedIdCollector={setSelectedIdCollector}
                                selectedIdCollector={selectedIdCollector}
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
                numColumns={4}
                estimatedItemSize={64}
                extraData={selectedIdCollector}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <SelectionItemBox
                      primary={item.primaryColor || "#fff"}
                      secondary={item.secondaryColor || "#fff"}
                      tertiary={item.tertiaryColor || "#fff"}
                      key={index + item.id}
                      image={item.image}
                      name={item.name}
                      type={item.type}
                      id={item.id}
                      setSelectedIdCollector={setSelectedIdCollector}
                      selectedIdCollector={selectedIdCollector}
                    />
                  </View>
                )}
              />
            ) : (
              <FlashList
                extraData={selectedIdCollector}
                numColumns={4}
                data={nonCategorizedFilter}
                estimatedItemSize={64}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <SelectionItemBox
                      primary={item.primaryColor || "#fff"}
                      secondary={item.secondaryColor || "#fff"}
                      tertiary={item.tertiaryColor || "#fff"}
                      key={index + item.id}
                      image={item.image}
                      name={item.name}
                      type={item.type}
                      id={item.id}
                      setSelectedIdCollector={setSelectedIdCollector}
                      selectedIdCollector={selectedIdCollector}
                    />
                  </View>
                )}
              />
            )}
            <View className={"h-14"} />
          </ScrollView>
        </View>
        <View className="absolute bottom-[2%] w-full">
          <Button
            className="mx-auto w-28 my-1"
            mode="contained"
            buttonColor={colors.mainCyan}
            textColor={colors.white}
            onPress={() => {
              if (selectedIdCollector.length > 0) {
                navigation.navigate("EventLogForm", {
                  selectedIDs: selectedIdCollector,
                });
              } else {
                onToggleSnackBar();
              }
            }}
          >
            {localization.Next[storedSettings.language]}
          </Button>
          <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
            {localization.SelectAtLeastOneItem[storedSettings.language]}
          </Snackbar>
        </View>
      </>
    </ThemeView>
  );
};
