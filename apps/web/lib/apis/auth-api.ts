import { axiosClient } from "../axios";
import { IApiResponse } from "../types/app-type";
import {
  IAuthResponse,
  IEmailResponse,
  IResetPasswordRequest,
  ISignInRequest,
  ISignUpRequest,
  IVerifyRequest,
} from "../types/auth-type";

export async function signUpApi(
  payload: ISignUpRequest
): Promise<IApiResponse<IEmailResponse>> {
  const { data } = await axiosClient.post("/auth/sign-up", payload);
  return data;
}

export async function verifyOtpApi(
  payload: IVerifyRequest
): Promise<IApiResponse<IAuthResponse>> {
  const { data } = await axiosClient.post("/auth/verify-otp", payload);
  return data;
}

export async function sendEmailOtpApi(
  payload: IEmailResponse
): Promise<IApiResponse<IEmailResponse>> {
  const { data } = await axiosClient.post("/auth/send-email-otp", payload);
  return data;
}

export async function resetPasswordApi(
  payload: IResetPasswordRequest
): Promise<IApiResponse<IAuthResponse>> {
  const { data } = await axiosClient.post("/auth/reset-password", payload);
  return data;
}

export async function signInApi(
  payload: ISignInRequest
): Promise<IApiResponse<IAuthResponse>> {
  const { data } = await axiosClient.post("/auth/sign-in", payload);
  return data;
}

export async function signOutApi(): Promise<IApiResponse<{ message: string }>> {
  const { data } = await axiosClient.get("/auth/sign-out");
  return data;
}
