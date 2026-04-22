import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TripsListClient } from "@/features/trips/list/TripsListClient";
import PageLayout from "@/components/layout/page/PageLayout";

export default async function TripsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <PageLayout title="Trips">
      <TripsListClient />
    </PageLayout>
  );
}
