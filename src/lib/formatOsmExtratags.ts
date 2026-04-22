import { NominatimExtraTags } from "@/lib/types/nominatim";
import { PlaceExtra } from "@/lib/types/place";
import { formatOsmTag } from "@/lib/formatOsmTag";

export default function formatOsmExtratags(
  extra: NominatimExtraTags | undefined
): PlaceExtra | null {
  if (!extra) return null;

  const phone = extra?.phone ?? extra?.["contact:phone"];
  const website = extra?.website ?? extra?.["contact:website"];
  const email = extra?.email ?? extra?.["contact:email"];
  const instagramRaw = extra?.["contact:instagram"];
  const instagram = instagramRaw
    ? `https://instagram.com/${instagramRaw.replace(/^@/, "")}`
    : undefined;
  const facebook = extra?.["contact:facebook"];
  return {
    imageUrl: "",
    openingHours: extra?.opening_hours ?? "",
    phone: phone ?? "",
    website: website ?? "",
    email: email ?? "",
    instagram: instagram ?? "",
    facebook: facebook ?? "",
    cuisine: extra?.cuisine ? formatOsmTag(extra.cuisine) : "",
    wheelchair: extra?.wheelchair ?? "",
    description: extra?.description ?? "",
  };
}
