export interface IUser {
  id: string
  name: string
  birthday: Date
  gender: string
  email: string
  bio?: string
}

export interface ISignUpRequest extends Omit<IUser, "id"> {
  password: string;
  confirm_password: string;
}

export interface IEmailResponse {
  type: number
  email: string
}