import { Image, TouchableOpacity, View, useColorScheme } from "react-native";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import {
  addOpacityToHex,
  colors as appColors,
  colors,
} from "./../utils/colors";
import {
  changeCategoryTypeByIndex,
  changeCategoryTypesIcon,
  delCategoryTypeByIndex,
} from "../redux/categoriesSlice";
import { categoryLayoutIcons } from "../utils/data";

export const EditItemList = ({
  item,
  setRefresh,
  CollectionsState,
  isCatType = false, //for catTypes
  ignoreNum, //for catTypes
  currentIndex, //for catTypes
  catIndex, //for catTypes
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
}) => {
  const [enableEditing, setEnableEditing] = useState(false);
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === "dark";
  const [newNameInput, setNewNameInput] = useState(item.label || "");
  const [iconIndex, setIconIndex] = useState(item?.icon ?? 0);
  const [updateIcon, setUpdateIcon] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      dispatch(
        changeCategoryTypesIcon({
          index: catIndex ?? 0,
          typeIndex: (currentIndex ?? 0) - (ignoreNum ?? 0),
          iconIndex: iconIndex,
        }),
      );
    }
  }, [updateIcon]);

  return (
    <View
      style={{ backgroundColor: addOpacityToHex(item.color ?? "#fff", 0.2) }}
      className="w-[80%] h-[59px] pt-0 rounded-lg self-center mb-5 relative border-mainGreen border-[1px] flex flex-row items-center justify-between"
    >
      {enableEditing ? (
        <CustomInput
          mode="outlined"
          outlineColor={appColors.mainGreen}
          selectionColor="#C0C0C0"
          activeOutlineColor={appColors.mainGreen}
          textContentType="name"
          style={[styles.customWidth, { marginBottom: 5, paddingVertical: 3 }]}
          value={newNameInput}
          onChange={(text) => setNewNameInput(text.nativeEvent.text)}
        />
      ) : (
        <ThemeText classNameStyle="font-bold ml-5">{item.label}</ThemeText>
      )}
      {isCatType &&
        (currentIndex ?? 0) >= (ignoreNum ?? 0) &&
        !enableEditing && (
          <TouchableOpacity
            className="border-mainGreen border-[2px] border-solid rounded-lg"
            onPress={() => {
              setIconIndex((prev: number) =>
                prev + 1 >= categoryLayoutIcons.length ? 0 : prev + 1,
              );
              // setRefresh((prev) => !prev);
              setUpdateIcon((prev) => !prev);
            }}
          >
            <Image
              className="w-7 h-7 rounded-md"
              source={categoryLayoutIcons[iconIndex]}
            ></Image>
          </TouchableOpacity>
        )}
      {(currentIndex ?? 0) >= (ignoreNum ?? 0) && (
        <View className="flex flex-row">
          <TouchableOpacity
            className="w-16 h-[59px] rounded-r-lg flex flex-row justify-center items-center"
            onPress={() => {
              if (
                (CollectionsState.filter(
                  (x) => x.label.toLowerCase() == newNameInput.toLowerCase(),
                ).length < 1 &&
                  newNameInput.length < 20) ||
                newNameInput == item.label
              ) {
                setEnableEditing((prev) => !prev);
                if (enableEditing) {
                  !isCatType
                    ? dispatch(
                        updateCollection({
                          name: item.label,
                          newName: newNameInput || item.label,
                        }),
                      )
                    : dispatch(
                        changeCategoryTypeByIndex({
                          index: catIndex ?? 0,
                          typeIndex: (currentIndex ?? 0) - (ignoreNum ?? 0),
                          typeName: newNameInput || item.label,
                        }),
                      );
                  setRefresh((prev) => !prev);
                }
              }
            }}
          >
            <Icon
              name={enableEditing ? "check-bold" : "note-edit"}
              size={25}
              color={isDarkMode ? colors.mainCyan : "gray"}
            />
          </TouchableOpacity>
          {!enableEditing && (
            <TouchableOpacity
              className="w-16 h-[59px] rounded-r-lg flex flex-row justify-center items-center"
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
                setRefresh((prev) => !prev);
              }}
            >
              <Icon
                name="delete"
                size={30}
                color={isDarkMode ? "#660000" : "red"}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
