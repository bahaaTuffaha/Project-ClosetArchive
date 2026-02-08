import "./global.css";
import { I18nManager, StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./routers/stack";
import { PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { ReactElement, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { colors } from "./utils/colors";

function App(): ReactElement {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.darkblue : colors.white,
  };

  useEffect(() => {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}

export default App;
