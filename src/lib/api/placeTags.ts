import type {
  CreatePlaceTagInput,
  DeletePlaceTagResponse,
  PlaceTagDto,
  PlaceTagResponse,
  PlaceTagsResponse,
} from "@/lib/api/places";

export const placeTagsQueryKey = ["place-tags"] as const;

export async function getPlaceTags(): Promise<PlaceTagsResponse> {
  const response = await fetch("/api/place-tags");

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(payload?.message ?? "Failed to load tags");
  }

  return (await response.json()) as PlaceTagsResponse;
}

export async function createPlaceTagRequest(
  payload: CreatePlaceTagInput,
): Promise<PlaceTagDto> {
  const response = await fetch("/api/place-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | (Partial<PlaceTagResponse> & { message?: string })
    | null;

  if (!response.ok || !data?.tag) {
    throw new Error(data?.message ?? "Failed to create tag");
  }

  return data.tag;
}

export async function deletePlaceTagRequest(
  id: string,
): Promise<DeletePlaceTagResponse> {
  const response = await fetch(`/api/place-tags/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(payload?.message ?? "Failed to delete tag");
  }

  return (await response.json()) as DeletePlaceTagResponse;
}