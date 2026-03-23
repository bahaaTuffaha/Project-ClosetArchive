import { Image, TouchableOpacity, View } from "react-native";
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
  const [newNameInput, setNewNameInput] = useState(item.label || "");
  const [iconIndex, setIconIndex] = useState((item as any)?.icon ?? 0);
  const [updateIcon, setUpdateIcon] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [isColorVisible, setIsColorVisible] = useState(false);
  const [itemColors, setItemColors] = useState([item.color || "#fff"]);

  const contrastColor = getContrastColor(item.color || "#fff");

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
      style={{ backgroundColor: item.color ?? "#fff" }}
      className="w-[80%] h-[59px] pt-0 rounded-lg self-center mb-5 relative border-mainGreen border-[1px] flex flex-row items-center justify-between"
    >
      <ColorModal
        colors={itemColors}
        setColors={setItemColors}
        visible={isColorVisible}
        setVisible={setIsColorVisible}
        colorSelection={0}
      />
      {enableEditing ? (
        <View className="flex-1 ml-5 mr-2">
          <CustomInput
            mode="outlined"
            outlineColor={appColors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={appColors.mainGreen}
            textContentType="name"
            style={{ height: 40 }}
            value={newNameInput}
            onChangeText={text => setNewNameInput(text)}
          />
        </View>
      ) : (
        <ThemeText
          classNameStyle="font-bold ml-5 flex-1"
          customStyle={{ color: contrastColor }}
        >
          {item.label}
        </ThemeText>
      )}
      {enableEditing && !isCatType && (
        <View className="mr-2">
          <TouchableOpacity
            onPress={() => setIsColorVisible(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Icon name="palette" size={30} color={contrastColor} />
          </TouchableOpacity>
        </View>
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
              setUpdateIcon(prev => !prev);
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
                setRefresh(prev => !prev);
              }}
            >
              <Icon
                name="delete"
                size={30}
                color={contrastColor === appColors.white ? "#ff4444" : "red"}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
