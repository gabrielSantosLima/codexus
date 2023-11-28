import React, { createContext } from "react";
import { useTheme } from "../hooks/useTheme";

export type Theme = "light" | "dark";

export interface ITheme {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ITheme>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
