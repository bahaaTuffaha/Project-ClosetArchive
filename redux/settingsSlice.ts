import { createSlice } from "@reduxjs/toolkit";

type language = "En" | "Ar" | "Es";

export type SettingsType = {
  language: language;
  name: string;
  laundryNumber: number;
};
const initialState: SettingsType = {
  language: "En",
  name: "User",
  laundryNumber: 5,
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
  importSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
