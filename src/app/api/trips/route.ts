import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { trip } from "@/db/schema";
import { CreateTripSchema } from "@/lib/api/trips";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const trips = await db
    .select()
    .from(trip)
    .where(eq(trip.userId, session.user.id))
    .orderBy(desc(trip.createdAt));

  return NextResponse.json({ trips });
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

  const parsed = CreateTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const [createdTrip] = await db
    .insert(trip)
    .values({
      id: randomUUID(),
      userId: session.user.id,
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      startPlaceId: parsed.data.startPlaceId,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      status: parsed.data.status ?? "draft",
    })
    .returning();

  return NextResponse.json({ trip: createdTrip }, { status: 201 });
}
