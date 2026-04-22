import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MapLayout from "@/components/layout/page/MapLayout";
import { TripCreateClient } from "@/features/trips/create/TripCreateClient";

export default async function NewTripPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <MapLayout>
      <TripCreateClient />
    </MapLayout>
  );
}
