import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  username: z
    .string()
    .min(2, { message: "Username is too short" })
    .refine((value) => value.toLowerCase() !== "guest", {
      message: 'The username "guest" is not allowed.',
    }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const SigninValidation = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const PostValidation = z.object({
  caption: z.string().min(2).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
