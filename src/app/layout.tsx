import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import classNames from "classnames";
import Header from "@/components/layout/header/Header";
import { QueryProvider } from "@/components/providers/QueryProvider";
import cx from "classnames";
import { ReactNode } from "react";

const baseFont = Outfit({
  variable: "--font-base",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expected Journey",
  description: "Plan journeys, discover places, keep memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={cx(baseFont.variable, "leading-none")}>
      <body
        className={classNames(
          "bg-background grid min-h-screen grid-rows-[auto_1fr_auto] antialiased"
        )}
      >
        <QueryProvider>
          <Header />

          <main className="flex flex-col">{children}</main>
          <footer>
            <div className="container mx-auto py-2 text-center text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} The Expected Journey
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
