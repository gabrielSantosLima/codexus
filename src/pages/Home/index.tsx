import { useEffect, useState } from "react";
import { Book } from "../../entities/book";
import { BookService } from "../../services/BookService";
import "./styles.css";

const bookService = new BookService();

export const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[] | undefined>(undefined);

  useEffect(() => {
    async function fetch() {
      const books = await bookService.fetchAll();
      setBooks(books);
    }

    fetch();
  }, []);

  function renderBook(book: Book) {
    console.log(book);
    return <li>{book.book}</li>;
  }

  return (
    <div className="home-page">
      <ul>
        {books !== undefined ? books.map(renderBook) : <p>Carregando...</p>}
      </ul>
    </div>
  );
};
