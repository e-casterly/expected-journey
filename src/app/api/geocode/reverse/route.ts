import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildPlaceObject,
} from "@/lib/nominatim";
import { NominatimExtraTags, NominatimResult } from "@/lib/types/nominatim";
import { PlaceExtra, PlaceGeneral } from "@/lib/types/place";

type NominatimReverseResult = NominatimResult & {
  extratags: NominatimExtraTags;
};

type ReverseResponse = PlaceGeneral & {
  extratags: PlaceExtra | null;
};

const ReverseGeocodeQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = ReverseGeocodeQuerySchema.safeParse({
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 });
  }

  const params = new URLSearchParams({
    lat: String(parsed.data.lat),
    lon: String(parsed.data.lon),
    format: "jsonv2",
    addressdetails: "1",
    extratags: "1",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "the-expected-journey/1.0",
        },
        cache: "no-store",
      },
    );

    const item = (await response
      .json()
      .catch(() => null)) as NominatimReverseResult | null;
    console.log(item);
    if (!response.ok || !item) {
      return NextResponse.json(
        { message: "Reverse geocoding request failed" },
        { status: response.status }
      );
    }

    const result = buildPlaceObject(item);

    return NextResponse.json<ReverseResponse>(result);
  } catch {
    return NextResponse.json(
      { message: "Failed to reach reverse geocoding service" },
      { status: 502 },
    );
  }
}