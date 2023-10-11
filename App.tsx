import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import Navigator from "./routers/stack";
import { PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { colors } from "./utils/colors";

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.darkblue : colors.white,
  };

  useEffect(() => {
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

export default App;
