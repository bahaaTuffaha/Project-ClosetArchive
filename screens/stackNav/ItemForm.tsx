// import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Button, Switch } from "react-native-paper";
import { useEffect, useState } from "react";
import addImage from "../../assets/images/addImage.png";
import { BackButton } from "../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  updateItem,
  itemRefresher,
  deleteItem,
} from "../../redux/itemsSlice";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import ColorModal from "../../components/ColorModal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { CustomInput } from "../../components/CustomInput";
import { RootState } from "../../redux/store";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import CustomModal from "../../components/CustomModal";
import { getAllSwatches } from "react-native-palette";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { CommonActions } from "@react-navigation/native";
import { DatePicker } from "../../components/DatePicker";

function get_random(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}
export const ItemForm = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { selectedCategory, editingIndex } = route.params;
  // const navigation = useNavigation<any>();
  const collectionState = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const currentIndex = useSelector((state: RootState) =>
    state.itemsList.items.findIndex((x) => x.id === editingIndex),
  );
  const storedItems = useSelector(
    (state: RootState) => state.itemsList.items[currentIndex],
  );
  const [name, setName] = useState(storedItems ? storedItems.name : "");
  const [collection, setCollection] = useState(
    storedItems ? storedItems.collection : [],
  );
  const [type, setType] = useState(storedItems ? storedItems.type : "");
  const [purchaseDate, setPurchaseDate] = useState(
    storedItems ? JSON.parse(storedItems.purchaseDate ?? "") : new Date(),
  );
  const [imageUrl, setImageUrl] = useState<string>(
    storedItems ? storedItems.image : "",
  );
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [colors, setColors] = useState([
    storedItems ? storedItems.primaryColor : "",
    storedItems ? storedItems.secondaryColor : "",
    storedItems ? storedItems.tertiaryColor : "",
  ]);
  const [colorSelection, setColorSelection] = useState(0);
  const [openType, setOpenType] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const [isAutoOn, setIsAutoOn] = useState(
    storedItems ? storedItems.automaticColor : false,
  );
  const [CollectionColors, setCollectionColors] = useState<{ color: string }>();
  const RandomNamesP1 = [
    "Wildfire",
    "Sunshine Spirit",
    "Retro Rebel",
    "Neon Nights",
    "Midnight Mirage",
    "Enigma",
    "Stardust Surfer",
    "Classic Comfort",
    "Essential Basics",
    "Everyday Style",
    "Timeless Appeal",
    "Urban Chic",
    "Casual Cool",
    "Easy Breezy",
    "Effortless Elegance",
    "Simple Sophistication",
    "Modern Minimalism",
    "Relaxed Vibes",
    "Versatile Essentials",
    "Contemporary Classic",
    "Effortless Style",
    "Trendy Basics",
    "Casual Chic",
    "Modern Edge",
    "Urban Essentials",
    "Easygoing Fashion",
    "Contemporary Comfort",
  ];

  const types = [
    {
      value: "Regular Fit",
      label: "Regular Fit",
    },
    {
      value: "Slim Fit",
      label: "Slim Fit",
    },
    {
      value: "Oversized Fit",
      label: "Oversized Fit",
    },
    {
      value: "Relaxed Fit",
      label: "Relaxed Fit",
    },
    {
      value: "Loose Fit",
      label: "Loose Fit",
    },
  ];
  useEffect(() => {
    // separating the color collection
    let colorCollector = [];
    for (let i = 0; i < collectionState.length; i++) {
      colorCollector.unshift(collectionState[i].color);
    }
    setCollectionColors(colorCollector);
  }, [collectionState]);

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  function deleteItemHandler() {
    dispatch(deleteItem({ selectedId: storedItems.id }));
    dispatch(itemRefresher());
    navigation.popToTop("Category");
  }

  function addItemHandler() {
    const errors = [];

    if (name.length <= 0) {
      errors.push("Please enter item name");
    }
    if (name.length > 20) {
      errors.push("Please enter a name within 20 characters");
    }
    // if (parseInt(size) < 0) {
    //   errors.push("Please enter the size in a positive value");
    // }

    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    editingIndex
      ? dispatch(
          updateItem({
            itemIndex: currentIndex,
            name: name,
            collection: collection,
            category: selectedCategory,
            type: type,
            purchaseDate: JSON.stringify(purchaseDate),
            image: imageUrl,
            automaticColor: isAutoOn,
            primaryColor: colors[0],
            secondaryColor: colors[1],
            tertiaryColor: colors[2],
          }),
        )
      : dispatch(
          addItem({
            name: name,
            collection: collection,
            category: selectedCategory,
            type: type,
            purchaseDate: JSON.stringify(purchaseDate),
            image: imageUrl,
            automaticColor: isAutoOn,
            primaryColor: colors[0],
            secondaryColor: colors[1],
            tertiaryColor: colors[2],
          }),
        );
    navigation.popToTop("Category");
    if (!editingIndex) {
      navigation.dispatch(CommonActions.goBack());
    } else {
      dispatch(itemRefresher());
    }
  }
  const onToggleSwitch = () => {
    if (imageUrl) {
      console.log(imageUrl);
      if (isAutoOn == false) {
        colorsExtractor(imageUrl.slice(7));
      }
      setIsAutoOn(!isAutoOn);
    }
  };

  const colorsExtractor = (imageUrl: string) => {
    getAllSwatches(
      { quality: "medium" },
      imageUrl,
      (error: any, swatches: any) => {
        if (error) {
          console.log(error);
        } else {
          swatches.sort((a: any, b: any) => {
            return b.population - a.population;
          });
          setColors([
            swatches[0].hex.slice(0, -2),
            swatches[1].hex.slice(0, -2),
            swatches[2].hex.slice(0, -2),
          ]);
        }
      },
    );
  };
  const handleImagePicker = async (type: number) => {
    if (type == 0) {
      await launchImageLibrary(
        { mediaType: "photo", selectionLimit: 1 },
        (response) => {
          if (response.didCancel) {
            console.log("Image picker cancelled");
          } else if (response.errorCode) {
            console.log("Image picker error: ", response.errorMessage);
          } else {
            setImageUrl(response.assets[0].uri || "");
          }
        },
      );
    } else if (1) {
      await launchCamera({ mediaType: "photo" }, (response) => {
        if (response.didCancel) {
          console.log("Image picker cancelled");
        } else if (response.errorCode) {
          console.log("Image picker error: ", response.errorMessage);
        } else {
          setImageUrl(response.assets[0].uri || "");
        }
      });
    }
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // const itemsState = useSelector((state: RootState) => state.itemsList)
  // console.log(itemsState.items)
  return (
    <>
      <ColorModal
        colors={colors}
        setColors={setColors}
        visible={visible}
        setVisible={setVisible}
        colorSelection={colorSelection}
      />
      <CustomModal
        setVisible={setImageModalVisible}
        visible={imageModalVisible}
        label="Import image"
      >
        <View className="px-6 space-y-5 mt-5">
          <Button mode="contained" onPress={() => handleImagePicker(1)}>
            Use Camera
          </Button>
          <Button mode="contained" onPress={() => handleImagePicker(0)}>
            Import From Device
          </Button>
        </View>
      </CustomModal>
      <ThemeView>
        <>
          <BackButton />
          <View className="flex items-center space-y-3">
            <ThemeText classNameStyle="text-xl mt-4 font-mono">
              {editingIndex ? "Editing Item" : "Adding an Item"}
            </ThemeText>
            <TouchableOpacity
              onPress={() => {
                setImageModalVisible(true);
              }}
            >
              <Image
                style={{ resizeMode: "contain" }}
                source={imageUrl == "" ? addImage : { uri: imageUrl }}
                className="w-20 h-20 rounded-md object-contain"
              />
            </TouchableOpacity>
            <CustomInput
              mode="outlined"
              outlineColor="#AEBB77"
              selectionColor="#C0C0C0"
              activeOutlineColor="#AEBB77"
              textContentType="name"
              style={styles.customWidth}
              label="Name"
              value={name}
              onChange={(text) => setName(text.nativeEvent.text)}
              right={
                <Pressable onPress={() => setName(get_random(RandomNamesP1))}>
                  <Icon name="dice" size={15} color="#77AEBB" />
                </Pressable>
              }
            />
            <View style={[{ zIndex: 2, marginBottom: 10 }, styles.customWidth]}>
              <DropDownPicker
                open={openType}
                value={type}
                items={types}
                setOpen={setOpenType}
                setValue={setType}
                mode="BADGE"
                placeholder="Type"
                style={{ borderColor: "#AEBB77" }}
                dropDownContainerStyle={{ borderColor: "#AEBB77" }}
                theme={String(useColorScheme()?.toUpperCase()) as ThemeNameType}
              />
            </View>
            <DatePicker
              title="Purchase Date"
              date={purchaseDate}
              isDatePickerVisible={isDatePickerVisible}
              setDate={setPurchaseDate}
              setDatePickerVisibility={setDatePickerVisibility}
            />
            <View style={[{ zIndex: 1 }, styles.customWidth]}>
              <DropDownPicker
                open={openCollection}
                value={collection}
                items={collectionState}
                setOpen={setOpenCollection}
                setValue={setCollection}
                multiple={true}
                theme={String(useColorScheme()?.toUpperCase()) as ThemeNameType}
                badgeDotColors={CollectionColors}
                badgeTextStyle={{ color: "black" }}
                mode="BADGE"
                placeholder="Collection"
                style={{ borderColor: "#AEBB77" }}
                dropDownContainerStyle={{ borderColor: "#AEBB77" }}
              />
            </View>

            <View className="flex flex-row">
              <Icon name="info-circle" size={15} color="#77AEBB" />
              <ThemeText classNameStyle="text-xs ml-2">
                You can add this Item under a collection
              </ThemeText>
            </View>

            <View className="flex-row items-center">
              <ThemeText>Automatic color selection</ThemeText>
              <Switch
                color="#77AEBB"
                value={isAutoOn}
                onValueChange={onToggleSwitch}
              />
            </View>

            {!isAutoOn && (
              <View className="flex flex-row justify-between items-center border-[1px] border-mainGreen rounded-lg w-4/5 h-8 px-5">
                <ThemeText>Primary color</ThemeText>
                <Pressable
                  onPress={() => {
                    setVisible(true);
                    setColorSelection(0);
                  }}
                >
                  <View
                    className="h-5 w-5 border-[0.2px]"
                    style={{ backgroundColor: colors[0] || "gray" }}
                  />
                </Pressable>
              </View>
            )}
            {!isAutoOn && (
              <View className="flex flex-row justify-between items-center border-[1px] border-mainGreen rounded-lg w-4/5 h-8 px-5">
                <ThemeText>Secondary</ThemeText>
                <Pressable
                  onPress={() => {
                    setVisible(true);
                    setColorSelection(1);
                  }}
                >
                  <View
                    className="h-5 w-5 border-[0.2px]"
                    style={{ backgroundColor: colors[1] || "gray" }}
                  />
                </Pressable>
              </View>
            )}
            {!isAutoOn && (
              <View className="flex flex-row justify-between items-center border-[1px] border-mainGreen rounded-lg w-4/5 h-8 px-5">
                <ThemeText>Tertiary color</ThemeText>
                <Pressable
                  onPress={() => {
                    setVisible(true);
                    setColorSelection(2);
                  }}
                >
                  <View
                    className="h-5 w-5 border-[0.2px]"
                    style={{ backgroundColor: colors[2] || "gray" }}
                  />
                </Pressable>
              </View>
            )}

            {errorsList.length && (
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
            <View className="flex flex-row justify-center space-x-5">
              <Button
                // className="mb-5"
                mode="contained"
                buttonColor="#77AEBB"
                textColor="white"
                onPress={addItemHandler}
              >
                Save
              </Button>
              {editingIndex && (
                <Button
                  // className="mb-5"
                  mode="contained"
                  buttonColor="#ee4949"
                  textColor="white"
                  onPress={deleteItemHandler}
                >
                  Delete
                </Button>
              )}
            </View>
          </View>
        </>
      </ThemeView>
    </>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
