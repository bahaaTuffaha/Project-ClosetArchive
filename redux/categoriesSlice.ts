import { createSlice } from "@reduxjs/toolkit";
import { trousers, tshirt } from "../screens/stackNav/images";

export type Category = {
  name: string;
  sprites: NodeRequire[];
  screen: string;
  index: number;
};
export type CategoryList = {
  Categories: Category[];
};
const initialState: CategoryList = {
  Categories: [
    { name: "T-Shirts", sprites: tshirt, screen: "ItemForm", index: 0 },
    { name: "Trousers", sprites: trousers, screen: "ItemForm", index: 1 },
  ],
};
const categoriesSlice = createSlice({
  name: "CategoryList",
  initialState: initialState,
  reducers: {
    addCategory: (state, action) => {
      state.Categories.push({
        name: action.payload.name,
        screen: "ItemForm",
        sprites: trousers,
        index: action.payload.index,
      } as Category);
    },
  },
});
export const { addCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
