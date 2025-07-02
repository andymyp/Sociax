import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IinitialState {
  isLoading: boolean;
}

const initialState: IinitialState = {
  isLoading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetState: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export default appSlice.reducer;
export const AppAction = appSlice.actions;
