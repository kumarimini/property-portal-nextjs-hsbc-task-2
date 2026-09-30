"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/estimator", label: "Property Value Estimator" },
  { href: "/market", label: "Property Market Analysis" },
];

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label="Main" className="flex flex-wrap gap-1">
      {links.map(({ href, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-brand text-white" : "text-ink hover:bg-line"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}