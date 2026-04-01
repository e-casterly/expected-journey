import { NextResponse } from "next/server";
import { z } from "zod";
import { UpdatePlaceSchema } from "@/lib/api/places";
import * as PlacesDAL from "@/dal/places";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const place = await PlacesDAL.getPlace(id);
  if (!place) {
    return NextResponse.json({ message: "Place not found" }, { status: 404 });
  }
  return NextResponse.json({ place });
}

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  const place = await PlacesDAL.updatePlace(id, parsed.data);
  if (!place) {
    return NextResponse.json({ message: "Place not found" }, { status: 404 });
  }
  return NextResponse.json({ place });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const deletedId = await PlacesDAL.deletePlace(id);
  if (!deletedId) {
    return NextResponse.json({ message: "Place not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: deletedId });
}
