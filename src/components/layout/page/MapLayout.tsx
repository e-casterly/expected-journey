import { ReactNode } from "react";

type PageLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function MapLayout({
  children,
}: PageLayoutProps) {
  return (
    <main className="grid h-[calc(100vh-var(--header-height))] grid-cols-[500px_1fr] overflow-hidden">
      {children}
    </main>
  );
}
