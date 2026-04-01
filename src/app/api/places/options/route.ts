import { NextResponse } from "next/server";
import * as PlacesDAL from "@/dal/places";

export async function GET() {
  const options = await PlacesDAL.getPlaceOptions();
  return NextResponse.json({ options });
}
