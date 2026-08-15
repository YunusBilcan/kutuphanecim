import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";

// GET /api/books/[id] — tek kitap getir
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb();
    const sql = getDb();
    const { id } = await params;
    const books = await sql`SELECT * FROM books WHERE id = ${parseInt(id)}`;

    if (books.length === 0) {
      return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(books[0]);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

// PUT /api/books/[id] — kitap güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb();
    const sql = getDb();
    const { id } = await params;
    const body = await request.json();
    const { title, author, description, category, year, isbn, available, cover } = body;

    const result = await sql`
      UPDATE books SET
        title = ${title},
        author = ${author},
        description = ${description || ""},
        category = ${category || "Roman"},
        year = ${year || 2024},
        isbn = ${isbn || ""},
        available = ${available ?? true},
        cover = ${cover || "📕"}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

// DELETE /api/books/[id] — kitap sil
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDb();
    const sql = getDb();
    const { id } = await params;
    const result = await sql`DELETE FROM books WHERE id = ${parseInt(id)} RETURNING *`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Kitap silindi" });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}
