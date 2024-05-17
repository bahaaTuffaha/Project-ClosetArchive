import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { Category } from "../../redux/categoriesSlice";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { useEffect } from "react";

const CategoryItem = ({ category }: { category: Category }) => {
  return (
    <View>
      <ThemeText>{category.name}</ThemeText>
    </View>
  );
};
export const EditCategory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { categoryIndex } = route.params;
  useEffect(() => {}, [categoryIndex]);

  return (
    <ThemeView>
      <FlashList
        numColumns={1}
        extraData={refreshLaundry}
        data={}
        estimatedItemSize={64}
        renderItem={({ item, index }) => (
          <View
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
            }}
          >
            <CategoryItem category={item} />
          </View>
        )}
      />
    </ThemeView>
  );
};
