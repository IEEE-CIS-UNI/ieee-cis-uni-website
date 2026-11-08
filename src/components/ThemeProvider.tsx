"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // On mount: read saved preference or system preference.
  // This must stay in an effect (not a lazy useState initializer): localStorage/matchMedia
  // don't exist during SSR, and resolving the real theme on the very first client render
  // would mismatch the server-rendered markup (e.g. Navbar's sun/moon icon), causing a
  // hydration error instead of this one extra render.
  useEffect(() => {
    const saved = localStorage.getItem("ieee-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ?? (prefersDark ? "dark" : "light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Cambio de tema parejo: antes cada elemento cambiaba de color a su propio
  // ritmo (sus transiciones iban de 150 a 1000 ms) y el cambio se veía
  // desordenado. Ahora se pausan las transiciones durante el cambio y, si el
  // navegador lo soporta, toda la página hace un solo fundido corto.
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("ieee-theme", next);
    } catch {
      // modo privado / almacenamiento bloqueado: el tema igual cambia
    }

    const root = document.documentElement;
    const swap = () => {
      root.classList.add("theme-switching");
      applyTheme(next);
      setTheme(next);
      // Se quitan después de que el navegador pintó el tema nuevo
      requestAnimationFrame(() =>
        requestAnimationFrame(() => root.classList.remove("theme-switching"))
      );
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && typeof document.startViewTransition === "function") {
      document.startViewTransition(swap);
    } else {
      swap();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
