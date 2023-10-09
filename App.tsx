import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import Navigator from "./routers/stack";
import { PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import PushNotification from "react-native-push-notification";
import { clothingReminderMessages, clothingReminderTitles } from "./utils/data";
import { get_random } from "./screens/stackNav/ItemForm";
import { colors } from "./utils/colors";

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

const createChannels = () => {
  PushNotification.createChannel(
    {
      channelId: "channel-id-1",
      channelName: "ClosetArchive",
    },
    (created) => console.log(`createChannel returned '${created}'`),
  );
};
const scheduleNotification = () => {
  // Check if there's an existing scheduled notification
  PushNotification.getDeliveredNotifications((nots) => {
    if (nots.length === 0) {
      // Schedule a new notification only if no existing ones are scheduled
      PushNotification.localNotificationSchedule({
        channelId: "channel-id-1",
        message: get_random(clothingReminderMessages),
        title: get_random(clothingReminderTitles),
        date: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours in milliseconds
        repeatType: "time",
        repeatTime: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
        allowWhileIdle: true,
      });
    }
  });
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.darkblue : colors.white,
  };
  useEffect(() => {
    GetAllPermissions();
  }, []);

  useEffect(() => {
    GetAllPermissions();
    createChannels();
    scheduleNotification();
    SplashScreen.hide();
  }, []);
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <SafeAreaView className="flex-1">
            <StatusBar
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Navigator />
            </GestureHandlerRootView>
          </SafeAreaView>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
