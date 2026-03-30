import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileHomeForm } from "@/features/profile/ProfileHomeForm";
import PageLayout from "@/components/layout/page/PageLayout";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    redirect("/signin");
  }

  return (
    <PageLayout>
      <div className="flex items-center gap-4">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User avatar"}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border border-zinc-200 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xl font-semibold text-zinc-700">
            {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {user.name ?? "Profile"}
          </h1>
          <p className="text-sm text-zinc-600">{user.email}</p>
        </div>
      </div>

      <ProfileHomeForm />
    </PageLayout>
  );
}
