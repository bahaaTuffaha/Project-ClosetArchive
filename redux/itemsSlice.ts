import { createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

export type item = {
  id: string;
  name: string;
  size?: number;
  collection?: [];
  purchaseDate?: string;
  image: string;
  automaticColorPicking?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
};
export type itemsList = {
  items: item[];
  collectionTags: CollectionTag[];
};
export type CollectionTag = {
  name: string;
};

const initialState: itemsList = {
  items: [],
  collectionTags: [],
};

const itemsSlice = createSlice({
  name: "itemsList",
  initialState: initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        id: uuid.v4(),
        name: action.payload.name,
        image: action.payload.image,
        size: action.payload.size || 0,
        collection:
          action.payload.collection.length == 0
            ? []
            : action.payload.collection,
        automaticColorPicking: action.payload.automaticColor || false,
        purchaseDate: action.payload.purchaseDate,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
        tertiaryColor: action.payload.tertiaryColor,
      } as item);
    },
  },
});
export const { addItem } = itemsSlice.actions;
export default itemsSlice.reducer;
