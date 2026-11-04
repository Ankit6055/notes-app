import type { Metadata } from "next";
import { Bricolage_Grotesque, Literata } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-ui",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
});

const literata = Literata({
  variable: "--font-text",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Notes",
  description: "Write, edit and keep notes in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${literata.variable}`}>
      <body>{children}</body>
    </html>
  );
}
