import { LatLon } from "@/lib/types/map";

export type PlaceExtra = {
  openingHours: string;
  phone: string;
  website: string;
  email: string;
  instagram: string;
  cuisine: string;
  description: string;
  wheelchair: string;
};

export type PlaceGeneral = {
  id: string;
  osmType: string;
  osmId: number;
  name: string;
  address: string;
} & LatLon;

export type WikidataInfo = {
  label: string | null;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  imageUrl: string | null;
};

export type PlaceDetailed = PlaceGeneral & {
  extratags?: PlaceExtra | null;
  wikidata?: WikidataInfo | null;
};