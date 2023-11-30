import { useContext, useEffect, useState } from "react";
import CodexusBadgeDark from "../../assets/tbadged.svg";
import CodexusBadgeLight from "../../assets/tbadgel.svg";
import { Header } from "../../components/Header";
import { ThemeContext } from "../../contexts/ThemeProvider";
import { Book } from "../../entities/book";
import { BookService } from "../../services/BookService";
import "./styles.css";

const bookService = new BookService();

export const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[] | undefined>(undefined);
  const [books2Show, setBooks2Show] = useState<Book[] | undefined>(undefined);

  // Livros recomendados (resultado do processo de aplicação das métricas de similaridade)
  const [recommendationBooks, setRecommendationBooks] = useState<Book[]>([]);

  // Livros avaliados pelo usuário logado
  const [reviewedBooks, setReviewedBooks] = useState<Book[]>([]);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    async function fetch() {
      const books = await bookService.fetchAll();
      setBooks(books);
      setBooks2Show(books);
    }

    fetch();
  }, []);

  return (
    <div className={`home-page theme ${theme}`}>
      <Header />
      <main className="main t-able">
        <header className="search">
          <img
            src={theme === "dark" ? CodexusBadgeDark : CodexusBadgeLight}
            alt="codexus"
            className="badge"
          />
          <input
            type="text"
            className="ipt primary"
            placeholder="Encontre um livro"
          />
        </header>

        <div className="content">
          <label className="content-title">Lista de Livros</label>
          <ul className="books">
            <li className="book">
              <label className="book-name">Texto</label>
              <label className="book-author">Autor</label>
              <a className="more" href="www.google.com.br">
                Ver Mais
              </a>
            </li>
            <li className="book">
              <label className="book-name">
                Título Very Very Very Very Very Gigas Demais
              </label>
              <label className="book-author">Autor</label>
              <a
                className="more"
                target="_blank"
                href="https://www.google.com.br"
              >
                Ver Mais
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};
