import { NextResponse } from "next/server";
import { z } from "zod";
import { CreatePlaceSchema } from "@/lib/api/places";
import * as PlacesDAL from "@/dal/places";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const osmType = searchParams.get("osmType") ?? undefined;
  const osmIdParam = searchParams.get("osmId");
  const osmId = osmIdParam ? Number(osmIdParam) : undefined;

  const places = await PlacesDAL.getPlaces({ osmType, osmId });

  if (osmType && osmId !== undefined) {
    return NextResponse.json({ place: places[0] ?? null });
  }

  return NextResponse.json({ places });
}

export async function POST(request: Request) {
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

  const place = await PlacesDAL.createPlace(parsed.data);
  return NextResponse.json({ place }, { status: 201 });
}
