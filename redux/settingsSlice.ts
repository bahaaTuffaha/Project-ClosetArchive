import { createSlice } from "@reduxjs/toolkit";

export type SettingsType = {
  language: number;
  name: string;
  laundryNumber: number;
  enableLaundry: boolean;
  enableReminder: boolean;
  enableHeatMap: boolean;
  appVer: string;
};
const initialState: SettingsType = {
  language: 0,
  name: "User",
  laundryNumber: 5,
  enableLaundry: true,
  enableReminder: true,
  enableHeatMap: false,
  appVer: "1.0.1",
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
    setReminder: (state, action) => {
      state.enableReminder = action.payload.enableReminder;
    },
    setHeatMap: (state, action) => {
      state.enableHeatMap = action.payload.enableHeatMap;
    },
    importSettings: (state, action) => {
      state.language = action.payload.language;
      state.laundryNumber = action.payload.laundryNumber;
      state.name = action.payload.name;
      state.enableLaundry = action.payload.enableLaundry;
      state.enableReminder = action.payload.enableReminder;
    },
    setAppVer: (state, action) => {
      state.appVer = action.payload.appVer;
    },
  },
});
export const {
  changeLanguage,
  userNameSetter,
  laundryNumberSetter,
  setEnableLaundry,
  setReminder,
  setHeatMap,
  importSettings,
  setAppVer,
} = settingsSlice.actions;
export default settingsSlice.reducer;
