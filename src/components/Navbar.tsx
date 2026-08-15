"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="bg-amber-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">📚</span>
            <span>Kütüphane</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`hover:text-amber-200 transition ${
                pathname === "/" ? "text-amber-200 font-semibold" : ""
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/kitaplar"
              className={`hover:text-amber-200 transition ${
                pathname === "/kitaplar" ? "text-amber-200 font-semibold" : ""
              }`}
            >
              Kitaplar
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded text-sm transition ${
                isAdmin
                  ? "bg-amber-600 text-white"
                  : "bg-amber-700 hover:bg-amber-600"
              }`}
            >
              ⚙️ Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
