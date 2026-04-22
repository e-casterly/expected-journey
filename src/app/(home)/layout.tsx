import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-1 overflow-hidden">{children}</main>
      <footer>
        <div className="container mx-auto py-2 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} The Expected Journey
        </div>
      </footer>
    </>
  );
}
