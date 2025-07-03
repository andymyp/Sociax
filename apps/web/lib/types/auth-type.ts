export interface IDeviceInfo {
  device_id: string;
  device: string;
}

export interface IUser {
  id: string;
  name: string;
  birthday: Date;
  gender: string;
  email: string;
  bio?: string;
}

export interface ISignUpRequest extends Omit<IUser, "id"> {
  password: string;
  confirm_password: string;
}

export interface IEmailResponse {
  type: number;
  email: string;
  reset?: boolean;
}

export interface IVerifyRequest extends IEmailResponse {
  device_id: string;
  device: string;
  otp: string;
}

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  type?: number;
  email?: string;
}

export interface IResendOtp {
  attempts: number;
  nextResendAt: number | null;
}

export interface IResetPasswordRequest extends IDeviceInfo {
  email: string;
  password: string;
  confirm_password: string;
}

export interface ISignInRequest extends IDeviceInfo {
  email: string;
  password: string;
}
