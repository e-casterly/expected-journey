"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const NAV_LINKS = [
  { href: "/trips", label: "Trips" },
  { href: "/places", label: "Places" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={classNames(
                "text-sm transition hover:text-zinc-900",
                pathname.startsWith(href)
                  ? "font-medium text-zinc-900"
                  : "text-zinc-500",
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
