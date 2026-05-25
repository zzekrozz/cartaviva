import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: `${BRAND_NAME} | Carta digital premium para restaurantes`,
  description: BRAND_TAGLINE
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
