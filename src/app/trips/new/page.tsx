import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TripCreateForm } from "@/features/trips/create/TripCreateForm";

export default async function NewTripPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return <TripCreateForm />;
}
