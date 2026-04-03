import { NominatimExtraTags, NominatimResult } from "@/lib/types/nominatim";
import { formatOsmTag } from "@/lib/formatOsmTag";
import capitalize from "@/lib/capitalize";
import formatOsmExtratags from "@/lib/formatOsmExtratags";

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
    extratags: formatOsmExtratags(item?.extratags),
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
  const name = result.name;
  const type = formatOsmTag(result.type);
  if (name && type) return capitalize([name, type].filter(Boolean).join(", "));
  const address = result.address;
  if (address) {
    const street = [address.road, address.house_number].filter(Boolean).join(" ");
    return capitalize([type, street].filter(Boolean).join(", "));
  }
  return result.display_name;
}

