import { ReactNode } from "react";
import Header from "@/components/layout/header/Header";

type PageLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function MapLayout({
  children,
}: PageLayoutProps) {
  return (
    <>
      <Header />
      <main className="grid h-[calc(100vh-var(--header-height))] grid-cols-[500px_1fr] overflow-hidden">
        {children}
      </main>
    </>
  );
}
