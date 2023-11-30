import { useContext, useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { MdOutlineReviews } from "react-icons/md";

import CodexusBadgeDark from "../../assets/tbadged.svg";
import CodexusBadgeLight from "../../assets/tbadgel.svg";
import { ThemeContext } from "../../contexts/ThemeProvider";
import { Book } from "../../entities/book";
import { BookService } from "../../services/BookService";

import { Header } from "../../components/Header";
import { UserService } from "../../services/UserService";
import "./styles.css";

const bookService = new BookService();
const userService = new UserService();
export const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[] | undefined>(undefined);
  const [books2Show, setBooks2Show] = useState<Book[] | undefined>(undefined);
  const [searchFor, setSearchFor] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [ratingPreview, setRatingPreview] = useState<number>(3);

  // Livros recomendados (resultado do processo de aplicação das métricas de similaridade)
  const [recommendationBooks, setRecommendationBooks] = useState<Book[]>([]);

  // Livros avaliados pelo usuário logado
  const [reviewedBooks, setReviewedBooks] = useState<Book[]>([]);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    async function fetch() {
      const books = await bookService.fetchAll();
      const booksReviewed: Book[] = [];
      const books2Recommend: Book[] = [];

      // Busca recomendações de livros
      const books2RecommendIDs = userService.recommendBooks();

      for (const book of books) {
        const user = userService.getAuthenticatedUser();
        if (user) {
          // Busca livros que o usuário já avaliou
          const ids = user.ratings.map((r) => r.bookId);
          if (ids.includes(book.id)) booksReviewed.push(book);
        }

        if (books2RecommendIDs.includes(book.id)) books2Recommend.push(book);
      }

      setBooks(books);
      setBooks2Show(books);
      setReviewedBooks(booksReviewed);
      setRecommendationBooks(books2Recommend);
    }

    fetch();
  }, []);

  function renderBook(book: Book, id: number) {
    const bookName = book.book || "";
    const size = bookName.length > 60 ? "s" : "n";

    return (
      <li key={id} className={`book ${size}`}>
        <label className="book-name">{book.book}</label>
        <label className="book-author">por {book.author}</label>
        <a className="more" target="_blank" href={book.URL}>
          Ver Mais
        </a>
      </li>
    );
  }

  function renderBookWithRating(book: Book, id: number) {
    const bookName = book.book || "";
    const size = bookName.length > 60 ? "s" : "n";

    return (
      <li
        key={id}
        className={`book ${size}`}
        onClick={() => setSelectedBook(book)}
      >
        <label className="book-name">{book.book}</label>
        <label className="book-author">por {book.author}</label>
        <a className="more" target="_blank" href={book.URL}>
          Ver Mais
        </a>
      </li>
    );
  }

  function onFilter(event: React.ChangeEvent<HTMLInputElement>) {
    if (books === undefined) return;
    const { value: text } = event.target;
    const filteredBooks = books.filter((b) =>
      b.book.toLowerCase().includes(text.toLowerCase())
    );
    setSearchFor(text);
    setBooks2Show(filteredBooks);
  }

  function onRating(bookRating: number) {
    const user = userService.getAuthenticatedUser();
    if (!user || !selectedBook) return;
    userService.rateBook(user.name, selectedBook.id, bookRating);
    window.location.reload();
  }

  function onRatingPreview(bookRating: number) {
    if (ratingPreview === bookRating) return;
    setRatingPreview(bookRating);
  }

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
            onChange={onFilter}
            className="ipt primary"
            placeholder="Encontre um livro"
          />
        </header>

        {/* Recomendações de livros */}
        {searchFor === "" && (
          <div className="content">
            <label className="content-title">
              Recomendados para você
              <FaRegStar />
            </label>
            {books2Show !== undefined && recommendationBooks.length === 0 && (
              <label className="empty">Não há recomendações para listar.</label>
            )}
            {books2Show === undefined && (
              <label className="empty">Carregando informações...</label>
            )}
            <ul className="books">{recommendationBooks.map(renderBook)}</ul>
          </div>
        )}

        {/* Avaliações realizadas */}
        {searchFor === "" && (
          <div className="content">
            <label className="content-title">
              Minhas avaliações
              <MdOutlineReviews />
            </label>
            {books2Show !== undefined && reviewedBooks.length === 0 && (
              <label className="empty">Não há avaliações para listar.</label>
            )}
            {books2Show === undefined && (
              <label className="empty">Carregando informações...</label>
            )}
            <ul className="books">{reviewedBooks.map(renderBook)}</ul>
          </div>
        )}

        {/* Listagem de livros */}
        <div className="content">
          <label className="content-title">Lista de Livros</label>
          {books2Show !== undefined && books2Show.length === 0 && (
            <label className="empty">Não há livros para listar.</label>
          )}
          {books2Show === undefined && (
            <label className="empty">Carregando lista de livros...</label>
          )}
          <ul className="books">{books2Show?.map(renderBookWithRating)}</ul>
        </div>
      </main>

      {selectedBook && (
        <div className="rating">
          <button className="close" onClick={() => setSelectedBook(undefined)}>
            <IoMdClose />
          </button>
          <div className="title">Avalie "{selectedBook.book}"</div>
          <div className="rating">
            <button
              className="rate"
              onMouseEnter={() => onRatingPreview(1)}
              onClick={() => onRating(1)}
            >
              {ratingPreview >= 1 ? <IoStar /> : <IoStarOutline />}
            </button>
            <button
              className="rate"
              onMouseEnter={() => onRatingPreview(2)}
              onClick={() => onRating(2)}
            >
              {ratingPreview >= 2 ? <IoStar /> : <IoStarOutline />}
            </button>
            <button
              className="rate"
              onMouseEnter={() => onRatingPreview(3)}
              onClick={() => onRating(3)}
            >
              {ratingPreview >= 3 ? <IoStar /> : <IoStarOutline />}
            </button>
            <button
              className="rate"
              onMouseEnter={() => onRatingPreview(4)}
              onClick={() => onRating(4)}
            >
              {ratingPreview >= 4 ? <IoStar /> : <IoStarOutline />}
            </button>
            <button
              className="rate"
              onMouseEnter={() => onRatingPreview(5)}
              onClick={() => onRating(5)}
            >
              {ratingPreview >= 5 ? <IoStar /> : <IoStarOutline />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
