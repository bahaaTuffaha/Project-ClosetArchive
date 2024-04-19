import { Image, TouchableOpacity } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { BackButton } from "../../components/BackButton";
import bulkBoxes from "../../assets/images/bulk.png";
import singleBox from "../../assets/images/single.png";
import { localization } from "../../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const ModeScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { selectedCategory, screenName } = route.params;
  const storedSettings = useSelector((state: RootState) => state.settings);
  return (
    <ThemeView>
      <>
        <BackButton />
        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center bg-mainGreen h-1/2 relative"
          onPress={() =>
            navigation.navigate(screenName, {
              selectedCategory: selectedCategory,
            })
          }
        >
          <ThemeText
            customStyle={{ fontFamily: "TSMorabaat-Regular" }}
            classNameStyle="text-[50px] z-10 text-bold"
          >
            {localization.addSingleItem[storedSettings.language]}
          </ThemeText>
          <Image
            source={singleBox}
            className="w-[80%] h-[70%] rounded-md object-cover z-0 self-center absolute"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center bg-mainCyan h-1/2 relative"
          onPress={() =>
            navigation.navigate("BulkModeForm", {
              selectedCategory: selectedCategory,
            })
          }
        >
          <ThemeText
            customStyle={{ fontFamily: "TSMorabaat-Regular" }}
            classNameStyle="text-[50px] z-10"
          >
            {localization.addMultiItems[storedSettings.language]}
          </ThemeText>
          <Image
            source={bulkBoxes}
            className="w-[80%] h-[90%] rounded-md object-cover z-0 self-center absolute"
          />
        </TouchableOpacity>
      </>
    </ThemeView>
  );
};
