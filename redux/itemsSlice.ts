import { createSlice } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

export type logsType = {
  id: string; //common ID for any combined items.
  eventDate: string;
  eventTime?: string;
  eventName: string;
  logTime: string; //iso??
};

export type item = {
  id: string;
  name: string;
  type?: number;
  category: number;
  collection?: string[];
  purchaseDate?: string;
  image: string;
  automaticColorPicking?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  logs?: logsType[];
};
export type itemsList = {
  items: item[];
  collectionTags: CollectionTag[];
};
export type CollectionTag = {
  label: string;
  value: string;
  color?: string;
};

const initialState: itemsList = {
  items: [],
  collectionTags: [
    { label: "GreenCollection", value: "GreenCollection", color: "#008000" },
    { label: "GoldCollection", value: "GoldCollection", color: "#FFD700" },
  ],
};

const itemsSlice = createSlice({
  name: "itemsList",
  initialState: initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        id: nanoid(),
        name: action.payload.name,
        image: action.payload.image,
        type: action.payload.type || 0,
        collection:
          action.payload.collection.length == 0
            ? []
            : action.payload.collection,
        category: action.payload.category,
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
    addLog: (state, action) => {
      const itemIndex = state.items.findIndex(
        (x) => x.id === action.payload.selectedId,
      );
      state.items[itemIndex].logs?.push({
        eventDate: action.payload.eventDate,
        eventName: action.payload.eventName,
        id: nanoid(),
        logTime: action.payload.logTime,
        eventTime: action.payload.eventTime,
      });
    },
  },
});
export const { addItem } = itemsSlice.actions;
export default itemsSlice.reducer;
