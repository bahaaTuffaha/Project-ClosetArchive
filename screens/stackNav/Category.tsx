import { Dimensions, Pressable, View, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import SpriteAnimation from "../../components/SpriteAnimator";
import { interpolate } from "react-native-reanimated";
import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  accessoriesSprite,
  newCategorySprite,
  shoesSprite,
  trousersSprite,
  tshirtSprite,
} from "./images";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { BackButton } from "../../components/BackButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { delCategory } from "../../redux/categoriesSlice";
import { localization } from "../../utils/localization";
export type TAnimationStyle = (value: number) => any;

export const defaultCategories = [
  {
    name: localization.Tops,
    spriteSheet: tshirtSprite,
    screen: "ItemForm",
    index: 0,
  },
  {
    name: localization.Bottoms,
    spriteSheet: trousersSprite,
    screen: "ItemForm",
    index: 1,
  },
  {
    name: localization.Shoes,
    spriteSheet: shoesSprite,
    screen: "ItemForm",
    index: 2,
  },
  {
    name: localization.Accessories,
    spriteSheet: accessoriesSprite,
    screen: "ItemForm",
    index: 3,
  },
];
export function Category() {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation<any>();

  const categoriesState = useSelector((state: RootState) => state.CategoryList);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const animationStyle: TAnimationStyle = useCallback(
    (value: number) => {
      "worklet";

      const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
      const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
      const translateX = interpolate(value, [-1, 0, 1], [-width, 0, width]);

      return {
        transform: [{ rotateZ }, { translateX }],
        zIndex,
      };
    },
    [width],
  );
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <ThemeView>
      <BackButton />
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
            spriteSheet: newCategorySprite,
            screen: "CategoryForm",
            index: -1,
          },
        ]}
        scrollAnimationDuration={1000}
        customAnimation={animationStyle}
        onProgressChange={(_, absoluteProgress) => {
          const idx = Math.round(absoluteProgress);
          setActiveIndex(idx);
        }}
        renderItem={({ item, index }) => (
          <View className="flex-1 items-center relative">
            <Pressable
              onPress={() =>
                item.index === -1
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
                {item.index >= defaultCategories.length
                  ? item.name[0]
                  : item.name[storedSettings.language]}
              </ThemeText>
              <SpriteAnimation
                spriteSheet={item.spriteSheet}
                frameWidth={500}
                frameHeight={500}
                columns={8}
                totalFrames={72}
                fps={24}
                style={{
                  width: 500,
                  height: 500,
                }}
                visible={index === activeIndex}
              />
            </Pressable>
            <View className="absolute top-0 flex flex-row gap-x-5">
              {item.index >= defaultCategories.length && (
                <TouchableOpacity
                  className="bg-mainPink border-solid rounded-full p-2"
                  onPress={() => {
                    dispatch(delCategory({ index: item.index }));
                  }}
                >
                  <Icon name="delete-forever" size={30} color="white" />
                </TouchableOpacity>
              )}
              {item.index !== -1 && (
                <TouchableOpacity
                  className="bg-mainPink border-solid rounded-full p-2"
                  onPress={() => {
                    navigation.navigate("EditCategory", {
                      categoryIndex: item.index,
                    });
                  }}
                >
                  <Icon name="edit" size={30} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </ThemeView>
  );
}
