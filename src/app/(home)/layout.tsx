import { ReactNode } from "react";
import Header from "@/components/layout/header/Header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <main className="flex-1 overflow-hidden">{children}</main>
      <footer>
        <div className="container mx-auto py-2 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} The Expected Journey
        </div>
      </footer>
    </>
  );
}
