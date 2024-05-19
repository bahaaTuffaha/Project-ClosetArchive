import { createSlice } from "@reduxjs/toolkit";
import { customCategory } from "../screens/stackNav/images";

export type Category = {
  name: string[];
  sprites: NodeRequire[];
  screen: string;
  index: number;
};
export type CategoryCustomType = {
  customTypes: { label: string; value: string }[];
};
export type CategoryList = {
  Categories: Category[];
  CategoryCustomTypes: CategoryCustomType[];
};
const initialState: CategoryList = {
  Categories: [],
  CategoryCustomTypes: [],
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
      state.CategoryCustomTypes = action.payload.CategoryCustomTypes;
    },
    addTypeToCategory: (state, action) => {
      state.CategoryCustomTypes[action.payload.index] = <any>[]; // make sure index available before Pushing
      const customT = state.CategoryCustomTypes[action.payload.index];
      if (!customT.customTypes) {
        customT.customTypes = [];
      }
      customT.customTypes.push({
        label: action.payload.typeName,
        value: action.payload.typeName,
      });
    },
    changeCategoryTypeByIndex: (state, action) => {
      const customT = state.CategoryCustomTypes[action.payload.index];
      customT.customTypes[action.payload.typeIndex] = {
        label: action.payload.typeName,
        value: action.payload.typeName,
      };
    },
    changeCategoryName: (state, action) => {
      const category = state.Categories[action.payload.index];
      category.name = action.payload.newName;
    },
  },
});
export const {
  addCategory,
  delCategory,
  importCategory,
  addTypeToCategory,
  changeCategoryTypeByIndex,
  changeCategoryName,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
