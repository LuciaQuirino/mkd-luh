import React, { createContext, useContext, useEffect, useState } from "react";

const LS_KEY = "mkd-luh-appearance";
const defaultTheme = {
  bg: "#444851",
  card: "#fff",
  fonte: ""
};

const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: (t) => {},
  resetTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const local = localStorage.getItem(LS_KEY);
    return local ? { ...defaultTheme, ...JSON.parse(local) } : defaultTheme;
  });

  useEffect(() => {
    document.body.style.backgroundColor = theme.bg;
    document.body.style.setProperty("--card-bg", theme.card);
    document.body.style.setProperty("--titulo-font", theme.fonte || "");
    document.body.style.setProperty('--app-bg', theme.bg);
    localStorage.setItem(LS_KEY, JSON.stringify(theme));
  }, [theme]);

  function resetTheme() {
    setTheme(defaultTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
