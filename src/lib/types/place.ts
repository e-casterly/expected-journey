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
  type: string;
} & LatLon;

export type PlaceDetailed = PlaceGeneral & {
  extras?: PlaceExtra | null;
};