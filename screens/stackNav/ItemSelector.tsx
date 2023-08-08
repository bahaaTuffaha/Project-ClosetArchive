import { useSelector } from "react-redux";
import { ThemeView } from "../../components/ThemeView";
import { View, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { CollectionContainer } from "../../components/CollectionContainer";
import { filter, filterCategories } from "../bottomNav/HomeBottom";
import { Searchbar } from "react-native-paper";
import { RootState } from "../../redux/store";
import { item } from "../../redux/itemsSlice";
import { SelectionItemBox } from "../../components/SelectionItemBox";

export const ItemSelector = () => {
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const [search, setSearch] = useState("");
  const isDarkMode = useColorScheme() === "dark";
  const [allCategories, setAllCategories] = useState<item[][]>([]);
  const [nonCategorized, setNonCategorized] = useState<item[]>([]);
  const [allCategoriesFilter, setAllCategoriesFilter] = useState<item[][]>([]);
  const [nonCategorizedFilter, setNonCategorizedFilter] = useState<item[]>([]);
  const [selectedIdCollector, setSelectedIdCollector] = useState<string[]>([]);

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
        <Searchbar
          className="mt-[1%]"
          theme={{
            roundness: 0,
            colors: {
              onSurfaceVariant: isDarkMode ? "white" : "black",
              elevation: { level3: "#aebb77b0" },
            },
          }}
          value={search}
          selectionColor="#C0C0C0"
          // label="Search"
          onChange={(text) => setSearch(text.nativeEvent.text)}
          onClearIconPress={() => setSearch("")}
        />
        <View className="w-full h-3/4 flex flex-row flex-wrap bg-gray mt-[1%]">
          {itemsState.collectionTags.map((collection, index) => {
            if (!search) {
              if (allCategories[index]?.length ?? 0 != 0) {
                return (
                  <CollectionContainer
                    key={index}
                    color={collection.color}
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
                    color={collection.color}
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
        </View>
      </>
    </ThemeView>
  );
};