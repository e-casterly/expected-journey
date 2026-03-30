import Link from "next/link";

export default function HeaderNav() {
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-6">
        <li>
          <Link href="/trips">Trips</Link>
        </li>
        <li>
          <Link href="/places">Places</Link>
        </li>
      </ul>
    </nav>
  );
}
