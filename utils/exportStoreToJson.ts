import { RootState, store } from "../redux/store"; // Replace with the correct path to your rootReducer file
import * as ScopedStorage from "react-native-scoped-storage";

export const exportStoreToJson = async () => {
  if (!store) {
    console.log("Store not initialized");
    return;
  }

  try {
    const state: RootState = store.getState();
    const serializedState = JSON.stringify(state);

    // Create a new file named store.json in the Documents directory
    const storePath = await ScopedStorage.createDocument(
      "store.json",
      "application/json",
      serializedState,
      "utf8",
    );
    if (storePath) {
      console.log("Store exported successfully.");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error exporting store:", error);
    return false;
  }
};
