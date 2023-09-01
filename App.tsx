import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import Navigator from "./routers/stack";
import { PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "black" : "white",
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
