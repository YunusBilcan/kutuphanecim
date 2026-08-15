"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  year: number;
  isbn: string;
  available: boolean;
  cover: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">📚 Dijital Kütüphane</h1>
          <p className="text-xl text-amber-200 mb-8 max-w-2xl mx-auto">
            Binlerce kitaba erişin, ödünç alın ve bilgiye ulaşın. Kütüphanemiz
            her zaman sizin için açık.
          </p>
          <Link
            href="/kitaplar"
            className="inline-block bg-white text-amber-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-100 transition"
          >
            Kitapları Keşfet →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "📖", label: "Toplam Kitap", value: "8+" },
            { icon: "👥", label: "Aktif Üye", value: "150+" },
            { icon: "📋", label: "Kategori", value: "5+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <span className="text-3xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Öne Çıkanlar</h2>
          <Link
            href="/kitaplar"
            className="text-amber-700 hover:text-amber-800 font-medium"
          >
            Tümünü Gör →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 Dijital Kütüphane. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
