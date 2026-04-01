import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { place } from "@/db/schema";
import { verifySession } from "./session";
import type {
  CreatePlaceInput,
  PlaceDto,
  PlaceOptionDto,
  PlaceSystemTag,
  UpdatePlaceInput,
} from "@/lib/api/places";

function toDto(row: typeof place.$inferSelect): PlaceDto {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    notes: row.notes,
    lat: row.lat,
    lon: row.lon,
    osmType: row.osmType,
    osmId: row.osmId,
    systemTags: (row.systemTags ?? []) as PlaceSystemTag[],
    tags: [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getPlaces(filters?: {
  osmType?: string;
  osmId?: number;
}): Promise<PlaceDto[]> {
  const { user } = await verifySession();

  if (filters?.osmType && filters.osmId !== undefined) {
    const row = await db.query.place.findFirst({
      where: and(
        eq(place.userId, user.id),
        eq(place.osmType, filters.osmType),
        eq(place.osmId, filters.osmId),
      ),
    });
    return row ? [toDto(row)] : [];
  }

  const rows = await db.query.place.findMany({
    where: eq(place.userId, user.id),
    orderBy: desc(place.createdAt),
  });
  return rows.map(toDto);
}

export async function getPlace(id: string): Promise<PlaceDto | null> {
  const { user } = await verifySession();
  const row = await db.query.place.findFirst({
    where: and(eq(place.id, id), eq(place.userId, user.id)),
  });
  return row ? toDto(row) : null;
}

export async function createPlace(input: CreatePlaceInput): Promise<PlaceDto> {
  const { user } = await verifySession();
  const { tagIds: _tagIds, ...data } = input;
  const [row] = await db
    .insert(place)
    .values({ id: randomUUID(), userId: user.id, ...data })
    .returning();
  return toDto(row);
}

export async function updatePlace(
  id: string,
  input: UpdatePlaceInput,
): Promise<PlaceDto | null> {
  const { user } = await verifySession();
  const { tagIds: _tagIds, ...data } = input;
  const [row] = await db
    .update(place)
    .set(data)
    .where(and(eq(place.id, id), eq(place.userId, user.id)))
    .returning();
  return row ? toDto(row) : null;
}

export async function deletePlace(id: string): Promise<string | null> {
  const { user } = await verifySession();
  const [row] = await db
    .delete(place)
    .where(and(eq(place.id, id), eq(place.userId, user.id)))
    .returning({ id: place.id });
  return row?.id ?? null;
}

export async function getPlaceOptions(): Promise<PlaceOptionDto[]> {
  const { user } = await verifySession();
  const rows = await db.query.place.findMany({
    where: eq(place.userId, user.id),
    columns: { id: true, name: true, address: true },
    orderBy: [asc(place.name), asc(place.createdAt)],
  });
  return rows.map((row) => ({
    id: row.id,
    label: row.address ? `${row.name} - ${row.address}` : row.name,
    tags: [],
  }));
}
