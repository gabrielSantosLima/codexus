import { Book } from "../entities/book";

export class BookService {
  async fetchAll(): Promise<Book[]> {
    const data = await fetch("data/data.json");
    const json = await data.json();
    return json as Book[];
  }

  async fetchByIds(idList: number[]) {
    const data = await fetch('data/data.json');
    const json = await data.json();

    const filteredData = json.filter((book: Book) => idList.includes(book.id));

    return filteredData;
  }
}
