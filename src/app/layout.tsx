import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import classNames from "classnames";
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
          "bg-background flex min-h-screen flex-col overflow-hidden antialiased"
        )}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
