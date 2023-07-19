import { Text, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import Icon from "react-native-vector-icons/Feather";
export function HomeBottom() {
  //this is the main page

  return (
    <ThemeView classNameStyle="px-5">
      <View className="flex flex-col">
        <Text className="font-light text-lg italic pt-5">
          Welcome back, {"bahaa"}
        </Text>
        <View className="w-full flex flex-col mt-10">
          <View className="w-full flex flex-row justify-between">
            <View className="flex flex-row items-center h-14 w-[79%] bg-mainPink rounded-tl-2xl shadow-2xl">
              <View className="mx-3">
                <Icon name="alert-octagon" size={40} color="white" />
              </View>
              <Text className="text-white font-bold w-3/4 capitalize">
                warnings
              </Text>
            </View>
            <View className="h-14 w-[20%] bg-mainCyan rounded-tr-2xl justify-center items-center shadow-xl">
              <Icon name="search" size={30} color="white" />
            </View>
          </View>
          <View className="w-full h-3/4 bg-gray mt-[1%]"></View>
        </View>
      </View>
    </ThemeView>
  );
}
