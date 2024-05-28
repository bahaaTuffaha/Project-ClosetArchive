import { FlashList } from "@shopify/flash-list";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { clothesList, localization } from "../../utils/localization";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BackButton } from "../../components/BackButton";
import { useEffect, useState } from "react";
import { CustomInput } from "../../components/CustomInput";
import { colors } from "../../utils/colors";
import { Button } from "react-native-paper";
import { addTypeToCategory } from "../../redux/categoriesSlice";
import { EditItemList } from "../../components/EditItemList";

export const EditCategory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { categoryIndex } = route.params;
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [refresh, setRefresh] = useState(false);
  const [catData, setCatData] = useState<any>([]);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [newType, setNewType] = useState("");
  const dispatch = useDispatch();

  const storedCatTypes = useSelector(
    (state: RootState) => state.CategoryList?.CategoryCustomTypes ?? [],
  );

  useEffect(() => {
    try {
      setCatData([
        ...clothesList[storedSettings.language][categoryIndex],
        ...(storedCatTypes[categoryIndex]?.customTypes || []),
      ]);
    } catch (e) {
      setCatData(storedCatTypes[categoryIndex]?.customTypes);
    }
  }, [refresh, storedCatTypes[categoryIndex]?.customTypes?.length]);

  function addTypeHandler(index: number, allList: any[]) {
    const errors = [];

    if (newType.length <= 0) {
      errors.push("Please enter a name for this Type");
    }
    if (newType.length > 20) {
      errors.push("Please enter a name within 20 characters max");
    }
    if (allList?.find((x) => x.label.toLowerCase() == newType.toLowerCase())) {
      errors.push("Please enter a different name");
    }
    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    dispatch(
      addTypeToCategory({
        index: index,
        typeName: newType,
      }),
    );
    setNewType("");
  }

  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row justify-center items-center ">
          <BackButton />
          <View className="flex flex-col items-center space-y-3">
            <ThemeText classNameStyle="text-xl mt-4 font-mono italic">
              {localization.Edit_Category[storedSettings.language]}
            </ThemeText>
            <CustomInput
              mode="outlined"
              outlineColor={colors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={colors.mainGreen}
              textContentType="name"
              style={styles.customWidth}
              label={localization.Add_Type[storedSettings.language]}
              value={newType}
              onChange={(text) => setNewType(text.nativeEvent.text)}
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
            <Button
              mode="contained"
              buttonColor={colors.mainCyan}
              textColor={colors.white}
              onPress={() => {
                addTypeHandler(categoryIndex, catData);
                Keyboard.dismiss();
              }}
              className="mx-10 my-5"
            >
              {localization.Save[storedSettings.language]}
            </Button>
          </View>
        </View>
        <FlashList
          numColumns={1}
          extraData={refresh}
          data={catData}
          estimatedItemSize={64}
          renderItem={({ item, index }) => (
            <View
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
              }}
            >
              {/* <CategoryItem key={index} type={item} /> */}
              <EditItemList
                item={item}
                setRefresh={setRefresh}
                CollectionsState={catData}
                isCatType={true}
                catIndex={categoryIndex}
                ignoreNum={
                  clothesList[storedSettings.language][categoryIndex]?.length
                }
                currentIndex={index}
                key={index}
              />
            </View>
          )}
        />
      </>
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
