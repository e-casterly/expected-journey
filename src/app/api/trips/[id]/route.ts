import { NextResponse } from "next/server";
import { z } from "zod";
import { UpdateTripSchema } from "@/lib/api/trips";
import * as TripsDAL from "@/dal/trips";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const trip = await TripsDAL.getTrip(id);
  if (!trip) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }
  return NextResponse.json({ trip });
}

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  const trip = await TripsDAL.updateTrip(id, parsed.data);
  if (!trip) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }
  return NextResponse.json({ trip });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const deletedId = await TripsDAL.deleteTrip(id);
  if (!deletedId) {
    return NextResponse.json({ message: "Trip not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: deletedId });
}
