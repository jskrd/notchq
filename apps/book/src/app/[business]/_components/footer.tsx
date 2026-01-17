import { getEnv } from "@repo/book/lib/env";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Footer(): ReactNode {
  const env = getEnv();

  const links: { href: string; label: string }[] = [
    { href: `${env.WWW_URL}/terms`, label: "Terms" },
    { href: `${env.WWW_URL}/privacy`, label: "Privacy" },
  ];

  return (
    <footer className="text-13 container mx-auto flex items-center justify-center space-x-13 px-21 py-55 text-gray-500">
      <Link href={env.WWW_URL}>
        Powered by <strong>{env.WWW_NAME}</strong>
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
