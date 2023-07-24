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
export function HomeBottom() {
  //this is the main page
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const [search, setSearch] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";

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
          <View className="w-full h-3/4 bg-gray mt-[1%]">
            {itemsState.collectionTags.map((collection) => {
              return (
                <CollectionContainer label={collection.label}>
                  <>
                    {itemsState.items.map((item) => {
                      if (item.collection?.includes(collection.value)) {
                        return (
                          <ItemBox
                            primary={item.primaryColor || "#fff"}
                            secondary={item.secondaryColor || "#fff"}
                            tertiary={item.tertiaryColor || "#fff"}
                            key={item.id}
                            image={item.image}
                            name={item.name}
                          />
                        );
                      }
                    })}
                  </>
                </CollectionContainer>
              );
            })}
            {itemsState.items.map((item) => {
              if (item.collection?.length == 0)
                return (
                  <ItemBox
                    primary={item.primaryColor || "#fff"}
                    secondary={item.secondaryColor || "#fff"}
                    tertiary={item.tertiaryColor || "#fff"}
                    key={item.id}
                    image={item.image}
                    name={item.name}
                  />
                );
            })}
          </View>
        </View>
      </View>
    </ThemeView>
  );
}
