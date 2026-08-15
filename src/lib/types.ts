export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  year: number;
  isbn: string;
  available: boolean;
  cover: string; // emoji as cover placeholder
}
