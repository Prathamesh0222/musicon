import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name should be atleast 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type signUpInput = z.infer<typeof signUpSchema>;
export type signInInput = z.infer<typeof signInSchema>;
