import { getEnv } from "@repo/book/lib/env";
import Link from "next/link";
import type { ReactNode } from "react";

const links: { href: string; label: string }[] = [
  { href: `${getEnv().WWW_URL}/terms`, label: "Terms" },
  { href: `${getEnv().WWW_URL}/privacy`, label: "Privacy" },
];

export default function Footer(): ReactNode {
  return (
    <footer className="text-13 container mx-auto flex items-center justify-center space-x-13 px-21 py-55 text-gray-500">
      <Link href={getEnv().WWW_URL}>
        Powered by <strong>{getEnv().WWW_NAME}</strong>
      </Link>
      <div className="h-13 w-1 bg-gray-500" />
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="hover:underline">
          {link.label}
        </Link>
      ))}
    </footer>
  );
}
