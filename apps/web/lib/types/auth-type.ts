export interface IDeviceInfo {
  device_id: string;
  device: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  birthday: Date;
  gender: string;
  bio?: string;
  avatar_url?: string;
  confirmed: boolean;
  boarded: boolean;
  online: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ISignUpRequest {
  name: string;
  email: string;
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

export interface ISignInOauthRequest extends IDeviceInfo {
  provider: string;
}
