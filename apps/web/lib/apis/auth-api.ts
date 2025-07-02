import { axiosClient } from "../axios";
import { IApiResponse } from "../types/app-type";
import { IEmailResponse, ISignUpRequest } from "../types/auth-type";

export async function signUpApi(payload: ISignUpRequest): Promise<IApiResponse<IEmailResponse>> {
  const { data } = await axiosClient.post("/auth/sign-up", payload);
  return data;
}
