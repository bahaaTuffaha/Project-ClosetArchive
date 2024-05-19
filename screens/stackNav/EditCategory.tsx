import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { clothesList, localization } from "../../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BackButton } from "../../components/BackButton";
import { CollectionItem } from "./CollectionForm";
import { useEffect, useState } from "react";

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

  const storedCatTypes = useSelector(
    (state: RootState) => state.CategoryList.CategoryCustomTypes,
  );

  useEffect(() => {
    try {
      setCatData([
        ...clothesList[storedSettings.language][categoryIndex],
        ...storedCatTypes[categoryIndex],
      ]);
    } catch (e) {
      setCatData(clothesList[storedSettings.language][categoryIndex]);
    }
  }, [refresh]);

  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">
            {"Edit Category"}
          </ThemeText>
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
              <CollectionItem
                item={item}
                setRefresh={setRefresh}
                CollectionsState={
                  clothesList[storedSettings.language][categoryIndex]
                }
                isCatType={true}
                catIndex={categoryIndex}
                ignoreNum={
                  clothesList[storedSettings.language][categoryIndex].length
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
