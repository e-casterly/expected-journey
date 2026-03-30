export type NominatimAddress = {
  road?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
};

export type NominatimExtraTags = {
  opening_hours?: string;
  phone?: string;
  website?: string;
  cuisine?: string;
  email?: string;
  "contact:phone"?: string;
  "contact:website"?: string;
  "contact:email"?: string;
  wheelchair?: string;
  description?: string;
  "contact:instagram"?: string;
};

export type NominatimResult = {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category?: string;
  type: string;
  class?: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address?: NominatimAddress;
  boundingbox?: [string, string, string, string];
};