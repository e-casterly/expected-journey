"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toActionMessage, toFieldErrorResult } from "@/lib/api/action-errors";
import { auth } from "@/lib/auth";
import { SignInActionResult, SignInSchema } from "@/lib/api/auth";

export async function signin(formData: FormData): Promise<SignInActionResult> {
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return toFieldErrorResult(validatedFields.error);
  }

  try {
    const response = await auth.api.signInEmail({
      body: validatedFields.data,
      headers: await headers(),
    });

    if (!response) {
      return { message: "Sign in failed" };
    }
  } catch (error) {
    return { message: toActionMessage(error, "Sign in failed") };
  }

  redirect("/");
}
