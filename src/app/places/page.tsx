import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PlaceClient } from "@/features/places/PlaceClient";
import MapLayout from "@/components/layout/page/MapLayout";

export default async function PlacesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return <MapLayout><PlaceClient /></MapLayout>;
}
