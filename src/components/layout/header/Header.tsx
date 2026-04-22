import Image from "next/image";
import Link from "next/link";
import HeaderAuth from "@/components/layout/header/HeaderAuth";
import HeaderNav from "@/components/layout/header/HeaderNav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  return (
    <header className="bg-linear-to-r from-[#E9F1F1] via-[#F3F3E9] via-83% to-[#F3F3E9] shadow-header">
      <div className="container mx-auto flex h-(--header-height) items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Expected Journey logo"
            width={312}
            height={36}
          />
        </Link>
        <div className="flex items-center gap-6">
          <HeaderNav />
          <HeaderAuth user={user} />
        </div>
      </div>
    </header>
  );
}
