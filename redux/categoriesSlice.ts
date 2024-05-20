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
      const { index, typeName } = action.payload;
      if (!state.CategoryCustomTypes) {
        state.CategoryCustomTypes = [];
      }
      if (!state.CategoryCustomTypes[index]) {
        state.CategoryCustomTypes[index] = { customTypes: [] };
      }

      const customT = state.CategoryCustomTypes[index];
      customT.customTypes.push({
        label: typeName,
        value: typeName,
      });
    },
    changeCategoryTypeByIndex: (state, action) => {
      const customT = state.CategoryCustomTypes[action.payload.index];
      customT.customTypes[action.payload.typeIndex] = {
        label: action.payload.typeName,
        value: action.payload.typeName,
      };
    },
    delCategoryTypeByIndex: (state, action) => {
      const customT = state.CategoryCustomTypes[action.payload.index];
      try {
        customT.customTypes.splice(action.payload.typeIndex, 1);
      } catch (e) {
        console.log("issue at removing catType " + e);
      }
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
  delCategoryTypeByIndex,
  changeCategoryName,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
