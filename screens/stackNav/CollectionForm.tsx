import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Button } from "react-native-paper";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { CustomInput } from "../../components/CustomInput";
import ColorModal from "../../components/ColorModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ThemeText } from "../../components/ThemeText";
import {
  CollectionTag,
  addCollection,
  deleteCollection,
  itemRefresher,
  updateCollection,
} from "../../redux/itemsSlice";
import { FlashList } from "@shopify/flash-list";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { colors as appColors, colors } from "./../../utils/colors";
import { localization } from "../../utils/localization";
import {
  changeCategoryTypeByIndex,
  changeCategoryTypesIcon,
  delCategoryTypeByIndex,
} from "../../redux/categoriesSlice";
import { categoryLayoutIcons } from "../../utils/data";

export function addOpacityToHex(hexColor: string, opacity: any) {
  // Remove the "#" character if it's present
  hexColor = hexColor.replace(/^#/, "");

  // Calculate the RGB values from the hex color
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Check if the opacity is a valid number between 0 and 1
  opacity = parseFloat(opacity);
  if (isNaN(opacity) || opacity < 0 || opacity > 1) {
    throw new Error("Opacity must be a number between 0 and 1");
  }

  // Convert to rgba format
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  return rgbaColor;
}

export const CollectionItem = ({
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
            className="bg-white rounded-full"
            onPress={() => {
              setIconIndex((prev: number) =>
                prev + 1 >= categoryLayoutIcons.length ? 0 : prev + 1,
              );
              // setRefresh((prev) => !prev);
              setUpdateIcon((prev) => !prev);
            }}
          >
            <Image
              className="w-10 h-10 rounded-md"
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

export const CollectionForm = () => {
  // const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [colors, setColors] = useState(["#242424"]);
  const [refresh, setRefresh] = useState(false);
  const CollectionsState = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const dispatch = useDispatch();

  async function addCollectionHandler() {
    const errors = [];

    if (name.length <= 0) {
      errors.push("Please enter a name for this Collection");
    }
    if (name.length > 20) {
      errors.push("Please enter a name within 20 characters max");
    }
    if (
      CollectionsState.find((x) => x.label.toLowerCase() == name.toLowerCase())
    ) {
      errors.push("Please enter a different name");
    }
    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    dispatch(
      addCollection({
        name: name,
        color: colors[0],
      }),
    );
  }
  return (
    <>
      <ColorModal
        colors={colors}
        setColors={setColors}
        visible={visible}
        setVisible={setVisible}
        colorSelection={0}
      />
      <ThemeView>
        <>
          <BackButton />

          <View className="flex flex-col items-center space-y-3">
            <ThemeText classNameStyle="text-xl mt-4 font-mono italic">
              {localization.Add_a_collection[storedSettings.language]}
            </ThemeText>
            <TouchableOpacity
              style={{ backgroundColor: colors[0] }}
              onPress={() => {
                setVisible(true);
                setColors([""]);
              }}
              className="flex justify-center items-center w-16 h-16 border-[2px] border-gray rounded-xl mt-2"
            >
              <Icon2 name="colorize" size={30} color={appColors.mainCyan} />
            </TouchableOpacity>
            <CustomInput
              mode="outlined"
              outlineColor={appColors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={appColors.mainGreen}
              textContentType="name"
              style={styles.customWidth}
              label={localization.Collection_name[storedSettings.language]}
              value={name}
              onChange={(text) => setName(text.nativeEvent.text)}
            />
            {errorsList.length > 0 && (
              <View>
                {errorsList.map((error, index) => {
                  return (
                    <Text key={index} className="text-[#C70039]">
                      {error}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>

          <Button
            // className="mb-5"
            mode="contained"
            buttonColor={appColors.mainCyan}
            textColor={appColors.white}
            onPress={() => {
              addCollectionHandler();
              Keyboard.dismiss();
            }}
            className="mx-10 my-5"
          >
            {localization.Save[storedSettings.language]}
          </Button>
          <View className="w-full h-1 bg-gray" />
          <ThemeText classNameStyle="w-full text-center font-mono text-xl my-5">
            {localization.Collections[storedSettings.language]}
          </ThemeText>
          {CollectionsState.length > 0 ? (
            <FlashList
              showsVerticalScrollIndicator={false}
              data={CollectionsState}
              extraData={refresh}
              renderItem={({ item }) => (
                <CollectionItem
                  item={item}
                  setRefresh={setRefresh}
                  CollectionsState={CollectionsState}
                />
              )}
              estimatedItemSize={200}
            />
          ) : (
            <View className="flex flex-col justify-center items-center w-full h-[50%]">
              <Text>
                {localization.There_is_no_collection[storedSettings.language]}
              </Text>
            </View>
          )}
        </>
      </ThemeView>
    </>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
