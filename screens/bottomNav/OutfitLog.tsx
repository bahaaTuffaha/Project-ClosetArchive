import {
  Text,
  View,
  useColorScheme,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react-native";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { LogComponent } from "../../components/LogComponent";
import { Button, RadioButton, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomModal from "../../components/CustomModal";
import { logsType } from "../../redux/itemsSlice";
import { ThemeText } from "../../components/ThemeText";
import dayjs from "dayjs";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export const OutfitLog = () => {
  const animationRef = useRef<Lottie>(null);
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    // animationRef.current?.play(30, 120);
  }, []);
  const [search, setSearch] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<logsType[]>([]);
  const isDarkMode = useColorScheme() === "dark";
  const logsState = useSelector((state: RootState) => state.itemsList.logs);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventId, setModalEventId] = useState("");
  const [modalInfo, setModalInfo] = useState<logsType>();
  const [sortValue, setSortValue] = useState("LA");

  const space = useSharedValue(-10);
  const { width, height } = Dimensions.get("window");
  const [isOpen, setIsOpen] = useState(false);
  const closeDrawerAnimation = useAnimatedStyle(() => {
    return {
      marginRight: withTiming(space.value, {
        duration: 500,
        easing: Easing.ease,
      }),
    };
  }, []);
  const handleOpenDrawer = () => {
    // Update the space value to trigger the animation
    setIsOpen((prev) => !prev);
    space.value = width / 2 - 15;
  };
  const handleCloseDrawer = () => {
    // Update the space value to trigger the animation
    setIsOpen((prev) => !prev);
    space.value = -10;
  };

  function filter(array: logsType[], search: string) {
    let newArray = array.filter((x) =>
      x.eventName.toLowerCase().includes(search.toLowerCase()),
    );
    switch (sortValue) {
      case "LA":
        newArray.sort((a, b) => {
          if (a.logTime > b.logTime) {
            return -1;
          }
          if (a.logTime < b.logTime) {
            return 1;
          }
          return 0;
        });
        break;
      case "NA":
        newArray.sort((a, b) => {
          const nameA = a.eventName.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
          const nameB = b.eventName.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        break;
      case "ND":
        newArray.sort((a, b) => {
          const nameA = a.eventName.toUpperCase();
          const nameB = b.eventName.toUpperCase();

          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });

        break;
      case "DA":
        newArray.sort((a, b) => {
          if (a.eventDate < b.eventDate) {
            return -1;
          }
          if (a.eventDate > b.eventDate) {
            return 1;
          }
          return 0;
        });

        break;
      case "DD":
        newArray.sort((a, b) => {
          if (a.eventDate > b.eventDate) {
            return -1;
          }
          if (a.eventDate < b.eventDate) {
            return 1;
          }
          return 0;
        });
        break;
    }
    return newArray;
  }

  useEffect(() => {
    let info = logsState.find((x) => x.eventId == modalEventId);
    setModalInfo(info);
  }, [modalEventId]);

  useEffect(() => {
    setFilteredLogs(filter(logsState, search));
  }, [logsState.length, search, sortValue]);

  //filter : last added  and first added (from logTime), today, last week ,search by name
  return (
    <ThemeView classNameStyle="px-5">
      <>
        <CustomModal
          setVisible={setModalVisible}
          visible={modalVisible}
          label={modalInfo?.eventName || "Event Name"}
        >
          <View className="w-[90%] mr-auto ml-auto space-y-5">
            <View>
              <ThemeText classNameStyle="text-[16px]">Date:</ThemeText>
              <ThemeText>
                {dayjs(
                  modalInfo?.eventDate ? JSON.parse(modalInfo?.eventDate) : "",
                ).format("DD/MM/YYYY")}
              </ThemeText>
            </View>
            <View>
              <ThemeText classNameStyle="text-[16px]">Time:</ThemeText>
              <ThemeText>
                {dayjs(
                  modalInfo?.eventDate ? JSON.parse(modalInfo?.eventDate) : "",
                ).format("h:mm A")}
              </ThemeText>
            </View>
            <View>
              <ThemeText classNameStyle="text-[16px]">
                AdditionalNotes:
              </ThemeText>
              <ThemeText classNameStyle="h-fit">
                {modalInfo?.additionalNotes}
              </ThemeText>
            </View>
          </View>
        </CustomModal>
        {/* this is a clickable background solution */}
        {isOpen && (
          <TouchableOpacity
            onPress={handleCloseDrawer}
            className="z-40 h-full w-full absolute right-5 bg-black opacity-30 rounded-xl"
          />
        )}
        <Animated.View
          style={[
            {
              height: height,
              width: width / 2,
              position: "absolute",
              backgroundColor: "white",
              zIndex: 50,
              right: "-50%",
            },
            closeDrawerAnimation,
          ]}
        >
          <RadioButton.Group
            onValueChange={(value) => setSortValue(value)}
            value={sortValue}
          >
            <RadioButton.Item label="Last Added" value="LA" />
            <RadioButton.Item label="Name Asc" value="NA" />
            <RadioButton.Item label="Name Desc" value="ND" />
            <RadioButton.Item label="Date Asc" value="DA" />
            <RadioButton.Item label="Date Desc" value="DD" />
          </RadioButton.Group>
          <Button
            mode="contained-tonal"
            className="self-center"
            onPress={() => {
              handleCloseDrawer();
            }}
          >
            Apply
          </Button>
        </Animated.View>
        <View className="flex flex-row items-center justify-center w-full h-14 rounded-t-2xl shadow-2xl bg-mainCyan mb-[1%]">
          <Text className="text-xl text-white font-bold">LOGS</Text>
          <View className="w-[1%] h-full bg-white absolute right-[15%]" />
          <Pressable
            onPress={() => {
              handleOpenDrawer();
            }}
            className="w-[15%] h-full bg-mainGreen absolute right-0 rounded-tr-2xl flex justify-center items-center"
          >
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
        <View className="w-full h-[85%] flex flex-row flex-wrap bg-gray mx-auto mt-[1%] px-5">
          {logsState.length <= 0 && (
            <View className="flex flex-col">
              <Lottie
                ref={animationRef}
                style={{ width: "100%", alignSelf: "center" }}
                source={require("../../assets/jsonAnimations/cloths1.json")}
              />
              <Text className="self-center">Your closet history is empty</Text>
            </View>
          )}
          <FlashList
            showsVerticalScrollIndicator={false}
            data={filteredLogs}
            extraData={refresh}
            renderItem={({ item }) => (
              <LogComponent
                eventName={item.eventName}
                eventDate={JSON.parse(item.eventDate)}
                eventId={item.eventId}
                setRefresh={setRefresh}
                setModalVisible={setModalVisible}
                setModalEventId={setModalEventId}
              />
            )}
            estimatedItemSize={200}
          />
        </View>
      </>
    </ThemeView>
  );
};
