import { Text, View, useColorScheme, Pressable } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react-native";
import { BackButton } from "../../components/BackButton";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { LogComponent } from "../../components/LogComponent";
import { Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export const OutfitLog = () => {
  const animationRef = useRef<Lottie>(null);
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    // animationRef.current?.play(30, 120);
  }, []);
  const [search, setSearch] = useState("");
  const isDarkMode = useColorScheme() === "dark";
  const logsState = useSelector((state: RootState) => state.itemsList.logs);
  //filter : last added  and first added (from logTime), today, last week ,search by name
  return (
    <ThemeView classNameStyle="px-5">
      <>
        <View className="flex flex-row items-center justify-center w-full h-14 rounded-t-2xl shadow-2xl bg-mainCyan mb-[1%]">
          <Text className="text-xl text-white font-bold">LOGS</Text>
          <View className="w-[1%] h-full bg-white absolute right-[15%]" />
          <Pressable className="w-[15%] h-full bg-mainGreen absolute right-0 rounded-tr-2xl flex justify-center items-center">
            <Icon name="filter" size={25} color="white" />
          </Pressable>
        </View>
        <Searchbar
          className="w-full"
          theme={{
            roundness: 0,
            colors: {
              onSurfaceVariant: isDarkMode ? "white" : "black",
              elevation: { level3: "#aebb77b0" },
            },
          }}
          value={search}
          selectionColor="#C0C0C0"
          // label="Search"
          onChange={(text) => setSearch(text.nativeEvent.text)}
          onClearIconPress={() => setSearch("")}
        />
        {logsState.length <= 0 && (
          <>
            <Lottie
              ref={animationRef}
              style={{ width: "100%", alignSelf: "center" }}
              source={require("../../assets/jsonAnimations/cloths1.json")}
            />
            <Text className="self-center">Your closet history is empty</Text>
          </>
        )}
        <View className="w-full h-[85%] flex flex-row flex-wrap bg-gray mx-auto mt-[1%] px-5">
          <FlashList
            showsVerticalScrollIndicator={false}
            data={logsState}
            renderItem={({ item }) => (
              <LogComponent
                eventName={item.eventName}
                eventDate={JSON.parse(item.eventDate)}
                eventId={item.eventId}
              />
            )}
            estimatedItemSize={200}
          />
        </View>
      </>
    </ThemeView>
  );
};
