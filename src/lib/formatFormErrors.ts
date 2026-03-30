type FormErrors = string | string[] | { message: string }[];

export function formatFormErrors(errors: FormErrors): string[] {
  if (typeof errors === "string") {
    return [errors];
  }

  if (Array.isArray(errors)) {
    return errors.map((e) => (typeof e === "string" ? e : e.message));
  }

  return errors
}