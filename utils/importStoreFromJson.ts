import { RootState, persistor, store } from "../redux/store"; // Replace with the correct path to your rootReducer file
import * as ScopedStorage from "react-native-scoped-storage";
import * as FileSystem from "expo-file-system";
import { importCategory } from "../redux/categoriesSlice";
import { importItems } from "../redux/itemsSlice";
import { importSettings } from "../redux/settingsSlice";

// Function to import the Redux store from a JSON file in the Documents folder
export const importStoreFromJson = async (
  setCheckboxes: (enableReminder: boolean, enableLaundry: boolean) => void,
) => {
  try {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    // Open the Document Picker to allow the user to select a file
    if (permissions.granted) {
      const file = await ScopedStorage.openDocument();

      if (file) {
        // Check if the selected file is a JSON file based on MIME type or file extension
        if (file.mime === "application/json" || file.name.endsWith(".json")) {
          // Read the serialized state from the selected JSON file
          // const theFile = await ScopedStorage.readFile(file.path);
          const serializedState = await FileSystem.readAsStringAsync(file.uri);
          const state: RootState = JSON.parse(serializedState);
          store.dispatch(
            importCategory({ Categories: state.CategoryList.Categories }),
          );
          store.dispatch(
            importItems({
              collectionTags: state.itemsList.collectionTags,
              logs: state.itemsList.logs,
              items: state.itemsList.items,
              refreshItems: state.itemsList.refreshItems,
              refreshLaundry: state.itemsList.refreshLaundry,
            }),
          );
          store.dispatch(
            importSettings({
              language:
                typeof state.settings.language === "string"
                  ? 0
                  : state.settings.language,
              laundryNumber: state.settings.laundryNumber,
              name: state.settings.name,
              enableLaundry: state.settings.enableLaundry,
              enableReminder: state.settings.enableReminder,
            }),
          );
          await persistor.persist();
          setCheckboxes(
            state.settings.enableLaundry,
            state.settings.enableReminder,
          );
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
    } else {
      console.log("The user denies permission");
      return false;
    }
  } catch (error) {
    console.error("Error importing store:", error);
    return false;
  }
};
