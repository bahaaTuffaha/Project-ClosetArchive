import { useSelector } from "react-redux";
import { ThemeView } from "../../components/ThemeView";
import { ScrollView, View, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { CollectionContainer } from "../../components/CollectionContainer";
import { filter, filterCategories } from "../bottomNav/HomeBottom";
import { Button, Searchbar, Snackbar } from "react-native-paper";
import { RootState } from "../../redux/store";
import { item } from "../../redux/itemsSlice";
import { SelectionItemBox } from "../../components/SelectionItemBox";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/BackButton";
import { addOpacityToHex } from "./CollectionForm";
import { ThemeText } from "../../components/ThemeText";

export const ItemSelector = () => {
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const [search, setSearch] = useState("");
  const isDarkMode = useColorScheme() === "dark";
  const [allCategories, setAllCategories] = useState<item[][]>([]);
  const [nonCategorized, setNonCategorized] = useState<item[]>([]);
  const [allCategoriesFilter, setAllCategoriesFilter] = useState<item[][]>([]);
  const [nonCategorizedFilter, setNonCategorizedFilter] = useState<item[]>([]);
  const [selectedIdCollector, setSelectedIdCollector] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    let cat = [];
    let nonCat = [];
    let final = [];
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
    setAllCategories(final);
    setNonCategorized(nonCat);
    return () => {
      cat = null;
      nonCat = null;
      final = null;
    };
  }, [itemsState.items.length]);

  useEffect(() => {
    setAllCategoriesFilter(filterCategories(allCategories, search));
    setNonCategorizedFilter(filter(nonCategorized, search));
  }, [search]);
  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">Select Items</ThemeText>
        </View>
        <View className="flex flex-row justify-end">
          <Searchbar
            className="w-[100%]"
            theme={{
              roundness: 0,
              colors: {
                onSurfaceVariant: isDarkMode ? "white" : "black",
                elevation: { level3: "#77AEBB" },
              },
            }}
            value={search}
            selectionColor="#C0C0C0"
            // label="Search"
            onChange={(text) => setSearch(text.nativeEvent.text)}
            onClearIconPress={() => setSearch("")}
          />
        </View>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            height: "90%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "#C9C9C9",
            marginTop: "1%",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
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
                          <SelectionItemBox
                            primary={item.primaryColor || "#fff"}
                            secondary={item.secondaryColor || "#fff"}
                            tertiary={item.tertiaryColor || "#fff"}
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            categoryNumber={item.category}
                            id={item.id}
                            setSelectedIdCollector={setSelectedIdCollector}
                            selectedIdCollector={selectedIdCollector}
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
                            <SelectionItemBox
                              primary={item.primaryColor || "#fff"}
                              secondary={item.secondaryColor || "#fff"}
                              tertiary={item.tertiaryColor || "#fff"}
                              key={item.id}
                              image={item.image}
                              name={item.name}
                              categoryNumber={item.category}
                              id={item.id}
                              setSelectedIdCollector={setSelectedIdCollector}
                              selectedIdCollector={selectedIdCollector}
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
          {search == ""
            ? nonCategorized.map((item, index) => {
                return (
                  <SelectionItemBox
                    primary={item.primaryColor || "#fff"}
                    secondary={item.secondaryColor || "#fff"}
                    tertiary={item.tertiaryColor || "#fff"}
                    key={index + item.id}
                    image={item.image}
                    name={item.name}
                    categoryNumber={item.category}
                    id={item.id}
                    setSelectedIdCollector={setSelectedIdCollector}
                    selectedIdCollector={selectedIdCollector}
                  />
                );
              })
            : nonCategorizedFilter.map((item, index) => {
                return (
                  <SelectionItemBox
                    primary={item.primaryColor || "#fff"}
                    secondary={item.secondaryColor || "#fff"}
                    tertiary={item.tertiaryColor || "#fff"}
                    key={index + item.id}
                    image={item.image}
                    name={item.name}
                    categoryNumber={item.category}
                    id={item.id}
                    setSelectedIdCollector={setSelectedIdCollector}
                    selectedIdCollector={selectedIdCollector}
                  />
                );
              })}
        </ScrollView>
        <View className="absolute bottom-[2%] w-full">
          <Button
            className="mx-auto w-28 my-1"
            mode="contained"
            buttonColor="#77AEBB"
            textColor="white"
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
            Next
          </Button>
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            // action={{
            //   label: 'Undo',
            //   onPress: () => {
            //     // Do something
            //   },
            // }}
          >
            Please select at least 1 item.
          </Snackbar>
        </View>
      </>
    </ThemeView>
  );
};
