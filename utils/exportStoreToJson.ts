import { RootState, store } from "../redux/store"; // Replace with the correct path to your rootReducer file
import * as ScopedStorage from "react-native-scoped-storage";

export const exportStoreToJson = async () => {
  try {
    const state: RootState = store.getState();
    const serializedState = JSON.stringify(state);

    // Open the Document Picker to select a folder (scoped storage)
    // const dir = await ScopedStorage.openDocumentTree();

    // Write the serialized state to a file in the selected directory
    let file = await ScopedStorage.createDocument(
      "store.json",
      "application/json",
      serializedState,
      "utf8",
    );

    console.log("Store exported successfully.");
    return true;
  } catch (error) {
    console.error("Error exporting store:", error);
    return false;
  }
};
