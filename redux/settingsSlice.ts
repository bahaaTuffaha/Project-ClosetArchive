import { createSlice } from "@reduxjs/toolkit";

type language = "En" | "Ar" | "Es";

export type SettingsType = {
  language: language;
  name: string;
  laundryNumber: number;
  enableLaundry: boolean;
};
const initialState: SettingsType = {
  language: "En",
  name: "User",
  laundryNumber: 5,
  enableLaundry: true,
};
const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload.lang;
    },
    userNameSetter: (state, action) => {
      state.name = action.payload.name;
    },
    laundryNumberSetter: (state, action) => {
      state.laundryNumber = action.payload.number;
    },
    setEnableLaundry: (state, action) => {
      state.enableLaundry = action.payload.enableLaundry;
    },
    importSettings: (state, action) => {
      state.language = action.payload.language;
      state.laundryNumber = action.payload.laundryNumber;
      state.name = action.payload.name;
    },
  },
});
export const {
  changeLanguage,
  userNameSetter,
  laundryNumberSetter,
  setEnableLaundry,
  importSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
