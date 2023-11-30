import { FormEvent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { ThemeContext } from "../../contexts/ThemeProvider";
import { UserService } from "../../services/UserService";

import "./styles.css";

const userService = new UserService();

export const Login: React.FC = () => {
  const navigation = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const isAuthenticated = userService.hasAuth();
    if (isAuthenticated) {
      navigation("/home");
    }
  }, [navigation]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);

    const name = data.get("name")?.toString();
    if (!name) return;

    userService.create(name);
    navigation("/home");
  }

  return (
    <div className={`login-page theme ${theme}`}>
      <Header />
      <main className="main t-able">
        <form className="form t-able" onSubmit={onSubmit}>
          <label className="title">Login</label>
          <input
            type="text"
            name="name"
            className="ipt name"
            placeholder="Digite seu nome"
          />
          <button className="bt submit primary">Entrar</button>
        </form>
      </main>
    </div>
  );
};
