"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";

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

const categories = ["Tümü", "Roman", "Bilim Kurgu", "Çocuk", "Bilim"];

export default function KitaplarPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Tümü" || book.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📖 Tüm Kitaplar</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Kitap veya yazar ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-800"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat
                  ? "bg-amber-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-lg">Kitap bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
