import { View, TouchableOpacity, useColorScheme } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ItemBox } from "./ItemBox";
import dayjs from "dayjs";
import { deleteEventLog, deleteLog } from "../redux/itemsSlice";
import { Dispatch, SetStateAction } from "react";

export const LogComponent = ({
  eventName,
  eventDate,
  eventId,
  setRefresh,
  setModalVisible,
  setModalEventId,
}: {
  eventName: string;
  eventDate: Date;
  eventId: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setModalEventId: Dispatch<SetStateAction<string>>;
}) => {
  const itemsState = useSelector((state: RootState) => state.itemsList.items);
  const filteredArray = itemsState.filter((obj) => {
    return obj.logIds?.some((element) => element === eventId);
  });
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
        setModalEventId(eventId);
      }}
      style={{
        backgroundColor: useColorScheme() === "dark" ? "#181818" : "white",
      }}
      className="w-full h-fit my-3 border-mainGreen flex flex-col items-center relative rounded-lg"
    >
      <View className="w-full flex flex-row justify-between">
        <Text className="ml-[5%] capitalize text-mainCyan font-bold">
          {eventName}
        </Text>
        <Text>{dayjs(eventDate).format("DD/MM/YYYY")}</Text>
        <Text>{dayjs(eventDate).format("h:mm A")}</Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(deleteLog({ selectedLogId: eventId }));
            dispatch(deleteEventLog({ selectedLogId: eventId }));
            setRefresh((value) => !value);
          }}
          className="h-full w-6 bg-red flex flex-row justify-center z-20 rounded-tr-lg"
        >
          <Text className="text-white font-bold">X</Text>
        </TouchableOpacity>
      </View>
      <View
        className="flex flex-row flex-wrap bg-slate-500 rounded-b-md w-full h-fit min-h-[73px] px-[5%] justify-evenly py-2 border-2"
        style={{
          borderColor: useColorScheme() === "dark" ? "#181818" : "white",
        }}
      >
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
