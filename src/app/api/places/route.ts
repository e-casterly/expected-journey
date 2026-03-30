import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { place } from "@/db/schema";
import { CreatePlaceSchema } from "@/lib/api/places";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const osmType = searchParams.get("osmType");
  const osmId = searchParams.get("osmId");

  if (osmType && osmId) {
    const found = await db.query.place.findFirst({
      where: and(
        eq(place.userId, session.user.id),
        eq(place.osmType, osmType),
        eq(place.osmId, Number(osmId)),
      ),
    });
    return NextResponse.json({ place: found ?? null });
  }

  const places = await db.query.place.findMany({
    where: eq(place.userId, session.user.id),
    orderBy: desc(place.createdAt),
  });

  return NextResponse.json({ places });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreatePlaceSchema.safeParse(body);
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

  const [createdPlace] = await db
    .insert(place)
    .values({
      id: randomUUID(),
      userId: session.user.id,
      ...placeData,
    })
    .returning();

  return NextResponse.json({ place: createdPlace }, { status: 201 });
}