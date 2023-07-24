import { createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

export type item = {
  id: string;
  name: string;
  type?: number;
  collection?: string[];
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
  label: string;
  value: string;
};

const initialState: itemsList = {
  items: [],
  collectionTags: [
    { label: "GreenCollection", value: "GreenCollection" },
    { label: "GoldCollection", value: "GoldCollection" },
  ],
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
        type: action.payload.type || 0,
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
    addCollection: (state, action) => {
      state.collectionTags.push({
        value: String(action),
        label: String(action),
      });
    },
  },
});
export const { addItem } = itemsSlice.actions;
export default itemsSlice.reducer;
