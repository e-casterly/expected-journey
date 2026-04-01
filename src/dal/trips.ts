import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { trip } from "@/db/schema";
import { verifySession } from "./session";
import type {
  CreateTripInput,
  TripDto,
  TripStatus,
  UpdateTripInput,
} from "@/lib/api/trips";

function toDto(row: typeof trip.$inferSelect): TripDto {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    startPlaceId: row.startPlaceId,
    startDate: row.startDate?.toISOString() ?? null,
    endDate: row.endDate?.toISOString() ?? null,
    status: row.status as TripStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getTrips(): Promise<TripDto[]> {
  const { user } = await verifySession();
  const rows = await db.query.trip.findMany({
    where: eq(trip.userId, user.id),
    orderBy: desc(trip.createdAt),
  });
  return rows.map(toDto);
}

export async function getTrip(id: string): Promise<TripDto | null> {
  const { user } = await verifySession();
  const row = await db.query.trip.findFirst({
    where: and(eq(trip.id, id), eq(trip.userId, user.id)),
  });
  return row ? toDto(row) : null;
}

export async function createTrip(input: CreateTripInput): Promise<TripDto> {
  const { user } = await verifySession();
  const [row] = await db
    .insert(trip)
    .values({
      id: randomUUID(),
      userId: user.id,
      title: input.title,
      slug: input.slug,
      description: input.description,
      startPlaceId: input.startPlaceId,
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status ?? "draft",
    })
    .returning();
  return toDto(row);
}

export async function updateTrip(
  id: string,
  input: UpdateTripInput,
): Promise<TripDto | null> {
  const { user } = await verifySession();
  const [row] = await db
    .update(trip)
    .set(input)
    .where(and(eq(trip.id, id), eq(trip.userId, user.id)))
    .returning();
  return row ? toDto(row) : null;
}

export async function deleteTrip(id: string): Promise<string | null> {
  const { user } = await verifySession();
  const [row] = await db
    .delete(trip)
    .where(and(eq(trip.id, id), eq(trip.userId, user.id)))
    .returning({ id: trip.id });
  return row?.id ?? null;
}
