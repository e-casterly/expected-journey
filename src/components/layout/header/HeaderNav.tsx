"use client";

import { Button } from "@/components/shared/Button";

const NAV_LINKS = [
  { href: "/trips", label: "Trips" },
  { href: "/places", label: "Places" },
];

export default function HeaderNav() {

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Button href={href} variant="text" size="l" color="primary">{label}</Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
