import { FormEvent, useContext } from "react";
import { Header } from "../../components/Header";
import { ThemeContext } from "../../contexts/ThemeProvider";
import "./styles.css";

export const Login: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    toggleTheme();
  }

  return (
    <div className={`login-page theme ${theme}`}>
      <Header />
      <main className="main t-able">
        <form className="form t-able">
          <label className="title">Login</label>
          <input
            type="text"
            className="ipt name"
            placeholder="Digite seu nome"
          />
          <button className="bt submit secondary" onClick={onSubmit}>
            Fazer login
          </button>
        </form>
      </main>
    </div>
  );
};
