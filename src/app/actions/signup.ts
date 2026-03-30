"use server";

import { auth } from "@/lib/auth";
import { toActionMessage, toFieldErrorResult } from "@/lib/api/action-errors";
import { SignUpActionResult, SignUpSchema } from "@/lib/api/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(formData: FormData): Promise<SignUpActionResult> {
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return toFieldErrorResult(validatedFields.error);
  }

  try {
    const response = await auth.api.signUpEmail({
      body: validatedFields.data,
      headers: await headers(),
    });
    if (!response) {
      return { message: "Sign up failed" };
    }
  } catch (error) {
    return { message: toActionMessage(error, "Sign up failed") };
  }
  redirect("/");
}
