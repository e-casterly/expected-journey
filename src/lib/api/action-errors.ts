import * as z from "zod";
import type { ActionResult } from "@/lib/api/common";

export function toFieldErrorResult<T extends Record<string, unknown>>(
  error: z.ZodError<T>,
): ActionResult<T> {
  return {
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

export function toActionMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}
