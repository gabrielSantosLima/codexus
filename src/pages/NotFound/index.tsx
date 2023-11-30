import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeProvider";
import "./styles.css";

export const NotFound: React.FC = () => {
  const navigation = useNavigate();
  const { theme } = useContext(ThemeContext);

  function redirect2Home() {
    navigation("/");
  }

  return (
    <div className={`not-found-page theme ${theme}`}>
      <div className="main">
        <h1 className="title">Página Não Encontrada</h1>
        <button className="bt primary" onClick={redirect2Home}>
          Voltar para a tela inicial
        </button>
      </div>
    </div>
  );
};
