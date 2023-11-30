import { useState } from "react";
import { Theme } from "../contexts/ThemeProvider";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme());

  function getTheme(): Theme {
    const localTheme = localStorage.getItem("theme") as Theme | undefined;
    return localTheme || "light";
  }

  function saveTheme(localTheme = theme) {
    localStorage.setItem("theme", localTheme);
  }

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    saveTheme(nextTheme);
  }

  return { theme, toggleTheme };
}
