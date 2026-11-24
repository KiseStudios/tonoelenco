import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "../components/site/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ELENCO — Fotografia Esportiva",
    template: "%s | ELENCO",
  },
  description: "ELENCO Fotografia Esportiva.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
