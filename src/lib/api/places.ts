import { z } from "zod";

export const placeSystemTagValues = ["starred"] as const;
export type PlaceSystemTag = (typeof placeSystemTagValues)[number];
export const PlaceSystemTagSchema = z.enum(placeSystemTagValues);

export type PlaceTagDto = {
  id: string;
  name: string;
};

export type PlaceTagsResponse = {
  tags: PlaceTagDto[];
};

export type PlaceTagResponse = {
  tag: PlaceTagDto;
};

export type DeletePlaceTagResponse = {
  ok: true;
  id: string;
};

export const CreatePlaceTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required").max(50, "Tag name is too long"),
});

export type CreatePlaceTagInput = z.infer<typeof CreatePlaceTagSchema>;

export type PlaceDto = {
  id: string;
  name: string;
  address: string | null;
  notes: string | null;
  lat: number;
  lon: number;
  osmType: string | null;
  osmId: number | null;
  systemTags: PlaceSystemTag[];
  tags: PlaceTagDto[];
  createdAt: string;
  updatedAt: string;
};

export type PlacesResponse = {
  places: PlaceDto[];
};

export type PlaceResponse = {
  place: PlaceDto;
};

export type DeletePlaceResponse = {
  ok: true;
  id: string;
};

export type PlaceOptionDto = {
  id: string;
  label: string;
  tags: PlaceTagDto[];
};

export type PlaceOptionsResponse = {
  options: PlaceOptionDto[];
};

export const CreatePlaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  address: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  osmType: z.string().optional(),
  osmId: z.number().int().optional(),
  tagIds: z.array(z.string()).default([]),
  systemTags: z.array(PlaceSystemTagSchema).default([]),
});

export const UpdatePlaceSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    address: z
      .string()
      .trim()
      .optional()
      .or(z.literal("").transform(() => null)),
    notes: z
      .string()
      .trim()
      .optional()
      .or(z.literal("").transform(() => null)),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lon: z.coerce.number().min(-180).max(180).optional(),
    osmType: z.string().optional(),
    osmId: z.number().int().optional(),
    tagIds: z.array(z.string()).optional(),
    systemTags: z.array(PlaceSystemTagSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof UpdatePlaceSchema>;