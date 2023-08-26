import { createSlice } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

export type logsType = {
  eventId: string; //common ID for any combined items.
  eventDate: string;
  eventName: string;
  additionalNotes?: string;
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
  logIds?: string[];
};
export type itemsList = {
  items: item[];
  collectionTags: CollectionTag[];
  logs: logsType[];
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
  logs: [],
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
    addEventLog: (state, action) => {
      state.logs.push({
        eventDate: action.payload.eventDate,
        eventName: action.payload.eventName,
        eventId: action.payload.eventId,
        logTime: action.payload.logTime,
        additionalNotes: action.payload.additionalNotes,
      } as logsType);
    },
    addLog: (state, action) => {
      //this added to add the eventId to the item/s
      const itemIndex = state.items.findIndex(
        (x) => x.id === action.payload.selectedId,
      );
      state.items[itemIndex].logIds?.push(action.payload.logId);
    },
  },
});
export const { addItem, addCollection, addLog, addEventLog } =
  itemsSlice.actions;
export default itemsSlice.reducer;
