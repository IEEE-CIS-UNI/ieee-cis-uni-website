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

  // La barra del navegador del celular sigue el tema elegido en la web, no el del
  // sistema (las dos etiquetas theme-color se igualan al color del tema activo).
  const syncThemeColor = (t: Theme) => {
    const color = t === "dark" ? "#000711" : "#EEF3FF";
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
  };

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Al montar: el script de <head> (layout.tsx) ya puso la clase correcta antes
  // del primer pintado; aquí solo se lee para que el ícono de sol/luna coincida.
  // No se vuelve a aplicar el tema: hacerlo después de cargar disparaba un
  // cambio visible de colores en celulares.
  // Sigue en un efecto (no en el estado inicial) para no desajustar el HTML
  // del servidor con el del cliente al hidratar.
  useEffect(() => {
    const initial: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    syncThemeColor(initial);
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
      syncThemeColor(next);
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
