"use client";

import { useAppForm } from "@/lib/hooks/useAppForm";
import { signin } from "@/app/actions/signin";
import { SignInSchema } from "@/lib/api/auth";

export function SignInForm() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("email", value.email);
      formData.append("password", value.password);

      const result = await signin(formData);

      if (result?.message || result?.fieldErrors) {
        form.setErrorMap({
          onSubmit: {
            form: result?.message,
            fields: result?.fieldErrors ?? {},
          },
        });
      }
    },
  });

  return (
    <div>
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
          className="flex flex-col items-center justify-stretch space-y-4"
        >
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                type="email"
                autoComplete="email"
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.TextField
                label="Password"
                type="password"
                autoComplete="current-password"
              />
            )}
          </form.AppField>
          <form.ErrorMessage />
          <form.SubscribeButton label="Sign in" fullWidth />
        </form>
      </form.AppForm>
    </div>
  );
}
