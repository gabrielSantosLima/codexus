import { Book } from "../entities/book";

export class BookService {
  async fetchAll(): Promise<Book[]> {
    const data = await fetch("/data/data.json");
    const json = await data.json();
    return json as Book[];
  }

  async findById(id: number): Promise<Book | undefined> {
    const books = await this.fetchAll();
    if (books.length === 0) {
      return undefined;
    }
    const foundBook = books.find(book => book.id === id);
    return foundBook;
  }
}
