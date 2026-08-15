import { Book } from "./types";

export const initialBooks: Book[] = [
  {
    id: "1",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    description:
      "Raskolnikov'un işlediği cinayetin ardından yaşadığı psikolojik çöküşü anlatan klasik roman.",
    category: "Roman",
    year: 1866,
    isbn: "978-975-07-0244-8",
    available: true,
    cover: "📕",
  },
  {
    id: "2",
    title: "Kürk Mantolu Madonna",
    author: "Sabahattin Ali",
    description:
      "Berlin'de geçen, kültürler arası bir aşk hikayesini anlatan Türk edebiyatının başyapıtı.",
    category: "Roman",
    year: 1943,
    isbn: "978-975-10-0456-2",
    available: true,
    cover: "📗",
  },
  {
    id: "3",
    title: "Sefiller",
    author: "Victor Hugo",
    description:
      "Jean Valjean'ın hikayesi üzerinden adaleti, merhameti ve toplumsal eşitsizliği sorgulayan dev eser.",
    category: "Roman",
    year: 1862,
    isbn: "978-975-07-0312-4",
    available: false,
    cover: "📘",
  },
  {
    id: "4",
    title: "Küçük Prens",
    author: "Antoine de Saint-Exupéry",
    description:
      "Bir çocuğun gözünden büyüklerin dünyasını sorgulayan, zamansız bir masal.",
    category: "Çocuk",
    year: 1943,
    isbn: "978-975-07-0567-8",
    available: true,
    cover: "📙",
  },
  {
    id: "5",
    title: "1984",
    author: "George Orwell",
    description:
      "Totaliter bir rejimde bireyin özgürlük arayışını anlatan distopik roman.",
    category: "Bilim Kurgu",
    year: 1949,
    isbn: "978-975-07-0890-7",
    available: true,
    cover: "📕",
  },
  {
    id: "6",
    title: "Şeker Portakalı",
    author: "José Mauro de Vasconcelos",
    description:
      "Küçük Zezé'nin hayal dünyası ve gerçek hayat arasındaki dokunaklı hikayesi.",
    category: "Çocuk",
    year: 1968,
    isbn: "978-975-07-1234-5",
    available: true,
    cover: "📗",
  },
  {
    id: "7",
    title: "Tutunamayanlar",
    author: "Oğuz Atay",
    description:
      "Türk edebiyatının postmodern başyapıtı, aydın bireyin toplumla çatışması.",
    category: "Roman",
    year: 1972,
    isbn: "978-975-07-2345-6",
    available: false,
    cover: "📘",
  },
  {
    id: "8",
    title: "Cosmos",
    author: "Carl Sagan",
    description:
      "Evrenin sırlarını herkesin anlayabileceği bir dille anlatan popüler bilim kitabı.",
    category: "Bilim",
    year: 1980,
    isbn: "978-975-07-3456-7",
    available: true,
    cover: "📙",
  },
];

const STORAGE_KEY = "kutuphane_books";

export function getBooks(): Book[] {
  if (typeof window === "undefined") return initialBooks;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
    return initialBooks;
  }
  return JSON.parse(stored);
}

export function saveBooks(books: Book[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function getBookById(id: string): Book | undefined {
  return getBooks().find((b) => b.id === id);
}

export function addBook(book: Omit<Book, "id">): Book {
  const books = getBooks();
  const newBook: Book = { ...book, id: Date.now().toString() };
  books.push(newBook);
  saveBooks(books);
  return newBook;
}

export function updateBook(id: string, data: Partial<Book>) {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...data };
    saveBooks(books);
  }
}

export function deleteBook(id: string) {
  const books = getBooks().filter((b) => b.id !== id);
  saveBooks(books);
}
