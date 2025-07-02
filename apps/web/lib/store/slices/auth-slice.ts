import {
  IDeviceInfo,
  IEmailResponse,
  IResendOtp,
  IUser,
} from "@/lib/types/auth-type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface IinitialState {
  deviceInfo: IDeviceInfo;
  verify: IEmailResponse | null;
  resendOtp: IResendOtp;
  token: string | null;
  user: IUser | null;
}

const initialState: IinitialState = {
  deviceInfo: {
    device_id: uuidv4(),
    device: "web",
  },
  verify: null,
  resendOtp: {
    attempts: 0,
    nextResendAt: null,
  },
  token: null,
  user: null,
};

const delayOtpSteps = [60, 120, 120, 3600];

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: () => initialState,
    setVerify: (state, action: PayloadAction<IinitialState["verify"]>) => {
      state.verify = action.payload;
    },
    startOtpCooldown: (state) => {
      if (state.resendOtp.attempts >= delayOtpSteps.length) return;
      const delay = delayOtpSteps[state.resendOtp.attempts] * 1000;
      state.resendOtp.nextResendAt = Date.now() + delay;
      state.resendOtp.attempts += 1;
    },
    resetResendOtp: (state) => {
      state.resendOtp = initialState.resendOtp;
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
