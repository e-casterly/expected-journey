import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { place } from "@/db/schema";
import { UpdatePlaceSchema } from "@/lib/api/places";
import { auth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

async function findPlace(placeId: string) {
  return db.query.place.findFirst({ where: eq(place.id, placeId) }) ?? null;
}

export async function GET(_: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const foundPlace = await db.query.place.findFirst({
    where: and(eq(place.id, id), eq(place.userId, user.id)),
  });

  if (!foundPlace) {
    return NextResponse.json({ message: "Place not found" }, { status: 404 });
  }

  return NextResponse.json({ place: foundPlace });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdatePlaceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { tagIds: _tagIds, ...placeData } = parsed.data;

  const [updatedPlace] = await db
    .update(place)
    .set(placeData)
    .where(and(eq(place.id, id), eq(place.userId, user.id)))
    .returning();

  if (!updatedPlace) {
    return NextResponse.json({ message: "Place not found" }, { status: 404 });
  }

  return NextResponse.json({ place: updatedPlace });
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const [deletedPlace] = await db
    .delete(place)
    .where(and(eq(place.id, id), eq(place.userId, user.id)))
    .returning({ id: place.id });

  if (!deletedPlace) {
    return NextResponse.json({ message: "Place not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id: deletedPlace.id });
}