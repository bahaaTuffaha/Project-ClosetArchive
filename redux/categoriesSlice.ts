import { createSlice } from "@reduxjs/toolkit";
import {
  customCategory,
  accessories,
  shoes,
  trousers,
  tshirt,
} from "../screens/stackNav/images";

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
    { name: "Tops", sprites: tshirt, screen: "ItemForm", index: 0 },
    { name: "Bottoms", sprites: trousers, screen: "ItemForm", index: 1 },
    { name: "Shoes", sprites: shoes, screen: "ItemForm", index: 2 },
    { name: "Accessories", sprites: accessories, screen: "ItemForm", index: 3 },
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
        sprites: customCategory,
        index: state.Categories[state.Categories.length - 1].index + 1,
      } as Category);
    },
    delCategory: (state, action) => {
      state.Categories.splice(action.payload.index, 1);
    },
  },
});
export const { addCategory, delCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
