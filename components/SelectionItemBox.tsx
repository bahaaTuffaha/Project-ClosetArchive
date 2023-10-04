import { View, Image, Text, Pressable } from "react-native";
import { categoryLayoutImages } from "../utils/data";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { colors } from "../utils/colors";

export const SelectionItemBox = ({
  image,
  primary,
  secondary,
  tertiary,
  name,
  categoryNumber,
  id,
  setSelectedIdCollector,
  selectedIdCollector,
}: {
  image: string;
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
  categoryNumber: number;
  id: string;
  setSelectedIdCollector: Dispatch<SetStateAction<string[]>>;
  selectedIdCollector: string[];
}) => {
  const boxStyle = "w-16 h-16 rounded-lg";
  const layout = require("../assets/images/layout1.png");
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    if (isSelected) {
      setSelectedIdCollector((prevArray) => [...prevArray, id]);
    } else {
      setSelectedIdCollector((prevArray) =>
        prevArray.filter((item) => isSelected || item !== id),
      );
    }
  }, [isSelected]);

  return (
    <Pressable
      onPress={() => {
        setIsSelected(!isSelected);
      }}
      className={`m-1 relative ${boxStyle}`}
    >
      <Image
        className="flex-1 absolute z-20 rounded-lg"
        source={
          selectedIdCollector.includes(id)
            ? require("../assets/images/layoutSelection.png")
            : categoryLayoutImages[categoryNumber] ?? layout
        }
      />
      <Text
        style={{
          textShadowColor: colors.black,
          textShadowRadius: 15,
        }}
        className="absolute z-10 rounded-lg text-center font-medium text-xs text-white self-center w-full mt-1"
      >
        {name}
      </Text>
      {image !== "" ? (
        <Image className="w-full h-full rounded-lg" source={{ uri: image }} />
      ) : (
        <View className={`flex flex-row rounded-lg ${boxStyle}`}>
          <View
            className="w-1/3 h-full rounded-l-lg"
            style={{ backgroundColor: primary }}
          ></View>
          <View
            className="w-1/3 h-full"
            style={{ backgroundColor: secondary }}
          ></View>
          <View
            className="w-1/3 h-full rounded-r-lg"
            style={{ backgroundColor: tertiary }}
          ></View>
        </View>
      )}
    </Pressable>
  );
};
