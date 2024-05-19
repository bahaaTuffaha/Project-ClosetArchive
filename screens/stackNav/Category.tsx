import {
  Dimensions,
  Pressable,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ImageSequence from "react-native-image-sequence-2";
import { AnimatedStyleProp, interpolate } from "react-native-reanimated";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { accessories, newCategory, shoes, trousers, tshirt } from "./images";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { BackButton } from "../../components/BackButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { delCategory } from "../../redux/categoriesSlice";
import { localization } from "../../utils/localization";
export type TAnimationStyle = (value: number) => AnimatedStyleProp<ViewStyle>;

export const defaultCategories = [
  {
    name: localization.Tops,
    sprites: tshirt,
    screen: "ItemForm",
    index: 0,
  },
  {
    name: localization.Bottoms,
    sprites: trousers,
    screen: "ItemForm",
    index: 1,
  },
  {
    name: localization.Shoes,
    sprites: shoes,
    screen: "ItemForm",
    index: 2,
  },
  {
    name: localization.Accessories,
    sprites: accessories,
    screen: "ItemForm",
    index: 3,
  },
];
export function Category() {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation<any>();

  const categoriesState = useSelector((state: RootState) => state.CategoryList);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const animationStyle: TAnimationStyle = useCallback((value: number) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
    const translateX = interpolate(value, [-1, 0, 1], [-width, 0, width]);

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);
  const dispatch = useDispatch();
  return (
    <>
      <BackButton />
      <ThemeView>
        <Carousel
          loop
          windowSize={3} //number of elements that rendered
          width={width}
          height={height}
          autoPlay={false}
          data={[
            ...defaultCategories,
            ...categoriesState.Categories,
            {
              name: localization.Add_New_Category,
              sprites: newCategory,
              screen: "CategoryForm",
              index: -1,
            },
          ]}
          scrollAnimationDuration={1000}
          customAnimation={animationStyle}
          // onSnapToItem={(index: any) => console.log("current index:", index)}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                // borderWidth: 1,
                alignItems: "center",
                position: "relative",
              }}
            >
              <Pressable
                onPress={() =>
                  item.index == -1
                    ? navigation.navigate(item.screen, {
                        selectedCategory: item.index,
                      })
                    : navigation.navigate("ModeScreen", {
                        screenName: item.screen,
                        selectedCategory: item.index,
                      })
                }
              >
                <ThemeText classNameStyle="text-3xl mt-20 uppercase mx-auto font-bold">
                  {item.index > 3
                    ? item.name[0]
                    : item.name[storedSettings.language]}
                </ThemeText>
                <ImageSequence
                  framesPerSecond={24}
                  images={item.sprites}
                  startFrameIndex={0}
                  style={{
                    width: 500,
                    height: 500,
                    margin: -10,
                  }}
                />
              </Pressable>
              <View className="absolute top-0 flex flex-row space-x-5">
                {item.index > 3 && (
                  <TouchableOpacity
                    className="bg-mainPink border-solid rounded-full p-2"
                    onPress={() => {
                      dispatch(delCategory({ index: item.index }));
                    }}
                  >
                    <Icon name="delete-forever" size={30} color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className="bg-mainPink border-solid rounded-full p-2"
                  onPress={() => {
                    // dispatch(delCategory({ index: item.index }));
                    navigation.navigate("EditCategory", {
                      categoryIndex: item.index,
                    });
                  }}
                >
                  <Icon name="edit" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ThemeView>
    </>
  );
}
