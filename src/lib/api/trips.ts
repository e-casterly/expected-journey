import { z } from "zod";

export const tripStatusValues = [
  "draft",
  "planned",
  "active",
  "completed",
  "cancelled",
] as const;

export const TripStatusSchema = z.enum(tripStatusValues);

export type TripStatus = z.infer<typeof TripStatusSchema>;

export type TripDto = {
  id: string;
  userId: string;
  title: string;
  slug: string | null;
  description: string | null;
  startPlaceId: string | null;
  startDate: string | null;
  endDate: string | null;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
};

export type TripsResponse = {
  trips: TripDto[];
};

export type TripResponse = {
  trip: TripDto;
};

export type DeleteTripResponse = {
  ok: true;
  id: string;
};

export const CreateTripSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  startPlaceId: z
    .string()
    .trim()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: TripStatusSchema.optional(),
});

export const UpdateTripSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    slug: z
      .string()
      .trim()
      .min(1)
      .optional()
      .or(z.literal("").transform(() => null)),
    description: z
      .string()
      .trim()
      .optional()
      .or(z.literal("").transform(() => null)),
    startPlaceId: z
      .string()
      .trim()
      .min(1)
      .optional()
      .or(z.literal("").transform(() => null)),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    status: TripStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type CreateTripInput = z.infer<typeof CreateTripSchema>;
export type UpdateTripInput = z.infer<typeof UpdateTripSchema>;
