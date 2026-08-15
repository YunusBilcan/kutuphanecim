import Link from "next/link";
import { Book } from "@/lib/types";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/kitaplar/${book.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 h-full flex flex-col">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 text-center">
          <span className="text-6xl">{book.cover}</span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">
            {book.title}
          </h3>
          <p className="text-amber-700 text-sm mt-1">{book.author}</p>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 flex-1">
            {book.description}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
              {book.category}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                book.available
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {book.available ? "✓ Mevcut" : "✗ Ödünçte"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
