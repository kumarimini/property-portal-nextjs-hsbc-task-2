import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Property Portal", template: "%s | Property Portal" },
  description:
    "Property value estimator and market analysis powered by a regression model.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>

        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="text-lg font-bold text-brand">
              Property Portal
            </Link>
            <NavBar />
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted">
            Property Portal · housing price model demo
          </div>
        </footer>
      </body>
    </html>
  );
}