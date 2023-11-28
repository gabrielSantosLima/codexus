import { useContext } from "react";
import CodexusBadgeDark from "../../assets/badged.svg";
import CodexusBadgeLight from "../../assets/badgel.svg";
import { ThemeContext } from "../../contexts/ThemeProvider";

import "./styles.css";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header className="header-component t-able">
      <img
        src={theme === "dark" ? CodexusBadgeDark : CodexusBadgeLight}
        alt="codexus"
        className="badge"
      />

      <button className="bt secondary toggle" onClick={toggleTheme}>
        Modo {theme === "dark" ? "Claro" : "Escuro"}
      </button>
    </header>
  );
};
