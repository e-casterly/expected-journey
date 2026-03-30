import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { trip } from "@/db/schema";
import { UpdateTripSchema } from "@/lib/api/trips";
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

export async function GET(_: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const foundTrip = await db.query.trip.findFirst({
    where: and(eq(trip.id, id), eq(trip.userId, user.id)),
  });

  if (!foundTrip) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({ trip: foundTrip });
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

  const parsed = UpdateTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const [updatedTrip] = await db
    .update(trip)
    .set(parsed.data)
    .where(and(eq(trip.id, id), eq(trip.userId, user.id)))
    .returning();

  if (!updatedTrip) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({ trip: updatedTrip });
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const [deletedTrip] = await db
    .delete(trip)
    .where(and(eq(trip.id, id), eq(trip.userId, user.id)))
    .returning({ id: trip.id });

  if (!deletedTrip) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id: deletedTrip.id });
}
