import { useContext } from "react";
import CodexusBadgeDark from "../../assets/badged.svg";
import CodexusBadgeLight from "../../assets/badgel.svg";
import { ThemeContext } from "../../contexts/ThemeProvider";

import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/UserService";
import "./styles.css";

const userService = new UserService();

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigate();
  const isAuthenticated = userService.hasAuth();

  function logout() {
    userService.logout();
    navigation("/");
  }

  function redirect2Home() {
    navigation("/");
  }

  return (
    <header className="header-component t-able">
      <img
        src={theme === "dark" ? CodexusBadgeDark : CodexusBadgeLight}
        alt="codexus"
        className="badge t-able"
        onClick={redirect2Home}
      />

      <button className="bt secondary toggle" onClick={toggleTheme}>
        Modo {theme === "dark" ? "Claro" : "Escuro"}
      </button>

      {isAuthenticated && (
        <button className="bt secondary logout" onClick={logout}>
          Sair
        </button>
      )}
    </header>
  );
};
