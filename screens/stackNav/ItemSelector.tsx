import { useSelector } from "react-redux";
import { ThemeView } from "../../components/ThemeView";
import { ScrollView, View, useColorScheme, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import { CollectionContainer } from "../../components/CollectionContainer";
import {
  filterCollectionsBySearch,
  filterItemsBySearch,
} from "../../utils/filters";
import { Button, Searchbar, Snackbar } from "react-native-paper";
import { RootState } from "../../redux/store";
import { item } from "../../redux/itemsSlice";
import { SelectionItemBox } from "../../components/SelectionItemBox";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/BackButton";
import { colors } from "../../utils/colors";
import { localization } from "../../utils/localization";

export const ItemSelector = () => {
  const itemsState = useSelector((state: RootState) => state.itemsList);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [search, setSearch] = useState("");
  const isDarkMode = useColorScheme() === "dark";
  const [selectedIdCollector, setSelectedIdCollector] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const groupedData = useMemo(() => {
    let collections: item[][] = [];
    let tags = itemsState.collectionTags;
    let items = itemsState.items;

    if (tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const col = items.filter(x => x.collection?.includes(tags[i].value));
        collections.push(col);
      }
    }

    const nonCollected = items.filter(
      x => !x.collection || x.collection.length === 0,
    );

    return {
      collections: filterCollectionsBySearch(collections, search),
      nonCollected: filterItemsBySearch(nonCollected, search),
    };
  }, [itemsState.items, itemsState.collectionTags, search]);

  const isRTL = storedSettings.language === 1;

  return (
    <ThemeView>
      <BackButton
        pageTitle={localization.SelectItems[storedSettings.language]}
      />

      <View style={styles.searchContainer}>
        <Searchbar
          theme={{
            roundness: 0,
            colors: {
              onSurfaceVariant: isDarkMode ? colors.black : colors.white,
              elevation: {
                level3: isDarkMode ? colors.mainCyan : colors.gray,
              },
            },
          }}
          style={[
            styles.searchBar,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
          inputStyle={{
            textAlign: isRTL ? "right" : "left",
          }}
          value={search}
          selectionColor="#C0C0C0"
          placeholder={
            localization.SearchPlaceholder?.[storedSettings.language] ||
            "Search"
          }
          onChangeText={text => setSearch(text)}
          onClearIconPress={() => setSearch("")}
        />
      </View>

      <View style={styles.listContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {itemsState.collectionTags.map((collection, index) => {
            const collectionItems = groupedData.collections[index];
            if (!collectionItems || collectionItems.length === 0) return null;

            return (
              <CollectionContainer
                key={`col-${index}`}
                color={collection.color ?? colors.white}
                label={collection.label}
              >
                <View style={styles.gridRow}>
                  {collectionItems.map(item => (
                    <View key={item.id} style={styles.gridItem}>
                      <SelectionItemBox
                        primary={item.primaryColor || colors.white}
                        secondary={item.secondaryColor || colors.white}
                        tertiary={item.tertiaryColor || colors.white}
                        image={item.image}
                        name={item.name}
                        type={item.type}
                        id={item.id}
                        setSelectedIdCollector={setSelectedIdCollector}
                        selectedIdCollector={selectedIdCollector}
                      />
                    </View>
                  ))}
                </View>
              </CollectionContainer>
            );
          })}

          {groupedData.nonCollected.length > 0 && (
            <View style={styles.gridRow}>
              {groupedData.nonCollected.map(item => (
                <View key={item.id} style={styles.gridItem}>
                  <SelectionItemBox
                    primary={item.primaryColor || colors.white}
                    secondary={item.secondaryColor || colors.white}
                    tertiary={item.tertiaryColor || colors.white}
                    image={item.image}
                    name={item.name}
                    type={item.type}
                    id={item.id}
                    setSelectedIdCollector={setSelectedIdCollector}
                    selectedIdCollector={selectedIdCollector}
                  />
                </View>
              ))}
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          style={styles.nextButton}
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
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    width: 120,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  searchBar: {
    width: "100%",
    height: 50,
  },
  listContainer: {
    backgroundColor: "#C9C9C9",
    marginTop: "1%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1,
    paddingBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 5,
  },
  bottomSpacer: {
    height: 80,
  },
  footer: {
    position: "absolute",
    bottom: "2%",
    width: "100%",
    alignItems: "center",
  },
});
