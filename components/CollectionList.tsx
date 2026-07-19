import { Dispatch, SetStateAction } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CollectionTag } from "../redux/itemsSlice";
import { colors as appColors } from "../utils/colors";
import {
  COLLECTION_SORT_VALUES,
  CollectionSortValue,
} from "../utils/collectionOrder";
import { EditItemList } from "./EditItemList";
import { ThemeText } from "./ThemeText";

type Props = {
  collections: CollectionTag[];
  sortValue: CollectionSortValue;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  emptyText: string;
  onMoveCollection: (value: string, direction: "up" | "down") => void;
};

export const CollectionList = ({
  collections,
  sortValue,
  refresh,
  setRefresh,
  emptyText,
  onMoveCollection,
}: Props) => {
  const isCustomSort = sortValue === COLLECTION_SORT_VALUES.CUSTOM;

  if (collections.length === 0) {
    return (
      <View style={styles.emptyState}>
        <ThemeText>{emptyText}</ThemeText>
      </View>
    );
  }

  return (
    <FlatList
      key={`collection-list-${sortValue}`}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      data={collections}
      extraData={{ refresh, sortValue }}
      keyExtractor={item => item.value}
      renderItem={({ item, index }) => (
        <View
          style={
            isCustomSort
              ? styles.collectionRowCustom
              : styles.collectionRowStandard
          }
        >
          {isCustomSort && (
            <View style={styles.reorderColumn}>
              <TouchableOpacity
                disabled={index === 0}
                onPress={() => onMoveCollection(item.value, "up")}
                style={styles.reorderButton}
              >
                <Icon
                  name="arrow-up-bold"
                  size={18}
                  color={index === 0 ? appColors.gray : appColors.mainCyan}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={index === collections.length - 1}
                onPress={() => onMoveCollection(item.value, "down")}
                style={styles.reorderButton}
              >
                <Icon
                  name="arrow-down-bold"
                  size={18}
                  color={
                    index === collections.length - 1
                      ? appColors.gray
                      : appColors.mainCyan
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          <EditItemList
            item={item}
            setRefresh={setRefresh}
            CollectionsState={collections}
            containerStyle={
              isCustomSort
                ? styles.collectionItemCustom
                : styles.collectionItemStandard
            }
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  collectionRowCustom: {
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  collectionRowStandard: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
  },
  reorderColumn: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  reorderButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionItemStandard: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 0,
  },
  collectionItemCustom: {
    flex: 1,
    alignSelf: "stretch",
    marginBottom: 0,
  },
  emptyState: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50%",
  },
});
