import { axiosClient } from "../axios";
import { IApiResponse } from "../types/app-type";
import { IUser } from "../types/auth-type";

export async function getUserByUsernameApi(
  username: string
): Promise<IApiResponse<IUser>> {
  const { data } = await axiosClient.get(`/user/${username}`);
  return data;
}

export async function updateUserApi(
  id: string,
  payload: IUser
): Promise<IApiResponse<IUser>> {
  const { data } = await axiosClient.patch(`/user/${id}`, payload);
  return data;
}
