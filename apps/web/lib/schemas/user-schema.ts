import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  username: z.string().min(3).max(20),
  birthday: z.date({ required_error: "Birthday is required" }),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  bio: z.string().optional(),
});

export const AvatarSchema = z.object({
  avatar: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 2 * 1024 * 1024,
          "Avatar must be less than 2MB"
        ),
      z.string(),
    ])
    .optional(),
});
