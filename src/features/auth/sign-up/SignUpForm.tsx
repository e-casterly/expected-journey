"use client";

import { useAppForm } from "@/lib/hooks/useAppForm";
import { signup } from "@/app/actions/signup";
import { SignUpSchema } from "@/lib/api/auth";

export function SignUpForm() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("email", value.email);
      formData.append("password", value.password);
      const result = await signup(formData);

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
          <form.AppField name="name">
            {(field) => <field.TextField label="Name" type="text" />}
          </form.AppField>
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
                autoComplete="new-password"
              />
            )}
          </form.AppField>
          <form.ErrorMessage />
          <form.SubscribeButton label="Sign up" fullWidth />
        </form>
      </form.AppForm>
    </div>
  );
}
