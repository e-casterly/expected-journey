import * as z from "zod";

export type FieldErrors<T extends Record<string, unknown>> =
  z.core.$ZodFlattenedError<T>["fieldErrors"];

export type ActionResult<T extends Record<string, unknown>> =
  | {
      fieldErrors?: FieldErrors<T>;
      message?: string;
    }
  | undefined;

export type ApiErrorResponse = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export type SuccessResponse<T> = T;
