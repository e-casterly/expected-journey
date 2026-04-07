import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchWikidata } from "@/lib/fetchWikidata";
import { WikidataInfo } from "@/lib/types/place";

const WikidataQuerySchema = z.object({
  id: z.string().regex(/^Q\d+$/, "Invalid Wikidata ID"),
  lang: z.string().default("en"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = WikidataQuerySchema.safeParse({
    id: searchParams.get("id"),
    lang: searchParams.get("lang") ?? "en",
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid Wikidata ID" }, { status: 400 });
  }

  const { id, lang } = parsed.data;
  const result = await fetchWikidata(id, lang);

  if (!result) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json<WikidataInfo>(result);
}
