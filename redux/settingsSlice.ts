import { createSlice } from "@reduxjs/toolkit";

type language = "En" | "Ar" | "Es";

export type SettingsType = {
  language: language;
  name: string;
};
const initialState: SettingsType = {
  language: "En",
  name: "User",
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
  },
});
export const { changeLanguage, userNameSetter } = settingsSlice.actions;
export default settingsSlice.reducer;