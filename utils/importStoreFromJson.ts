import { RootState, store } from "../redux/store"; // Replace with the correct path to your rootReducer file
import * as ScopedStorage from "react-native-scoped-storage";
import * as FileSystem from "expo-file-system";

// Function to import the Redux store from a JSON file in the Documents folder
export const importStoreFromJson = async () => {
  try {
    // Open the Document Picker to allow the user to select a file
    const file = await ScopedStorage.openDocument();

    if (file) {
      // Check if the selected file is a JSON file based on MIME type or file extension
      if (file.mime === "application/json" || file.name.endsWith(".json")) {
        // Read the serialized state from the selected JSON file
        const serializedState = await FileSystem.readAsStringAsync(file.uri);
        const state: RootState = JSON.parse(serializedState);

        // Dispatch an action to replace the current Redux store with the imported state
        store.dispatch({ type: "REPLACE_STATE", payload: state });

        console.log("Store imported successfully.");
        return true;
      } else {
        console.log("Selected file is not a JSON file.");
        return false;
      }
    } else {
      console.log("No file selected.");
      return false;
    }
  } catch (error) {
    console.error("Error importing store:", error);
    return false;
  }
};
