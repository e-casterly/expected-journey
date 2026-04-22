import { WikidataInfo } from "@/lib/types/place";
import capitalize from "@/lib/capitalize";

type WikidataEntity = {
  labels?: Record<string, { value: string }>;
  descriptions?: Record<string, { value: string }>;
  claims?: {
    P856?: { mainsnak: { datavalue?: { value: string } } }[]; // official website
    P154?: { mainsnak: { datavalue?: { value: string } } }[]; // logo
    P18?: { mainsnak: { datavalue?: { value: string } } }[];  // image
    P2003?: { mainsnak: { datavalue?: { value: string } } }[]; // instagram username
    P2013?: { mainsnak: { datavalue?: { value: string } } }[]; // facebook profile
  };
};

function buildImageUrl(filename: string, width = 300): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
}

export async function fetchWikidata(
  id: string,
  lang = "en",
): Promise<WikidataInfo | null> {
  const params = new URLSearchParams({
    action: "wbgetentities",
    ids: id,
    format: "json",
    languages: lang,
    props: "labels|descriptions|claims",
  });

  try {
    const response = await fetch(
      `https://www.wikidata.org/w/api.php?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "the-expected-journey/1.0",
        },
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) return null;

    const data = await response.json().catch(() => null);
    const entity = data?.entities?.[id] as WikidataEntity | undefined;

    if (!entity) return null;

    const label = entity.labels?.[lang]?.value ?? null;
    const description = capitalize(entity.descriptions?.[lang]?.value) ?? null;
    const website = entity.claims?.P856?.[0]?.mainsnak?.datavalue?.value ?? null;

    const imageFilename = entity.claims?.P18?.[0]?.mainsnak?.datavalue?.value ?? null;
    const imageUrl = imageFilename ? buildImageUrl(imageFilename) : null;

    const instagramUsername = entity.claims?.P2003?.[0]?.mainsnak?.datavalue?.value ?? null;
    const instagram = instagramUsername ? `https://instagram.com/${instagramUsername}` : null;

    const facebookProfile = entity.claims?.P2013?.[0]?.mainsnak?.datavalue?.value ?? null;
    const facebook = facebookProfile ? `https://facebook.com/${facebookProfile}` : null;

    return { label, description, website, imageUrl, instagram, facebook };
  } catch {
    return null;
  }
}
