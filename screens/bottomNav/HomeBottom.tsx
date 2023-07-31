import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import Icon from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import { Searchbar } from "react-native-paper";
import { ThemeText } from "../../components/ThemeText";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemBox } from "../../components/ItemBox";
import { CollectionContainer } from "../../components/CollectionContainer";
import { item } from "../../redux/itemsSlice";
export function HomeBottom() {
  //this is the main page
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const [search, setSearch] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const [allCategories, setAllCategories] = useState<item[][]>([]);
  const [nonCategorized, setNonCategorized] = useState<item[]>([]);
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
  }, [itemsState.items.length]); // I will look for a solution in case of editing the items.

  return (
    <ThemeView classNameStyle="px-5">
      <View className="flex flex-col">
        <View className="w-full flex flex-row justify-between items-center pt-5">
          <ThemeText classNameStyle="font-light text-lg italic">
            {`Welcome back, ${"bahaa"}`}
          </ThemeText>
          <TouchableOpacity className="flex flex-col bg-mainGreen w-[20%] h-12 justify-center items-center rounded-t-2xl">
            <Icon name="plus-square" size={20} color="white" />
            <Text className="text-xs text-white">Collection</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex flex-col mt-5">
          <View className="w-full flex flex-row justify-between">
            <View className="flex flex-row items-center h-14 w-[79%] bg-mainPink rounded-tl-2xl shadow-2xl">
              <View className="mx-3">
                <Icon name="alert-octagon" size={40} color="white" />
              </View>
              <Text className="text-white font-bold w-3/4 capitalize">
                warnings
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsSearchVisible(!isSearchVisible)}
              className="h-14 w-[20%] bg-mainCyan rounded-tr-2xl justify-center items-center shadow-xl"
            >
              <Icon name="search" size={30} color="white" />
            </TouchableOpacity>
          </View>
          {isSearchVisible && (
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
            />
          )}
          <View className="w-full h-3/4 flex flex-row flex-wrap px-[5%] bg-gray mt-[1%] pt-2">
            {itemsState.collectionTags.map((collection, index) => {
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
                          <ItemBox
                            primary={item.primaryColor || "#fff"}
                            secondary={item.secondaryColor || "#fff"}
                            tertiary={item.tertiaryColor || "#fff"}
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            categoryNumber={item.category}
                          />
                        );
                      })}
                    </>
                  </CollectionContainer>
                );
              }
            })}
            {nonCategorized.map((item, index) => {
              return (
                <ItemBox
                  primary={item.primaryColor || "#fff"}
                  secondary={item.secondaryColor || "#fff"}
                  tertiary={item.tertiaryColor || "#fff"}
                  key={index + item.id}
                  image={item.image}
                  name={item.name}
                  categoryNumber={item.category}
                />
              );
            })}
          </View>
        </View>
      </View>
    </ThemeView>
  );
}
