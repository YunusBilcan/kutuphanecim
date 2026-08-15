"use client";

import { useEffect, useState } from "react";

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

const emptyForm = {
  title: "",
  author: "",
  description: "",
  category: "Roman",
  year: 2024,
  isbn: "",
  available: true,
  cover: "📕",
};

const covers = ["📕", "📗", "📘", "📙"];
const categories = ["Roman", "Bilim Kurgu", "Çocuk", "Bilim", "Tarih", "Felsefe"];

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = sessionStorage.getItem("admin_logged_in");
    if (session === "true") setIsLoggedIn(true);
  }, []);

  const fetchBooks = () => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    if (isLoggedIn) fetchBooks();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_logged_in", "true");
    } else {
      alert("Yanlış şifre!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author) {
      alert("Kitap adı ve yazar zorunludur!");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/books/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchBooks();
    } catch {
      alert("Bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (book: Book) => {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      year: book.year,
      isbn: book.isbn,
      available: book.available,
      cover: book.cover,
    });
    setEditingId(book.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    }
  };

  if (!mounted) return null;

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <span className="text-5xl">🔐</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-3">
              Admin Girişi
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Yönetim paneline erişmek için giriş yapın
            </p>
          </div>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-800"
          />
          <button
            type="submit"
            className="w-full bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
          >
            Giriş Yap
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Demo şifre: admin123
          </p>
        </form>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">⚙️ Admin Paneli</h1>
          <p className="text-gray-500 mt-1">
            Kitapları yönetin: ekleyin, düzenleyin veya silin.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-800 transition"
          >
            {showForm ? "✕ İptal" : "+ Yeni Kitap"}
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              sessionStorage.removeItem("admin_logged_in");
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition"
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Book Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "📝 Kitap Düzenle" : "📖 Yeni Kitap Ekle"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kitap Adı *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yazar *
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yayın Yılı
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapak
              </label>
              <div className="flex gap-2">
                {covers.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, cover: c })}
                    className={`text-3xl p-2 rounded-lg transition ${
                      form.cover === c
                        ? "bg-amber-100 ring-2 ring-amber-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={form.available}
                onChange={(e) =>
                  setForm({ ...form, available: e.target.checked })
                }
                className="w-4 h-4 accent-amber-700"
              />
              <label htmlFor="available" className="text-sm text-gray-700">
                Mevcut (ödünçte değil)
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-800 transition disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingId ? "💾 Güncelle" : "➕ Ekle"}
          </button>
        </form>
      )}

      {/* Book Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Kitap
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Yazar
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">
                  Kategori
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">
                  Durum
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{book.cover}</span>
                      <span className="font-medium text-gray-800">
                        {book.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{book.author}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {book.category}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        book.available
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {book.available ? "Mevcut" : "Ödünçte"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-amber-700 hover:bg-amber-50 px-3 py-1 rounded text-sm transition"
                      >
                        ✏️ Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm transition"
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {books.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl block mb-2">📭</span>
            <p>Henüz kitap eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
}
