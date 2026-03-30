import * as z from "zod";
import type { ActionResult } from "@/lib/api/common";

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .trim(),
});

export const SignInSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(1, { error: "Password is required." })
    .trim(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;

export type SignUpActionResult = ActionResult<SignUpInput>;
export type SignInActionResult = ActionResult<SignInInput>;
