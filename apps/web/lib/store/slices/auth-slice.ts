import { IEmailResponse, IUser } from "@/lib/types/auth-type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IinitialState {
  verify: IEmailResponse | null
  token: string | null
  user: IUser | null
}

const initialState: IinitialState = {
  verify: null,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: () => initialState,
    setVerify: (state, action: PayloadAction<IinitialState["verify"]>) => {
      state.verify = action.payload;
    },
    setToken: (state, action: PayloadAction<IinitialState["token"]>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<IinitialState["user"]>) => {
      state.user = action.payload;
    },
  },
});

export default authSlice.reducer;
export const AuthAction = authSlice.actions;
