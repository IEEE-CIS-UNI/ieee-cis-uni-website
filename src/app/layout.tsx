import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
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
    url: "https://ieeecisuni.vercel.app",
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
    <html lang="es" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${poppins.className} bg-[var(--brand-background)] text-[var(--brand-text)] min-h-screen flex flex-col transition-colors duration-400`} suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
