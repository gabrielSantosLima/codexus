export class BookService {
  async fetchAll() {
    const data = await fetch("data/data.json");
    const json = await data.json();
    return json;
  }
}
