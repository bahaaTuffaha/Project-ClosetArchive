import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categoriesSlice";
import itemsSlice from "./itemsSlice";
import FilesystemStorage from "redux-persist-filesystem-storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import settingsSlice from "./settingsSlice";
import { normalizeCollectionTags } from "../utils/collectionOrder";

const persistConfig = {
  key: "root",
  storage: FilesystemStorage,
  migrate: async (state: any) => {
    if (!state?.itemsList) {
      return state;
    }

    return {
      ...state,
      itemsList: {
        ...state.itemsList,
        collectionTags: normalizeCollectionTags(
          state.itemsList.collectionTags || [],
        ),
      },
    };
  },
};
const rootReducer = combineReducers({
  CategoryList: categoriesSlice,
  itemsList: itemsSlice,
  settings: settingsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
