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
  type: string;
  fit: string;
  season?: string;
  quantity: number;
  size: number;
  sizeUnit: string;
  category: number;
  collection?: string[];
  purchaseDate?: string;
  image: string;
  automaticColor?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  logIds?: string[];
  laundryCounter: number;
  laundryable: boolean;
};
export type itemsList = {
  items: item[];
  collectionTags: CollectionTag[];
  logs: logsType[];
  refreshItems: boolean;
  refreshLaundry: boolean;
};
export type CollectionTag = {
  label: string;
  value: string;
  color?: string;
  isOpen: boolean;
};

const initialState: itemsList = {
  items: [],
  collectionTags: [],
  logs: [],
  refreshItems: false,
  refreshLaundry: false,
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
        type: action.payload.type,
        fit: action.payload.fit,
        sizeUnit: action.payload.sizeUnit,
        size: action.payload.size,
        quantity: action.payload.quantity,
        collection:
          action.payload.collection.length == 0
            ? []
            : action.payload.collection,
        category: action.payload.category,
        automaticColor: action.payload.automaticColor || false,
        purchaseDate: action.payload.purchaseDate,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
        tertiaryColor: action.payload.tertiaryColor,
        logIds: [],
        laundryCounter: 0,
        season: action.payload.season,
        laundryable: true,
      } as item);
    },
    updateItem: (state, action) => {
      const itemIndex = action.payload.itemIndex;
      state.items[itemIndex].name = action.payload.name;
      state.items[itemIndex].image = action.payload.image;
      state.items[itemIndex].type = action.payload.type;
      state.items[itemIndex].fit = action.payload.fit;
      state.items[itemIndex].size = action.payload.size;
      state.items[itemIndex].sizeUnit = action.payload.sizeUnit;
      state.items[itemIndex].quantity = action.payload.quantity;
      state.items[itemIndex].collection =
        action.payload.collection.length == 0 ? [] : action.payload.collection;
      state.items[itemIndex].automaticColor = action.payload.automaticColor;
      state.items[itemIndex].purchaseDate = action.payload.purchaseDate;
      state.items[itemIndex].primaryColor = action.payload.primaryColor;
      state.items[itemIndex].secondaryColor = action.payload.secondaryColor;
      state.items[itemIndex].tertiaryColor = action.payload.tertiaryColor;
      state.items[itemIndex].season = action.payload.season;
    },
    addCollection: (state, action) => {
      state.collectionTags.push({
        value: action.payload.name,
        label: action.payload.name,
        color: action.payload.color,
        isOpen: true,
      });
    },
    updateCollection: (state, action) => {
      const collectionIndex = state.collectionTags.findIndex(
        (x) => x.label === action.payload.name,
      );
      state.collectionTags[collectionIndex].label = action.payload.newName;
    },
    toggleCollection: (state, action) => {
      const collectionIndex = state.collectionTags.findIndex(
        (x) => x.label === action.payload.name,
      );
      state.collectionTags[collectionIndex].isOpen =
        !state.collectionTags[collectionIndex].isOpen;
    },
    deleteCollection: (state, action) => {
      const collectionIndex = state.collectionTags.findIndex(
        (x) => x.label === action.payload.name,
      );
      state.collectionTags.splice(collectionIndex, 1);
      try {
        for (let i = 0; i < state.items.length; i++) {
          let itemCollectionIndex = state.items[i].collection?.findIndex(
            (x) => x === action.payload.name,
          );

          if (itemCollectionIndex != -1) {
            state.items[i].collection?.splice(itemCollectionIndex, 1);
          }
        }
      } catch (err) {
        console.log("Error occurred at deleteCollection");
      }
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
    deleteEventLog: (state, action) => {
      const eventIndex = state.logs.findIndex(
        (x) => x.eventId === action.payload.selectedLogId,
      );
      state.logs.splice(eventIndex, 1);
    },
    addLog: (state, action) => {
      //this added to add the eventId to the item/s
      const itemIndex = state.items.findIndex(
        (x) => x.id === action.payload.selectedId,
      );
      const logIdsSet = new Set(state.items[itemIndex].logIds || []);
      if (!logIdsSet.has(action.payload.logId)) {
        logIdsSet.add(action.payload.logId);
        state.items[itemIndex].logIds = Array.from(logIdsSet);
        state.items[itemIndex].laundryCounter = logIdsSet.size;
      }
      // state.items[itemIndex].logIds?.push(action.payload.logId);
      // state.items[itemIndex].laundryCounter += 1;
    },
    deleteLog: (state, action) => {
      const itemIndices = state.items.reduce(
        (indices: number[], item, index) => {
          if (
            item.logIds &&
            item.logIds.includes(action.payload.selectedLogId)
          ) {
            indices.push(index);
          }
          return indices;
        },
        [],
      );
      for (let i of itemIndices) {
        const logIndex = state.items[i].logIds?.findIndex(
          (x) => x === action.payload.selectedLogId,
        );
        state.items[i].logIds?.splice(logIndex as number, 1);
      }
    },
    itemRefresher: (state) => {
      state.refreshItems = !state.refreshItems;
    },
    laundryRefresher: (state) => {
      state.refreshLaundry = !state.refreshLaundry;
    },
    deleteItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (x) => x.id === action.payload.selectedId,
      );
      state.items.splice(itemIndex, 1);
    },
    resetLaundryCounter: (state, action) => {
      const itemIndex = state.items.findIndex(
        (x) => x.id === action.payload.selectedId,
      );
      state.items[itemIndex].laundryCounter = 0;
    },
    enableLaundry4Object: (state, action) => {
      const itemIndex = state.items.findIndex(
        (x) => x.id === action.payload.selectedId,
      );
      state.items[itemIndex].laundryable = action.payload.laundryValue;
    },
    importItems: (state, action) => {
      state.items = action.payload.items;
      state.collectionTags = action.payload.collectionTags;
      state.logs = action.payload.logs;
      state.refreshItems = action.payload.refreshItems;
      state.refreshLaundry = action.payload.refreshLaundry;
    },
  },
});
export const {
  addItem,
  updateItem,
  addCollection,
  toggleCollection,
  deleteCollection,
  updateCollection,
  addLog,
  deleteLog,
  addEventLog,
  deleteEventLog,
  itemRefresher,
  laundryRefresher,
  deleteItem,
  resetLaundryCounter,
  enableLaundry4Object,
  importItems,
} = itemsSlice.actions;
export default itemsSlice.reducer;
