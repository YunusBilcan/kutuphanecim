import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";

// GET /api/books — tüm kitapları getir
export async function GET() {
  try {
    await initializeDb();
    const sql = getDb();
    const books = await sql`SELECT * FROM books ORDER BY created_at DESC`;
    return NextResponse.json(books);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

// POST /api/books — yeni kitap ekle
export async function POST(request: NextRequest) {
  try {
    await initializeDb();
    const sql = getDb();
    const body = await request.json();
    const { title, author, description, category, year, isbn, available, cover } = body;

    if (!title || !author) {
      return NextResponse.json({ error: "Kitap adı ve yazar zorunludur" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO books (title, author, description, category, year, isbn, available, cover)
      VALUES (${title}, ${author}, ${description || ""}, ${category || "Roman"}, ${year || 2024}, ${isbn || ""}, ${available ?? true}, ${cover || "📕"})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}
