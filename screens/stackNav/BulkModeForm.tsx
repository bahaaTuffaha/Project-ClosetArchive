import { Button } from "react-native-paper";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { colors } from "../../utils/colors";
import { CustomInput } from "../../components/CustomInput";
import { Text, View, useColorScheme } from "react-native";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ThemeText } from "../../components/ThemeText";
import Icon from "react-native-vector-icons/FontAwesome5";
import { handleNumberChange } from "../../utils/validators";
import { addItem } from "../../redux/itemsSlice";
import DropDownPicker, { ThemeNameType } from "react-native-dropdown-picker";
import { CommonActions } from "@react-navigation/native";
import { clothesList, localization } from "../../utils/localization";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as FileSystem from "expo-file-system";
import ImageResizer from "@bam.tech/react-native-image-resizer";

export const BulkModeForm = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { selectedCategory } = route.params;
  const [prefix, setPrefix] = useState("");
  const [imageNum, setImageNum] = useState(2);
  const [openType, setOpenType] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const colorScheme = String(useColorScheme()?.toUpperCase()) as ThemeNameType;
  const [collection, setCollection] = useState([]);
  const [type, setType] = useState("");
  const dispatch = useDispatch();
  const [errorsList, setErrorsList] = useState<string[]>([]);
  // const [images, setImages] = useState<[]>([]);

  const storedSettings = useSelector((state: RootState) => state.settings);
  const collectionState = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const storedCatTypes = useSelector(
    (state: RootState) => state.CategoryList.CategoryCustomTypes,
  );

  const combiningTypesData =
    selectedCategory <= 3
      ? [
          ...(clothesList[storedSettings.language]?.[selectedCategory] || []),
          ...(storedCatTypes?.[selectedCategory]?.customTypes || []).map(
            (item) => ({
              label: item.label,
              value: item.value,
            }),
          ),
        ]
      : storedCatTypes?.[selectedCategory]?.customTypes.map((item) => ({
          label: item.label,
          value: item.value,
        }));

  const handleImagePicker = async (type: number, createItem: any) => {
    if (type === 0) {
      try {
        const response = await launchImageLibrary({
          mediaType: "photo",
          selectionLimit: imageNum,
        });

        if (response.didCancel) {
          console.log("Image picker cancelled");
          return;
        } else if (response.errorCode) {
          console.log("Image picker error: ", response.errorMessage);
          return;
        }

        const newImages = [];
        for (let i = 0; i < response.assets?.length; i++) {
          newImages.push(response.assets[i]?.uri);
        }
        createItem(newImages); // Update the state with the new array
      } catch (error) {
        console.error("Image picker error:", error);
      }
    } else {
      const newImages = [];
      for (let i = 0; i < imageNum; i++) {
        try {
          await launchCamera(
            {
              mediaType: "photo",
            },
            (response) => {
              if (response.didCancel) {
                console.log("Image picker cancelled");
              } else if (response.errorCode) {
                console.log("Image picker error: ", response.errorMessage);
                return;
              } else {
                newImages.push(response.assets[0]?.uri);
              }
            },
          );
        } catch (error) {
          console.log("permission error", error);
        }
      }
      createItem(newImages);
    }
  };
  function addItemHandler(mode: number) {
    const errors = [];

    if (prefix.length <= 0) {
      errors.push("Please enter item prefix");
    }
    if (prefix.length > 20) {
      errors.push("Please enter a name within 20 characters");
    }

    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);

    handleImagePicker(mode, createItem);

    function createItem(images: any[]) {
      for (let i = 0; i < images.length; i++) {
        ImageResizer.createResizedImage(images[i], 500, 500, "JPEG", 40, 0)
          .then(async (response) => {
            const imgBase64 = await FileSystem.readAsStringAsync(response.uri, {
              encoding: "base64",
            });
            console.log("imageSize", response.size);
            dispatch(
              addItem({
                name: prefix + ` ${i + 1}`,
                collection: collection,
                category: selectedCategory,
                type: type,
                fit: "",
                season: "",
                size: "",
                sizeUnit: "",
                quantity: 1,
                purchaseDate: JSON.stringify(new Date()),
                image: imgBase64,
                automaticColor: false,
                primaryColor: "",
                secondaryColor: "",
                tertiaryColor: "",
              }),
            );
          })
          .catch((err) => {
            console.log("image comparison error: ", err);
          });
      }
    }

    navigation.popToTop("Category");

    navigation.dispatch(CommonActions.goBack());
  }
  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">
            {localization.BulkMode[storedSettings.language]}
          </ThemeText>
        </View>
        <View className="space-y-5">
          <CustomInput
            mode="outlined"
            outlineColor={colors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={colors.mainGreen}
            textContentType="name"
            className="mx-20"
            style={[
              {
                textAlign: storedSettings.language == 1 ? "right" : "left",
              },
            ]}
            label={localization.Prefix[storedSettings.language]}
            value={prefix}
            onChange={(text) => setPrefix(text.nativeEvent.text)}
          />
          {combiningTypesData?.length > 0 && (
            <View style={{ zIndex: 2, marginHorizontal: 80 }}>
              <DropDownPicker
                open={openType}
                value={type}
                items={combiningTypesData}
                setOpen={setOpenType}
                setValue={setType}
                mode="SIMPLE"
                listMode="MODAL"
                placeholder={localization.Type[storedSettings.language]}
                style={{ borderColor: colors.mainGreen }}
                dropDownContainerStyle={{ borderColor: colors.mainGreen }}
                theme={colorScheme}
              />
            </View>
          )}
          <View style={{ zIndex: 1, marginHorizontal: 80 }}>
            <DropDownPicker
              open={openCollection}
              value={collection}
              items={collectionState}
              setOpen={setOpenCollection}
              setValue={setCollection}
              multiple={true}
              theme={colorScheme}
              // badgeDotColors={CollectionColors}
              showBadgeDot={false}
              badgeTextStyle={{ color: colors.black }}
              mode="BADGE"
              placeholder={localization.Collection[storedSettings.language]}
              style={{ borderColor: colors.mainGreen }}
              dropDownContainerStyle={{ borderColor: colors.mainGreen }}
            />
          </View>
          <CustomInput
            mode="outlined"
            outlineColor={colors.mainGreen}
            selectionColor="#C0C0C0"
            activeOutlineColor={colors.mainGreen}
            textContentType="name"
            className="mx-20"
            label={localization.NumberOfItems[storedSettings.language]}
            value={imageNum.toString()}
            onChange={(text) =>
              handleNumberChange(
                () => {
                  setImageNum(Number(text.nativeEvent.text));
                },
                text.nativeEvent.text,
                0,
                30,
              )
            }
            keyboardType="numeric"
          />
          <View
            className={`flex  mx-16 ${
              storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Icon name="info-circle" size={15} color={colors.mainCyan} />
            <ThemeText classNameStyle="text-xs mx-2">
              {localization.bulkInfo[storedSettings.language]}
            </ThemeText>
          </View>
          {errorsList.length > 0 && (
            <View>
              {errorsList.map((error, index) => {
                return (
                  <Text key={index} className="text-[#C70039] self-center">
                    {error}
                  </Text>
                );
              })}
            </View>
          )}
          <Button
            className="mx-5"
            mode="contained"
            buttonColor={colors.mainCyan}
            textColor={colors.white}
            onPress={() => {
              addItemHandler(0);
            }}
          >
            {localization.startLocalImages[storedSettings.language]}
          </Button>
          <Button
            className="mx-5"
            mode="contained"
            buttonColor={colors.mainCyan}
            textColor={colors.white}
            onPress={() => {
              addItemHandler(1);
            }}
          >
            {localization.startWCamera[storedSettings.language]}
          </Button>
        </View>
      </>
    </ThemeView>
  );
};
