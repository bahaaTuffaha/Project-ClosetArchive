import { Dimensions, Pressable, View, ViewStyle } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ImageSequence from "react-native-image-sequence-2";
import { AnimatedStyleProp, interpolate } from "react-native-reanimated";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { newCategory } from "./images";
import { ThemeView } from "../../components/ThemeView";
import { ThemeText } from "../../components/ThemeText";
import { BackButton } from "../../components/BackButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import { delCategory } from "../../redux/categoriesSlice";
const centerIndex = Math.round(36);
export type TAnimationStyle = (value: number) => AnimatedStyleProp<ViewStyle>;

export function Category() {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation<any>();

  const categoriesState = useSelector((state: RootState) => state.CategoryList);
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
          autoPlay={false} // do redux + array for
          data={[
            ...categoriesState.Categories,
            {
              name: "Add New Category",
              sprites: newCategory,
              screen: "CategoryForm",
              index: -1,
            },
          ]} // spread to add custom cate.. that are stored in redux ,at the last you should add "Add new category", add on press
          scrollAnimationDuration={1000}
          customAnimation={animationStyle}
          // onSnapToItem={(index: any) => console.log("current index:", index)}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                // borderWidth: 1,
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate(item.screen, {
                    selectedCategory: item.index,
                  })
                }
              >
                <ThemeText classNameStyle="text-3xl mt-10 uppercase mx-auto font-bold">
                  {item.name}
                </ThemeText>
                <ImageSequence
                  framesPerSecond={24}
                  images={item.sprites}
                  // downsampleHeight={32}
                  // downsampleWidth={32}
                  startFrameIndex={centerIndex}
                  style={{ width: 500, height: 500 }}
                />
              </Pressable>
              {item.index > 3 && (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(delCategory({ index: item.index }));
                  }}
                >
                  <Icon name="delete" size={50} color="red" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </ThemeView>
    </>
  );
}
