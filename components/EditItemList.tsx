import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { useDispatch } from "react-redux";
import { ThemeText } from "../components/ThemeText";
import {
  CollectionTag,
  deleteCollection,
  itemRefresher,
  updateCollection,
} from "../redux/itemsSlice";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors as appColors, getContrastColor } from "./../utils/colors";
import {
  changeCategoryTypeByIndex,
  changeCategoryTypesIcon,
  delCategoryTypeByIndex,
} from "../redux/categoriesSlice";
import { categoryLayoutIcons } from "../utils/data";
import ColorModal from "./ColorModal";

export const EditItemList = ({
  item,
  setRefresh,
  CollectionsState,
  isCatType = false, //for catTypes
  ignoreNum, //for catTypes
  currentIndex, //for catTypes
  catIndex, //for catTypes
  containerStyle,
}: {
  item: CollectionTag;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  CollectionsState:
    | CollectionTag[]
    | {
        label: string;
        value: string;
        icon: number;
      }[];
  isCatType?: boolean;
  ignoreNum?: number;
  currentIndex?: number;
  catIndex?: number;
  containerStyle?: StyleProp<ViewStyle>;
}) => {
  const [enableEditing, setEnableEditing] = useState(false);
  const dispatch = useDispatch();
  const [newNameInput, setNewNameInput] = useState(item.label || "");
  const [iconIndex, setIconIndex] = useState((item as any)?.icon ?? 0);
  const [isColorVisible, setIsColorVisible] = useState(false);
  const [itemColors, setItemColors] = useState([item.color || "#fff"]);

  const contrastColor = getContrastColor(item.color || "#fff");

  const handleCategoryIconChange = () => {
    const nextIconIndex =
      iconIndex + 1 >= categoryLayoutIcons.length ? 0 : iconIndex + 1;

    setIconIndex(nextIconIndex);
    dispatch(
      changeCategoryTypesIcon({
        index: catIndex ?? 0,
        typeIndex: (currentIndex ?? 0) - (ignoreNum ?? 0),
        iconIndex: nextIconIndex,
      }),
    );
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: item.color ?? appColors.white },
      ]}
    >
      <ColorModal
        colors={itemColors}
        setColors={setItemColors}
        visible={isColorVisible}
        setVisible={setIsColorVisible}
        colorSelection={0}
      />
      {enableEditing ? (
        <View style={styles.inputWrapper}>
          <CustomInput
            mode="outlined"
            outlineColor={appColors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={appColors.mainGreen}
            textContentType="name"
            style={styles.editInput}
            value={newNameInput}
            onChangeText={text => setNewNameInput(text)}
          />
        </View>
      ) : (
        <ThemeText customStyle={[styles.itemLabel, { color: contrastColor }]}>
          {item.label}
        </ThemeText>
      )}
      {enableEditing && !isCatType && (
        <View style={styles.paletteWrapper}>
          <TouchableOpacity
            onPress={() => setIsColorVisible(true)}
            style={styles.paletteButton}
          >
            <Icon name="palette" size={30} color={contrastColor} />
          </TouchableOpacity>
        </View>
      )}
      {isCatType &&
        (currentIndex ?? 0) >= (ignoreNum ?? 0) &&
        !enableEditing && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCategoryIconChange}
          >
            <Image
              style={styles.iconImage}
              source={categoryLayoutIcons[iconIndex]}
            />
          </TouchableOpacity>
        )}
      {(currentIndex ?? 0) >= (ignoreNum ?? 0) && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (
                (CollectionsState.filter(
                  x => x.label.toLowerCase() === newNameInput.toLowerCase(),
                ).length < 1 &&
                  newNameInput.length < 20) ||
                newNameInput === item.label
              ) {
                setEnableEditing(prev => !prev);
                if (enableEditing) {
                  !isCatType
                    ? dispatch(
                        updateCollection({
                          name: item.label,
                          newName: newNameInput || item.label,
                          color: itemColors[0],
                        }),
                      )
                    : dispatch(
                        changeCategoryTypeByIndex({
                          index: catIndex ?? 0,
                          typeIndex: (currentIndex ?? 0) - (ignoreNum ?? 0),
                          typeName: newNameInput || item.label,
                        }),
                      );
                  setRefresh(prev => !prev);
                }
              }
            }}
          >
            <Icon
              name={enableEditing ? "check-bold" : "note-edit"}
              size={25}
              color={contrastColor}
            />
          </TouchableOpacity>
          {!enableEditing && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (!isCatType) {
                  dispatch(deleteCollection({ name: item.label }));
                  dispatch(itemRefresher());
                } else {
                  dispatch(
                    delCategoryTypeByIndex({
                      index: catIndex ?? 0,
                      typeIndex: (currentIndex ?? 0) - (ignoreNum ?? 0),
                    }),
                  );
                }
                setRefresh(prev => !prev);
              }}
            >
              <Icon
                name="delete"
                size={30}
                color={
                  contrastColor === appColors.white
                    ? appColors.brightRed
                    : appColors.red
                }
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    minHeight: 59,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: appColors.mainGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 20,
    marginRight: 8,
  },
  editInput: {
    height: 40,
  },
  itemLabel: {
    fontWeight: "700",
    marginLeft: 20,
    flex: 1,
  },
  paletteWrapper: {
    marginRight: 8,
  },
  paletteButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    borderColor: appColors.mainGreen,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 8,
  },
  iconImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  actionsRow: {
    flexDirection: "row",
  },
  actionButton: {
    width: 64,
    minHeight: 59,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
