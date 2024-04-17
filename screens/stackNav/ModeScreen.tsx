import { TouchableOpacity } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { BackButton } from "../../components/BackButton";

export const ModeScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { selectedCategory, screenName } = route.params;
  return (
    <ThemeView>
      <>
        <BackButton />
        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center bg-mainGreen h-1/2"
          onPress={() =>
            navigation.navigate(screenName, {
              selectedCategory: selectedCategory,
            })
          }
        >
          <ThemeText classNameStyle="text-lg">Add Single Item</ThemeText>
        </TouchableOpacity>
        <TouchableOpacity className="w-full flex flex-row items-center justify-center bg-mainCyan h-1/2">
          <ThemeText classNameStyle="text-lg">Add a Bulk</ThemeText>
        </TouchableOpacity>
      </>
    </ThemeView>
  );
};
