import { IEmailResponse, IUser } from "@/lib/types/auth-type";
import { AppDispatch } from "..";
import { AuthAction } from "../slices/auth-slice";

export const setVerify = (data: IEmailResponse | null) => {
  return async (dispatch: AppDispatch) => {
    dispatch(AuthAction.setVerify(data));
  };
};

export const setUser = (data: IUser | null) => {
  return async (dispatch: AppDispatch) => {
    dispatch(AuthAction.setUser(data));
  };
};
