import { createSlice } from "@reduxjs/toolkit";
import { customCategory } from "../screens/stackNav/images";

export type Category = {
  name: string[];
  sprites: NodeRequire[];
  screen: string;
  index: number;
};
export type CategoryList = {
  Categories: Category[];
};
const initialState: CategoryList = {
  Categories: [],
};
export { initialState as CurrentCategories };
const categoriesSlice = createSlice({
  name: "CategoryList",
  initialState: initialState,
  reducers: {
    addCategory: (state, action) => {
      state.Categories.push({
        name: [action.payload.name],
        screen: "ItemForm",
        sprites: customCategory,
        index:
          state.Categories.length == 0
            ? 4
            : state.Categories[state.Categories.length - 1].index + 1,
      } as Category);
    },
    delCategory: (state, action) => {
      const categoryIndex = state.Categories.findIndex(
        (x) => x.index === action.payload.index,
      );
      state.Categories.splice(categoryIndex, 1);
    },
    importCategory: (state, action) => {
      state.Categories = action.payload.Categories;
    },
  },
});
export const { addCategory, delCategory, importCategory } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
