import { NextResponse } from "next/server";
import { z } from "zod";
import { NominatimExtraTags, NominatimResult } from "@/lib/types/nominatim";
import { PlaceDetailed, PlaceGeneral } from "@/lib/types/place";
import { buildPlaceObject } from "@/lib/formatOsmData";
import { fetchWikidata } from "@/lib/fetchWikidata";

const LookupQuerySchema = z.object({
  osm_type: z.enum(["node", "way", "relation"]),
  osm_id: z.coerce.number().int().positive(),
});

type NominatimLookupResult = NominatimResult & {
  extratags?: NominatimExtraTags;
};

type LookupResponse = PlaceGeneral & PlaceDetailed;

const OSM_TYPE_PREFIX: Record<string, string> = {
  node: "N",
  way: "W",
  relation: "R",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = LookupQuerySchema.safeParse({
    osm_type: searchParams.get("osm_type"),
    osm_id: searchParams.get("osm_id"),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid osm_type or osm_id" }, { status: 400 });
  }

  const { osm_type, osm_id } = parsed.data;
  const osmIds = `${OSM_TYPE_PREFIX[osm_type]}${osm_id}`;

  const params = new URLSearchParams({
    osm_ids: osmIds,
    format: "json",
    addressdetails: "1",
    extratags: "1",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/lookup?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "the-expected-journey/1.0",
        },
        cache: "no-store",
      },
    );

    const results = (await response.json().catch(() => null)) as
      | NominatimLookupResult[]
      | null;

    if (!response.ok || !results) {
      return NextResponse.json(
        { message: "Lookup request failed" },
        { status: response.status },
      );
    }

    const item = results[0];
    if (!item) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    console.log(item);
    const wikidataId = item.extratags?.wikidata;
    const place = buildPlaceObject(item);
    const wikidata = wikidataId ? await fetchWikidata(wikidataId) : null;

    return NextResponse.json<LookupResponse>({ ...place, wikidata });
  } catch {
    return NextResponse.json(
      { message: "Failed to reach geocoding service" },
      { status: 502 },
    );
  }
}
