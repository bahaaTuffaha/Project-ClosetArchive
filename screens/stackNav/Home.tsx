import React, { useEffect } from "react";
import MyTabs from "../../routers/BottomTabNav";
import { ThemeView } from "../../components/ThemeView";
import PushNotification from "react-native-push-notification";
import { get_random } from "./ItemForm";
import {
  clothingReminderMessages,
  clothingReminderTitles,
} from "../../utils/localization";
import { PermissionsAndroid, Platform } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export async function GetAllPermissions() {
  try {
    if (Platform.OS === "android") {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);
      return userResponse;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

const laundryNotification = (numberOfLaundry: number) => {
  PushNotification.localNotificationSchedule({
    channelId: "channel-id-1",
    message: `You have ${numberOfLaundry} item${
      Boolean(numberOfLaundry > 1) ? "s" : ""
    } need${Boolean(numberOfLaundry == 1) ? "s" : ""} laundry`,
    title: "Laundry Reminder",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    repeatType: "day",
    repeatTime: 1,
    id: "2",
    allowWhileIdle: true,
    ignoreInForeground: true,
    color: "#fff23f",
  });
};

const createChannels = (selectedLang: number) => {
  PushNotification.channelExists("channel-id-1", function (exists) {
    if (!exists) {
      PushNotification.createChannel(
        {
          channelId: "channel-id-1",
          channelName: "ClosetArchive",
        },
        (created) => console.log(`createChannel returned '${created}'`),
      );
    }
  });
  const randomMessage = get_random(clothingReminderMessages)[selectedLang || 0];
  const randomTitle = get_random(clothingReminderTitles)[selectedLang || 0];
  PushNotification.cancelLocalNotification("1");
  PushNotification.cancelLocalNotification("2");
  PushNotification.localNotificationSchedule({
    channelId: "channel-id-1",
    message: randomMessage,
    title: randomTitle,
    date: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours in milliseconds
    repeatType: "hour",
    repeatTime: 12,
    id: "1",
    allowWhileIdle: true,
    ignoreInForeground: true,
  });
};

export function Home() {
  const storedSettings = useSelector((state: RootState) => state.settings);
  const storedItems = useSelector((state: RootState) => state.itemsList.items);
  const numberOfLaundry = storedItems.filter(
    (item) =>
      item.laundryCounter >= storedSettings.laundryNumber && item.laundryable,
  ).length;
  const selectedLang = useSelector(
    (state: RootState) => state.settings.language,
  );
  useEffect(() => {
    // PushNotification.deleteChannel("channel-id-1");

    GetAllPermissions();
    createChannels(selectedLang);
  }, []);

  useEffect(() => {
    laundryNotification(numberOfLaundry);
    if (storedSettings.enableLaundry != true || numberOfLaundry == 0) {
      PushNotification.cancelLocalNotification("2");
    }
  }, [storedSettings.enableLaundry, numberOfLaundry]);

  return (
    <ThemeView>
      <MyTabs />
    </ThemeView>
  );
}
