import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthday: z.date({ required_error: "Birthday is required" }),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(1, "Confirm password is required"),
}).superRefine((val, ctx) => {
  if (val.password !== val.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords is not match",
      path: ["confirm_password"],
    });
  }
});

export const VerifyOtpSchema = z.object({
  otp: z.string().min(6, "OTP must be at least 6 number"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(1, "Confirm password is required"),
}).superRefine((val, ctx) => {
  if (val.password !== val.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords is not match",
      path: ["confirm_password"],
    });
  }
});