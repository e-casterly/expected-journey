"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/shared/Button";
import { ErrorList } from "@/components/shared/ErrorList";
import { Label } from "@/components/shared/Label";
import { useAppForm } from "@/lib/hooks/useAppForm";
import { formatFormErrors } from "@/lib/formatFormErrors";
import { CreateTripSchema } from "@/lib/api/trips";
import type { TripResponse } from "@/lib/api/trips";

const TripCreateFormSchema = z
  .object({
    title: CreateTripSchema.shape.title,
    description: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine((value, ctx) => {
    if (!value.startDate || !value.endDate) return;

    if (new Date(value.endDate) < new Date(value.startDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }
  });

type TripCreateFormValues = z.infer<typeof TripCreateFormSchema>;

function getFieldErrorMessages(errors: unknown[]): string[] | undefined {
  const messages = errors.flatMap((error) => {
    if (!error) return [];
    return formatFormErrors(error as Parameters<typeof formatFormErrors>[0]);
  });

  return messages.length ? messages : undefined;
}

export function TripCreateForm() {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validators: {
      onSubmit: TripCreateFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: Record<string, string> = {
        title: value.title.trim(),
      };

      if (value.description.trim())
        payload.description = value.description.trim();
      if (value.startDate)
        payload.startDate = new Date(value.startDate).toISOString();
      if (value.endDate)
        payload.endDate = new Date(value.endDate).toISOString();

      try {
        const response = await fetch("/api/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const responseJson = (await response.json().catch(() => null)) as
          | (Partial<TripResponse> & {
              message?: string;
              fieldErrors?: Partial<
                Record<keyof TripCreateFormValues, string[]>
              >;
            })
          | null;

        if (!response.ok || !responseJson?.trip) {
          form.setErrorMap({
            onSubmit: {
              form: responseJson?.message ?? "Failed to create trip",
              fields: responseJson?.fieldErrors ?? {},
            },
          });
          return;
        }

        router.push("/trips");
        router.refresh();
      } catch (requestError) {
        form.setErrorMap({
          onSubmit: {
            form:
              requestError instanceof Error
                ? requestError.message
                : "Failed to create trip",
            fields: {},
          },
        });
      }
    },
  });

  return (
    <section className="flex h-full flex-col overflow-hidden">
      <div className="border-stroke flex items-center justify-between gap-4 border-b-2 px-8 py-4">
        <h1 className="text-2xl font-medium">Create trip</h1>
        <Link
          href="/trips"
          className="text-sm text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
        >
          Back to trips
        </Link>
      </div>
      <div className="h-full w-full overflow-hidden">
        <div className="flex h-full w-full flex-col overflow-auto px-8 py-4">
          <form.AppForm>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              noValidate
            >
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    label="Title"
                    name={field.name}
                    type="text"
                    placeholder="Iceland 2026"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.TextareaField
                    label="Description"
                    placeholder="Notes, goals, route ideas..."
                    rows={4}
                  />
                )}
              </form.AppField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.AppField name="startDate">
                  {(field) => {
                    const errorMessages = !field.state.meta.isValid
                      ? getFieldErrorMessages(field.state.meta.errors)
                      : undefined;
                    const hasError = Boolean(errorMessages?.length);

                    return (
                      <div className="w-full">
                        <Label htmlFor="trip-start-date">Start date</Label>
                        <input
                          id="trip-start-date"
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          aria-invalid={hasError || undefined}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className={`mt-0.5 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none ${
                            hasError ? "border-destructive" : "border-stroke"
                          }`}
                        />
                        <ErrorList messages={errorMessages} />
                      </div>
                    );
                  }}
                </form.AppField>

                <form.AppField name="endDate">
                  {(field) => {
                    const errorMessages = !field.state.meta.isValid
                      ? getFieldErrorMessages(field.state.meta.errors)
                      : undefined;
                    const hasError = Boolean(errorMessages?.length);

                    return (
                      <div className="w-full">
                        <Label htmlFor="trip-end-date">End date</Label>
                        <input
                          id="trip-end-date"
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          aria-invalid={hasError || undefined}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className={`mt-0.5 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none ${
                            hasError ? "border-destructive" : "border-stroke"
                          }`}
                        />
                        <ErrorList messages={errorMessages} />
                      </div>
                    );
                  }}
                </form.AppField>
              </div>

              <form.ErrorMessage />
              <h2 className="text-xl font-semibold text-zinc-900">Itinerary</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <form.SubscribeButton label="Create trip" fullWidth />
                <Button
                  href="/trips"
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          </form.AppForm>
        </div>
      </div>
    </section>
  );
}
