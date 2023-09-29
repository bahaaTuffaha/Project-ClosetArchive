import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useState } from "react";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { CustomInput } from "../../components/CustomInput";
import ColorModal from "../../components/ColorModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ThemeText } from "../../components/ThemeText";
import {
  addCollection,
  deleteCollection,
  itemRefresher,
} from "../../redux/itemsSlice";
import { FlashList } from "@shopify/flash-list";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

export const CollectionForm = () => {
  // const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [colors, setColors] = useState([""]);
  const [refresh, setRefresh] = useState(false);
  const CollectionsState = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const dispatch = useDispatch();

  async function addCollectionHandler() {
    const errors = [];

    if (name.length <= 0) {
      errors.push("Please enter a name for this Collection");
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
            <ThemeText classNameStyle="text-xl mt-4 font-mono">
              Add a Collection
            </ThemeText>
            <TouchableOpacity
              style={{ backgroundColor: colors[0] }}
              onPress={() => {
                setVisible(true);
              }}
              className="flex justify-center items-center w-16 h-16 border-[3px] rounded-xl mt-2"
            >
              <Text className="text-black">Color</Text>
            </TouchableOpacity>
            <CustomInput
              mode="outlined"
              outlineColor="#AEBB77"
              selectionColor="#C0C0C0"
              activeOutlineColor="#AEBB77"
              textContentType="name"
              style={styles.customWidth}
              label="Collection Name"
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
            buttonColor="#77AEBB"
            textColor="white"
            onPress={() => {
              addCollectionHandler();
              Keyboard.dismiss();
            }}
            className="mx-10 my-5"
          >
            Save
          </Button>
          <View className="w-full h-1 bg-gray" />
          <Text className="w-full text-center font-mono text-xl my-5">
            Collections
          </Text>
          <FlashList
            showsVerticalScrollIndicator={false}
            data={CollectionsState}
            extraData={refresh}
            renderItem={({ item }) => (
              <View
                style={{ backgroundColor: addOpacityToHex(item.color, 0.2) }}
                className="w-[90%] rounded-lg p-5 self-center mb-5 relative "
              >
                <Text className="font-bold text-black">{item.label}</Text>
                <TouchableOpacity
                  className="w-16 h-[59px] absolute rounded-r-lg right-0 flex flex-row justify-center items-center"
                  onPress={() => {
                    dispatch(deleteCollection({ name: item.label }));
                    setRefresh((prev) => !prev);
                    dispatch(itemRefresher());
                  }}
                >
                  <Icon name="delete" size={30} color="red" />
                </TouchableOpacity>
              </View>
            )}
            estimatedItemSize={200}
          />
        </>
      </ThemeView>
    </>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
