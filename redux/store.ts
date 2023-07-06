import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categoriesSlice";
import itemsSlice from "./itemsSlice";

const rootReducer = combineReducers({
  CategoryList: categoriesSlice,
  itemsList: itemsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
