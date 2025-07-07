import { IUser } from "./auth-type";

export interface IUpdateUserRequest extends IUser {
  file?: File;
}
