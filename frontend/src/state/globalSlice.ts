import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
}

const initialState: GlobalState = {
  isDarkMode: false,
  isSidebarCollapsed: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { setIsDarkMode, setIsSidebarCollapsed } = globalSlice.actions;
export default globalSlice.reducer;
