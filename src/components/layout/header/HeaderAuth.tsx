import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HeaderAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
console.log(user)
  if (!user) {
    return (
      <Link
        href="/signin"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profile" className="flex items-center gap-1">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User avatar"}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border border-zinc-200"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-700">
            {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
          </div>
        )}

        {/* Name */}
        <span className="hidden text-sm text-zinc-700 sm:inline">
          {user.name ?? user.email}
        </span>
      </Link>

      {/* Sign out */}
      <form
        action={async () => {
          "use server";
          await auth.api.signOut({
            headers: await headers(),
          });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
