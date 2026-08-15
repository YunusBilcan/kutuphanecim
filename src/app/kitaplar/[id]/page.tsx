"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Book } from "@/lib/types";
import { getBookById } from "@/lib/data";

export default function BookDetail() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getBookById(id);
    setBook(found || null);
    setMounted(true);
  }, [params.id]);

  if (!mounted) return null;

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">📭</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Kitap Bulunamadı
        </h1>
        <Link href="/kitaplar" className="text-amber-700 hover:underline">
          ← Kitaplara Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/kitaplar"
        className="text-amber-700 hover:underline text-sm mb-6 inline-block"
      >
        ← Kitaplara Dön
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-amber-50 to-amber-100 p-12 flex items-center justify-center">
            <span className="text-9xl">{book.cover}</span>
          </div>
          <div className="md:w-2/3 p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {book.title}
                </h1>
                <p className="text-lg text-amber-700 mt-1">{book.author}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {book.available ? "✓ Mevcut" : "✗ Ödünçte"}
              </span>
            </div>

            <p className="text-gray-600 mt-6 leading-relaxed">
              {book.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Kategori</p>
                <p className="text-gray-800 font-medium">{book.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">Yayın Yılı</p>
                <p className="text-gray-800 font-medium">{book.year}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-gray-400 uppercase">ISBN</p>
                <p className="text-gray-800 font-medium">{book.isbn}</p>
              </div>
            </div>

            {book.available && (
              <button className="mt-6 w-full bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition">
                📖 Ödünç Al
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
