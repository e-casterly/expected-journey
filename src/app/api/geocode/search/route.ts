import { NextResponse } from "next/server";
import { z } from "zod";
import { buildPlaceObject } from "@/lib/formatOsmData";
import { NominatimResult } from "@/lib/types/nominatim";
import { PlaceGeneral } from "@/lib/types/place";

const SearchGeocodeQuerySchema = z.object({
  q: z.string().trim().min(1, "Query is required"),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = SearchGeocodeQuerySchema.safeParse({
    q: searchParams.get("q"),
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid search query" }, { status: 400 });
  }

  const params = new URLSearchParams({
    q: parsed.data.q,
    format: "jsonv2",
    limit: "10",
    addressdetails: "1",
  });

  if (parsed.data.lat !== undefined && parsed.data.lon !== undefined) {
    const delta = 0.5;
    const { lat, lon } = parsed.data;
    params.set("viewbox", `${lon - delta},${lat + delta},${lon + delta},${lat - delta}`);
    params.set("bounded", "0");
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "the-expected-journey/1.0",
        },
        cache: "no-store",
      },
    );

    const result = (await response.json().catch(() => null)) as NominatimResult[] | null;
    console.log(result);
    if (!response.ok) {
      return NextResponse.json(
        { message: "Geocoding search request failed" },
        { status: response.status },
      );
    }

    const suggestions: PlaceGeneral[] = (result ?? []).map((item) => {
      return buildPlaceObject(item);
    });

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { message: "Failed to reach geocoding service" },
      { status: 502 },
    );
  }
}
