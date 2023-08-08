import { View, Image, Text, Pressable } from "react-native";
import { categoryLayoutImages } from "../utils/data";
import { Dispatch, SetStateAction, useState } from "react";

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
  const boxStyle2 = "w-[69px] h-[69px] rounded-lg";
  const layout = require("../assets/images/layout1.png");
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Pressable
      onPress={() => {
        setIsSelected(!isSelected);
        if (isSelected) {
          setSelectedIdCollector((prevArray) => [...prevArray, id]);
        } else {
          setSelectedIdCollector((prevArray) =>
            prevArray.filter((item) => isSelected || item !== id),
          );
        }
      }}
      style={{
        borderWidth: selectedIdCollector.includes(id) ? 5 : 0,
        borderColor: "#77AEBB",
      }}
      className={`m-1 relative ${
        selectedIdCollector.includes(id) ? boxStyle2 : boxStyle
      }`}
    >
      <Image
        className="flex-1 absolute z-20 rounded-lg"
        source={categoryLayoutImages[categoryNumber] ?? layout}
      />
      <Text
        style={{
          textShadowColor: "black",
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
