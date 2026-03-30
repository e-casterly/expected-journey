import { NominatimExtraTags, NominatimResult } from "@/lib/types/nominatim";
import { formatOsmTag } from "@/lib/formatOsmTag";
import { PlaceExtra } from "@/lib/types/place";

export function buildPlaceObject(
  item: NominatimResult & {
    extratags?: NominatimExtraTags;
  }
) {
  return {
    id: String(item.place_id),
    osmType: item.osm_type,
    osmId: item.osm_id,
    name: buildName(item),
    address: buildLocality(item),
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    type: formatOsmTag(item.type),
    extratags: setExtraTags(item?.extratags),
  };
}

export function buildLocality(result: NominatimResult): string {
  if (!result?.address) {
    return result.display_name;
  }
  const address = result.address;
  const street = [address.road, address.house_number].filter(Boolean).join(" ");
  const city = address.city ?? address.town ?? address.village ?? address.suburb;
  return [street, city, address.state, address.postcode, address.country]
    .filter(Boolean)
    .join(", ");
}

export function buildName(result: NominatimResult): string {
  if (result.name) return result.name;
  const type = formatOsmTag(result.type);
  const address = result.address;
  if (address) {
    const street = [address.road, address.house_number].filter(Boolean).join(" ");
    return [type, street].filter(Boolean).join(", ");
  }
  return result.display_name;
}

export function setExtraTags(extra: NominatimExtraTags | undefined): PlaceExtra | null {
  if (!extra) return null;

  const phone = extra?.phone ?? extra?.["contact:phone"];
  const website = extra?.website ?? extra?.["contact:website"];
  const email = extra?.email ?? extra?.["contact:email"];
  const instagram = extra?.["contact:instagram"];
  return {
    openingHours: extra?.opening_hours ?? "",
    phone: phone ?? "",
    website: website ?? "",
    email: email ?? "",
    instagram: instagram ?? "",
    cuisine: extra?.cuisine ? formatOsmTag(extra.cuisine) : "",
    wheelchair: extra?.wheelchair ?? "",
    description: extra?.description ?? "",
  };
}

