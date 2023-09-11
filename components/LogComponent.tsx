import { View, TouchableOpacity } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ItemBox } from "./ItemBox";
import dayjs from "dayjs";

export const LogComponent = ({
  eventName,
  eventDate,
  eventId,
}: {
  eventName: string;
  eventDate: Date;
  eventId: string;
}) => {
  const itemsState = useSelector((state: RootState) => state.itemsList.items);
  const filteredArray = itemsState.filter((obj) => {
    return obj.logIds?.some((element) => element === eventId);
  });
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("event details");
      }}
      className="w-full h-fit my-5 border-mainGreen bg-white flex flex-col items-center relative rounded-lg"
    >
      <View className="w-full flex flex-row justify-between">
        <Text className="ml-[5%] capitalize text-mainCyan font-bold">
          {eventName}
        </Text>
        <Text>{dayjs(eventDate).format("DD/MM/YYYY")}</Text>
        <Text>{dayjs(eventDate).format("h:mm A")}</Text>
        <TouchableOpacity
          onPress={() => console.log("delete this item")}
          className="h-full w-6 bg-red flex flex-row justify-center z-20 rounded-tr-lg"
        >
          <Text className="text-white font-bold">X</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row flex-wrap bg-mainPink rounded-b-md w-full h-fit min-h-[73px] px-4 py-2 border-2 border-white">
        {filteredArray.map((item) => {
          return (
            <ItemBox
              primary={item.primaryColor || "#fff"}
              secondary={item.secondaryColor || "#fff"}
              tertiary={item.tertiaryColor || "#fff"}
              key={item.id}
              image={item.image}
              name={item.name}
              categoryNumber={item.category}
              id={item.id}
            />
          );
        })}
      </View>
    </TouchableOpacity>
  );
};
