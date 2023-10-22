import {
  Text,
  View,
  useColorScheme,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";
import { ThemeView } from "../../components/ThemeView";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react-native";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { LogComponent } from "../../components/LogComponent";
import { RadioButton, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomModal from "../../components/CustomModal";
import { logsType } from "../../redux/itemsSlice";
import { ThemeText } from "../../components/ThemeText";
import dayjs from "dayjs";
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { colors } from "../../utils/colors";
import { SideModal } from "../../components/SideModal";
import { LogFilter } from "../../utils/filters";
import { localization } from "../../utils/localization";

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

  const space = useSharedValue(-20);
  const { width } = Dimensions.get("window");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDrawer = () => {
    // Update the space value to trigger the animation
    Keyboard.dismiss();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      space.value = width / 2 - 5;
    }
  };
  useEffect(() => {
    let info = logsState.find((x) => x.eventId == modalEventId);
    setModalInfo(info);
  }, [modalEventId]);

  useEffect(() => {
    setFilteredLogs(LogFilter(sortValue, logsState, search));
  }, [logsState.length, search, sortValue]);

  const storedSettings = useSelector((state: RootState) => state.settings);
  return (
    <ThemeView classNameStyle="px-1">
      <>
        <CustomModal
          setVisible={setModalVisible}
          visible={modalVisible}
          label={modalInfo?.eventName || "Event Name"}
        >
          <View className="w-[90%] mr-auto ml-auto">
            <View className="mt-5 bg-[#77aebb5d] rounded-lg p-5">
              {/* <ThemeText classNameStyle="text-[16px]">Date:</ThemeText> */}
              <ThemeText lightColor={colors.gray} customStyle={styles.dayStyle}>
                {dayjs(
                  modalInfo?.eventDate ? JSON.parse(modalInfo?.eventDate) : "",
                ).format("dddd")}
              </ThemeText>
              <ThemeText lightColor={colors.gray} customStyle={styles.date}>
                {dayjs(
                  modalInfo?.eventDate ? JSON.parse(modalInfo?.eventDate) : "",
                ).format("MMM DD, YYYY")}
              </ThemeText>
              <View
                className={`w-[60%] h-[1px] ${
                  isDarkMode ? "bg-white" : "bg-black"
                }`}
              />
              <View className="flex flex-row items-baseline mt-2">
                {/* <ThemeText classNameStyle="text-[16px]">Time:</ThemeText> */}
                <ThemeText
                  lightColor={colors.gray}
                  customStyle={styles.timeStyle}
                >
                  {dayjs(
                    modalInfo?.eventDate
                      ? JSON.parse(modalInfo?.eventDate)
                      : "",
                  ).format("h:mm ")}
                </ThemeText>
                <ThemeText lightColor={colors.gray} customStyle={styles.timeA}>
                  {dayjs(
                    modalInfo?.eventDate
                      ? JSON.parse(modalInfo?.eventDate)
                      : "",
                  ).format("A")}
                </ThemeText>
              </View>
            </View>

            <View className="p-2">
              <ThemeText customStyle={styles.notes}>
                {localization.Additional_notes[storedSettings.language]}
              </ThemeText>
              <ThemeText classNameStyle="h-fit text-[14px]">
                {modalInfo?.additionalNotes}
              </ThemeText>
            </View>
          </View>
        </CustomModal>
        <SideModal space={space} isOpen={isOpen} setIsOpen={setIsOpen}>
          <>
            <RadioButton.Group
              onValueChange={(value) => setSortValue(value)}
              value={sortValue}
            >
              <RadioButton.Item
                label={localization.Last_Added[storedSettings.language]}
                value="LA"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label={localization.Name_Asc[storedSettings.language]}
                value="NA"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label={localization.Name_Desc[storedSettings.language]}
                value="ND"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label={localization.Date_Asc[storedSettings.language]}
                value="DA"
                color={colors.mainCyan}
              />
              <RadioButton.Item
                label={localization.Date_Desc[storedSettings.language]}
                value="DD"
                color={colors.mainCyan}
              />
            </RadioButton.Group>
          </>
        </SideModal>
        <View className="flex flex-row items-center justify-center w-full h-14 rounded-t-2xl shadow-2xl bg-mainCyan mb-[1%]">
          <Text className="text-xl text-white font-bold">
            {localization.Logs[storedSettings.language]}
          </Text>
          <View className="w-[1%] h-full bg-white absolute right-[15%]" />
          <Pressable
            onPress={() => {
              handleOpenDrawer();
            }}
            className="w-[15%] h-full bg-mainGreen absolute right-0 rounded-tr-2xl flex justify-center items-center"
          >
            <Icon name="filter" size={25} color={colors.white} />
          </Pressable>
        </View>
        <Searchbar
          className="w-full"
          theme={{
            roundness: 0,
            colors: {
              onSurfaceVariant: isDarkMode ? colors.white : colors.black,
              elevation: { level3: "#aebb77b0" },
            },
          }}
          value={search}
          style={{
            flexDirection: storedSettings.language == 1 ? "row-reverse" : "row",
          }}
          inputStyle={{
            textAlign: storedSettings.language == 1 ? "right" : "left",
          }}
          selectionColor="#C0C0C0"
          // label="Search"
          onChange={(text) => setSearch(text.nativeEvent.text)}
          onClearIconPress={() => setSearch("")}
        />
        <View
          style={{
            width: "100%",
            height: "78%",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          className="flex flex-row flex-wrap bg-gray mx-auto mt-[1%] px-5"
        >
          {logsState.length <= 0 && (
            <View className="flex flex-col">
              <Lottie
                ref={animationRef}
                style={{ width: "100%", alignSelf: "center" }}
                source={require("../../assets/jsonAnimations/cloths1.json")}
              />
              <ThemeText
                darkColor={colors.black}
                lightColor={colors.white}
                classNameStyle="self-center"
              >
                {localization.ClosetHistoryEmpty[storedSettings.language]}
              </ThemeText>
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
const styles = StyleSheet.create({
  timeStyle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 30,
  },
  timeA: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
  },
  date: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
  },
  dayStyle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  notes: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
  },
});
