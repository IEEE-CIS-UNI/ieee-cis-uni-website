import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import SplineErrorSuppressor from "@/components/SplineErrorSuppressor";
import MotionProvider from "@/components/MotionProvider";
import { SITE_URL } from "@/lib/site";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

// Se ejecuta en <head>, antes de pintar: lee el tema guardado o, si no hay,
// el del sistema, y deja la clase `dark` puesta. Debe coincidir con la lógica
// de ThemeProvider (clave "ieee-theme").
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("ieee-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})();`;

// Barra del navegador del celular con el color de fondo de la web (claro/oscuro)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF3FF" },
    { media: "(prefers-color-scheme: dark)", color: "#000711" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IEEE CIS UNI - Capítulo Estudiantil",
    template: "%s | IEEE CIS UNI"
  },
  description: "Official Student Chapter of the IEEE Computational Intelligence Society at the National University of Engineering (UNI). Promoting innovation in AI and computing.",
  keywords: ["IEEE", "CIS", "UNI", "Inteligencia Computacional", "IA", "Machine Learning", "Data Science", "Perú", "Ingeniería"],
  authors: [{ name: "IEEE CIS UNI" }],
  creator: "IEEE CIS UNI",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    title: "IEEE CIS UNI - Computational Intelligence Society",
    description: "Innovación y tecnología en Inteligencia Computacional en la Universidad Nacional de Ingeniería.",
    siteName: "IEEE CIS UNI",
    images: [
      {
        url: "https://erlvccwqqntypqkkrsvw.supabase.co/storage/v1/object/public/assets/Header%20Principal.png",
        width: 1200,
        height: 630,
        alt: "IEEE CIS UNI Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE CIS UNI",
    description: "Innovación en Inteligencia Computacional en la UNI.",
    images: ["https://erlvccwqqntypqkkrsvw.supabase.co/storage/v1/object/public/assets/Header%20Principal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Tema antes del primer pintado: sin esto la página se pintaba siempre en
            oscuro y cambiaba a claro recién al terminar de cargar el JavaScript
            (en celular, varios segundos después, con un salto de colores). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${poppins.className} bg-[var(--brand-background)] text-[var(--brand-text)] min-h-svh flex flex-col transition-colors duration-400`} suppressHydrationWarning>
        <ThemeProvider>
          <MotionProvider>
            <SplineErrorSuppressor />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
