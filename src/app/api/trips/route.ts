import { NextResponse } from "next/server";
import { z } from "zod";
import { CreateTripSchema } from "@/lib/api/trips";
import * as TripsDAL from "@/dal/trips";

export async function GET() {
  const trips = await TripsDAL.getTrips();
  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
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

  const trip = await TripsDAL.createTrip(parsed.data);
  return NextResponse.json({ trip }, { status: 201 });
}
