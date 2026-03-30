import Image from "next/image";
import Link from "next/link";
import HeaderAuth from "@/components/layout/header/HeaderAuth";
import HeaderNav from "@/components/layout/header/HeaderNav";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-gradient">
      <div className="mx-auto flex h-14 container items-center justify-between">
        <Link
          href="/"
        >
          <Image src="/logo.svg" alt="Expected Journey logo" width={256} height={30} />
        </Link>
        <div className="flex items-center gap-6">
          <HeaderNav />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
